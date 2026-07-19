// Cloudflare Pages Function — POST /api/chat
// 硅基流动 GLM-Z1-9B-0414 代理 + BM25 文档搜索

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SYSTEM_PROMPT = `你是 Destiny，由 Destiny 博士设计的 AI 助手，也是一个友好、耐心的 Python 学习伙伴。

你的能力：
- 回答 Python 相关的学习问题
- 解释代码、调试错误
- 基于网站文档内容给出准确回答
- 用通俗易懂的方式讲解编程概念

规则：
1. 优先使用提供的文档内容回答 Python 学习问题
2. 如果文档中没有相关内容，可以用自己的知识回答，但要说明这是通用知识
3. 回答简洁明了，适合学习者理解
4. 使用中文回答
5. 保持友好、热情的语气，像一个学习伙伴一样交流
6. 如果用户提供了代码，解释其含义、执行结果和关键知识点`;

const CODE_PROMPT = `你是一个代码解释助手。请详细解释用户提供的 Python 代码：

1. 代码的整体功能和目的
2. 逐行解释关键语句
3. 涉及的 Python 知识点
4. 可能的运行结果
5. 相关的最佳实践或注意事项

使用中文回答，语言简洁易懂。`;

// ── 文档索引 ──

let docsIndex = null;

async function loadDocsIndex(env) {
  if (docsIndex) return docsIndex;
  try {
    const resp = await fetch(env.DOCS_INDEX_URL || 'https://study-python-zj.pages.dev/docs-content.json');
    docsIndex = await resp.json();
  } catch {}
  return docsIndex;
}

// ── BM25 搜索 ──

function tokenize(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const tokens = [];

  // 英文单词
  for (const w of lower.match(/[a-z][a-z0-9_]*/g) || []) {
    tokens.push(w);
  }

  // 中文 bigram + 单字
  const zh = lower.match(/[\u4e00-\u9fff]/g) || [];
  for (let i = 0; i < zh.length - 1; i++) tokens.push(zh[i] + zh[i + 1]);
  tokens.push(...zh);

  return tokens;
}

function bm25Search(query, chunks, topK = 5) {
  const k1 = 1.5, b = 0.75;
  const N = chunks.length;
  const avgDl = chunks.reduce((s, c) => s + c.content.length, 0) / N || 1;

  // 构建文档频率
  const df = {};
  for (const chunk of chunks) {
    const seen = new Set();
    for (const t of tokenize(chunk.content)) {
      if (!seen.has(t)) { df[t] = (df[t] || 0) + 1; seen.add(t); }
    }
  }

  const queryTerms = tokenize(query);

  return chunks
    .map((chunk, idx) => {
      const terms = tokenize(chunk.content);
      const dl = terms.length;
      let score = 0;

      for (const qt of queryTerms) {
        const tf = terms.filter(t => t === qt).length;
        const idf = Math.log((N - (df[qt] || 0) + 0.5) / ((df[qt] || 0) + 0.5) + 1);
        score += idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / avgDl));
      }

      // 标题加分
      const heading = (chunk.heading || '').toLowerCase();
      for (const qt of queryTerms) {
        if (heading.includes(qt)) score += 2;
      }

      return { chunk, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk);
}

// ── 上下文构建 ──

function buildContext(results, pageContext) {
  let ctx = '';
  if (pageContext) {
    ctx += `[当前页面: ${pageContext.title} (${pageContext.path})]\n\n`;
  }
  if (results.length > 0) {
    ctx += '以下是与问题相关的文档内容：\n\n';
    for (const c of results) {
      ctx += `## ${c.heading || '未命名'}\n${c.content}\n\n`;
    }
  }
  return ctx;
}

// ── SSE 流式转发 ──

async function streamSSE(response, writer) {
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
        if (!trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);

        if (data === '[DONE]') {
          writer.write('data: {"type":"done"}\n\n');
          continue;
        }

        try {
          const content = JSON.parse(data).choices?.[0]?.delta?.content;
          if (content) writer.write(`data: ${JSON.stringify({ type: 'token', content })}\n\n`);
        } catch {}
      }
    }
  } catch (err) {
    writer.write(`data: ${JSON.stringify({ type: 'error', content: err.message })}\n\n`);
  }
}

// ── 请求处理 ──

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { messages, pageContext, code } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return jsonError('messages required', 400);
    }

    // BM25 搜索相关文档
    const index = await loadDocsIndex(env);
    const lastMsg = messages[messages.length - 1];
    const query = code || lastMsg.content;

    let contextStr = '';
    if (index?.pages) {
      const allChunks = index.pages.flatMap(p => p.chunks || []);
      contextStr = buildContext(bm25Search(query, allChunks, 5), pageContext);
    }

    // 构造系统提示
    let systemPrompt = code ? CODE_PROMPT : SYSTEM_PROMPT;
    if (contextStr) systemPrompt += '\n\n' + contextStr;

    // 调用硅基流动 API
    const apiResp = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.MODEL || 'THUDM/GLM-Z1-9B-0414',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        stream: true,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!apiResp.ok) {
      return jsonError(await apiResp.text(), apiResp.status);
    }

    // 流式转发
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    context.waitUntil(streamSSE(apiResp, writer).then(() => writer.close()));

    return new Response(readable, {
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  } catch (err) {
    return jsonError(err.message, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
