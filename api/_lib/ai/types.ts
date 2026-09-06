export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CompleteInput {
  system: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface CompleteResult {
  text: string;
  provider: 'free' | 'mock';
}

/**
 * Provider abstraction (R21 / design §4). Implementations:
 *  - FreeAIProvider: a free-tier OpenAI-compatible API.
 *  - MockAIProvider: deterministic, keyless fallback.
 */
export interface AIProvider {
  readonly kind: 'free' | 'mock';
  complete(input: CompleteInput): Promise<CompleteResult>;
}
