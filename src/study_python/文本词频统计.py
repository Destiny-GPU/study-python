import re
import time
from collections import Counter
from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib

# -----------------------------------------------------------------------------
# 全局配置与预编译
# -----------------------------------------------------------------------------

# 设置中文字体，以便图表能正确显示中文标签
matplotlib.rcParams["font.sans-serif"] = [
    "SimHei",
    "Microsoft YaHei",
    "Arial Unicode MS",
    "PingFang HK",
]
matplotlib.rcParams["axes.unicode_minus"] = False


# 预编译正则表达式：匹配连续的小写英文字母序列
# 注意：此正则依赖于输入数据已经通过 .lower() 转换为小写。
_WORD_PATTERN = re.compile(r"[a-z]+")


def word_frequency_fast(filepath: str | Path) -> Counter[str]:
    """通过全量读取和批量处理实现极速词频统计。"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 关键步骤：先统一转换为小写
    content_lower = content.lower()

    # 批量提取所有小写单词
    words = _WORD_PATTERN.findall(content_lower)

    counter = Counter()
    counter.update(words)
    return counter


def generate_test_file(filepath: str | Path, repeat: int = 10000) -> None:
    """生成用于性能测试的大体积文本文件。"""
    content = (
        "Beautiful is better than ugly.\n"
        "Explicit is better than implicit.\n"
        "Simple is better than complex.\n"
        "Complex is better than complicated.\n"
        "Flat is better than nested.\n"
        "Sparse is better than dense.\n"
        "Readability counts.\n"
        "Special cases aren't special enough to break the rules.\n"
        "Although practicality beats purity.\n"
        "Errors should never pass silently.\n"
        "Unless explicitly silenced.\n"
        "In the face of ambiguity, refuse the temptation to guess.\n"
        "There should be one-- and preferably only one --obvious way to do it.\n"
        "Although that way may not be obvious at first unless you're Dutch.\n"
        "Now is better than never.\n"
        "Although never is often better than ＊right＊ now.\n"
        "If the implementation is hard to explain, it's a bad idea.\n"
        "If the implementation is easy to explain, it may be a good idea.\n"
        "Namespaces are one honking great idea -- let's do more of those!\n\n"
    )
    with open(filepath, "w", encoding="utf-8") as f:
        for _ in range(repeat):
            f.write(content)


def plot_top_words(counter: Counter[str], top_n: int = 15) -> None:
    """绘制最高频单词的柱状图。"""

    most_common = counter.most_common(top_n)
    words = [item[0] for item in most_common]
    frequencies = [item[1] for item in most_common]

    plt.figure(figsize=(12, 8))
    bars = plt.barh(words, frequencies, color="skyblue", edgecolor="gray")

    plt.title(f"Top {top_n} Frequent Words", fontsize=16, pad=20)
    plt.xlabel("Frequency", fontsize=12)
    plt.ylabel("Words", fontsize=12)

    # 添加数值标签
    for bar, freq in zip(bars, frequencies):
        plt.text(
            bar.get_width() + max(frequencies) * 0.01,
            bar.get_y() + bar.get_height() / 2,
            f"{freq}",
            va="center",
            fontsize=10,
        )

    plt.tight_layout()
    plt.show()


def main() -> None:
    """主入口：协调文件生成、性能测试及结果展示。"""
    test_file = Path("test_zen_final.txt")

    try:
        print(f"Generating test file: {test_file}")
        generate_test_file(test_file)

        file_size_mb = test_file.stat().st_size / 1024 / 1024
        print(f"File size: {file_size_mb:.2f} MB")

        print("\nProcessing...")
        start_time = time.perf_counter()
        word_counts = word_frequency_fast(test_file)
        elapsed_time = time.perf_counter() - start_time

        print("\nTop 10 Frequent words:")
        for word, freq in word_counts.most_common(10):
            print(f"  {word:<12} {freq}")

        total_unique = len(word_counts)
        total_occurrences = sum(word_counts.values())

        print(f"\nTotal unique words: {total_unique}")
        print(f"Total word occurrences: {total_occurrences}")
        print(f"Processing time: {elapsed_time:.4f} seconds")

        print("\nGenerating visualization...")
        plot_top_words(word_counts, top_n=15)

    finally:
        if test_file.exists():
            test_file.unlink()
            print(f"\nCleaned up test file: {test_file}")


if __name__ == "__main__":
    main()
