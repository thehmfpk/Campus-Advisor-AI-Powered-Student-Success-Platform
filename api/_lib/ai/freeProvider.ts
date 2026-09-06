import type { AIProvider, CompleteInput, CompleteResult } from './types';

/**
 * FreeAIProvider — calls a FREE-TIER, OpenAI-compatible chat completions API
 * (e.g. Groq free tier: https://api.groq.com/openai/v1). Configured entirely by
 * environment variables; the API key never reaches the browser (R18/R21).
 *
 * Throws on any failure so the caller can fall back to MockAIProvider.
 */
export class FreeAIProvider implements AIProvider {
  readonly kind = 'free' as const;

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
    private readonly model: string,
  ) {}

  async complete(input: CompleteInput): Promise<CompleteResult> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/chat/completions`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          temperature: input.temperature ?? 0.6,
          max_tokens: input.maxTokens ?? 800,
          messages: [
            { role: 'system', content: input.system },
            ...input.messages,
          ],
        }),
      });
      if (!res.ok) {
        throw new Error(`AI provider responded ${res.status}`);
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error('Empty AI response');
      return { text, provider: 'free' };
    } finally {
      clearTimeout(timeout);
    }
  }
}
