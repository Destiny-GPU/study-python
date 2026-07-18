# Study Python

从入门到精通的 Python 系统学习之旅。

[![GitHub Stars](https://img.shields.io/github/stars/Destiny-GPU/study-python?style=social)](https://github.com/Destiny-GPU/study-python)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Destiny-GPU/study-python/blob/main/LICENSE.md)

## 项目简介

一个基于 Docusaurus 3.10 构建的 Python 教程网站，涵盖 Python 3.12+ 的现代写法，从语法基础到工程实战。教程包含丰富的交互式代码示例（PyodideRunner 支持浏览器内运行）、进度追踪、章节导航等功能。

- **在线访问**: [study-python-zj.pages.dev](https://study-python-zj.pages.dev/)
- **Python 版本**: 3.14（cutting-edge）
- **文档框架**: Docusaurus 3.10
- **构建工具**: Node.js >= 20, npm, uv (Python 包管理器)

## 功能特性

- 🎨 **现代化设计**: 深色/浅色主题切换，响应式布局
- 🚀 **高性能**: 懒加载、GPU 加速、字体优化
- 📝 **交互式代码**: PyodideRunner 支持浏览器内运行 Python 代码
- 📊 **学习进度**: 自动追踪阅读进度和已读章节
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

### Python 环境（可选）

如果需要运行 Python 示例代码：

```bash
# 安装依赖
uv sync

# 运行脚本
uv run python src/study_python/timer.py
```

## 项目结构

```
study-python/
├── docs/                          # Docusaurus 文档站点
│   ├── docs/                      # 教程文档 (MDX 格式)
│   │   ├── getting-started/       # 入门指南
│   │   ├── basics/                # 基础语法
│   │   ├── control-flow/          # 控制流
│   │   ├── data-structures/       # 数据结构
│   │   ├── functions/             # 函数
│   │   ├── oop/                   # 面向对象
│   │   ├── modules/               # 模块与包
│   │   ├── error-handling/        # 异常处理
│   │   ├── file-handling/         # 文件操作
│   │   ├── advanced/              # 高级特性
│   │   ├── standard-library/      # 标准库
│   │   ├── testing-debugging/     # 测试与调试
│   │   ├── project-tutorial/      # 项目实战
│   │   ├── performance/           # 性能优化
│   │   ├── scientific-computing/  # 科学计算
│   │   └── parallel-computing/    # 并发编程
│   ├── blog/                      # 学习笔记
│   ├── src/                       # 源码目录
│   │   ├── components/            # 自定义 React 组件
│   │   ├── css/                   # 样式文件 (模块化)
│   │   ├── clientModules/         # 客户端脚本
│   │   ├── data/                  # 数据文件
│   │   ├── hooks/                 # React Hooks
│   │   ├── pages/                 # 自定义页面
│   │   ├── theme/                 # Docusaurus 主题覆盖
│   │   └── utils/                 # 工具函数
│   ├── static/                    # 静态资源
│   ├── scripts/                   # 构建脚本
│   ├── docusaurus.config.js       # 主配置文件
│   ├── sidebars.js                # 侧边栏配置
│   └── package.json               # 依赖配置
├── src/study_python/              # Python 源码（学习练习）
├── scripts/                       # 工具脚本
├── tests/                         # 测试目录
├── pyproject.toml                 # Python 项目配置
├── CONTRIBUTING.md                # 贡献指南
├── LICENSE.md                     # MIT 许可证
└── README.md                      # 本文件
```

## 开发指南

### 文档站点开发

```bash
cd docs

# 安装依赖
npm ci

# 启动开发服务器（支持热更新）
npm start

# 生产构建
npm run build

# 本地预览生产构建
npm run serve

# Markdown 格式检查
npm run lint

# 自动修复格式问题
npm run lint:fix
```

### Python 开发

```bash
# 安装依赖
uv sync

# 代码检查
uv run ruff check src/      # lint
uv run ruff format src/     # format

# 运行测试
uv run pytest               # 运行所有测试
uv run pytest tests/test_foo.py  # 运行单个文件
```

### 添加新文档

1. 在 `docs/docs/` 对应目录下创建 `.mdx` 文件
2. 添加 frontmatter：

```yaml
---
sidebar_position: N
sidebar_label: '简短标题'
title: 'emoji 标题'
description: '一句话描述'
---
```

3. 参考 `_template.mdx` 了解标准章节结构
4. 在 `docs/sidebars.js` 的 `DOC_ORDER` 中添加文件名

### 添加学习笔记

在 `docs/blog/` 目录下创建博客文章：

```yaml
---
slug: article-slug
title: 文章标题
authors: [destiny]
tags: [python, learning]
---
```

## 组件说明

文档站点包含以下自定义组件：

| 组件 | 说明 |
|------|------|
| `CardGrid` | 首页卡片网格展示 |
| `HeroSection` | 首页英雄区域 |
| `TypingCode` | 打字机效果代码展示 |
| `PyodideRunner` | 浏览器内 Python 运行器 |
| `AutoRelatedDocs` | 自动相关文档推荐 |
| `LearningPath` | 学习路径展示 |
| `QuoteBlock` | 名言引用块 |
| `TrackSelector` | 学习路径选择器 |

详细组件文档请查看 [docs/src/components/README.md](docs/src/components/README.md)。

## 样式系统

CSS 按功能模块化拆分：

- `_variables.css` — 设计令牌（颜色、字体、阴影）
- `_base.css` — 基础样式
- `_components.css` — 组件样式（拆分为 `_navbar.css`、`_sidebar.css`、`_footer.css`、`_buttons.css`、`_cards.css`、`_alerts.css`）
- `_doc-content.css` — 文档内容样式
- `_pages.css` — 页面特定样式
- `_responsive.css` — 响应式断点

入口文件 `custom.css` 通过 `@import` 引入所有模块。

## CI/CD

- **PR 验证**: `.github/workflows/docs-ci.yml` — 自动构建验证
- **部署**: `.github/workflows/deploy.yml` — push to main 时部署到 GitHub Pages

## 性能优化

- **懒加载**: 图片和组件按需加载
- **GPU 加速**: 动画使用 `will-change` 提示
- **字体优化**: 字体预加载，减少 FOUT
- **代码分割**: 客户端模块动态导入
- **内容可见性**: `content-visibility: auto` 跳过离屏渲染

## 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

### 贡献方式

1. 改进现有文档（修复错别字、补充示例）
2. 添加新文档（参考 `_template.mdx`）
3. 添加学习笔记
4. 报告问题

## 许可证

[MIT](LICENSE.md)

## 联系方式

- GitHub Issues: [提交问题](https://github.com/Destiny-GPU/study-python/issues)
- 邮箱: zhangjian_destiny@qq.com
