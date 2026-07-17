# Python 源码目录

本目录包含 Study Python 项目的 Python 源码，主要用于学习练习和工具脚本。

## 目录结构

```
src/study_python/
├── __init__.py          # 包初始化文件
├── timer.py             # 计时器工具
├── 文本加密解密.py       # 文本加密解密示例
├── 文本词频统计.py       # 文本词频统计示例
└── sample_text.txt      # 示例文本文件
```

## 文件说明

### timer.py

简单的计时器工具，用于测量代码执行时间。

```python
import time

def timer(func):
    """计时器装饰器"""
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 执行时间: {end - start:.4f} 秒")
        return result
    return wrapper

@timer
def slow_function():
    """示例函数"""
    time.sleep(1)
    return "完成"

if __name__ == "__main__":
    slow_function()
```

### 文本加密解密.py

文本加密解密示例，演示基本的加密算法。

### 文本词频统计.py

文本词频统计示例，演示文本处理和数据分析。

### sample_text.txt

示例文本文件，用于测试文本处理脚本。

---

## 开发环境

### 安装依赖

```bash
uv sync
```

### 运行脚本

```bash
# 使用 uv 运行
uv run python src/study_python/timer.py

# 或直接运行
python src/study_python/timer.py
```

### 代码检查

```bash
uv run ruff check src/      # lint
uv run ruff format src/     # format
```

---

## 依赖说明

本项目依赖以下 Python 包：

| 包名 | 版本 | 用途 |
|------|------|------|
| matplotlib | >=3.11.0 | 数据可视化 |
| scipy | >=1.18.0 | 科学计算 |
| tqdm | >=4.68.4 | 进度条 |
| torch | latest | PyTorch |
| torchvision | latest | PyTorch 视觉库 |

### PyTorch CPU 版本

默认安装 PyTorch CPU 版本，配置在 `pyproject.toml`：

```toml
[tool.uv.sources]
torch = { index = "pytorch-cpu" }
torchvision = { index = "pytorch-cpu" }
```

---

## 开发指南

### 添加新模块

1. 在 `src/study_python/` 下创建 Python 文件
2. 添加模块文档字符串
3. 编写示例代码
4. 更新本 README.md

### 代码规范

- 遵循 PEP 8 风格
- 使用 type hints
- 编写文档字符串
- 添加示例代码

### 测试

```bash
uv run pytest               # 运行所有测试
uv run pytest tests/test_foo.py  # 运行单个文件
uv run pytest -k "test_name"    # 按关键字运行
```

---

## 相关链接

- [Python 官方文档](https://docs.python.org/zh-cn/3/)
- [uv 文档](https://docs.astral.sh/uv/)
- [Ruff 文档](https://docs.astral.sh/ruff/)
