import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/students/:id/profile
router.get('/:id/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { fullName: true, email: true, avatarUrl: true } }, institution: true },
    });
    if (!profile) return res.status(404).json({ error: 'Student not found' });
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/students/:id/profile
router.put('/:id/profile', authMiddleware, async (req, res) => {
  try {
    const { branch, year, cgpa, githubUrl, linkedinUrl, readinessScore } = req.body;
    const profile = await prisma.studentProfile.update({
      where: { id: req.params.id },
      data: { branch, year, cgpa, githubUrl, linkedinUrl, readinessScore },
    });
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/students/:id/skills
router.get('/:id/skills', authMiddleware, async (req, res) => {
  try {
    const skills = await prisma.studentSkill.findMany({
      where: { studentId: req.params.id },
      include: { skill: true },
    });
    res.json({
      skills: skills.map((s) => ({
        id: s.id,
        name: s.skill.name,
        category: s.skill.category,
        proficiency: s.proficiency,
        level: s.level,
        status: s.status,
        verifiedMethod: s.verifiedMethod,
        assessmentScore: s.assessmentScore,
        verifiedDate: s.verifiedDate,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// POST /api/students/:id/skills
router.post('/:id/skills', authMiddleware, async (req, res) => {
  try {
    const { skillId, proficiency, level, status } = req.body;

    let skill = await prisma.skillMaster.findUnique({ where: { id: skillId } });
    if (!skill && skillId !== req.body.skillName) {
      skill = await prisma.skillMaster.findUnique({ where: { name: req.body.skillName } });
    }
    if (!skill) {
      skill = await prisma.skillMaster.create({
        data: { id: skillId, name: req.body.skillName || skillId, category: req.body.category || 'Frontend', industryDemand: 50 },
      });
    }

    const studentSkill = await prisma.studentSkill.create({
      data: {
        studentId: req.params.id,
        skillId: skill.id,
        proficiency: proficiency || 0,
        level: level || 'Beginner',
        status: status || 'self-claimed',
      },
    });
    res.status(201).json({ studentSkill });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// POST /api/students/:id/skills/request
router.post('/:id/skills/request', authMiddleware, async (req, res) => {
  try {
    const { skillName, category, reason } = req.body;
    const student = await prisma.studentProfile.findUnique({
      where: { id: req.params.id },
      include: { user: true, institution: true },
    });

    const request = await prisma.skillRequest.create({
      data: {
        studentName: student?.user.fullName || 'Unknown',
        studentRoll: student?.rollNumber,
        collegeName: student?.institution?.name || 'Unknown',
        skillName,
        category: category || 'Frontend',
        reason,
      },
    });
    res.status(201).json({ requestId: request.id, status: 'pending', message: 'Skill request transmitted to TPO' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit skill request' });
  }
});

// GET /api/students/:id/projects
router.get('/:id/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.studentProject.findMany({
      where: { studentId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/students/:id/applications
router.get('/:id/applications', authMiddleware, async (req, res) => {
  try {
    const applications = await prisma.studentApplication.findMany({
      where: { studentId: req.params.id },
      include: { job: { include: { company: true } } },
      orderBy: { appliedAt: 'desc' },
    });
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET /api/students (list all students - admin/institution)
router.get('/', authMiddleware, roleGuard('admin', 'institution'), async (req, res) => {
  try {
    const { institutionId, branch, search } = req.query;
    const where = {};
    if (institutionId) where.institutionId = institutionId;
    if (branch) where.branch = { contains: branch, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { rollNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const students = await prisma.studentProfile.findMany({
      where,
      include: { user: { select: { fullName: true, email: true } }, institution: true, skills: true },
      orderBy: { readinessScore: 'desc' },
    });
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

export default router;
