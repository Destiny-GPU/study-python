import Layout from '@theme/Layout';
import AiChat from '@site/src/components/AiChat';

export default function AiChatPage() {
  return (
    <Layout title="AI 学习助手" description="基于 Study Python 文档的智能问答助手">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AiChat />
      </div>
    </Layout>
  );
}
