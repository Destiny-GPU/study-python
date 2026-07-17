# GitHub 配置文档

本目录包含 GitHub 相关配置文件。

## 目录结构

```
.github/
├── dependabot.yml               # Dependabot 配置
├── ISSUE_TEMPLATE/              # Issue 模板
│   └── ...                      # 各类 Issue 模板
├── PULL_REQUEST_TEMPLATE.md     # PR 模板
└── workflows/                   # GitHub Actions 工作流
    ├── docs-ci.yml              # 文档 CI 验证
    └── deploy.yml               # 部署工作流
```

## 工作流

### docs-ci.yml

PR 验证工作流，在修改 `docs/**` 时自动运行。

**触发条件**：
- Pull Request 修改 `docs/**` 文件

**执行步骤**：
1. 检出代码
2. 安装 Node.js 22
3. 执行 `npm ci`
4. 执行 `npm run build`

**用途**：
- 验证文档构建是否成功
- 检查 Markdown 格式

### deploy.yml

部署工作流，在 push to main 时自动部署。

**触发条件**：
- Push 到 main 分支
- 修改 `docs/**` 文件

**执行步骤**：
1. 检出代码
2. 安装 Node.js 22
3. 构建文档站点
4. 上传到 GitHub Pages

**权限要求**：
- `contents: read`
- `pages: write`
- `id-token: write`

---

## Dependabot

自动更新依赖配置。

### 配置说明

```yaml
version: 2
updates:
  # npm 依赖
  - package-ecosystem: "npm"
    directory: "/docs"
    schedule:
      interval: "weekly"
  
  # Python 依赖
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 功能

- 自动检测依赖更新
- 创建 PR 更新依赖
- 每周自动检查

---

## Issue 模板

提供标准化的 Issue 提交格式。

### 模板类型

- Bug 报告
- 功能请求
- 文档问题
- 其他

### 使用方法

1. 在 GitHub 仓库中点击 "New Issue"
2. 选择合适的模板
3. 填写模板中的必填项
4. 提交 Issue

---

## PR 模板

标准化的 Pull Request 提交格式。

### 模板内容

```markdown
## 变更说明

简要描述本次变更...

## 变更类型

- [ ] 文档更新
- [ ] Bug 修复
- [ ] 新功能
- [ ] 重构
- [ ] 其他

## 测试

- [ ] 本地构建通过
- [ ] 格式检查通过
- [ ] 无破坏性变更

## 相关 Issue

Closes #XXX
```

---

## 配置指南

### 添加新工作流

1. 在 `.github/workflows/` 下创建 `.yml` 文件
2. 定义触发条件
3. 定义执行步骤
4. 提交到 main 分支

### 添加 Issue 模板

1. 在 `.github/ISSUE_TEMPLATE/` 下创建 `.md` 文件
2. 使用 YAML frontmatter 定义模板
3. 编写模板内容

### 修改 Dependabot 配置

1. 编辑 `.github/dependabot.yml`
2. 添加或修改更新规则
3. 提交到 main 分支

---

## 相关链接

- [GitHub Actions 文档](https://docs.github.com/cn/actions)
- [Dependabot 文档](https://docs.github.com/cn/code-security/dependabot)
- [Issue 模板文档](https://docs.github.com/cn/communities/using-templates-to-encourage-useful-issues-and-pull-requests)
