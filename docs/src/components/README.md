# 自定义组件文档

本文档介绍 Study Python 文档站点的所有自定义 React 组件。

## 组件列表

| 组件 | 说明 | 用途 |
|------|------|------|
| [CardGrid](#cardgrid) | 卡片网格 | 首页功能展示 |
| [HeroSection](#herosection) | 英雄区域 | 首页顶部区域 |
| [TypingCode](#typingcode) | 打字机效果 | 代码动画展示 |
| [PyodideRunner](#pyodiderunner) | Python 运行器 | 浏览器内运行代码 |
| [CheatCard](#cheatcard) | 速查卡片 | 交互式速查表 |
| [ParamPlayground](#paramplayground) | 参数游乐场 | 交互式参数调节与可视化 |
| [ControlChallenge](#controlchallenge) | 控制挑战 | 飞行控制编程挑战 |
| [KnowledgeGraph](#knowledgegraph) | 知识图谱 | 交互式知识关系图 |
| [AutoRelatedDocs](#autorelateddocs) | 相关文档 | 自动推荐相关文章 |
| [LearningPath](#learningpath) | 学习路径 | 阶段性学习引导 |
| [QuoteBlock](#quoteblock) | 名言引用 | 展示名言警句 |
| [TrackSelector](#trackselector) | 路径选择 | 选择学习路径 |

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

---

## PyodideRunner

浏览器内 Python 代码运行器，基于 [Pyodide](https://pyodide.org/)。

### 位置

`src/components/PyodideRunner/index.jsx`

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

## CheatCard

交互式速查卡片，支持复制和运行代码。

### 位置

`src/components/CheatCard/index.jsx`

### 用法

```mdx
import CheatCard from '@site/src/components/CheatCard';

<CheatCard
  title="速查表"
  headers={['语法', '功能', '示例']}
  rows={[
    ['`if condition:`', '条件判断', '`if x > 0: print("正数")`'],
  ]}
/>
```

### 特性

- 代码复制到剪贴板
- 浏览器内运行示例代码
- 输出结果实时展示

---

## ParamPlayground

交互式参数调节与实时可视化组件。

### 位置

`src/components/ParamPlayground/index.jsx`

### 用法

```mdx
import ParamPlayground from '@site/src/components/ParamPlayground';

<ParamPlayground
  title="PID 控制器阶跃响应"
  code={`
import numpy as np
def simulate(kp, ki, kd):
    ...
    return t, y
`}
  controls={[
    { id: 'kp', label: 'Kp', min: 0.1, max: 5, step: 0.1, default: 1.5 },
  ]}
  chart={{ xLabel: '时间 (s)', yLabel: '输出', title: '阶跃响应' }}
/>
```

### 特性

- 滑块/切换控件实时调节参数
- Canvas 图表实时渲染
- Pyodide 执行 Python 代码

---

## ControlChallenge

飞行控制编程挑战组件。

### 位置

`src/components/ControlChallenge/index.jsx`

### 用法

```mdx
import ControlChallenge from '@site/src/components/ControlChallenge';

<ControlChallenge
  title="挑战：计算升力系数"
  scenario="你的无人机在高度 100m 处平飞..."
  objective="编写函数 calculate_lift(v, alpha)"
  starterCode={`def calculate_lift(v, alpha):\n    pass`}
  solution={`def calculate_lift(v, alpha):\n    return 2 * 3.14159 * alpha`}
  tests={[
    { call: 'calculate_lift(50, 0.1)', expected: [0.5, 0.8], label: '迎角 0.1 rad' },
  ]}
/>
```

### 特性

- CodeMirror 代码编辑器
- 自动测试验证
- 提示和答案展示

---

## KnowledgeGraph

交互式知识关系图谱。

### 位置

`src/components/KnowledgeGraph/index.jsx`

### 用法

```mdx
import KnowledgeGraph from '@site/src/components/KnowledgeGraph';

<KnowledgeGraph />
```

### 特性

- SVG 渲染，零依赖
- 缩放/平移交互
- 点击节点跳转文档
- 分类过滤

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
- 最多显示 3 个相关文档

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

---

## 组件开发指南

### 添加新组件

1. 在 `src/components/` 下创建新目录
2. 创建 `index.js` 或 `index.jsx` 实现组件
3. 创建 `styles.module.css` 添加样式（可选）
4. 在 `src/components/index.js` 中导出
5. 在 MDX 文件中使用

### 组件结构

```
NewComponent/
├── index.js / index.jsx   # 组件实现
└── styles.module.css      # CSS 模块
```

### 共享代码

- `src/components/shared/ErrorBoundary.jsx` — 通用错误边界
- `src/hooks/useTheme.js` — 主题检测 hook
- `src/components/PyodideRunner/loader.js` — Pyodide 加载与输出捕获工具
