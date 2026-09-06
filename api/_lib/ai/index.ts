import type { AIProvider, CompleteInput, CompleteResult } from './types';
import type { AIProvider, CompleteInput, CompleteResult } from './types';
import { MockAIProvider } from './mockProvider';
import { FreeAIProvider } from './freeProvider';

export type { AIProvider, CompleteInput, CompleteResult, ChatMessage } from './types';
export { buildSystemPrompt, buildContextBlock } from './prompts';
export type { Agent, AiContext } from './prompts';

/**
 * Selects the AI provider from environment (R21):
 *   AI_MODE=free + AI_API_KEY present → FreeAIProvider
 *   otherwise                        → MockAIProvider (keyless, zero cost)
 *
 * `complete()` here also provides RUNTIME FALLBACK: if the free provider errors
 * or is rate-limited, we transparently fall back to the mock provider so the
 * demo never breaks and never incurs cost.
 */
export function getProviders(): { primary: AIProvider; fallback: MockAIProvider } {
  const mode = process.env.AI_MODE ?? 'mock';
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL;
  const fallback = new MockAIProvider();

  if (mode === 'free' && apiKey && baseUrl && model) {
    return { primary: new FreeAIProvider(apiKey, baseUrl, model), fallback };
  }
  return { primary: fallback, fallback };
}

export async function complete(
  input: CompleteInput,
): Promise<CompleteResult & { usedFallback: boolean }> {
  const { primary, fallback } = getProviders();
  if (primary.kind === 'mock') {
    const r = await primary.complete(input);
    return { ...r, usedFallback: false };
  }
  try {
    const r = await primary.complete(input);
    return { ...r, usedFallback: false };
  } catch {
    const r = await fallback.complete(input);
    return { ...r, usedFallback: true };
  }
}
