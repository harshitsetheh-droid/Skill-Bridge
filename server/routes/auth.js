import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken, hashPassword, comparePassword, authMiddleware } from '../middleware/auth.js';

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

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role,
        fullName: (fullName || '').trim().slice(0, 120) || 'User',
        status: 'pending_approval',
      },
    });

    if (role === 'student') {
      let institution = null;
      if (institutionCode) {
        institution = await prisma.institution.findUnique({ where: { code: institutionCode } });
      }
      await prisma.studentProfile.create({
        data: {
          id: user.id,
          userId: user.id,
          institutionId: institution?.id,
          rollNumber: req.body.rollNumber || `ROLL-${Date.now()}`,
          branch: req.body.branch || 'Computer Science',
          year: req.body.year || 'Final Year',
          cgpa: req.body.cgpa || 0,
        },
      });
    }

    if (role === 'company') {
      await prisma.companyProfile.create({
        data: {
          userId: user.id,
          name: companyName || fullName,
          industry: industry || 'Technology',
          description: req.body.description,
          headquarters: location || 'India',
        },
      });
    }

    if (role === 'institution') {
      const code = institutionCode || `INST-${Date.now()}`;
      const institution = await prisma.institution.create({
        data: {
          name: fullName,
          code,
          location: location || 'India',
          tpoName: tpoName || fullName,
          tpoEmail: normalizedEmail,
        },
      });
      await prisma.user.update({
        where: { id: user.id },
        data: { institutionId: institution.id },
      });
    }

    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      token,
      user: { id: user.id, name: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    if (role && user.role !== role) {
      return res.status(403).json({ error: `This account is registered as '${user.role}', not '${role}'` });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'This account has been suspended. Contact support.' });
    }

    const token = generateToken(user);

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
