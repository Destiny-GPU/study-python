# Study Python 文档站点

基于 [Docusaurus](https://docusaurus.io/) 3.10 构建的 Python 学习文档站点。

## 环境要求

- Node.js >= 20
- npm
- Python 3.14+（用于生成脚本标签）

## 快速开始

```bash
cd docs
npm ci          # 安装依赖
npm start       # 启动开发服务器 (localhost:3000)
```

## 常用命令

```bash
npm start               # 开发模式，支持热更新
npm run build           # 生产构建，输出到 build/
npm run serve           # 本地预览生产构建
npm run lint            # Markdown 格式检查
npm run lint:fix        # 自动修复 Markdown 格式问题
npm run clear           # 清除缓存
npm run generate-doc-tags  # 生成文档标签数据
```

## 文档结构

```
docs/
├── docs/                      # 教程文档 (MDX)
│   ├── getting-started/       # 入门指南 (4 篇)
│   ├── basics/                # 基础语法 (7 篇)
│   ├── control-flow/          # 控制流 (5 篇)
│   ├── data-structures/       # 数据结构 (5 篇)
│   ├── functions/             # 函数 (7 篇)
│   ├── oop/                   # 面向对象 (6 篇)
│   ├── modules/               # 模块与包 (4 篇)
│   ├── error-handling/        # 异常处理 (4 篇)
│   ├── file-handling/         # 文件操作 (4 篇)
│   ├── advanced/              # 高级特性 (9 篇)
│   ├── standard-library/      # 标准库 (6 篇)
│   ├── testing-debugging/     # 测试与调试 (4 篇)
│   ├── project-tutorial/      # 项目实战 (2 篇)
│   ├── performance/           # 性能优化 (2 篇)
│   ├── scientific-computing/  # 科学计算 (5 篇)
│   └── parallel-computing/    # 并发编程 (2 篇)
├── blog/                      # 学习笔记
├── src/                       # 源码目录
│   ├── components/            # 自定义 React 组件
│   │   ├── CardGrid/          # 卡片网格
│   │   ├── HeroSection/       # 英雄区域
│   │   ├── TypingCode/        # 打字机效果
│   │   ├── PyodideRunner/     # Python 运行器
│   │   ├── ProgressTracker/   # 进度追踪
│   │   ├── AutoRelatedDocs/   # 相关文档推荐
│   │   ├── ChapterNav/        # 章节导航
│   │   ├── LearningPath/      # 学习路径
│   │   ├── QuoteBlock/        # 名言引用
│   │   └── TrackSelector/     # 路径选择
│   ├── css/                   # 样式文件 (模块化)
│   │   ├── _variables.css     # 设计令牌
│   │   ├── _base.css          # 基础样式
│   │   ├── _components.css    # 组件样式
│   │   ├── _doc-content.css   # 文档内容样式
│   │   ├── _pages.css         # 页面样式
│   │   └── custom.css         # 入口文件
│   ├── clientModules/         # 客户端脚本
│   │   ├── constellation.js   # 星座动画入口
│   │   ├── constellation-init.js  # 星座动画实现
│   │   ├── progressBar.js     # 顶部进度条
│   │   └── progressTracker.js # 学习进度追踪
│   ├── data/                  # 数据文件
│   │   ├── chapters.json      # 章节配置
│   │   ├── doc-tags.json      # 文档标签
│   │   └── quotes.js          # 名言数据
│   ├── hooks/                 # React Hooks
│   │   └── useScrollReveal.js # 滚动显示动画
│   ├── pages/                 # 自定义页面
│   └── theme/                 # Docusaurus 主题覆盖
├── static/                    # 静态资源
│   ├── img/                   # 图片资源
│   └── files/                 # 文件资源
├── scripts/                   # 构建脚本
│   └── generate-doc-tags.py   # 生成文档标签
├── docusaurus.config.js       # 主配置文件
├── sidebars.js                # 侧边栏配置
├── package.json               # 依赖配置
└── .markdownlint.json         # Markdown lint 配置
```

## 新增文档

### 1. 创建 MDX 文件

在 `docs/` 对应目录下创建 `.mdx` 文件：

```mdx
---
sidebar_position: 1
sidebar_label: '简短标题'
title: '📖 完整标题'
description: '一句话描述本文档内容'
---

# 📖 完整标题

这里是文档内容...

## 小结

- 要点 1
- 要点 2
```

### 2. 更新侧边栏配置

在 `sidebars.js` 的 `DOC_ORDER` 对象中添加文件名：

```javascript
const DOC_ORDER = {
  'getting-started': [
    'installation',
    'first-program',
    'your-new-doc',  // 新增
  ],
  // ...
};
```

### 3. 添加文档标签

在 `src/data/doc-tags.json` 中为新文档添加标签：

```json
{
  "your-new-doc": ["标签1", "标签2"],
  // ...
}
```

## 样式系统

### CSS 模块划分

- `_variables.css` — 设计令牌（颜色、字体、阴影、间距）
- `_base.css` — 基础样式（重置、排版、工具类）
- `_components.css` — 组件样式（导航栏、侧边栏、按钮、卡片）
- `_doc-content.css` — 文档内容样式（代码块、表格、提示框）
- `_pages.css` — 页面特定样式（首页、关于页）

### 添加新样式

1. 确定样式属于哪个模块
2. 在对应 `.css` 文件中添加样式
3. 使用 CSS 变量保持一致性（参考 `_variables.css`）

### 主题定制

- 浅色主题：`@theme` 中的 CSS 变量
- 深色主题：`[data-theme='dark']` 选择器
- 响应式：`@media` 断点在 `_pages.css` 中定义

## 组件开发

### 组件结构

```
ComponentName/
├── index.js          # 组件实现
├── styles.module.css # CSS 模块（可选）
└── index.test.js     # 测试（可选）
```

### 组件注册

1. 在 `components/index.js` 中导出组件
2. 在 MDX 文件中使用 `<ComponentName />`

### 现有组件

| 组件 | 用途 | 位置 |
|------|------|------|
| `CardGrid` | 首页卡片展示 | `src/components/CardGrid/` |
| `HeroSection` | 首页英雄区域 | `src/components/HeroSection/` |
| `TypingCode` | 打字机效果 | `src/components/TypingCode/` |
| `PyodideRunner` | Python 代码运行 | `src/components/PyodideRunner/` |
| `ProgressTracker` | 进度追踪 | `src/components/ProgressTracker/` |
| `AutoRelatedDocs` | 相关文档推荐 | `src/components/AutoRelatedDocs/` |

详细组件文档请查看 [src/components/README.md](src/components/README.md)。

## 客户端模块

客户端模块在页面加载时自动执行，用于实现全局功能：

- `progressBar.js` — 页面顶部加载进度条
- `constellation.js` — 首页星空粒子动画（动态加载）
- `progressTracker.js` — 学习进度持久化存储

## 构建优化

- **代码分割**：客户端模块动态导入
- **字体优化**：预加载 Google Fonts
- **图片优化**：懒加载 + `decoding="async"`
- **GPU 加速**：`will-change` 提示
- **内容可见性**：`content-visibility: auto`

## CI/CD 流程

### PR 验证

`.github/workflows/docs-ci.yml` 在 PR 修改 `docs/**` 时自动运行：

1. 安装 Node.js 22
2. 执行 `npm ci`
3. 执行 `npm run build`

### 部署

`.github/workflows/deploy.yml` 在 push to main 时自动部署：

1. 构建文档站点
2. 上传到 GitHub Pages

## 故障排除

### 构建失败

```bash
npm run clear    # 清除缓存
npm ci           # 重新安装依赖
npm run build    # 重新构建
```

### 热更新不生效

1. 检查文件保存是否成功
2. 尝试重启开发服务器
3. 清除浏览器缓存

### 样式问题

1. 检查 CSS 模块是否正确导入
2. 确认 CSS 变量名拼写
3. 使用浏览器开发者工具检查样式

## 相关链接

- [Docusaurus 官方文档](https://docusaurus.io/docs)
- [Docusaurus GitHub](https://github.com/facebook/docusaurus)
- [MDX 语法](https://mdxjs.com/)
