#!/usr/bin/env python3
"""
批量改进教程语言风格：技术文档式 → 对话式 + 技术深度
"""

import re
from pathlib import Path

DOCS_DIR = Path(__file__).parent.parent / "docs" / "docs"

# 替换规则：(旧模式, 新模式)
REPLACEMENTS = [
    # 用"我们"代替"你"
    (r"你将掌握", "我们将掌握"),
    (r"你将了解", "我们将了解"),
    (r"你将学习", "我们将学习"),
    (r"你将理解", "我们将理解"),
    (r"你会发现", "我们会发现"),
    (r"你可以", "我们可以"),
    (r"你需要", "我们可以"),
    (r"你应该", "我们可以"),
    (r"你必须", "我们需要"),
    (r"请尝试", "让我们尝试"),
    (r"请运行", "让我们运行"),
    (r"请思考", "让我们思考"),
    (r"请观察", "让我们观察"),
    (r"请对比", "让我们对比"),
    (r"请分析", "让我们分析"),
    
    # 用"可以"代替"必须/应该"
    (r"必须使用", "可以使用"),
    (r"应该使用", "可以使用"),
    (r"必须遵循", "可以参考"),
    (r"应该遵循", "可以参考"),
    (r"必须理解", "可以理解"),
    (r"应该理解", "可以理解"),
    
    # 用"让我们"代替"请"
    (r"请看以下", "让我们看看以下"),
    (r"请看下面", "让我们看看下面"),
    (r"请看这个", "让我们看看这个"),
    
    # 用"我们发现"代替"你应该知道"
    (r"你应该知道", "我们会发现"),
    (r"你需要知道", "我们会发现"),
    (r"你需要理解", "我们可以理解"),
    
    # 用"或许"代替"必须"
    (r"必须注意", "需要注意"),
    (r"必须牢记", "值得牢记"),
    (r"必须记住", "值得记住"),
    
    # 保持专业但谦逊
    (r"本节将系统讲解", "本节我们将一起探索"),
    (r"本节将详细介绍", "本节我们将一起了解"),
    (r"本节将深入讲解", "本节我们将一起深入"),
    (r"本节将全面讲解", "本节我们将一起全面"),
]

def improve_style(content: str) -> str:
    """应用语言风格改进"""
    for old_pattern, new_pattern in REPLACEMENTS:
        content = re.sub(old_pattern, new_pattern, content)
    return content

def process_file(filepath: Path) -> bool:
    """处理单个文件，返回是否修改"""
    content = filepath.read_text(encoding="utf-8")
    new_content = improve_style(content)
    
    if new_content != content:
        filepath.write_text(new_content, encoding="utf-8")
        return True
    return False

def main():
    """主函数"""
    print("开始改进教程语言风格...")
    
    modified_count = 0
    total_count = 0
    
    for mdx_file in sorted(DOCS_DIR.rglob("*.mdx")):
        if mdx_file.name.startswith("_"):
            continue
        
        total_count += 1
        if process_file(mdx_file):
            modified_count += 1
            print(f"  ✓ {mdx_file.relative_to(DOCS_DIR.parent)}")
    
    print(f"\n完成！共处理 {total_count} 个文件，修改了 {modified_count} 个文件")

if __name__ == "__main__":
    main()
