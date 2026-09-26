import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// POST /api/applications/apply
router.post('/apply', authMiddleware, roleGuard('student'), async (req, res) => {
  try {
    const { jobId, resumeUrl } = req.body;
    const studentId = req.user.id;

    const existing = await prisma.studentApplication.findUnique({
      where: { studentId_jobId: { studentId, jobId } },
    });
    if (existing) return res.status(400).json({ error: 'Already applied to this job' });

    const job = await prisma.internshipJob.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Calculate match score
    const studentSkills = await prisma.studentSkill.findMany({
      where: { studentId },
      include: { skill: true },
    });
    const skillNames = studentSkills.map((s) => s.skill.name.toLowerCase());
    const required = job.requiredSkills.map((s) => s.toLowerCase());
    const matched = required.filter((r) => skillNames.some((sn) => sn.includes(r) || r.includes(sn)));
    const matchScore = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 50;

    const application = await prisma.studentApplication.create({
      data: { studentId, jobId, matchScore, status: 'applied' },
    });

    await prisma.internshipJob.update({
      where: { id: jobId },
      data: { applicantsCount: { increment: 1 } },
    });

    res.status(201).json({
      applicationId: application.id,
      status: application.status,
      matchScore: application.matchScore,
      transmittedToTpo: true,
    });
  } catch (error) {
    res.status(500).json({ error: 'Application failed' });
  }
});

// GET /api/applications - list applications (filtered by role)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { jobId, studentId, status } = req.query;
    const where = {};
    if (jobId) where.jobId = jobId;
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const applications = await prisma.studentApplication.findMany({
      where,
      include: {
        student: { include: { user: { select: { fullName: true, email: true } }, skills: { include: { skill: true } } } },
        job: { include: { company: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// PATCH /api/applications/:id/status - company updates status
router.patch('/:id/status', authMiddleware, roleGuard('company'), async (req, res) => {
  try {
    const { status, packageOffered, offeredRole, postingLocation, joiningDate } = req.body;

    const application = await prisma.studentApplication.update({
      where: { id: req.params.id },
      data: {
        status,
        packageOffered: packageOffered || undefined,
        offeredRole: offeredRole || undefined,
        postingLocation: postingLocation || undefined,
        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      },
    });

    // Create notifications for student and TPO
    const student = await prisma.studentProfile.findUnique({ where: { id: application.studentId } });
    if (student) {
      await prisma.notification.create({
        data: {
          title: `Application ${status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}`,
          message: `Your application has been updated to "${status}"${packageOffered ? ` with offer ${packageOffered}` : ''}.`,
          category: 'job',
          targetRole: 'student',
          userId: student.userId,
        },
      });
    }

    res.json({
      status: 'success',
      applicationId: application.id,
      currentStatus: application.status,
      tpoNotified: true,
      studentNotified: true,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// GET /api/applications/company/:companyId
router.get('/company/:companyId', authMiddleware, roleGuard('company'), async (req, res) => {
  try {
    const applications = await prisma.studentApplication.findMany({
      where: { job: { companyId: req.params.companyId } },
      include: {
        student: { include: { user: { select: { fullName: true, email: true } }, skills: { include: { skill: true } }, projects: true } },
        job: true,
      },
      orderBy: { matchScore: 'desc' },
    });
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company applications' });
  }
});

// GET /api/applications/institution/:institutionId
router.get('/institution/:institutionId', authMiddleware, roleGuard('institution'), async (req, res) => {
  try {
    const applications = await prisma.studentApplication.findMany({
      where: { student: { institutionId: req.params.institutionId } },
      include: {
        student: { include: { user: { select: { fullName: true } } } },
        job: { include: { company: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch institution applications' });
  }
});

export default router;
