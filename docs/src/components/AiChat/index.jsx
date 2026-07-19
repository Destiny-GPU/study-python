import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AiToolsLinks from './AiToolsLinks';
import { useChat } from './hooks/useChat';
import styles from './styles.module.css';

const API_URL = typeof window !== 'undefined'
  ? (window.__AI_API_URL__ || '/api/chat')
  : '/api/chat';

export default function AiChat() {
  const chatHeaderRef = useRef(null);
  const { messages, isLoading, sendMessage, clearHistory } = useChat(API_URL);

  // 从代码块跳转过来时，自动发送代码解释请求
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return;

    const decoded = decodeURIComponent(code);
    setTimeout(() => {
      chatHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    sendMessage(`请解释这段代码：\n\`\`\`python\n${decoded}\n\`\`\``, { code: decoded });
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader} ref={chatHeaderRef}>
        <h2 className={styles.chatTitle}>🤖 Destiny</h2>
        <p className={styles.chatSubtitle}>Destiny 博士设计的 AI 助手</p>
        {messages.length > 0 && (
          <button
            className={styles.clearButton}
            onClick={() => window.confirm('确定要清空对话历史吗？') && clearHistory()}
          >
            🗑️ 清理上下文
          </button>
        )}
      </div>

      <div className={styles.messagesArea}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <p>👋 你好！我是 Destiny，Destiny 博士设计的 AI 助手。</p>
            <p>你可以问我关于 Python 学习的任何问题，我会基于网站文档来回答。</p>
            <p>你也可以在教程页面点击代码块旁的「问 AI」按钮来解释代码。</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </div>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
      <AiToolsLinks />
    </div>
  );
}
