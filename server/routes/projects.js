import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/projects - list all projects for a student
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.query;
    const where = studentId ? { studentId } : {};
    const projects = await prisma.studentProject.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects - add a new project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { studentId, title, description, techStack, repoUrl, liveUrl } = req.body;
    const project = await prisma.studentProject.create({
      data: { studentId, title, description, techStack, repoUrl, liveUrl },
    });
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// POST /api/projects/:id/analyze-code - AST code analysis via Gemini
router.post('/:id/analyze-code', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.studentProject.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Call Gemini AI for AST analysis
    const { analyzeCodeOriginality } = await import('../services/gemini.js');
    const analysis = await analyzeCodeOriginality({
      repoUrl: project.repoUrl,
      techStack: project.techStack,
      title: project.title,
      description: project.description,
    });

    const updated = await prisma.studentProject.update({
      where: { id },
      data: {
        originalityScore: analysis.originalityScore,
        status: analysis.status,
        flagReason: analysis.flagReason,
        astAnalysisSummary: analysis.architectureSummary,
      },
    });

    res.json({
      originalityScore: updated.originalityScore,
      status: updated.status,
      flagReason: updated.flagReason,
      methodsAnalyzed: analysis.methodsAnalyzed,
      architectureSummary: analysis.architectureSummary,
      aiDefenseQuestions: analysis.aiDefenseQuestions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Code analysis failed' });
  }
});

// POST /api/projects/:id/submit-defense - AI Logic Q&A defense
router.post('/:id/submit-defense', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const project = await prisma.studentProject.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { evaluateDefense } = await import('../services/gemini.js');
    const result = await evaluateDefense({
      project: { title: project.title, description: project.description, techStack: project.techStack, astSummary: project.astAnalysisSummary },
      answers,
    });

    const updated = await prisma.studentProject.update({
      where: { id },
      data: {
        logicDefenseScore: result.logicScore,
        status: result.passed ? 'passed' : project.status,
        verifiedDate: result.passed ? new Date() : project.verifiedDate,
      },
    });

    res.json({
      passed: result.passed,
      logicScore: result.logicScore,
      status: updated.status,
      verifiedDate: updated.verifiedDate,
    });
  } catch (error) {
    res.status(500).json({ error: 'Defense evaluation failed' });
  }
});

// GET /api/projects/flagged - all flagged projects (institution/admin)
router.get('/flagged', authMiddleware, async (req, res) => {
  try {
    const flagged = await prisma.studentProject.findMany({
      where: { status: 'flagged' },
      include: { student: { include: { user: { select: { fullName: true } } } } },
      orderBy: { originalityScore: 'asc' },
    });
    res.json({ flagged });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flagged projects' });
  }
});

export default router;
