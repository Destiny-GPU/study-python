#!/usr/bin/env python3
"""Strip emojis from front matter title fields for cleaner browser tabs.
H1 headings and sidebar_label are not affected."""

import re
from pathlib import Path

DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"

# Emoji regex pattern — only actual emojis, not CJK or other Unicode
EMOJI_PATTERN = re.compile(
    "["
    "\U0001F600-\U0001F64F"  # emoticons
    "\U0001F300-\U0001F5FF"  # symbols & pictographs
    "\U0001F680-\U0001F6FF"  # transport & map
    "\U0001F1E0-\U0001F1FF"  # flags
    "\U00002702-\U000027B0"  # dingbats
    "\U0001f926-\U0001f937"
    "\u2640-\u2642"
    "\u2600-\u2B55"
    "\u200d"
    "\u23cf"
    "\u23e9"
    "\u231a"
    "\ufe0f"
    "\u3030"
    "]+",
    flags=re.UNICODE,
)


def strip_emoji(text: str) -> str:
    return EMOJI_PATTERN.sub("", text).strip()


def process_file(filepath: Path) -> bool:
    content = filepath.read_text(encoding="utf-8")
    lines = content.split("\n")
    changed = False
    result = []

    for line in lines:
        if line.startswith("title: "):
            original_val = line[7:]
            cleaned = strip_emoji(original_val)
            if cleaned and cleaned != original_val:
                # Preserve quoting style
                if original_val.startswith("'"):
                    result.append(f"title: '{cleaned}'")
                elif original_val.startswith('"'):
                    result.append(f'title: "{cleaned}"')
                else:
                    result.append(f"title: {cleaned}")
                changed = True
                continue
        result.append(line)

    if changed:
        filepath.write_text("\n".join(result), encoding="utf-8")
    return changed


def main():
    modified = 0
    for mdx_file in sorted(DOCS_DIR.rglob("*.mdx")):
        if mdx_file.name.startswith("_"):
            continue
        if process_file(mdx_file):
            modified += 1
            rel = mdx_file.relative_to(DOCS_DIR.parent)
            print(f"  ✓ {rel}")
    print(f"\nStripped emojis from {modified} files")


if __name__ == "__main__":
    main()
