import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { getSupabaseAdmin, createAuthUser, createAppUser } from '../services/supabase.js';

const router = Router();
const prisma = new PrismaClient();

const ALLOWED_ROLES = ['student', 'company', 'institution'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(email, password) {
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return 'Please provide a valid email address.';
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return null;
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, fullName, institutionCode, companyName, industry, location, tpoName, tpoEmail } = req.body;

    const normalizedEmail = (email || '').trim().toLowerCase();

    // Admin accounts are created by seed only — never via public signup.
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: `Role '${role}' is not allowed to self-register.` });
    }

    const credError = validateCredentials(normalizedEmail, password);
    if (credError) return res.status(400).json({ error: credError });

    // Create the identity in Supabase Auth (handles hashing + JWT issuance).
    const { data: authData, error: authError } = await createAuthUser(normalizedEmail, password, fullName, role);
    if (authError) {
      if (authError.status === 409 || /already/i.test(authError.message)) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      return res.status(400).json({ error: authError.message });
    }

    const authUserId = authData?.user?.id;
    if (!authUserId) return res.status(500).json({ error: 'Signup failed' });

    // Mirror minimal user row in our own DB (passwordHash is managed by Supabase).
    const user = await createAppUser({
      id: authUserId,
      email: normalizedEmail,
      passwordHash: 'SUPABASE_MANAGED',
      role,
      fullName: (fullName || '').trim().slice(0, 120) || 'User',
      status: 'pending_approval',
    });

    await createRoleProfile(user, {
      role,
      fullName: user.fullName,
      email: normalizedEmail,
      institutionCode,
      companyName,
      industry,
      location,
      tpoName,
      tpoEmail,
      reqBody: req.body,
    });

    // Sign them in immediately (admin createUser auto-confirms the email).
    const { data: signedIn, error: signInError } = await getSupabaseAdmin().auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError) {
      return res.status(201).json({
        status: 'success',
        user: { id: user.id, name: user.fullName, email: user.email, role: user.role },
        message: 'Account created. Please log in.',
      });
    }

    res.status(201).json({
      status: 'success',
      token: signedIn?.session?.access_token,
      user: { id: user.id, name: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

async function createRoleProfile(user, ctx) {
  const { role } = ctx;
  if (role === 'student') {
    let institution = null;
    if (ctx.institutionCode) {
      institution = await prisma.institution.findUnique({ where: { code: ctx.institutionCode } });
    }
    await prisma.studentProfile.create({
      data: {
        id: user.id,
        userId: user.id,
        institutionId: institution?.id,
        rollNumber: ctx.reqBody.rollNumber || `ROLL-${Date.now()}`,
        branch: ctx.reqBody.branch || 'Computer Science',
        year: ctx.reqBody.year || 'Final Year',
        cgpa: ctx.reqBody.cgpa || 0,
      },
    });
  }

  if (role === 'company') {
    await prisma.companyProfile.create({
      data: {
        userId: user.id,
        name: ctx.companyName || ctx.fullName,
        industry: ctx.industry || 'Technology',
        description: ctx.reqBody.description,
        headquarters: ctx.location || 'India',
      },
    });
  }

  if (role === 'institution') {
    const code = ctx.institutionCode || `INST-${Date.now()}`;
    const institution = await prisma.institution.create({
      data: {
        name: ctx.fullName,
        code,
        location: ctx.location || 'India',
        tpoName: ctx.tpoName || ctx.fullName,
        tpoEmail: ctx.email,
      },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { institutionId: institution.id },
    });
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    const { data: sessionData, error: signInError } = await getSupabaseAdmin().auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError || !sessionData?.session) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const authUserId = sessionData.user.id;
    const user = await prisma.user.findUnique({ where: { id: authUserId } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (role && user.role !== role) {
      return res.status(403).json({ error: `This account is registered as '${user.role}', not '${role}'` });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'This account has been suspended. Contact support.' });
    }

    const token = sessionData.session.access_token;

    let profileExtra = {};
    if (user.role === 'student') {
      const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
      if (profile) profileExtra = { collegeId: profile.institutionId, branch: profile.branch };
    }

    res.json({
      status: 'success',
      token,
      user: { id: user.id, name: user.fullName, email: user.email, role: user.role, ...profileExtra },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/session
router.get('/session', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, fullName: true, email: true, role: true, isVerified: true, status: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const session = await prisma.sessionTracking.create({
      data: {
        userId: user.id,
        role: user.role,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
      },
    });

    res.json({ session: { id: session.id, userId: user.id, role: user.role, lastActive: session.lastActive } });
  } catch (error) {
    res.status(500).json({ error: 'Session fetch failed' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, fullName: true, email: true, role: true, isVerified: true, status: true, avatarUrl: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;