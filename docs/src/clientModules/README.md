# 客户端模块文档

客户端模块（Client Modules）在页面加载时自动执行，用于实现全局功能。

## 模块列表

| 模块 | 说明 | 执行时机 |
|------|------|----------|
| [progressBar.js](#progressbarjs) | 页面顶部加载进度条 | 每次页面加载 |
| [constellation.js](#constellationjs) | 星座粒子动画 | 首页加载 |

---

## progressBar.js

页面顶部加载进度条和返回顶部按钮。

### 位置

`src/clientModules/progressBar.js`

### 功能

- 页面加载时显示进度条
- 阅读进度指示
- 返回顶部按钮
- 平滑过渡动画

---

## constellation.js

星空粒子动画，仅在首页显示。

### 位置

- `src/clientModules/constellation.js` — 入口文件
- `src/clientModules/constellation-init.js` — 实现文件

### 功能

- Canvas 粒子动画
- 鼠标交互效果（引力效应）
- 滚动速度响应
- 响应式画布尺寸
- 动态加载（代码分割）

### 实现

采用动态导入模式，将实现代码分离：

```javascript
// constellation.js（入口）
export default function initConstellation() {
  if (window.location.pathname === '/') {
    import('./constellation-init.js').then(module => {
      module.default();
    });
  }
}
```

---

## 配置

客户端模块在 `docusaurus.config.js` 中注册：

```javascript
const config = {
  clientModules: [
    require.resolve('./src/clientModules/progressBar.js'),
    require.resolve('./src/clientModules/constellation.js'),
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

### 注意事项

- 客户端模块在浏览器中执行，不能使用 Node.js API
- 避免在模块中执行耗时操作
- 使用动态导入减少初始加载体积
