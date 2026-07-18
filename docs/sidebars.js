// @ts-check

import fs from 'fs';
import path from 'path';
import chapters from './src/data/chapters.json';

/**
 * 侧边栏文档顺序配置
 * 新增文档只需在此处对应分类中添加一项（文件名不含扩展名）
 * 插入中间位置只需在对应位置添加，无需修改其他项
 */
const DOC_ORDER = {
  'getting-started': [
    'installation',
    'first-program',
    'running-code',
    'ide-setup',
  ],
  'basics': [
    'variables',
    'numbers',
    'strings',
    'booleans',
    'operators',
    'input-output',
    'comments',
  ],
  'control-flow': [
    'if-else',
    'for-loops',
    'while-loops',
    'break-continue',
    'match-case',
  ],
  'data-structures': [
    'lists',
    'tuples',
    'dictionaries',
    'sets',
    'comprehensions',
  ],
  'functions': [
    'defining',
    'parameters',
    'scope',
    'lambda',
    'decorators',
    'recursion',
    'generators',
  ],
  'oop': [
    'classes',
    'inheritance',
    'polymorphism',
    'encapsulation',
    'dataclasses',
    'magic-methods',
  ],
  'modules': [
    'module-basics',
    'packages',
    'pip',
    'virtual-env',
  ],
  'error-handling': [
    'exceptions',
    'try-except',
    'custom-exceptions',
    'context-managers',
  ],
  'file-handling': [
    'read-write',
    'file-paths',
    'json',
    'csv',
  ],
  'advanced': [
    'type-hints',
    'typing-module',
    'pattern-matching',
    'async-await',
    'walrus-operator',
    'defensive-programming',
    'pythonic',
    'eval-function',
    'hash-mechanism',
  ],
  'standard-library': [
    'os',
    'pathlib',
    'datetime',
    'collections',
    'itertools',
    'functools',
  ],
  'testing-debugging': [
    'pytest-basics',
    'pytest-advanced',
    'debugging',
    'debugging-advanced',
  ],
  'project-tutorial': [
    'complete-project',
    'scientific-project',
  ],
  'performance': [
    'profiling',
    'optimization',
  ],
  'scientific-computing': [
    'numpy-fundamentals',
    'scipy-intro',
    'pandas-intro',
    'matplotlib-intro',
    'pytorch-intro',
  ],
  'parallel-computing': [
    'multiprocessing',
    'threading',
  ],
};

/**
 * 五阶段分组配置 — 从 chapters.json 读取，emoji 和 label 统一管理
 */
const PHASES = chapters.phases.map(p => ({
  label: `${p.emoji} ${p.label}`,
  description: p.description,
  categories: p.categories,
}));

const docsDir = path.resolve(__dirname, 'docs');

/**
 * 读取分类的 _category_.json
 */
function getCategoryMeta(dirName) {
  const metaPath = path.join(docsDir, dirName, '_category_.json');
  if (fs.existsSync(metaPath)) {
    return JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  }
  return {};
}

/**
 * 获取分类下的所有文档 ID（不含扩展名）
 */
function getDocIds(dirName) {
  const dir = path.join(docsDir, dirName);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(mdx?|mdx)$/.test(f) && !f.startsWith('_'))
    .map(f => path.parse(f).name)
    .filter(id => id !== '_template');
}

/**
 * 为一个分类生成侧边栏项
 */
function generateCategorySidebar(dirName) {
  const meta = getCategoryMeta(dirName);
  const order = DOC_ORDER[dirName];
  let docIds;

  if (order) {
    // 使用配置的顺序，但只包含实际存在的文件
    const existing = new Set(getDocIds(dirName));
    docIds = order.filter(id => existing.has(id));
    // 追加配置中没有但文件中存在的（新文件忘记加到配置）
    const unordered = getDocIds(dirName).filter(id => !docIds.includes(id));
    if (unordered.length > 0) {
      console.warn(`[sidebars] ${dirName}: 以下文档未在 DOC_ORDER 中配置，已追加到末尾: ${unordered.join(', ')}`);
    }
    docIds.push(...unordered);
  } else {
    // 没有配置，按文件名排序
    docIds = getDocIds(dirName).sort();
  }

  return {
    type: 'category',
    label: meta.label || dirName,
    ...(meta.link ? { link: meta.link } : {}),
    items: docIds.map(id => `${dirName}/${id}`),
  };
}

/**
 * 生成五阶段分组侧边栏
 */
function generatePhasedSidebar() {
  return PHASES.map(phase => ({
    type: 'category',
    label: phase.label,
    collapsed: false,
    items: phase.categories
      .filter(dirName => fs.existsSync(path.join(docsDir, dirName)))
      .map(dirName => generateCategorySidebar(dirName)),
  }));
}

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    // 根级文档（intro, playground）保持原有 position 排序
    'intro',
    'playground',
    // 五阶段分组文档
    ...generatePhasedSidebar(),
  ],
};

export default sidebars;
