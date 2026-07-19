import { useState, useRef } from 'react';
import styles from './styles.module.css';

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className={styles.inputForm} onSubmit={handleSubmit}>
      <textarea
        ref={inputRef}
        className={styles.inputField}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入你的问题... (Enter 发送, Shift+Enter 换行)"
        rows={4}
        disabled={disabled}
      />
      <button
        type="submit"
        className={styles.sendButton}
        disabled={disabled || !input.trim()}
      >
        {disabled ? '⏳' : '➤'}
      </button>
    </form>
  );
}
