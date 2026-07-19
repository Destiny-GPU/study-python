import { useState } from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import { useHistory } from '@docusaurus/router';
import styles from './styles.module.css';

function extractCode(children) {
  if (typeof children === 'string') return children;
  return children?.props?.children || '';
}

export default function CodeBlockWrapper(props) {
  const [hovered, setHovered] = useState(false);
  const history = useHistory();

  const handleAskAI = () => {
    const code = extractCode(props.children);
    if (code) history.push(`/ai-chat?code=${encodeURIComponent(code)}`);
  };

  return (
    <div
      className={styles.codeBlockWrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <OriginalCodeBlock {...props} />
      {hovered && (
        <button className={styles.askButton} onClick={handleAskAI} title="问 AI 解释这段代码">
          🤖 问 AI
        </button>
      )}
    </div>
  );
}
