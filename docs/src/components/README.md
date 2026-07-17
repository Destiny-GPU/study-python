# 自定义组件文档

本文档介绍 Study Python 文档站点的所有自定义 React 组件。

## 组件列表

| 组件 | 说明 | 用途 |
|------|------|------|
| [CardGrid](#cardgrid) | 卡片网格 | 首页功能展示 |
| [HeroSection](#herosection) | 英雄区域 | 首页顶部区域 |
| [TypingCode](#typingcode) | 打字机效果 | 代码动画展示 |
| [PyodideRunner](#pyodiderunner) | Python 运行器 | 浏览器内运行代码 |
| [ProgressTracker](#progresstracker) | 进度追踪 | 学习进度记录 |
| [AutoRelatedDocs](#autorelateddocs) | 相关文档 | 自动推荐相关文章 |
| [ChapterNav](#chapternav) | 章节导航 | 上下篇导航 |
| [LearningPath](#learningpath) | 学习路径 | 阶段性学习引导 |
| [QuoteBlock](#quoteblock) | 名言引用 | 展示名言警句 |
| [TrackSelector](#trackselector) | 路径选择 | 选择学习路径 |
| [VisualizeButton](#visualizebutton) | 可视化按钮 | 触发可视化效果 |
| [About](#about) | 关于页面 | 作者介绍 |

---

## CardGrid

首页卡片网格，展示教程的核心特性。

### 位置

`src/components/CardGrid/index.js`

### 用法

```jsx
import CardGrid from '@site/src/components/CardGrid';

<CardGrid />
```

### 特性

- 响应式布局（移动端单列，桌面端三列）
- 悬停动画效果
- 懒加载图片
- 支持深色/浅色主题

### 数据源

卡片数据硬编码在组件中，包含：
- emoji 图标
- 标题
- 描述
- 链接

---

## HeroSection

首页英雄区域，包含标题、副标题和 CTA 按钮。

### 位置

`src/components/HeroSection/index.js`

### 用法

```jsx
import HeroSection from '@site/src/components/HeroSection';

<HeroSection />
```

### 特性

- 星座粒子动画背景（通过 `constellation.js`）
- 打字机效果（`TypingCode` 组件）
- 渐入动画
- 响应式设计

---

## TypingCode

打字机效果的代码展示组件。

### 位置

`src/components/TypingCode/index.js`

### 用法

```jsx
import TypingCode from '@site/src/components/TypingCode';

<TypingCode />
```

### 特性

- 自动打字动画
- IntersectionObserver 控制动画启停
- 暗色主题适配

### 性能优化

- 使用 `requestAnimationFrame` 控制动画
- 当组件不在视口时自动暂停动画
- 减少不必要的重绘

---

## PyodideRunner

浏览器内 Python 代码运行器，基于 [Pyodide](https://pyodide.org/)。

### 位置

`src/components/PyodideRunner/index.js`

### 用法

````mdx
import PyodideRunner from '@site/src/components/PyodideRunner';

<PyodideRunner>

```python
print("Hello, World!")
```

</PyodideRunner>
````

### 特性

- 浏览器内运行 Python 代码
- 支持标准库和 NumPy、Matplotlib 等
- 代码高亮显示
- 输出结果实时展示
- 加载状态提示

### 依赖

- Pyodide WebAssembly
- CodeMirror 代码编辑器

---

## ProgressTracker

学习进度追踪组件，记录用户的学习进度。

### 位置

`src/components/ProgressTracker/index.js`

### 用法

```jsx
import ProgressTracker from '@site/src/components/ProgressTracker';

<ProgressTracker />
```

### 特性

- 自动记录已读文档
- 进度百分比显示
- localStorage 持久化
- MutationObserver 实时更新

### 数据存储

进度数据存储在 `localStorage`：
- `study-progress` — 阅读进度百分比
- `visited-docs` — 已访问文档列表

---

## AutoRelatedDocs

自动相关文档推荐组件。

### 位置

`src/components/AutoRelatedDocs/index.js`

### 用法

```jsx
import AutoRelatedDocs from '@site/src/components/AutoRelatedDocs';

<AutoRelatedDocs />
```

### 特性

- 基于标签匹配相关文档
- Set 数据结构优化查找性能
- 早期终止策略
- 最多显示 3 个相关文档

### 标签数据

标签数据来自 `src/data/doc-tags.json`，包含 92 个文档的标签映射。

---

## ChapterNav

章节导航组件，显示上一篇/下一篇链接。

### 位置

`src/components/ChapterNav/index.js`

### 用法

```jsx
import ChapterNav from '@site/src/components/ChapterNav';

<ChapterNav />
```

### 特性

- 自动获取前后文档
- 响应式设计
- 平滑过渡动画

---

## LearningPath

学习路径展示组件，展示阶段性学习内容。

### 位置

`src/components/LearningPath/index.js`

### 用法

```jsx
import LearningPath from '@site/src/components/LearningPath';

<LearningPath />
```

### 特性

- 五阶段学习路径
- 可折叠/展开
- 进度指示器
- 动画效果

---

## QuoteBlock

名言引用块组件。

### 位置

`src/components/QuoteBlock/index.js`

### 用法

```jsx
import QuoteBlock from '@site/src/components/QuoteBlock';

<QuoteBlock />
```

### 特性

- 随机展示名言
- 深色/浅色主题适配
- 渐入动画

### 数据源

名言数据来自 `src/data/quotes.js`。

---

## TrackSelector

学习路径选择器组件。

### 位置

`src/components/TrackSelector/index.js`

### 用法

```jsx
import TrackSelector from '@site/src/components/TrackSelector';

<TrackSelector />
```

### 特性

- 选择学习路径
- 保存用户选择
- 响应式设计

---

## VisualizeButton

可视化按钮组件，用于触发可视化效果。

### 位置

`src/components/VisualizeButton/index.js`

### 用法

```jsx
import VisualizeButton from '@site/src/components/VisualizeButton';

<VisualizeButton />
```

### 特性

- 点击触发可视化
- 加载状态提示
- 错误处理

---

## About

关于页面组件，展示作者信息。

### 位置

`src/components/About/index.js`

### 用法

```jsx
import About from '@site/src/components/About';

<About />
```

### 特性

- 作者信息展示
- 技能标签
- 项目链接

---

## 组件开发指南

### 添加新组件

1. 在 `src/components/` 下创建新目录
2. 创建 `index.js` 实现组件
3. 创建 `styles.module.css` 添加样式（可选）
4. 在 `src/components/index.js` 中导出
5. 在 MDX 文件中使用

### 组件结构

```
NewComponent/
├── index.js              # 组件实现
├── styles.module.css     # CSS 模块
└── index.test.js         # 测试文件（可选）
```

### 样式规范

- 使用 CSS 模块避免样式冲突
- 使用 CSS 变量（`_variables.css`）
- 支持深色/浅色主题
- 响应式设计

### 性能优化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 和 `useCallback` 优化性能
- 大型组件使用懒加载
- 动画使用 `will-change` 提示 GPU

### 测试

```bash
npm run test           # 运行所有测试
npm run test:watch     # 监听模式
```

---

## 相关链接

- [Docusaurus 插件开发](https://docusaurus.io/docs/plugins)
- [React 组件最佳实践](https://react.dev/learn/thinking-in-react)
- [CSS 模块文档](https://github.com/css-modules/css-modules)
