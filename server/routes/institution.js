import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/tpo/overview
router.get('/overview', authMiddleware, roleGuard('institution'), async (req, res) => {
  try {
    const institution = await prisma.institution.findFirst({
      where: { users: { some: { id: req.user.id } } },
    });
    if (!institution) return res.status(404).json({ error: 'Institution not found' });

    const totalStudents = await prisma.studentProfile.count({ where: { institutionId: institution.id } });
    const avgReadiness = await prisma.studentProfile.aggregate({ where: { institutionId: institution.id }, _avg: { readinessScore: true } });
    const activeJobs = await prisma.internshipJob.count({ where: { targetInstitutionId: institution.id, tpoApprovalStatus: 'approved' } });
    const selectedStudents = await prisma.studentApplication.count({ where: { student: { institutionId: institution.id }, status: 'selected' } });

    res.json({
      overview: {
        name: institution.name,
        totalStudents,
        placementReadyPercent: totalStudents > 0 ? Math.round((selectedStudents / totalStudents) * 100) : 0,
        activeJobPostings: activeJobs,
        avgMatchScore: Math.round(avgReadiness._avg.readinessScore || 0),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

// POST /api/tpo/drive-requests/invite
router.post('/drive-requests/invite', authMiddleware, roleGuard('institution'), async (req, res) => {
  try {
    const { companyId, targetRoles, proposedDates, minCgpa } = req.body;
    const institution = await prisma.institution.findFirst({
      where: { users: { some: { id: req.user.id } } },
    });

    const request = await prisma.driveRequest.create({
      data: {
        companyId,
        institutionId: institution.id,
        initiatedBy: 'institution',
        targetRoles: targetRoles || [],
        proposedDates: proposedDates?.map((d) => new Date(d)) || [],
        minCgpa: minCgpa || 7,
      },
    });
    res.status(201).json({ request });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create drive request' });
  }
});

// GET /api/tpo/drive-requests
router.get('/drive-requests', authMiddleware, roleGuard('institution'), async (req, res) => {
  try {
    const institution = await prisma.institution.findFirst({
      where: { users: { some: { id: req.user.id } } },
    });
    const requests = await prisma.driveRequest.findMany({
      where: { institutionId: institution?.id },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drive requests' });
  }
});

// PATCH /api/tpo/drive-requests/:id
router.patch('/drive-requests/:id', authMiddleware, roleGuard('institution'), async (req, res) => {
  try {
    const { status, tpoRemarks } = req.body;
    const institution = await prisma.institution.findFirst({
      where: { users: { some: { id: req.user.id } } },
    });
    const request = await prisma.driveRequest.findUnique({ where: { id: req.params.id } });
    if (!request) return res.status(404).json({ error: 'Drive request not found' });
    if (!institution || request.institutionId !== institution.id) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    const updated = await prisma.driveRequest.update({
      where: { id: req.params.id },
      data: { status, tpoRemarks },
    });
    res.json({ request: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update drive request' });
  }
});

// GET /api/tpo/skill-requests
router.get('/skill-requests', authMiddleware, roleGuard('institution'), async (req, res) => {
  try {
    const requests = await prisma.skillRequest.findMany({ orderBy: { submittedAt: 'desc' } });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skill requests' });
  }
});

// PATCH /api/tpo/skill-requests/:id
router.patch('/skill-requests/:id', authMiddleware, roleGuard('institution'), async (req, res) => {
  try {
    const { status, tpoRemarks } = req.body;
    const request = await prisma.skillRequest.update({
      where: { id: req.params.id },
      data: { status, tpoRemarks },
    });
    res.json({ request });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill request' });
  }
});

// GET /api/tpo/curriculum-gaps
router.get('/curriculum-gaps', authMiddleware, roleGuard('institution'), async (req, res) => {
  try {
    const gaps = await prisma.curriculumGap.findMany({ orderBy: { department: 'asc' } });
    const grouped = gaps.reduce((acc, g) => {
      if (!acc[g.department]) acc[g.department] = [];
      acc[g.department].push(g);
      return acc;
    }, {});
    res.json({ gaps: grouped });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch curriculum gaps' });
  }
});

// GET /api/tpo/placed-students
router.get('/placed-students', authMiddleware, roleGuard('institution'), async (req, res) => {
  try {
    const institution = await prisma.institution.findFirst({
      where: { users: { some: { id: req.user.id } } },
    });
    const placed = await prisma.studentApplication.findMany({
      where: { student: { institutionId: institution?.id }, status: 'selected' },
      include: {
        student: { include: { user: { select: { fullName: true } } } },
        job: { include: { company: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ placed });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch placed students' });
  }
});

export default router;

