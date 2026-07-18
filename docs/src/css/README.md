# CSS 样式文档

本目录包含文档站点的所有 CSS 样式文件，采用模块化组织。

## 目录结构

```
docs/src/css/
├── custom.css          # 入口文件，import 所有模块
├── _variables.css      # 设计令牌（颜色、字体、阴影等）
├── _base.css           # 基础样式（font-face, scrollbar, focus-visible）
├── _components.css     # 组件样式（navbar, sidebar, footer, buttons, cards, alerts）
├── _doc-content.css    # 文档内容样式（headings, code blocks, tables, scroll-reveal）
├── _pages.css          # 页面特定样式（about page）
└── _responsive.css     # 响应式断点（tablet 768px, phone 480px）
```

## 模块说明

### custom.css

入口文件，通过 `@import` 引入所有模块：

```css
@import './_variables.css';
@import './_base.css';
@import './_components.css';
@import './_doc-content.css';
@import './_pages.css';
@import './_responsive.css';
```

### _variables.css

设计令牌，定义 light/dark 主题的 CSS 变量。

```css
:root {
  --ifm-color-primary: #4a6cf7;
  --ifm-color-primary-dark: #3d5ce0;
  --ifm-font-family-base: 'Inter', system-ui, sans-serif;
  --ifm-font-family-monospace: 'JetBrains Mono', monospace;
}

[data-theme='dark'] {
  --ifm-color-primary: #6d8efb;
  --ifm-color-primary-dark: #5a7df5;
}
```

### _base.css

基础样式：

- `@font-face` 声明（JetBrains Mono 3 个字重）
- `html { font-size: 19px }` + 响应式覆盖
- 自定义滚动条样式
- `prefers-reduced-motion` 无障碍支持
- `:focus-visible` 键盘焦点指示器

### _components.css

组件样式入口文件，通过 `@import` 汇总子模块：

- `_navbar.css` — 导航栏（glassmorphism, 渐变标题）
- `_sidebar.css` — 侧边栏（动画, 活跃指示器）
- `_footer.css` — 页脚
- `_buttons.css` — `.ds-btn` 按钮系统
- `_cards.css` — 卡片组件
- `_alerts.css` — 提示框/告警框

### _doc-content.css

文档内容样式：

- 布局覆盖（`.theme-doc-markdown`）
- 标题样式（h1 渐变动画）
- 代码块（macOS 风格圆点, 复制按钮）
- 表格、图片、TOC
- Scroll-reveal 入场动画
- Mermaid 图表居中

### _pages.css

About 页面特定样式。

### _responsive.css

集中管理响应式断点：

- Tablet: `@media (max-width: 996px)` 和 `@media (max-width: 768px)`
- Phone: `@media (max-width: 480px)`

---

## 使用指南

### 添加新样式

1. 确定样式属于哪个模块
2. 在对应 `.css` 文件中添加样式
3. 使用 CSS 变量保持一致性

### 使用 CSS 变量

```css
/* 正确 — 使用变量 */
.my-component {
  color: var(--ifm-color-primary);
  font-family: var(--ifm-font-family-base);
}

/* 错误 — 硬编码值 */
.my-component {
  color: #4a6cf7;
  font-family: 'Inter', sans-serif;
}
```

### 深色主题

```css
/* 浅色主题 */
:root {
  --my-color: #1a1a2e;
}

/* 深色主题 */
[data-theme='dark'] {
  --my-color: #e2e8f0;
}
```

---

## 注意事项

- 避免使用 Docusaurus 内部类名（如 `.copyButton_c254`），升级后会失效
- 优先使用语义化选择器（如 `.theme-doc-markdown`）或属性选择器（如 `[class*="copyButton"]`）
- `will-change` 应谨慎使用，仅在确有性能收益时添加
