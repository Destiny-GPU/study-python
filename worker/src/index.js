import { SYSTEM_PROMPT, CODE_EXPLAIN_PROMPT } from './prompt';
import { bm25Search, buildContext } from './rag';
import { streamSSE } from './stream';

let docsIndex = null;

async function loadDocsIndex(env) {
  if (docsIndex) return docsIndex;
  const url = env.DOCS_INDEX_URL;
  if (url) {
    const resp = await fetch(url);
    docsIndex = await resp.json();
  }
  return docsIndex;
}

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // 健康检查
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST' && url.pathname === '/api/chat') {
      try {
        const body = await request.json();
        const { messages, pageContext, code } = body;

        if (!messages || !Array.isArray(messages)) {
          return new Response(JSON.stringify({ error: 'messages required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const index = await loadDocsIndex(env);
        const lastMsg = messages[messages.length - 1];
        const query = code ? code : lastMsg.content;

        let contextStr = '';
        if (index && index.pages) {
          const allChunks = index.pages.flatMap(p => p.chunks || []);
          const results = bm25Search(query, allChunks, 5);
          contextStr = buildContext(results, pageContext);
        }

        let systemPrompt = code ? CODE_EXPLAIN_PROMPT : SYSTEM_PROMPT;
        if (contextStr) {
          systemPrompt += '\n\n' + contextStr;
        }

        const apiMessages = [
          { role: 'system', content: systemPrompt },
          ...messages,
        ];

        const model = env.MODEL || 'THUDM/GLM-Z1-9B-0414';
        const apiResp = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.SILICONFLOW_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: apiMessages,
            stream: true,
            max_tokens: 2048,
            temperature: 0.7,
          }),
        });

        if (!apiResp.ok) {
          const errText = await apiResp.text();
          return new Response(JSON.stringify({ error: errText }), {
            status: apiResp.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        ctx.waitUntil(streamSSE(apiResp, writer).then(() => writer.close()));

        return new Response(readable, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
