// 简易 BM25 搜索实现

export function bm25Search(query, chunks, topK = 5) {
  const k1 = 1.5;
  const b = 0.75;
  const avgDl = chunks.reduce((sum, c) => sum + c.content.length, 0) / chunks.length || 1;
  const N = chunks.length;

  // 构建倒排索引
  const docFreqs = {};
  for (const chunk of chunks) {
    const terms = tokenize(chunk.content);
    const seen = new Set();
    for (const term of terms) {
      if (!seen.has(term)) {
        docFreqs[term] = (docFreqs[term] || 0) + 1;
        seen.add(term);
      }
    }
  }

  // 计算每个 chunk 的 BM25 分数
  const queryTerms = tokenize(query);
  const scores = chunks.map((chunk, idx) => {
    const terms = tokenize(chunk.content);
    const dl = terms.length;
    let score = 0;

    for (const qt of queryTerms) {
      const tf = terms.filter(t => t === qt).length;
      const df = docFreqs[qt] || 0;
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
      const tfNorm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / avgDl));
      score += idf * tfNorm;
    }

    // 标题匹配加分
    const titleLower = (chunk.heading || '').toLowerCase();
    for (const qt of queryTerms) {
      if (titleLower.includes(qt)) score += 2;
    }

    return { idx, score };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(s => s.score > 0)
    .map(s => chunks[s.idx]);
}

function tokenize(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const tokens = [];
  // 英文单词
  const enWords = lower.match(/[a-z][a-z0-9_]*/g) || [];
  tokens.push(...enWords);
  // 中文字符（bigram）
  const zhChars = lower.match(/[\u4e00-\u9fff]/g) || [];
  for (let i = 0; i < zhChars.length - 1; i++) {
    tokens.push(zhChars[i] + zhChars[i + 1]);
  }
  // 中文单字
  tokens.push(...zhChars);
  return tokens;
}

export function buildContext(searchResults, pageContext) {
  let context = '';

  if (pageContext) {
    context += `[当前页面: ${pageContext.title} (${pageContext.path})]\n\n`;
  }

  if (searchResults.length > 0) {
    context += '以下是与问题相关的文档内容：\n\n';
    for (const chunk of searchResults) {
      context += `## ${chunk.heading || '未命名'}\n${chunk.content}\n\n`;
    }
  }

  return context;
}
