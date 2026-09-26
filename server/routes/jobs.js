import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/jobs - list all jobs with filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { campusType, targetUniversity, companyId, type } = req.query;
    const where = {};
    if (campusType) where.campusType = campusType;
    if (targetUniversity) where.targetInstitution = { name: { contains: targetUniversity, mode: 'insensitive' } };
    if (companyId) where.companyId = companyId;
    if (type) where.type = type;

    const jobs = await prisma.internshipJob.findMany({
      where,
      include: { company: { select: { name: true, logoUrl: true } } },
      orderBy: { deadline: 'asc' },
    });

    res.json({
      jobs: jobs.map((j) => ({
        id: j.id,
        title: j.title,
        company: j.company.name,
        companyLogo: j.company.logoUrl,
        location: j.location,
        type: j.type,
        stipend: j.stipendPackage,
        requiredSkills: j.requiredSkills,
        preferredSkills: j.preferredSkills,
        description: j.description,
        minCgpa: j.minCgpa,
        eligibleBranches: j.eligibleBranches,
        deadline: j.deadline,
        applicantsCount: j.applicantsCount,
        campusType: j.campusType,
        targetUniversity: j.targetInstitution?.name,
        tpoApprovalStatus: j.tpoApprovalStatus,
        driveStartDate: j.driveStartDate,
        driveEndDate: j.driveEndDate,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// POST /api/jobs - create a new job (company only)
router.post('/', authMiddleware, roleGuard('company'), async (req, res) => {
  try {
    const companyProfile = await prisma.companyProfile.findUnique({ where: { userId: req.user.id } });
    if (!companyProfile) return res.status(404).json({ error: 'Company profile not found' });

    const { title, type, campusType, targetInstitutionId, location, stipendPackage, description, minCgpa, eligibleBranches, requiredSkills, preferredSkills, deadline } = req.body;

    const job = await prisma.internshipJob.create({
      data: {
        companyId: companyProfile.id,
        title,
        type: type || 'Internship',
        campusType: campusType || 'off_campus',
        targetInstitutionId,
        location,
        stipendPackage,
        description,
        minCgpa: minCgpa || 0,
        eligibleBranches: eligibleBranches || [],
        requiredSkills: requiredSkills || [],
        preferredSkills: preferredSkills || [],
        deadline: new Date(deadline),
      },
    });
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PATCH /api/jobs/:id/tpo-status - TPO approve/reject job for own institution (admin allowed)
router.patch('/:id/tpo-status', authMiddleware, roleGuard('institution', 'admin'), async (req, res) => {
  try {
    const { status } = req.body; // approved | rejected

    const job = await prisma.internshipJob.findUnique({ where: { id: req.params.id } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (req.user.role === 'institution') {
      const institution = await prisma.institution.findFirst({
        where: { users: { some: { id: req.user.id } } },
      });
      if (!institution || job.targetInstitutionId !== institution.id) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    }

    const updated = await prisma.internshipJob.update({
      where: { id: req.params.id },
      data: { tpoApprovalStatus: status },
    });
    res.json({ job: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update TPO status' });
  }
});

export default router;
