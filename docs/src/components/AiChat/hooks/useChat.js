import { useState, useCallback, useRef } from 'react';

const STORAGE_KEY = 'ai-chat-history';

const loadHistory = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveHistory = (messages) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
};

const updateLastMessage = (prev, content, extra = {}) => {
  const updated = [...prev];
  updated[updated.length - 1] = { ...updated[updated.length - 1], content, ...extra };
  return updated;
};

export function useChat(apiUrl) {
  const [messages, setMessages] = useState(loadHistory);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (content, { code, pageContext } = {}) => {
    const userMsg = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveHistory(newMessages);

    setIsLoading(true);
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      abortRef.current = new AbortController();

      const body = { messages: newMessages };
      if (code) body.code = code;
      if (pageContext) body.pageContext = pageContext;

      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) throw new Error(`API error: ${resp.status}`);

      // 流式读取 SSE
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'token' && parsed.content) {
              finalContent += parsed.content;
              setMessages(prev => updateLastMessage(prev, finalContent));
            } else if (parsed.type === 'error') {
              throw new Error(parsed.content);
            }
          } catch (e) {
            if (e.message && !e.message.includes('JSON')) throw e;
          }
        }
      }

      setMessages(prev => {
        const updated = updateLastMessage(prev, finalContent || '（无响应）');
        saveHistory(updated);
        return updated;
      });
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMessages(prev => {
        const updated = updateLastMessage(prev, `错误: ${err.message}`, { isError: true });
        saveHistory(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, apiUrl]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    saveHistory([]);
  }, []);

  return { messages, isLoading, sendMessage, clearHistory };
}
