# Study Python

从入门到精通的 Python 系统学习之旅。

[![GitHub Stars](https://img.shields.io/github/stars/Destiny-GPU/study-python?style=social)](https://github.com/Destiny-GPU/study-python)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Destiny-GPU/study-python/blob/main/LICENSE.md)

## 项目简介

一个基于 Docusaurus 3.10 构建的 Python 教程网站，涵盖 Python 3.12+ 的现代写法，从语法基础到工程实战。教程包含丰富的交互式代码示例（PyodideRunner 支持浏览器内运行）、进度追踪、章节导航、AI 智能问答等功能。

- **在线访问**: [study-python-zj.pages.dev](https://study-python-zj.pages.dev/)
- **Python 版本**: 3.14（cutting-edge）
- **文档框架**: Docusaurus 3.10
- **构建工具**: Node.js >= 20, npm, uv (Python 包管理器)

## 功能特性

- 🎨 **现代化设计**: 深色/浅色主题切换，响应式布局
- 🚀 **高性能**: 懒加载、GPU 加速、字体优化
- 📝 **交互式代码**: PyodideRunner 支持浏览器内运行 Python 代码
- 🤖 **AI 智能问答**: 基于硅基流动 GLM-Z1-9B-0414，支持文档检索和代码解释
- 🔍 **全文搜索**: 基于 lunr 的本地搜索
- 🎯 **系统化内容**: 13 个章节，92 篇文档
- 📱 **移动端适配**: 完整的响应式设计

## 快速开始

### 环境要求

- Node.js >= 20
- npm
- Python 3.14+（用于 Python 相关脚本）
- uv（推荐的 Python 包管理器）

### 克隆并启动

```bash
# 克隆仓库
git clone https://github.com/Destiny-GPU/study-python.git
cd study-python

# 启动文档站点
cd docs
npm ci
npm start
```

开发服务器启动后访问 `http://localhost:3000`。

### 本地测试 AI 聊天功能

```bash
cd docs
npx wrangler pages dev build --port 8788
# 访问 http://localhost:8788/ai-chat
```

> 注意：`npm run serve` 不支持 Cloudflare Pages Functions，AI 聊天会报 404。必须用 `wrangler pages dev build`。

### Python 环境（可选）

```bash
uv sync
uv run python src/study_python/timer.py
```

## 项目结构

```
study-python/
├── docs/                          # Docusaurus 文档站点
│   ├── docs/                      # 教程文档 (MDX 格式)
│   ├── blog/                      # 学习笔记
│   ├── functions/api/chat.js      # Cloudflare Pages Function (AI API)
│   ├── src/
│   │   ├── components/AiChat/     # AI 聊天组件
│   │   ├── plugins/               # 构建插件 (文档索引)
│   │   └── theme/CodeBlock/       # 代码块「问 AI」按钮
│   └── static/img/ai-tools/       # AI 工具图标
├── worker/                        # Cloudflare Worker (备用，国内不可用)
├── src/study_python/              # Python 源码
└── pyproject.toml
```

## AI 聊天功能

### 架构

```
浏览器 → /api/chat (Pages Function) → BM25 搜索 docs-content.json → 硅基流动 GLM-Z1-9B-0414 → SSE 流式返回
```

### 关键文件

| 文件 | 说明 |
|------|------|
| `docs/functions/api/chat.js` | API 代理：CORS + BM25 搜索 + LLM 调用 + SSE 流式 |
| `docs/src/plugins/docs-index-plugin.js` | 构建时生成 `docs-content.json`（104 页索引） |
| `docs/src/components/AiChat/` | 聊天界面（hooks/useChat + 消息渲染 + localStorage 持久化） |
| `docs/src/theme/CodeBlock/` | Swizzle CodeBlock，添加「问 AI」按钮 |
| `docs/.dev.vars` | 本地 API Key（不提交） |

### 部署

- 推送到 GitHub → Cloudflare Pages 自动部署
- `SILICONFLOW_API_KEY` 通过 `wrangler pages secret set` 配置（不进代码）
- 文档索引 `docs-content.json` 随构建自动上传

## 组件说明

| 组件 | 说明 |
|------|------|
| `AiChat` | AI 智能问答界面 |
| `CardGrid` | 首页卡片网格展示 |
| `HeroSection` | 首页英雄区域 |
| `TypingCode` | 打字机效果代码展示 |
| `PyodideRunner` | 浏览器内 Python 运行器 |
| `AutoRelatedDocs` | 自动相关文档推荐 |
| `LearningPath` | 学习路径展示 |
| `QuoteBlock` | 名言引用块 |
| `TrackSelector` | 学习路径选择器 |

## 样式系统

CSS 按功能模块化拆分：

- `_variables.css` — 设计令牌
- `_base.css` — 基础样式
- `_components.css` — 组件样式（navbar/sidebar/footer/buttons/cards/alerts）
- `_doc-content.css` — 文档内容样式
- `_pages.css` — 页面特定样式
- `_responsive.css` — 响应式断点

## CI/CD

- **PR 验证**: `.github/workflows/docs-ci.yml`
- **部署**: `.github/workflows/deploy.yml` — push to main 时部署到 Cloudflare Pages

## 许可证

[MIT](LICENSE.md)

## 联系方式

- GitHub Issues: [提交问题](https://github.com/Destiny-GPU/study-python/issues)
- 邮箱: zhangjian_destiny@qq.com
