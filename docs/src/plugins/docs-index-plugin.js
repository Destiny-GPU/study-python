const fs = require('fs');
const path = require('path');

module.exports = function docsIndexPlugin(context) {
  return {
    name: 'docs-index-plugin',

    async postBuild({ outDir }) {
      const pages = [];
      const docsDir = path.join(context.siteDir, 'docs');
      const blogDir = path.join(context.siteDir, 'blog');

      if (fs.existsSync(docsDir)) scanDir(docsDir, pages, 'docs');
      if (fs.existsSync(blogDir)) scanDir(blogDir, pages, 'blog');

      const index = { version: '1.0', generated: new Date().toISOString(), pages };
      fs.writeFileSync(path.join(outDir, 'docs-content.json'), JSON.stringify(index, null, 2));
      console.log(`[docs-index] Generated ${pages.length} pages`);
    },
  };
};

// ── 文件扫描 ──

function scanDir(dir, pages, category) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full, pages, category);
    } else if (/\.(mdx?|md)$/.test(entry.name)) {
      const page = parseMdx(fs.readFileSync(full, 'utf-8'), full, category);
      if (page) pages.push(page);
    }
  }
}

// ── MDX 解析 ──

function parseMdx(raw, filePath, category) {
  // 提取 frontmatter
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  let title = '', slug = '';
  if (fmMatch) {
    const fm = fmMatch[1];
    title = fm.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '') || '';
    slug = fm.match(/^slug:\s*(.+)$/m)?.[1]?.trim() || '';
  }

  // 提取代码块
  const codeChunks = [];
  let codeIdx = 0;
  let content = raw.replace(/^---\n[\s\S]*?\n---\n?/, '')
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      codeChunks.push({ id: `code-${codeIdx++}`, language: lang || 'python', content: code.trim() });
      return '';
    });

  // 清理 MDX 标记
  content = content
    .replace(/<[A-Z][^>]*\/>/g, '')
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (content.length < 20) return null;

  // 按 ## 标题分块
  const chunks = splitChunks(content);
  if (chunks.length === 0) return null;

  const relPath = filePath.replace(/.*?(?:docs|blog)\//, '/');
  return {
    path: slug || relPath.replace(/\.mdx?$/, '').replace(/\/index$/, ''),
    title: title || path.basename(filePath, path.extname(filePath)),
    category,
    chunks,
    code_chunks: codeChunks,
  };
}

// ── 内容分块 ──

function splitChunks(content) {
  const chunks = [];
  let idx = 0;

  for (const section of content.split(/\n(?=## )/)) {
    const trimmed = section.trim();
    if (trimmed.length < 30) continue;

    const heading = trimmed.match(/^(?:##\s*)?(.+)/)?.[1]?.trim() || '';

    if (trimmed.length > 800) {
      // 长段落按段切分
      let buffer = '';
      for (const para of trimmed.split(/\n\n+/)) {
        if (buffer.length + para.length > 600 && buffer.length > 0) {
          chunks.push(makeChunk(idx++, heading, buffer));
          buffer = para;
        } else {
          buffer += (buffer ? '\n\n' : '') + para;
        }
      }
      if (buffer.trim().length > 30) chunks.push(makeChunk(idx++, heading, buffer));
    } else {
      chunks.push(makeChunk(idx++, heading, trimmed));
    }
  }
  return chunks;
}

function makeChunk(idx, heading, content) {
  const text = content.trim();
  const keywords = new Set();

  // 英文术语
  for (const w of text.match(/[a-zA-Z_][a-zA-Z0-9_.]{2,}/g) || []) {
    if (!STOP_WORDS.has(w.toLowerCase())) keywords.add(w);
  }
  // 中文关键词
  for (const w of (text.match(/[\u4e00-\u9fff]{2,6}/g) || []).slice(0, 10)) {
    keywords.add(w);
  }

  return {
    id: `chunk-${idx}`,
    heading,
    content: text,
    keywords: [...keywords].slice(0, 15),
  };
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'this', 'that', 'from',
  'import', 'def', 'class', 'function', 'const', 'let', 'var',
]);
