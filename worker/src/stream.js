export async function streamSSE(response, writer) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);

        if (data === '[DONE]') {
          writer.write('data: {"type":"done"}\n\n');
          continue;
        }

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            writer.write(`data: ${JSON.stringify({ type: 'token', content })}\n\n`);
          }
        } catch {
          // 忽略解析失败的行
        }
      }
    }
  } catch (err) {
    writer.write(`data: ${JSON.stringify({ type: 'error', content: err.message })}\n\n`);
  }
}
