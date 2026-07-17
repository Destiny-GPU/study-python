# 客户端模块文档

客户端模块（Client Modules）在页面加载时自动执行，用于实现全局功能。

## 模块列表

| 模块 | 说明 | 执行时机 |
|------|------|----------|
| [progressBar.js](#progressbarjs) | 页面顶部加载进度条 | 每次页面加载 |
| [constellation.js](#constellationjs) | 星座粒子动画 | 首页加载 |
| [progressTracker.js](#progresstrackerjs) | 学习进度追踪 | 每次页面加载 |

---

## progressBar.js

页面顶部加载进度条，显示页面加载进度。

### 位置

`src/clientModules/progressBar.js`

### 功能

- 在页面加载时显示进度条
- 平滑过渡动画
- 加载完成后自动隐藏

### 实现

```javascript
// 在 Docusaurus 配置中注册
clientModules: [
  require.resolve('./src/clientModules/progressBar.js'),
  // ...
],
```

---

## constellation.js

星空粒子动画，仅在首页显示。

### 位置

- `src/clientModules/constellation.js` — 入口文件
- `src/clientModules/constellation-init.js` — 实现文件

### 功能

- Canvas 粒子动画
- 鼠标交互效果
- 响应式画布尺寸
- 动态加载（代码分割）

### 实现

采用动态导入模式，将实现代码分离：

```javascript
// constellation.js（入口）
export default function initConstellation() {
  // 仅在首页加载
  if (window.location.pathname === '/') {
    import('./constellation-init.js').then(module => {
      module.default();
    });
  }
}
```

### 性能优化

- 动态导入减少首页加载体积
- Canvas 动画使用 `requestAnimationFrame`
- 离屏时自动暂停动画

---

## progressTracker.js

学习进度追踪，记录用户的学习进度。

### 位置

`src/clientModules/progressTracker.js`

### 功能

- 自动记录已访问文档
- 计算学习进度百分比
- localStorage 持久化存储
- MutationObserver 实时更新

### 数据存储

| 键名 | 类型 | 说明 |
|------|------|------|
| `study-progress` | Number | 学习进度百分比 (0-100) |
| `visited-docs` | Array | 已访问文档路径列表 |

### 实现细节

#### 缓存优化

```javascript
// 缓存进度数据
let cachedProgress = null;
let cachedVisitedSet = null;

function getProgress() {
  if (cachedProgress === null) {
    cachedProgress = JSON.parse(localStorage.getItem('study-progress') || '0');
  }
  return cachedProgress;
}
```

#### 侧边栏 DOM 缓存

```javascript
// 缓存侧边栏 DOM 查询结果
let sidebarItems = null;

function getSidebarItems() {
  if (!sidebarItems) {
    sidebarItems = document.querySelectorAll('.sidebar__item a');
  }
  return sidebarItems;
}
```

#### MutationObserver

监听侧边栏 DOM 变化，自动更新缓存：

```javascript
const observer = new MutationObserver(() => {
  sidebarItems = null; // 使缓存失效
});

observer.observe(sidebarContainer, {
  childList: true,
  subtree: true,
});
```

---

## 配置

客户端模块在 `docusaurus.config.js` 中注册：

```javascript
const config = {
  clientModules: [
    require.resolve('./src/clientModules/progressBar.js'),
    require.resolve('./src/clientModules/constellation.js'),
    require.resolve('./src/clientModules/progressTracker.js'),
  ],
  // ...
};
```

## 开发指南

### 添加新模块

1. 在 `src/clientModules/` 下创建 `.js` 文件
2. 导出默认函数作为入口
3. 在 `docusaurus.config.js` 中注册
4. 重启开发服务器

### 模块结构

```javascript
// src/clientModules/myModule.js
export default function initMyModule() {
  // 模块逻辑
  console.log('My module initialized');
}
```

### 注意事项

- 客户端模块在浏览器中执行，不能使用 Node.js API
- 避免在模块中执行耗时操作
- 使用动态导入减少初始加载体积
- 考虑页面卸载时的清理工作

---

## 性能优化

### 动态导入

使用 `import()` 动态导入大型模块：

```javascript
export default function init() {
  if (needModule()) {
    import('./heavy-module.js').then(module => {
      module.default();
    });
  }
}
```

### 条件加载

根据页面条件决定是否加载：

```javascript
export default function init() {
  if (window.location.pathname === '/') {
    // 首页才加载
  }
}
```

### 缓存策略

- DOM 查询结果缓存
- localStorage 数据缓存
- MutationObserver 监听变化并使缓存失效

---

## 相关链接

- [Docusaurus 客户端模块](https://docusaurus.io/docs/docusaurus-config#clientModules)
- [MDN Web API](https://developer.mozilla.org/zh-CN/docs/Web/API)
