import { useCallback, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/AuthContext';
import { routeIntent, type ResolvableAgent } from '@/lib/intentRouter';
import { answerLocally } from './knowledgeBase';
import type { AgentKey } from '@/types/db';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  agent?: ResolvableAgent;
  source?: 'ai' | 'local';
}

interface AdviseResponse {
  text: string;
  agent: ResolvableAgent;
}

export function useAdvisor() {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [pending, setPending] = useState(false);

  const send = useCallback(
    async (text: string, selected: AgentKey) => {
      const message = text.trim();
      if (!message || pending) return;

      const agent: ResolvableAgent =
        selected === 'auto' ? routeIntent(message).agent : (selected as ResolvableAgent);

      setMessages((m) => [...m, { role: 'user', content: message, agent }]);
      setPending(true);

      // Small delay so the typing indicator feels natural.
      await new Promise((r) => setTimeout(r, 350));

      // 1) Try the AI API only when a session token exists (i.e. configured).
      //    2) ALWAYS fall back to the built-in knowledge base so the chatbot
      //    works on any deployment with no key and no database.
      let answer = '';
      let source: 'ai' | 'local' = 'local';
      if (accessToken) {
        try {
          const res = await api<AdviseResponse>('/ai/advise', {
            method: 'POST',
            token: accessToken,
            body: { agent, message },
          });
          if (res?.text) {
            answer = res.text;
            source = 'ai';
          }
        } catch {
          /* fall through to local knowledge base */
        }
      }
      if (!answer) {
        answer = answerLocally(agent, message);
        source = 'local';
      }

      setMessages((m) => [...m, { role: 'assistant', content: answer, agent, source }]);
      setPending(false);
    },
    [accessToken, pending],
  );

  const reset = useCallback(() => setMessages([]), []);

  return { messages, pending, send, reset };
}
