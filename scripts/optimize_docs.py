#!/usr/bin/env python3
"""批量优化文档：添加 Emoji 标题 + 添加代码块标题。

Emoji 从 chapters.json 读取，作为唯一数据源。
"""

import json
import re
from pathlib import Path

DOCS_DIR = Path(__file__).parent.parent / "docs" / "docs"
CHAPTERS_JSON = Path(__file__).parent.parent / "docs" / "src" / "data" / "chapters.json"

# 从 chapters.json 读取分类 emoji，作为唯一数据源
with open(CHAPTERS_JSON, encoding="utf-8") as f:
    _chapters = json.load(f)

CATEGORY_EMOJI = {"intro.mdx": "🐍"}
for slug, info in _chapters["categories"].items():
    CATEGORY_EMOJI[slug] = info["emoji"]

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
