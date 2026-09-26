import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/company/profile
router.get('/profile', authMiddleware, roleGuard('company'), async (req, res) => {
  try {
    const profile = await prisma.companyProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Company profile not found' });
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/company/profile
router.put('/profile', authMiddleware, roleGuard('company'), async (req, res) => {
  try {
    const { name, industry, website, description, headquarters, logoUrl } = req.body;
    const profile = await prisma.companyProfile.update({
      where: { userId: req.user.id },
      data: { name, industry, website, description, headquarters, logoUrl },
    });
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/company/feedback
router.post('/feedback', authMiddleware, roleGuard('company'), async (req, res) => {
  try {
    const { institutionId, skillRatings, feedbackNote, actionRecommended } = req.body;
    const company = await prisma.companyProfile.findUnique({ where: { userId: req.user.id } });
    if (!company) return res.status(404).json({ error: 'Company profile not found' });

    const created = [];
    const instExists = await prisma.institution.findUnique({ where: { id: institutionId } });
    if (!instExists) return res.status(400).json({ error: 'Institution not found' });

    for (const rating of skillRatings || []) {
      const fb = await prisma.feedbackSkill.create({
        data: {
          companyId: company.id,
          institutionId,
          skillName: rating.skill,
          status: rating.status,
          averageScore: rating.averageScore,
          feedbackNote: feedbackNote || '',
          actionRecommended,
        },
      });
      created.push(fb);
    }

    res.status(201).json({ feedbackCount: created.length, message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// GET /api/company/feedback/:institutionId
router.get('/feedback/:institutionId', authMiddleware, roleGuard('institution', 'company', 'admin'), async (req, res) => {
  try {
    if (req.user.role === 'institution') {
      const institution = await prisma.institution.findFirst({
        where: { users: { some: { id: req.user.id } } },
      });
      if (!institution || institution.id !== req.params.institutionId) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    }
    const feedbacks = await prisma.feedbackSkill.findMany({
      where: { institutionId: req.params.institutionId },
      include: { company: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ feedbacks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// GET /api/company/analytics/:companyId - own company only (admin allowed)
router.get('/analytics/:companyId', authMiddleware, roleGuard('company', 'admin'), async (req, res) => {
  try {
    const companyId = req.params.companyId;

    if (req.user.role === 'company') {
      const company = await prisma.companyProfile.findUnique({ where: { userId: req.user.id } });
      if (!company || company.id !== companyId) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    }

    const totalJobs = await prisma.internshipJob.count({ where: { companyId } });
    const totalApplications = await prisma.studentApplication.count({ where: { job: { companyId } } });
    const selectedCount = await prisma.studentApplication.count({ where: { job: { companyId }, status: 'selected' } });
    const shortlistedCount = await prisma.studentApplication.count({ where: { job: { companyId }, status: 'shortlisted' } });

    res.json({
      analytics: {
        totalJobs,
        totalApplications,
        selectedCount,
        shortlistedCount,
        conversionRate: totalApplications > 0 ? Math.round((selectedCount / totalApplications) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
