# 贡献指南

感谢你对 Study Python 项目的关注！本文档将帮助你了解如何参与贡献。

## 目录

- [快速开始](#快速开始)
- [贡献方式](#贡献方式)
- [代码规范](#代码规范)
- [Pull Request 流程](#pull-request-流程)
- [问题反馈](#问题反馈)

## 快速开始

### 环境准备

- Node.js >= 20
- npm
- Python 3.14+（用于 Python 相关脚本）
- uv（推荐的 Python 包管理器）

### 启动开发

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

## 贡献方式

### 1. 改进现有文档

- 修复错别字或语法错误
- 补充示例代码
- 改进表达使其更清晰
- 添加图表或截图

### 2. 添加新文档

1. 在 `docs/docs/` 对应目录下创建 `.mdx` 文件
2. 参考 `_template.mdx` 了解标准格式
3. 确保 frontmatter 包含必要字段：

```yaml
---
sidebar_position: N
sidebar_label: '简短标题'
title: '📖 完整标题'
description: '一句话描述'
---
```

4. 在 `docs/sidebars.js` 的 `DOC_ORDER` 中添加文件名
5. 在 `docs/src/data/doc-tags.json` 中添加标签

### 3. 添加学习笔记

在 `docs/blog/` 目录下创建博客文章：

```yaml
---
slug: article-slug
title: 文章标题
authors: [destiny]
tags: [python, learning]
---
```

### 4. 报告问题

在 [GitHub Issues](https://github.com/Destiny-GPU/study-python/issues) 中提交问题，包含：

- 问题描述
- 复现步骤（如适用）
- 期望行为
- 实际行为
- 截图（如适用）

### 5. 提交代码

- 修复 Bug
- 添加新功能
- 改进现有功能
- 优化性能

## 代码规范

### Markdown/MDX

- 使用 MDX 格式
- 代码块指定语言标记
- 中文与英文之间加空格
- 使用正确的标点符号

```bash
npm run lint        # 检查格式
npm run lint:fix    # 自动修复
```

### Python

- 遵循 PEP 8 风格
- 使用 type hints
- 编写文档字符串
- 添加示例代码

```bash
uv run ruff check src/      # lint
uv run ruff format src/     # format
```

### JavaScript/React

- 使用 ES6+ 语法
- 使用 CSS 模块
- 避免全局变量
- 编写可复用组件

### 提交信息

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
type(scope): description

# 示例
docs(basics): 修复变量章节的示例代码
fix(blog): 修复标签路径问题
feat(components): 添加新的可视化组件
```

类型：
- `docs`: 文档变更
- `fix`: 修复问题
- `feat`: 新功能
- `style`: 样式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

## Pull Request 流程

### 1. Fork 仓库

在 GitHub 上 Fork 仓库到你的账户。

### 2. 克隆仓库

```bash
git clone https://github.com/your-username/study-python.git
cd study-python
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature
```

分支命名规范：
- `feature/xxx` — 新功能
- `fix/xxx` — Bug 修复
- `docs/xxx` — 文档更新
- `refactor/xxx` — 重构

### 4. 进行修改

按照代码规范进行修改。

### 5. 运行检查

```bash
# 文档检查
cd docs
npm run lint
npm run build

# Python 检查
uv run ruff check src/
uv run ruff format src/
```

### 6. 提交代码

```bash
git add .
git commit -m "docs(basics): 修复变量章节的示例代码"
```

### 7. 推送到远程

```bash
git push origin feature/your-feature
```

### 8. 创建 Pull Request

在 GitHub 上创建 PR，填写清晰的描述。

## 项目结构

```
study-python/
├── docs/                          # 文档站点
│   ├── docs/                      # 教程文档
│   ├── blog/                      # 学习笔记
│   ├── src/                       # 源码
│   │   ├── components/            # React 组件
│   │   ├── css/                   # 样式文件
│   │   ├── clientModules/         # 客户端脚本
│   │   └── data/                  # 数据文件
│   └── scripts/                   # 构建脚本
├── src/study_python/              # Python 源码
├── scripts/                       # 工具脚本
└── tests/                         # 测试目录
```

## 相关文档

- [项目 README](README.md)
- [文档站点 README](docs/README.md)
- [组件文档](docs/src/components/README.md)
- [客户端模块文档](docs/src/clientModules/README.md)
- [CSS 样式文档](docs/src/css/README.md)
- [工具脚本文档](scripts/README.md)

## 问题反馈

如有疑问，欢迎通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/Destiny-GPU/study-python/issues)
- 邮箱: zhangjian_destiny@qq.com

## 感谢

感谢所有贡献者的支持！你的贡献让这个项目变得更好。
