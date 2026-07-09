在你的 `docs/docs/` 目录下创建这个文件：

`docs/docs/docusaurus-guide.md`

```markdown
---
sidebar_position: 1
title: Docusaurus 使用教程
description: 从零开始掌握 Docusaurus 的日常使用
---

# Docusaurus 使用教程

## 基本概念

Docusaurus 项目的核心目录结构：

```
docs/
├── blog/                    ← 博客文章
├── docs/                    ← 文档（你正在看的就在这里）
├── src/
│   ├── components/          ← 自定义 React 组件
│   ├── css/                 ← 自定义样式
│   └── pages/               ← 自定义页面（如首页）
├── static/                  ← 静态资源（图片、文件等）
├── docusaurus.config.js     ← 主配置文件
└── sidebars.js              ← 侧边栏导航结构
```

**你日常只需要关心两个目录：`docs/` 放文档，`blog/` 放博客。**

---

## 写文档

### 创建新文档

在 `docs/` 目录下创建 `.md` 文件即可：

```bash
# 在 docs/docs/ 下直接创建
touch docs/docs/algorithms/sorting.md
```

### 文档头部（Frontmatter）

每个文档文件顶部可以写元数据：

```markdown
---
sidebar_position: 2          ← 在侧边栏中的排序
title: 排序算法               ← 页面标题
description: 常见排序算法总结  ← 描述（SEO 用）
tags: [算法, 排序]            ← 标签
---

# 排序算法

正文内容从这里开始...
```

### 目录分组

创建文件夹来组织文档，文件夹内放一个 `_category_.json`：

```bash
mkdir -p docs/docs/algorithms
```

创建 `docs/docs/algorithms/_category_.json`：

```json
{
  "label": "算法",
  "position": 2,
  "link": {
    "type": "generated-index",
    "description": "常见算法的学习笔记"
  }
}
```

这样侧边栏会自动生成「算法」分组。

### 侧边栏排序

在 `sidebars.js` 中可以手动控制顺序：

```js
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '数据结构',
      items: [
        'data-structures/array',
        'data-structures/hash-table',
      ],
    },
    {
      type: 'category',
      label: '算法',
      items: [
        'algorithms/sorting',
        'algorithms/binary-search',
      ],
    },
  ],
};

module.exports = sidebars;
```

---

## 写博客

### 创建新博客

在 `blog/` 目录下创建文件，文件名带日期：

```bash
touch blog/2026-07-10-my-first-algorithm.md
```

### 博客头部

```markdown
---
slug: my-first-algorithm       ← URL 路径
title: 我的第一篇算法博客       ← 标题
authors: [tom]                  ← 作者（在 blog/authors.yml 中定义）
tags: [算法, Python]            ← 标签
---

正文内容...
```

### 多作者配置

编辑 `blog/authors.yml`：

```yaml
tom:
  name: Tom
  title: Python 开发者
  url: https://github.com/yourname
  image_url: https://github.com/yourname.png
```

---

## 代码块

### 基本用法

````markdown
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```
````

### 高亮特定行

````markdown
```python {2,3}
def binary_search(arr, target):
    left, right = 0, len(arr) - 1    # 这两行会高亮
    while left <= right:
        mid = (left + right) // 2
```
````

### 带标题的代码块

````markdown
```python title="binary_search.py"
def binary_search(arr, target):
    ...
```
````

---

## 数学公式

Docusaurus 内置支持 KaTeX，无需额外配置。

### 行内公式

```markdown
时间复杂度为 $O(n \log n)$，空间复杂度为 $O(1)$。
```

### 块级公式

```markdown
$$
T(n) = 2T\left(\frac{n}{2}\right) + O(n)
$$
```

---

## Markdown 扩展语法

### 提示框（Admonitions）

```markdown
:::note
这是一个普通提示。
:::

:::tip
这是一个小技巧。
:::

:::warning
这是一个警告。
:::

:::danger
这是危险操作。
:::

:::info title="自定义标题"
带自定义标题的提示框。
:::
```

### Tab 切换

同一段内容展示多种语言的实现：

````markdown
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="python" label="Python" default>

  ```python
  def add(a, b):
      return a + b
  ```

  </TabItem>
  <TabItem value="go" label="Go">

  ```go
  func add(a, b int) int {
      return a + b
  }
  ```

  </TabItem>
</Tabs>
````

### 表格

```markdown
| 算法     | 最好   | 平均       | 最坏   | 空间   |
|----------|--------|------------|--------|--------|
| 快速排序 | O(n log n) | O(n log n) | O(n²) | O(log n) |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) |
| 堆排序   | O(n log n) | O(n log n) | O(n log n) | O(1) |
```

---

## 图片

### 放在 static 目录

```bash
# 把图片放到
static/img/sorting-demo.png
```

在 Markdown 中引用：

```markdown
![排序演示](/img/sorting-demo.png)
```

### 相对路径引用

也可以直接放在 docs 目录旁：

```markdown
![流程图](./assets/flowchart.png)
```

---

## 部署到 GitHub Pages

### 方式一：使用 deploy 命令

```bash
# 首次配置（编辑 docusaurus.config.js）
# 确保以下字段正确：
#   url: 'https://yourname.github.io'
#   baseUrl: '/repo-name/'      ← 如果仓库名不是 username.github.io
#   organizationName: 'yourname'
#   projectName: 'repo-name'

# 部署
GIT_USER=yourname npm run deploy
```

### 方式二：使用 GitHub Actions（推荐）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

然后在 GitHub 仓库 → Settings → Pages → Source 选择 **GitHub Actions**。

之后每次 `git push` 到 main 分支就会自动部署。

---

## 常用配置速查

编辑 `docusaurus.config.js`：

```js
const config = {
  title: '站点标题',
  tagline: '副标题',
  url: 'https://yourname.github.io',
  baseUrl: '/',

  // 导航栏
  themeConfig: {
    navbar: {
      title: 'Tom',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '知识库',
        },
        { to: '/blog', label: '博客', position: 'left' },
        {
          href: 'https://github.com/yourname',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },

  // 代码块
  prism: {
    theme: require('prism-react-renderer').themes.github,
    darkTheme: require('prism-react-renderer').themes.dracula,
    additionalLanguages: ['python', 'bash', 'json'],
  },
};
```

---

## 日常工作流速查

```bash
# 写文档
npm start                     # 启动预览，http://localhost:3000

# 检查构建
npm run build                 # 打包
npm run serve                 # 本地预览打包结果

# 发布
git add .
git commit -m "新增xxx文档"
git push                      # GitHub Actions 自动部署
```
```
