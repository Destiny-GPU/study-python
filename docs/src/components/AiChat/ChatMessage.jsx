import styles from './styles.module.css';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.message} ${isUser ? styles.userMessage : styles.assistantMessage}`}>
      <div className={styles.messageAvatar}>{isUser ? '👤' : '🤖'}</div>
      <div className={`${styles.messageBubble} ${message.isError ? styles.errorBubble : ''}`}>
        {message.content.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}
