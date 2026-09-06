import type { AIProvider, CompleteInput, CompleteResult } from './types';
import { answerFromKnowledge, type Role } from './knowledge';

/**
 * MockAIProvider — role-based + knowledge-based responder. It detects the
 * active agent role from the system prompt, then answers the user's latest
 * message from a curated knowledge base (see knowledge.ts). This makes the
 * advisor genuinely useful with NO API key and ZERO cost (R21), and it is
 * deterministic so demos are reproducible.
 */
export class MockAIProvider implements AIProvider {
  readonly kind = 'mock' as const;

  async complete(input: CompleteInput): Promise<CompleteResult> {
    const role = detectRole(input.system);
    const userMsg = [...input.messages].reverse().find((m) => m.role === 'user')?.content ?? '';
    const text = answerFromKnowledge(role, userMsg);
    return { text, provider: 'mock' };
  }
}

function detectRole(system: string): Role {
  const s = system.toLowerCase();
  if (s.includes('academic advisor')) return 'academic';
  if (s.includes('career advisor')) return 'career';
  if (s.includes('coding mentor')) return 'coding';
  if (s.includes('cv advisor')) return 'cv';
  return 'generic';
}
