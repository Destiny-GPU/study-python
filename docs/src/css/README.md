# CSS 样式文档

本目录包含文档站点的所有 CSS 样式文件，采用模块化组织。

## 目录结构

```
docs/src/css/
├── custom.css          # 入口文件
├── _variables.css      # 设计令牌
├── _base.css           # 基础样式
├── _components.css     # 组件样式
├── _doc-content.css    # 文档内容样式
├── _pages.css          # 页面样式
└── _responsive.css     # 响应式样式（可选）
```

## 模块说明

### custom.css

入口文件，通过 `@import` 引入所有模块。

```css
@import './_variables.css';
@import './_base.css';
@import './_components.css';
@import './_doc-content.css';
@import './_pages.css';
```

### _variables.css

设计令牌，定义颜色、字体、阴影等变量。

```css
:root {
  /* 颜色 */
  --ifm-color-primary: #2563eb;
  --ifm-color-primary-dark: #1d4ed8;
  
  /* 字体 */
  --ifm-font-family-base: 'Inter', sans-serif;
  --ifm-font-family-monospace: 'JetBrains Mono', monospace;
  
  /* 阴影 */
  --ifm-global-shadow-lw: 0 1px 3px rgba(0, 0, 0, 0.12);
  
  /* 间距 */
  --ifm-global-spacing: 1rem;
}
```

### _base.css

基础样式，包括重置、排版、工具类。

```css
/* 重置 */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 排版 */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
}

/* 工具类 */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.25rem; }
```

### _components.css

组件样式，包括导航栏、侧边栏、按钮、卡片等。

```css
/* 导航栏 */
.navbar {
  background: var(--ifm-background-color);
  box-shadow: var(--ifm-global-shadow-lw);
}

/* 侧边栏 */
.sidebar__item {
  padding: 0.5rem 1rem;
}

/* 按钮 */
.btn-primary {
  background: var(--ifm-color-primary);
  color: white;
}

/* 卡片 */
.card {
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
}
```

### _doc-content.css

文档内容样式，包括代码块、表格、提示框等。

```css
/* 代码块 */
code {
  font-family: var(--ifm-font-family-monospace);
  background: var(--ifm-color-emphasis-100);
}

/* 表格 */
table {
  width: 100%;
  border-collapse: collapse;
}

/* 提示框 */
.admonition {
  border-left: 4px solid var(--ifm-color-primary);
  padding: 1rem;
}
```

### _pages.css

页面特定样式，包括首页、关于页等。

```css
/* 首页英雄区域 */
.heroBanner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 关于页 */
.about-page {
  max-width: 800px;
  margin: 0 auto;
}
```

---

## 使用指南

### 添加新样式

1. 确定样式属于哪个模块
2. 在对应 `.css` 文件中添加样式
3. 使用 CSS 变量保持一致性

### 使用 CSS 变量

```css
/* 正确 */
.my-component {
  color: var(--ifm-color-primary);
  font-family: var(--ifm-font-family-base);
}

/* 错误 */
.my-component {
  color: #2563eb;
  font-family: 'Inter', sans-serif;
}
```

### 深色主题

```css
/* 浅色主题 */
:root {
  --my-color: #000;
}

/* 深色主题 */
[data-theme='dark'] {
  --my-color: #fff;
}
```

### 响应式设计

```css
/* 移动端 */
@media (max-width: 768px) {
  .my-component {
    padding: 0.5rem;
  }
}

/* 桌面端 */
@media (min-width: 769px) {
  .my-component {
    padding: 1rem;
  }
}
```

---

## 性能优化

### 使用 CSS 变量

CSS 变量可以在运行时修改，减少重绘：

```javascript
document.documentElement.style.setProperty('--my-color', 'red');
```

### 使用 will-change

对于频繁变化的属性，使用 `will-change` 提示 GPU：

```css
.animated-element {
  will-change: transform, opacity;
}
```

### 使用 content-visibility

对于离屏内容，使用 `content-visibility` 跳过渲染：

```css
.off-screen {
  content-visibility: auto;
}
```

---

## 相关链接

- [CSS 变量文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [Docusaurus 主题定制](https://docusaurus.io/docs/styling-layout)
- [CSS 性能优化](https://web.dev/articles/contlining-web-performance)
