#!/usr/bin/env python3
"""批量优化文档：添加 Emoji 标题 + 转换小结为 summary 提示框 + 添加代码块标题"""

import re
from pathlib import Path

DOCS_DIR = Path("/home/tom/MyProject/PythonProject/study-python/docs/docs")

CATEGORY_EMOJI = {
    "intro.mdx": "🐍",
    "getting-started": "🛠️",
    "basics": "📝",
    "control-flow": "🔀",
    "data-structures": "📦",
    "functions": "⚙️",
    "oop": "🏗️",
    "modules": "🧩",
    "error-handling": "🛡️",
    "file-handling": "📂",
    "advanced": "🚀",
    "standard-library": "🧰",
}

TITLE_EMOJI_MAP = {
    "Python 简介": "🐍",
    "安装 Python 环境": "🛠️",
    "第一个 Python 程序": "🛠️",
    "运行 Python 代码": "🛠️",
    "IDE 与编辑器配置": "🛠️",
    "变量与数据类型": "📝",
    "数字类型": "📝",
    "字符串": "📝",
    "布尔值": "📝",
    "运算符": "📝",
    "输入与输出": "📝",
    "注释": "📝",
    "条件判断": "🔀",
    "for 循环": "🔀",
    "while 循环": "🔀",
    "break 与 continue": "🔀",
    "match-case 匹配": "🔀",
    "列表": "📦",
    "元组": "📦",
    "字典": "📦",
    "集合": "📦",
    "推导式": "📦",
    "定义函数": "⚙️",
    "函数参数": "⚙️",
    "作用域": "⚙️",
    "Lambda 表达式": "⚙️",
    "装饰器": "⚙️",
    "递归": "⚙️",
    "生成器": "⚙️",
    "类与对象": "🏗️",
    "继承": "🏗️",
    "多态": "🏗️",
    "封装": "🏗️",
    "数据类": "🏗️",
    "魔术方法": "🏗️",
    "模块": "🧩",
    "包": "🧩",
    "pip 包管理": "🧩",
    "虚拟环境": "🧩",
    "异常基础": "🛡️",
    "try-except": "🛡️",
    "自定义异常": "🛡️",
    "上下文管理器": "🛡️",
    "文件读写": "📂",
    "路径处理": "📂",
    "JSON 处理": "📂",
    "CSV 处理": "📂",
    "类型注解": "🚀",
    "typing 模块": "🚀",
    "模式匹配详解": "🚀",
    "异步编程": "🚀",
    "海象运算符": "🚀",
    "防御性编程": "🚀",
    "Pythonic 风格": "🚀",
    "eval 函数": "🚀",
    "哈希机制": "🚀",
    "os 模块": "🧰",
    "pathlib 模块": "🧰",
    "datetime 模块": "🧰",
    "collections 模块": "🧰",
    "itertools 模块": "🧰",
    "functools 模块": "🧰",
}

CODE_TITLE_PATTERNS = [
    (r"```\s*py\s*$", '```py title="Python"'),
    (r"```\s*python\s*$", '```python title="Python"'),
    (r"```\s*bash\s*$", '```bash title="Shell"'),
    (r"```\s*sh\s*$", '```sh title="Shell"'),
    (r"```\s*powershell\s*$", '```powershell title="PowerShell"'),
    (r"```\s*text\s*$", '```text title="输出"'),
]


def get_category_emoji(filepath: Path) -> str:
    """根据文件路径获取分类 emoji"""
    if filepath.name == "intro.mdx":
        return CATEGORY_EMOJI["intro.mdx"]
    for part in filepath.parts:
        if part in CATEGORY_EMOJI:
            return CATEGORY_EMOJI[part]
    return ""


def add_emoji_to_frontmatter(content: str, emoji: str) -> str:
    """在 frontmatter 的 title 字段添加 emoji"""

    def replace_title(m):
        title = m.group(1)
        if title.startswith(emoji):
            return m.group(0)
        return f"title: {emoji} {title}"

    return re.sub(r"^title:\s*(.+)$", replace_title, content, count=1, flags=re.MULTILINE)


def add_emoji_to_h1(content: str, emoji: str) -> str:
    """在 h1 标题添加 emoji"""

    def replace_h1(m):
        title = m.group(2)
        if title.startswith(emoji):
            return m.group(0)
        return f"{m.group(1)}{emoji} {title}"

    return re.sub(r"^(#\s+)(.+)$", replace_h1, content, count=1, flags=re.MULTILINE)


def convert_summary_to_admonition(content: str) -> str:
    """将 ## 小结 转为 :::summary 提示框"""
    if "## 小结" not in content:
        return content

    lines = content.split("\n")
    result = []
    in_summary = False
    summary_lines = []

    for i, line in enumerate(lines):
        if line.strip() == "## 小结":
            in_summary = True
            result.append(":::summary 📋 小结")
            continue

        if in_summary:
            if line.startswith("## ") or (i + 1 >= len(lines)):
                if i + 1 >= len(lines) and line.strip():
                    summary_lines.append(line)
                result.extend(summary_lines)
                result.append(":::")
                result.append("")
                if i + 1 >= len(lines) and line.strip():
                    pass
                else:
                    result.append(line)
                in_summary = False
                summary_lines = []
            else:
                summary_lines.append(line)
        else:
            result.append(line)

    return "\n".join(result)


def add_code_titles(content: str) -> str:
    """为代码块添加标题"""
    for pattern, replacement in CODE_TITLE_PATTERNS:
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
    return content


def process_file(filepath: Path) -> None:
    """处理单个文件"""
    content = filepath.read_text(encoding="utf-8")
    original = content

    emoji = get_category_emoji(filepath)
    if not emoji:
        print(f"  ⚠️  No emoji for {filepath}")
        return

    content = add_emoji_to_frontmatter(content, emoji)
    content = add_emoji_to_h1(content, emoji)
    content = convert_summary_to_admonition(content)
    content = add_code_titles(content)

    if content != original:
        filepath.write_text(content, encoding="utf-8")
        print(f"  ✅ {filepath.relative_to(DOCS_DIR)}")
    else:
        print(f"  ⏭️  {filepath.relative_to(DOCS_DIR)} (no changes)")


def main():
    mdx_files = sorted(DOCS_DIR.rglob("*.mdx"))
    print(f"Found {len(mdx_files)} .mdx files\n")

    for f in mdx_files:
        process_file(f)

    print("\n✅ All done!")


if __name__ == "__main__":
    main()
