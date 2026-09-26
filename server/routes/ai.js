import { Router } from 'express';

const router = Router();

// POST /api/ai/analyze-code - AST code plagiarism analysis
router.post('/analyze-code', async (req, res) => {
  try {
    const { repoUrl, techStack, title, description } = req.body;
    const { analyzeCodeOriginality } = await import('../services/gemini.js');
    const result = await analyzeCodeOriginality({ repoUrl, techStack, title, description });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

// POST /api/ai/defense-questions - generate defense Q&A
router.post('/defense-questions', async (req, res) => {
  try {
    const { project } = req.body;
    const { generateDefenseQuestions } = await import('../services/gemini.js');
    const result = await generateDefenseQuestions(project);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate defense questions' });
  }
});

// POST /api/ai/evaluate-defense - evaluate student answers
router.post('/evaluate-defense', async (req, res) => {
  try {
    const { project, answers } = req.body;
    const { evaluateDefense } = await import('../services/gemini.js');
    const result = await evaluateDefense({ project, answers });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to evaluate defense' });
  }
});

// POST /api/ai/parse-resume - ATS resume parsing
router.post('/parse-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;
    const { parseResume } = await import('../services/gemini.js');
    const result = await parseResume(resumeText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Resume parsing failed' });
  }
});

// POST /api/ai/skill-questions - generate quiz questions for a skill
router.post('/skill-questions', async (req, res) => {
  try {
    const { skillName, difficulty, count } = req.body;
    const { generateQuizQuestions } = await import('../services/gemini.js');
    const result = await generateQuizQuestions(skillName, difficulty, count);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
});

export default router;

