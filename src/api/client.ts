const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface AiQuestion {
  id: string;
  checkpointTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skill?: string;
}

export async function generateSkillQuestions(
  skillName: string,
  difficulty: string = 'Intermediate',
  count: number = 5
): Promise<AiQuestion[]> {
  const data = await request<{ questions: AiQuestion[] }>('/ai/skill-questions', {
    method: 'POST',
    body: JSON.stringify({ skillName, difficulty, count }),
  });
  return data.questions || [];
}