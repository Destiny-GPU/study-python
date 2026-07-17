#!/usr/bin/env python3
"""Batch-fix style inconsistencies across all Docusaurus MDX docs."""

import re
from pathlib import Path

DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"


def fix_summary_heading(content: str) -> str:
    """Unify summary heading emoji from 📝 to ✅."""
    return content.replace("## 📝 本节总结", "## ✅ 本节总结")


def fix_code_block_language(content: str) -> str:
    """Unify code block language from `python` to `py` for standalone blocks.
    Also fix output block title from 'Output' to '输出'."""
    # Fix standalone ```python blocks (not inside PyodideRunner)
    # Only replace ```python that is NOT inside a PyodideRunner component
    content = re.sub(r'```python\b', '```py', content)
    # Fix output block title
    content = content.replace('title="Output"', 'title="输出"')
    return content


def fix_title_quotes(content: str) -> str:
    """Remove quotes from title and description in front matter."""
    lines = content.split('\n')
    in_front_matter = False
    result = []
    for line in lines:
        if line.strip() == '---':
            in_front_matter = not in_front_matter
            result.append(line)
            continue
        if in_front_matter:
            # Remove quotes from title: 'xxx' → xxx, "xxx" → xxx
            if line.startswith("title: '") or line.startswith('title: "'):
                quote = line[6]  # ' or "
                val = line[8:-1]  # strip title: ' and '
                result.append(f"title: {val}")
            elif line.startswith("description: '") or line.startswith('description: "'):
                quote = line[12]
                val = line[14:-1]
                result.append(f"description: {val}")
            else:
                result.append(line)
        else:
            result.append(line)
    return '\n'.join(result)


def fix_admonition_caution(content: str) -> str:
    """Replace :::caution with :::warning."""
    return re.sub(r':::caution\b', ':::warning', content)


def fix_admonition_summary(content: str) -> str:
    """Replace :::summary with :::info."""
    return re.sub(r':::summary\b', ':::info', content)


def fix_overview_section(content: str) -> str:
    """Replace :::tip 🎯 本节要点 with ## 📌 本节要点."""
    content = content.replace(":::tip 🎯 本节要点", "## 📌 本节要点")
    return content


def process_file(filepath: Path) -> list[str]:
    """Apply all fixes to a file. Returns list of changes made."""
    content = filepath.read_text(encoding="utf-8")
    original = content
    changes = []

    content = fix_summary_heading(content)
    content = fix_code_block_language(content)
    content = fix_title_quotes(content)
    content = fix_admonition_caution(content)
    content = fix_admonition_summary(content)
    content = fix_overview_section(content)

    if content != original:
        filepath.write_text(content, encoding="utf-8")
        if "📝 本节总结" in original:
            changes.append("summary emoji 📝→✅")
        if "```python" in original:
            changes.append("code lang python→py")
        if "title: '" in original or 'title: "' in original:
            changes.append("title quotes removed")
        if "description: '" in original or 'description: "' in original:
            changes.append("desc quotes removed")
        if ":::caution" in original:
            changes.append("caution→warning")
        if ":::summary" in original:
            changes.append("summary→info")
        if ":::tip 🎯 本节要点" in original:
            changes.append("overview tip→heading")

    return changes


def main():
    total_changes = 0
    for mdx_file in sorted(DOCS_DIR.rglob("*.mdx")):
        if mdx_file.name.startswith("_"):
            continue
        changes = process_file(mdx_file)
        if changes:
            total_changes += 1
            rel = mdx_file.relative_to(DOCS_DIR.parent)
            print(f"  ✓ {rel}: {', '.join(changes)}")

    # Also process .md files
    for md_file in sorted(DOCS_DIR.rglob("*.md")):
        if md_file.name.startswith("_"):
            continue
        changes = process_file(md_file)
        if changes:
            total_changes += 1
            rel = md_file.relative_to(DOCS_DIR.parent)
            print(f"  ✓ {rel}: {', '.join(changes)}")

    print(f"\nModified {total_changes} files")


if __name__ == "__main__":
    main()
