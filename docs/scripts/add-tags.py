#!/usr/bin/env python3
"""Batch-add tags to all Docusaurus MDX doc files based on directory category."""

import re
from pathlib import Path

DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"

# Map directory names to primary tags
CATEGORY_TAGS = {
    "getting-started": ["入门"],
    "basics": ["基础语法"],
    "control-flow": ["控制流"],
    "data-structures": ["数据结构"],
    "functions": ["函数"],
    "oop": ["面向对象"],
    "modules": ["模块与包"],
    "error-handling": ["异常处理"],
    "file-handling": ["文件操作"],
    "advanced": ["进阶特性"],
    "standard-library": ["标准库"],
    "testing-debugging": ["测试调试"],
    "project-tutorial": ["项目实战"],
    "performance": ["性能"],
}

# Extra tags for docs that belong to multiple knowledge domains
EXTRA_TAGS = {
    "decorators": ["进阶特性"],
    "generators": ["进阶特性"],
    "context-managers": ["进阶特性"],
    "dataclasses": ["进阶特性"],
    "comprehensions": ["函数"],
    "type-hints": ["基础语法"],
    "typing-module": ["面向对象"],
    "hash-mechanism": ["数据结构"],
    "pythonic": ["基础语法"],
    "pattern-matching": ["控制流"],
    "async-await": ["进阶特性"],
    "defensive-programming": ["异常处理"],
    "match-case": ["进阶特性"],
}

FRONT_MATTER_PATTERN = re.compile(
    r"^(---\n)(.*?)(---\n)", re.DOTALL
)


def add_tags_to_file(filepath: Path) -> bool:
    """Add tags to a file's front matter. Returns True if modified."""
    content = filepath.read_text(encoding="utf-8")
    match = FRONT_MATTER_PATTERN.match(content)
    if not match:
        return False

    front_matter = match.group(2)

    # Skip root-level docs (intro.mdx, about.mdx, playground.mdx, _template.mdx)
    category = filepath.parent.name
    if category not in CATEGORY_TAGS:
        return False

    # Skip if tags already exist
    if "tags:" in front_matter:
        return False

    # Determine tags
    doc_name = filepath.stem
    tags = list(CATEGORY_TAGS[category])
    if doc_name in EXTRA_TAGS:
        for tag in EXTRA_TAGS[doc_name]:
            if tag not in tags:
                tags.append(tag)

    # Format tags as YAML list
    tags_yaml = ", ".join(tags)

    # Insert tags before the closing ---
    new_front_matter = front_matter.rstrip("\n") + f"\ntags: [{tags_yaml}]\n"
    new_content = match.group(1) + new_front_matter + match.group(3) + content[match.end():]

    filepath.write_text(new_content, encoding="utf-8")
    return True


def main():
    modified = 0
    for mdx_file in sorted(DOCS_DIR.rglob("*.mdx")):
        if mdx_file.name.startswith("_"):
            continue
        if add_tags_to_file(mdx_file):
            modified += 1
            print(f"  + {mdx_file.relative_to(DOCS_DIR.parent)}")
    print(f"\nModified {modified} files")


if __name__ == "__main__":
    main()
