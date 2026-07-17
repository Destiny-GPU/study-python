# 工具脚本文档

本目录包含项目使用的工具脚本，用于文档优化和代码风格改进。

## 脚本列表

| 脚本 | 说明 | 用法 |
|------|------|------|
| [optimize_docs.py](#optimize_docspy) | 批量优化文档 | `python scripts/optimize_docs.py` |
| [improve_writing_style.py](#improve_writing_stylepy) | 改进语言风格 | `python scripts/improve_writing_style.py` |

---

## optimize_docs.py

批量优化文档：添加 Emoji 标题 + 添加代码块标题。

### 位置

`scripts/optimize_docs.py`

### 功能

1. **添加 Emoji 标题**
   - 从 `chapters.json` 读取分类 Emoji
   - 自动添加到 frontmatter 的 `title` 字段
   - 自动添加到 h1 标题

2. **添加代码块标题**
   - 为 Python 代码块添加 `title="Python"`
   - 为 Shell 代码块添加 `title="Shell"`
   - 为输出代码块添加 `title="输出"`

### 用法

```bash
python scripts/optimize_docs.py
```

### 输出示例

```
Found 92 .mdx files

  ✅ getting-started/installation.mdx
  ✅ basics/variables.mdx
  ⏭️ intro.mdx (no changes)

✅ All done!
```

### 数据源

Emoji 数据来自 `docs/src/data/chapters.json`：

```json
{
  "categories": {
    "getting-started": {
      "emoji": "🚀",
      "label": "入门指南"
    },
    "basics": {
      "emoji": "📝",
      "label": "基础语法"
    }
  }
}
```

---

## improve_writing_style.py

批量改进教程语言风格：技术文档式 → 对话式 + 技术深度。

### 位置

`scripts/improve_writing_style.py`

### 功能

将技术文档式的语言改为更亲切的对话式风格：

| 旧模式 | 新模式 |
|--------|--------|
| 你将掌握 | 我们将掌握 |
| 你将了解 | 我们将了解 |
| 必须使用 | 可以使用 |
| 应该遵循 | 可以参考 |
| 请运行 | 让我们运行 |
| 请思考 | 让我们思考 |

### 用法

```bash
python scripts/improve_writing_style.py
```

### 输出示例

```
开始改进教程语言风格...
  ✓ docs/getting-started/installation.mdx
  ✓ docs/basics/variables.mdx

完成！共处理 92 个文件，修改了 45 个文件
```

### 替换规则

```python
REPLACEMENTS = [
    # 用"我们"代替"你"
    (r"你将掌握", "我们将掌握"),
    (r"你将了解", "我们将了解"),
    
    # 用"可以"代替"必须/应该"
    (r"必须使用", "可以使用"),
    (r"应该使用", "可以使用"),
    
    # 用"让我们"代替"请"
    (r"请运行", "让我们运行"),
    (r"请思考", "让我们思考"),
]
```

---

## 文档生成脚本

位于 `docs/scripts/` 目录：

### generate-doc-tags.py

生成文档标签数据，用于 `AutoRelatedDocs` 组件。

```bash
cd docs
npm run generate-doc-tags
```

输出文件：`docs/src/data/doc-tags.json`

---

## 开发指南

### 添加新脚本

1. 在 `scripts/` 目录下创建 Python 脚本
2. 添加 `#!/usr/bin/env python3` shebang
3. 编写文档字符串说明功能
4. 在 `main()` 函数中实现逻辑
5. 更新本 README.md

### 代码规范

- 使用 `pathlib.Path` 处理路径
- 添加类型提示
- 编写文档字符串
- 处理异常情况

### 运行脚本

```bash
# 使用 uv 运行（推荐）
uv run python scripts/optimize_docs.py

# 或直接运行
python scripts/optimize_docs.py
```

---

## 相关链接

- [Python pathlib 文档](https://docs.python.org/zh-cn/3/library/pathlib.html)
- [正则表达式文档](https://docs.python.org/zh-cn/3/library/re.html)
