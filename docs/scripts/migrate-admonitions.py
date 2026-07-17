#!/usr/bin/env python3
"""Migrate admonitions to Docusaurus 3.10 new syntax and add class shortcuts.

Conversion rules:
1. :::type Title → :::type[Title]  (old → new syntax)
2. :::tip 🎯 本节要点 → :::tip[🎯 本节要点]{.key-points}
3. :::info 🔗 延伸学习 → :::info[🔗 延伸学习]{.see-also}
4. :::info 📋 小结 → ::info[📋 小结]{.summary}
5. :::danger 安全警告 → :::danger[安全警告]{.safety-warning}
6. :::details Title → :::details[Title]
7. :::type (no title) → keep as is
8. :::type[Title] (already new) → skip
"""

import re
from pathlib import Path

DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"

# Special admonitions that get class shortcuts
CLASS_MAP = {
    "tip 🎯 本节要点": ("tip", "🎯 本节要点", ".key-points"),
    "info 🔗 延伸学习": ("info", "🔗 延伸学习", ".see-also"),
    "info 📋 小结": ("info", "📋 小结", ".summary"),
    "danger 安全警告": ("danger", "安全警告", ".safety-warning"),
}

# Pattern: opening admonition marker with title (old syntax)
# Matches: :::type Title text (not :::type[ and not :::type$)
OPENING_PATTERN = re.compile(
    r'^(:::(tip|info|warning|note|danger|caution|details)) ([^\[\n{].*)$',
    re.MULTILINE
)


def migrate_line(line: str) -> str:
    """Convert a single line's admonition from old to new syntax."""
    m = OPENING_PATTERN.match(line)
    if not m:
        return line

    marker = m.group(1)  # :::type
    type_name = m.group(2)  # tip, info, etc.
    title = m.group(3).strip()

    # Check if this is a special admonition that gets a class
    lookup = f"{type_name} {title}"
    if lookup in CLASS_MAP:
        _, new_title, css_class = CLASS_MAP[lookup]
        return f"{marker}[{new_title}]{{{css_class}}}"

    # Regular migration: :::type Title → :::type[Title]
    return f"{marker}[{title}]"


def process_file(filepath: Path) -> int:
    """Migrate admonitions in a file. Returns count of changes."""
    content = filepath.read_text(encoding="utf-8")
    lines = content.split('\n')
    changes = 0
    result = []

    for line in lines:
        new_line = migrate_line(line)
        if new_line != line:
            changes += 1
        result.append(new_line)

    if changes > 0:
        filepath.write_text('\n'.join(result), encoding="utf-8")

    return changes


def main():
    total = 0
    for mdx_file in sorted(DOCS_DIR.rglob("*.mdx")):
        if mdx_file.name.startswith("_"):
            continue
        n = process_file(mdx_file)
        if n:
            total += n
            rel = mdx_file.relative_to(DOCS_DIR.parent)
            print(f"  ✓ {rel}: {n} admonitions migrated")

    print(f"\nTotal: {total} admonitions migrated")


if __name__ == "__main__":
    main()
