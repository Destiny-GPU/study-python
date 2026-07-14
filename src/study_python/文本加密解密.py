from __future__ import annotations

import random
from collections import Counter
from functools import lru_cache
from pathlib import Path

# 英文字母近似频率(%),用于频率分析破解
_ENGLISH_FREQ = {
    "a": 8.2,
    "b": 1.5,
    "c": 2.8,
    "d": 4.3,
    "e": 12.7,
    "f": 2.2,
    "g": 2.0,
    "h": 6.1,
    "i": 7.0,
    "j": 0.15,
    "k": 0.77,
    "l": 4.0,
    "m": 2.4,
    "n": 6.7,
    "o": 7.5,
    "p": 1.9,
    "q": 0.095,
    "r": 6.0,
    "s": 6.3,
    "t": 9.1,
    "u": 2.8,
    "v": 0.98,
    "w": 2.4,
    "x": 0.15,
    "y": 2.0,
    "z": 0.074,
}

_SEP = "-" * 30
_SEP_DOUBLE = "=" * 30


# === 核心算法 ===
@lru_cache(maxsize=None)
def _build_table(key: int) -> tuple[dict[str, str], dict[str, str]]:
    """根据 key 生成 (加密表, 解密表),大小写独立。结果被缓存,调用方不应修改"""
    rng = random.Random(key)
    enc, dec = {}, {}
    for base in (65, 97):  # 大写、小写
        letters = [chr(base + i) for i in range(26)]
        shuffled = letters[:]
        rng.shuffle(shuffled)
        for src, dst in zip(letters, shuffled):
            enc[src] = dst
            dec[dst] = src
    return enc, dec


def encrypt(source: str, key: int = 3) -> str:
    """单表替换加密:key 作为随机种子生成置换表"""
    enc, _ = _build_table(key)
    return source.translate(str.maketrans(enc))


def decrypt(source: str, key: int = 3) -> str:
    """单表替换解密:key 必须与加密时一致"""
    _, dec = _build_table(key)
    return source.translate(str.maketrans(dec))


def _freq_order(text: str) -> str:
    """返回文本中字母按出现频率降序排列的字符串"""
    counts = Counter(text.lower())
    return "".join(sorted(_ENGLISH_FREQ, key=lambda c: counts.get(c, 0), reverse=True))


def auto_decrypt(source: str) -> str:
    """纯频率分析破解:按字母频率匹配最可能的映射,返回推测明文"""
    cipher_order = _freq_order(source)
    english_order = "".join(sorted(_ENGLISH_FREQ, key=_ENGLISH_FREQ.get, reverse=True))
    mapping = dict(zip(cipher_order, english_order))
    # 合并大小写映射,str.translate 一次完成替换
    mapping.update({k.upper(): v.upper() for k, v in mapping.items()})
    return source.translate(str.maketrans(mapping))


# === 评估与展示 ===
def _correctness(actual: str, expected: str) -> float:
    """计算破解正确率(字符级匹配比例)"""
    if len(actual) != len(expected):
        return 0.0
    return sum(a == e for a, e in zip(actual, expected)) / len(expected)


def _preview(text: str, max_chars: int = 200) -> str:
    """截取前 max_chars 字符作为预览,超出加省略号"""
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "..."


def _print_freq_stats(text: str) -> None:
    """统计并打印文本中各字母频率,与标准英文频率对比"""
    counts = Counter(c for c in text.lower() if c.isalpha())
    total = sum(counts.values()) or 1
    print(f"样本字母总数: {total}")
    print(f"{'字母':<6}{'实际(%)':<10}{'标准(%)':<10}{'偏差':<10}")
    for c in sorted(_ENGLISH_FREQ, key=_ENGLISH_FREQ.get, reverse=True):
        actual = counts.get(c, 0) / total * 100
        expected = _ENGLISH_FREQ[c]
        diff = actual - expected
        print(f"{c:<6}{actual:<10.2f}{expected:<10.2f}{diff:+.2f}")


# === 演示入口 ===
def _run_demo() -> None:
    """运行加密/解密/破解演示"""
    sample = (Path(__file__).parent / "sample_text.txt").read_text(encoding="utf-8")

    _print_freq_stats(sample)
    print(_SEP_DOUBLE)

    encrypted = encrypt(sample)
    decrypted = decrypt(encrypted)
    cracked = auto_decrypt(encrypted)

    accuracy = _correctness(cracked, sample)
    success = accuracy > 0.9  # 正确率 90% 以上算成功

    print(f"原文预览:\n{_preview(sample)}")
    print(_SEP)
    print(f"密文预览:\n{_preview(encrypted)}")
    print(_SEP)
    print(f"解密文预览:\n{_preview(decrypted)}")
    print(_SEP_DOUBLE)
    print(f"破解{'成功' if success else '失败'}(正确率 {accuracy:.1%})")
    print(f"破解结果预览:\n{_preview(cracked)}")


if __name__ == "__main__":
    _run_demo()
