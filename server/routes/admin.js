import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/admin/dashboard
router.get('/dashboard', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const totalStudents = await prisma.studentProfile.count();
    const totalCompanies = await prisma.companyProfile.count();
    const totalInstitutions = await prisma.institution.count();
    const totalApplications = await prisma.studentApplication.count();
    const selectedStudents = await prisma.studentApplication.count({ where: { status: 'selected' } });
    const flaggedProjects = await prisma.studentProject.count({ where: { status: 'flagged' } });
    const pendingApprovals = await prisma.approval.count({ where: { status: 'pending' } });
    const flaggedSessions = await prisma.sessionTracking.count({ where: { isFlagged: true } });

    res.json({
      dashboard: {
        totalStudents,
        totalCompanies,
        totalInstitutions,
        totalApplications,
        selectedStudents,
        flaggedProjects,
        pendingApprovals,
        flaggedSessions,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// GET /api/admin/students
router.get('/students', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const { search, institutionId, status } = req.query;
    const where = {};
    if (institutionId) where.institutionId = institutionId;
    if (status) where.integrityStatus = status;
    if (search) {
      where.OR = [
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { rollNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const students = await prisma.studentProfile.findMany({
      where,
      include: { user: { select: { fullName: true, email: true, isVerified: true, status: true } }, institution: true },
      orderBy: { id: 'desc' },
    });
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /api/admin/institutions
router.get('/institutions', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany({
      include: { students: { select: { id: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({
      institutions: institutions.map((i) => ({
        ...i,
        studentCount: i.students.length,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch institutions' });
  }
});

// GET /api/admin/companies
router.get('/companies', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const companies = await prisma.companyProfile.findMany({
      include: { jobs: { select: { id: true, applicantsCount: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({
      companies: companies.map((c) => ({
        ...c,
        totalJobs: c.jobs.length,
        totalApplicants: c.jobs.reduce((sum, j) => sum + j.applicantsCount, 0),
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// GET /api/admin/approvals
router.get('/approvals', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const approvals = await prisma.approval.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ approvals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch approvals' });
  }
});

// PATCH /api/admin/approvals/:id
router.patch('/approvals/:id', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const approval = await prisma.approval.update({
      where: { id: req.params.id },
      data: { status, remarks, reviewedBy: req.user.id, reviewedAt: new Date() },
    });

    // If approving an institution, update the institution record
    if (approval.entityType === 'institution' && status === 'approved') {
      await prisma.institution.update({
        where: { id: approval.entityId },
        data: { isApproved: true },
      });
    }
    if (approval.entityType === 'company' && status === 'approved') {
      await prisma.companyProfile.update({
        where: { id: approval.entityId },
        data: { isVerified: true },
      });
    }

    res.json({ approval });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update approval' });
  }
});

// GET /api/admin/sessions
router.get('/sessions', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const sessions = await prisma.sessionTracking.findMany({
      include: { user: { select: { fullName: true, email: true, role: true } } },
      orderBy: { loginTime: 'desc' },
      take: 100,
    });
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /api/admin/fraud-alerts
router.get('/fraud-alerts', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const flaggedProjects = await prisma.studentProject.findMany({
      where: { status: 'flagged' },
      include: { student: { include: { user: { select: { fullName: true } }, institution: true } } },
    });

    const flaggedSessions = await prisma.sessionTracking.findMany({
      where: { isFlagged: true },
      include: { user: { select: { fullName: true, email: true } } },
    });

    res.json({
      alerts: [
        ...flaggedProjects.map((p) => ({
          type: 'plagiarism',
          entity: p.student.user.fullName,
          title: `Plagiarism: ${p.title}`,
          detail: `Originality score: ${p.originalityScore}% - ${p.flagReason}`,
          severity: p.originalityScore < 30 ? 'high' : 'medium',
          timestamp: p.verifiedDate,
        })),
        ...flaggedSessions.map((s) => ({
          type: 'session_anomaly',
          entity: s.user.fullName,
          title: `Suspicious session from ${s.ipAddress}`,
          detail: `Device: ${s.userAgent}`,
          severity: 'high',
          timestamp: s.loginTime,
        })),
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fraud alerts' });
  }
});

// PUT /api/admin/students/:id/verify
router.put('/students/:id/verify', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const { isVerified, status } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isVerified, status },
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify student' });
  }
});

// PUT /api/admin/students/:id/integrity
router.put('/students/:id/integrity', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const { integrityStatus } = req.body;
    const profile = await prisma.studentProfile.update({
      where: { id: req.params.id },
      data: { integrityStatus },
    });
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update integrity' });
  }
});

export default router;
