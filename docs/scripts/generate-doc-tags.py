#!/usr/bin/env python3
"""Generate doc-tags.json mapping doc IDs to their tags, titles, and descriptions.

Reads category list from chapters.json to stay in sync with the single source of truth.
"""

import json
import re
from pathlib import Path

DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"
CHAPTERS_JSON = Path(__file__).resolve().parent.parent / "src" / "data" / "chapters.json"
OUTPUT = Path(__file__).resolve().parent.parent / "src" / "data" / "doc-tags.json"

FRONT_MATTER_PATTERN = re.compile(
    r"^---\n(.*?)---\n", re.DOTALL
)

# Read valid categories from chapters.json
with open(CHAPTERS_JSON, encoding="utf-8") as f:
    VALID_CATEGORIES = set(json.load(f)["categories"].keys())


def parse_front_matter(content: str) -> dict:
    match = FRONT_MATTER_PATTERN.match(content)
    if not match:
        return {}
    fm = match.group(1)
    result = {}
    for line in fm.strip().split("\n"):
        if ":" in line:
            key, _, val = line.partition(":")
            key = key.strip()
            val = val.strip()
            if key == "tags":
                # Parse YAML array: [tag1, tag2]
                val = val.strip("[]").split(",")
                val = [v.strip() for v in val if v.strip()]
            result[key] = val
    return result


def main():
    doc_tags = {}
    for mdx_file in sorted(DOCS_DIR.rglob("*.mdx")):
        if mdx_file.name.startswith("_"):
            continue
        category = mdx_file.parent.name
        if category not in VALID_CATEGORIES:
            continue

        content = mdx_file.read_text(encoding="utf-8")
        fm = parse_front_matter(content)
        if not fm.get("tags"):
            continue

        doc_id = str(mdx_file.relative_to(DOCS_DIR).with_suffix(""))
        doc_id = doc_id.replace(".mdx", "")

        doc_tags[doc_id] = {
            "title": fm.get("title", ""),
            "description": fm.get("description", ""),
            "tags": fm["tags"],
        }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(doc_tags, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated {OUTPUT} with {len(doc_tags)} docs")


if __name__ == "__main__":
    main()
