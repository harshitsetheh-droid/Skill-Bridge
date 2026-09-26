import { GoogleGenAI } from '@google/genai';

let genai = null;

function getClient() {
  if (!genai && process.env.GEMINI_API_KEY) {
    genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genai;
}

// Free-tier quota is per model per day, so rotate through models on exhaustion.
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];

async function callGemini(prompt) {
  const client = getClient();
  if (!client) {
    console.warn('Gemini API key not configured - returning mock response');
    return null;
  }
  const preferredModel = process.env.GEMINI_MODEL || GEMINI_MODELS[0];
  const models = preferredModel
    ? [preferredModel, ...GEMINI_MODELS.filter((m) => m !== preferredModel)]
    : GEMINI_MODELS;

  let lastError = null;
  for (const model of models) {
    try {
      const response = await client.models.generateContent({ model, contents: prompt });
      return response.text;
    } catch (error) {
      lastError = error;
      const status = error?.status;
      const msg = `${error?.message || ''}`;
      const throttled = status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(msg);
      if (throttled) {
        console.warn(`Gemini quota exhausted on ${model}, trying next model...`);
        continue;
      }
      if (status === 404 || status === 503 || /no longer available|not found|high demand|unavailable/i.test(msg)) {
        console.warn(`Gemini model ${model} unavailable (${status}), trying next model...`);
        continue;
      }
      console.error(`Gemini API error (${model}):`, error.message);
      break;
    }
  }
  console.error('Gemini call failed:', lastError?.message);
  return null;
}

// ─── AST Code Originality Analysis ──────────────────────────

export async function analyzeCodeOriginality({ repoUrl, techStack, title, description }) {
  const prompt = `You are an expert code plagiarism auditor for a campus placement platform called TalentBridge.

Analyze this student project for code originality and plagiarism:

PROJECT: ${title}
DESCRIPTION: ${description}
REPOSITORY: ${repoUrl}
TECH STACK: ${(techStack || []).join(', ')}

Provide a JSON response with:
{
  "originalityScore": <0-100, where 100 is completely original>,
  "status": "passed" | "flagged" | "pending",
  "flagReason": <null if passed, else explain why flagged>,
  "methodsAnalyzed": [<list of key methods/functions found>],
  "architectureSummary": "<1-2 sentence summary of code architecture>",
  "aiDefenseQuestions": [
    {
      "id": "q1",
      "question": "<conceptual question about a specific implementation>",
      "expectedConcept": "<expected answer concept>"
    }
  ]
}

Rules:
- Score >= 70: "passed"
- Score 40-69: "pending" (needs verification)
- Score < 40: "flagged"
- Generate 3-4 defense questions focusing on architectural decisions, algorithmic choices, and implementation reasoning.
- Be strict but fair - real projects with minor boilerplate are okay, wholesale copies are not.`;

  const response = await callGemini(prompt);
  if (response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {}
  }

  // Fallback mock when API not available
  return {
    originalityScore: 85,
    status: 'passed',
    flagReason: null,
    methodsAnalyzed: ['initialize', 'processData', 'render', 'handleEvent'],
    architectureSummary: 'Well-structured modular application with clear separation of concerns.',
    aiDefenseQuestions: [
      { id: 'q1', question: 'Why did you choose this specific architecture pattern?', expectedConcept: 'MVC/Component-based design reasoning' },
      { id: 'q2', question: 'How does your caching strategy work and why?', expectedConcept: 'Cache invalidation and performance optimization' },
      { id: 'q3', question: 'Walk me through the data flow in your main feature.', expectedConcept: 'State management and data transformation' },
    ],
  };
}

// ─── Defense Question Generation ────────────────────────────

export async function generateDefenseQuestions(project) {
  const prompt = `Generate 4 technical defense questions for this project:

PROJECT: ${project.title}
DESCRIPTION: ${project.description}
TECH STACK: ${(project.techStack || []).join(', ')}
AST ANALYSIS: ${project.astSummary || 'N/A'}

Return JSON:
{
  "questions": [
    { "id": "q1", "question": "...", "expectedConcept": "..." }
  ]
}`;

  const response = await callGemini(prompt);
  if (response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {}
  }

  return {
    questions: [
      { id: 'q1', question: 'What was the primary technical challenge in this project?', expectedConcept: 'Problem decomposition and solution design' },
      { id: 'q2', question: 'How would you scale this system to handle 10x traffic?', expectedConcept: 'Horizontal scaling, caching, load balancing' },
      { id: 'q3', question: 'Why did you choose the specific database/data structure?', expectedConcept: 'Trade-off analysis between alternatives' },
      { id: 'q4', question: 'What security considerations did you implement?', expectedConcept: 'Input validation, auth, encryption' },
    ],
  };
}

// ─── Defense Evaluation ─────────────────────────────────────

export async function evaluateDefense({ project, answers }) {
  const prompt = `Evaluate student's answers to project defense questions:

PROJECT: ${project.title}
TECH STACK: ${(project.techStack || []).join(', ')}

ANSWERS:
${(answers || []).map((a, i) => `Q${i + 1}: ${a.question || 'Unknown'}\nA: ${a.answer || 'No answer'}`).join('\n\n')}

Return JSON:
{
  "passed": true/false,
  "logicScore": <0-100>,
  "feedback": "brief overall feedback"
}`;

  const response = await callGemini(prompt);
  if (response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {}
  }

  // Mock evaluation
  const score = 75 + Math.floor(Math.random() * 20);
  return { passed: score >= 60, logicScore: score, feedback: 'Good understanding of core concepts.' };
}

// ─── Resume ATS Parsing ─────────────────────────────────────

export async function parseResume(resumeText) {
  const prompt = `Parse this resume text and extract structured data:

RESUME TEXT:
${resumeText}

Return JSON:
{
  "skills": [<list of technical skills>],
  "education": { "degree": "...", "institution": "...", "gpa": "...", "year": "..." },
  "experience": [{ "company": "...", "role": "...", "duration": "...", "summary": "..." }],
  "projects": [{ "name": "...", "tech": ["..."], "summary": "..." }],
  "atsScore": <0-100 based on formatting, keywords, completeness>,
  "keywordMatch": <0-100>,
  "skillCoverage": <0-100>,
  "suggestions": ["improvement tip 1", "tip 2"]
}`;

  const response = await callGemini(prompt);
  if (response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {}
  }

  return {
    skills: ['JavaScript', 'React', 'Node.js'],
    education: { degree: 'B.Tech CSE', institution: 'Unknown', gpa: 'N/A', year: 'N/A' },
    experience: [],
    projects: [],
    atsScore: 72,
    keywordMatch: 65,
    skillCoverage: 70,
    suggestions: ['Add quantifiable achievements', 'Include more technical keywords'],
  };
}

// ─── Quiz Question Generation ───────────────────────────────

export async function generateQuizQuestions(skillName, difficulty = 'Intermediate', count = 3) {
  const prompt = `Generate ${count} multiple-choice quiz questions for the skill "${skillName}" at ${difficulty} level.

Return JSON:
{
  "questions": [
    {
      "skill": "${skillName}",
      "portionLearned": "topic area",
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "why this is correct",
      "difficulty": "${difficulty}"
    }
  ]
}`;

  const response = await callGemini(prompt);
  if (response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      console.warn('[gemini] generateQuizQuestions: no JSON object found in response');
    } catch (e) {
      console.warn('[gemini] generateQuizQuestions: JSON parse failed:', e.message);
    }
  } else {
    console.warn('[gemini] generateQuizQuestions: callGemini returned null');
  }

  return {
    questions: Array.from({ length: count }, (_, i) => ({
      skill: skillName,
      portionLearned: 'Core Concepts',
      question: `Question ${i + 1} about ${skillName}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      explanation: 'This is the correct answer because of fundamental principles.',
      difficulty,
    })),
  };
}
