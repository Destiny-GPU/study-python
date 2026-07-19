/**
 * Knowledge graph data — nodes and edges for the Python tutorial.
 * Positions are in a 1000x700 viewport, manually placed for a clean layout.
 */

export const categories = {
  intro:      { label: '入门准备',   color: '#10b981', lightColor: '#dcfce7' },
  basics:     { label: '核心语法',   color: '#3b82f6', lightColor: '#dbeafe' },
  intermediate: { label: '进阶概念', color: '#f59e0b', lightColor: '#fef3c7' },
  advanced:   { label: '高级主题',   color: '#8b5cf6', lightColor: '#ede9fe' },
  engineering:{ label: '工程实践',   color: '#ec4899', lightColor: '#fce7f3' },
};

export const nodes = [
  // 入门准备
  { id: 'intro',             label: 'Python 简介',       category: 'intro',      x: 100, y: 80,  path: '/docs/intro' },
  { id: 'installation',      label: '环境搭建',          category: 'intro',      x: 100, y: 180, path: '/docs/getting-started/installation' },

  // 核心语法
  { id: 'basics',            label: '基础语法',          category: 'basics',     x: 280, y: 80,  path: '/docs/basics/variables' },
  { id: 'control-flow',     label: '流程控制',          category: 'basics',     x: 280, y: 180, path: '/docs/control-flow/if-else' },
  { id: 'data-structures',  label: '数据结构',          category: 'basics',     x: 280, y: 280, path: '/docs/data-structures/lists' },
  { id: 'functions',        label: '函数',              category: 'basics',     x: 280, y: 380, path: '/docs/functions/scope' },

  // 进阶概念
  { id: 'oop',               label: '面向对象',          category: 'intermediate', x: 480, y: 80,  path: '/docs/oop/inheritance' },
  { id: 'modules',           label: '模块与包',          category: 'intermediate', x: 480, y: 180, path: '/docs/modules/' },
  { id: 'error-handling',   label: '异常处理',          category: 'intermediate', x: 480, y: 280, path: '/docs/error-handling/try-except' },
  { id: 'file-handling',    label: '文件操作',          category: 'intermediate', x: 480, y: 380, path: '/docs/file-handling/read-write' },

  // 高级主题 — 三列间距从 100px 拉大到 160px，避免节点重叠
  { id: 'standard-library', label: '标准库',            category: 'advanced',   x: 650, y: 80,  path: '/docs/standard-library/collections' },
  { id: 'numpy',             label: 'NumPy',            category: 'advanced',   x: 650, y: 180, path: '/docs/scientific-computing/numpy-fundamentals' },
  { id: 'scipy',             label: 'SciPy',            category: 'advanced',   x: 650, y: 280, path: '/docs/scientific-computing/scipy-intro' },
  { id: 'pandas',            label: 'pandas',           category: 'advanced',   x: 810, y: 180, path: '/docs/scientific-computing/pandas-intro' },
  { id: 'matplotlib',        label: 'matplotlib',       category: 'advanced',   x: 810, y: 280, path: '/docs/scientific-computing/matplotlib-intro' },
  { id: 'pytorch',           label: 'PyTorch',          category: 'advanced',   x: 810, y: 380, path: '/docs/scientific-computing/pytorch-intro' },
  { id: 'typing',            label: '类型标注',          category: 'advanced',   x: 650, y: 380, path: '/docs/advanced/typing-module' },
  { id: 'async',             label: '异步编程',          category: 'advanced',   x: 970, y: 280, path: '/docs/advanced/async-await' },
  { id: 'decorators',        label: '装饰器',            category: 'advanced',   x: 970, y: 180, path: '/docs/functions/decorators' },
  { id: 'generators',        label: '生成器',            category: 'advanced',   x: 970, y: 80,  path: '/docs/functions/generators' },

  // 工程实践
  { id: 'testing',           label: '测试与调试',        category: 'engineering', x: 480, y: 480, path: '/docs/testing-debugging/' },
  { id: 'threading',         label: '并行计算',          category: 'engineering', x: 650, y: 480, path: '/docs/parallel-computing/threading' },
  { id: 'performance',       label: '性能优化',          category: 'engineering', x: 970, y: 480, path: '/docs/performance/profiling' },
  { id: 'project',           label: '项目实战',          category: 'engineering', x: 650, y: 580, path: '/docs/project-tutorial/' },
];

export const edges = [
  // 入门 → 基础
  { from: 'intro', to: 'installation' },
  { from: 'installation', to: 'basics' },

  // 基础语法链
  { from: 'basics', to: 'control-flow' },
  { from: 'control-flow', to: 'data-structures' },
  { from: 'data-structures', to: 'functions' },

  // 基础 → 进阶
  { from: 'functions', to: 'oop' },
  { from: 'functions', to: 'modules' },
  { from: 'functions', to: 'error-handling' },
  { from: 'error-handling', to: 'file-handling' },

  // 进阶 → 高级
  { from: 'modules', to: 'standard-library' },
  { from: 'standard-library', to: 'numpy' },
  { from: 'numpy', to: 'scipy' },
  { from: 'numpy', to: 'pandas' },
  { from: 'scipy', to: 'matplotlib' },
  { from: 'pandas', to: 'matplotlib' },
  { from: 'scipy', to: 'pytorch' },
  { from: 'functions', to: 'decorators' },
  { from: 'functions', to: 'generators' },
  { from: 'oop', to: 'typing' },
  { from: 'oop', to: 'async' },

  // 高级 → 工程
  { from: 'error-handling', to: 'testing' },
  { from: 'numpy', to: 'threading' },
  { from: 'threading', to: 'performance' },
  { from: 'testing', to: 'project' },
  { from: 'performance', to: 'project' },
];
