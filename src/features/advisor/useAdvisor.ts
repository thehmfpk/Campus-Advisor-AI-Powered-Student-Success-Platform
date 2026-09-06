import { useCallback, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/AuthContext';
import { routeIntent, type ResolvableAgent } from '@/lib/intentRouter';
import type { AgentKey } from '@/types/db';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  agent?: ResolvableAgent;
  provider?: 'free' | 'mock';
  usedFallback?: boolean;
}

interface AdviseResponse {
  text: string;
  agent: ResolvableAgent;
  provider: 'free' | 'mock';
  usedFallback: boolean;
  conversationId: string | null;
}

export function useAdvisor() {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [pending, setPending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const send = useCallback(
    async (text: string, selected: AgentKey) => {
      const message = text.trim();
      if (!message || pending) return;

      // Resolve the agent: manual selection overrides the router.
      const agent: ResolvableAgent =
        selected === 'auto' ? routeIntent(message).agent : (selected as ResolvableAgent);

      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      setMessages((m) => [...m, { role: 'user', content: message, agent }]);
      setPending(true);

      try {
        const res = await api<AdviseResponse>('/ai/advise', {
          method: 'POST',
          token: accessToken ?? undefined,
          body: { agent, message, history, conversationId },
        });
        setConversationId(res.conversationId);
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content: res.text,
            agent: res.agent,
            provider: res.provider,
            usedFallback: res.usedFallback,
          },
        ]);
      } catch (e) {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content:
              e instanceof Error
                ? `⚠️ ${e.message}`
                : '⚠️ The AI is temporarily unavailable. Please try again.',
            agent,
          },
        ]);
      } finally {
        setPending(false);
      }
    },
    [accessToken, conversationId, messages, pending],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  return { messages, pending, send, reset };
}
