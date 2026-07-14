from __future__ import annotations

import time


class Timer:
    """一次性计时上下文管理器，适合 env/model/eval 等单次阶段。"""

    def __init__(self, name: str = "Timer") -> None:
        self.name = name

    def __enter__(self) -> Timer:
        print(f"⏱️ [{self.name}] 开始...")
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, traceback) -> bool:
        self.elapsed = time.perf_counter() - self.start
        print(f"⏱️ [{self.name}] 耗时: {self.elapsed:.4f} 秒")
        if exc_type:
            print(f"⚠️ [{self.name}] 异常: {exc_val}")
        return False  # 不吞掉异常


def make_env() -> int:
    """模拟环境创建，返回一个代表环境的占位对象。"""
    time.sleep(1)

    return 42  # 模拟 env 对象


def collect_rollout(env: int, num_steps: int) -> int:
    """模拟 rollout 数据采集，返回采集到的样本数（等于 num_steps）。"""
    time.sleep(1)
    return num_steps


def ppo_update(num_minibatches: int) -> int:
    """模拟 PPO 策略更新，返回处理的 minibatch 数。"""
    time.sleep(1)
    return num_minibatches


if __name__ == "__main__":
    from tqdm import tqdm

    # ===== 一次性阶段：环境创建、模型初始化 =====
    with Timer("env 创建"):
        env = make_env()

    with Timer("模型初始化"):
        time.sleep(1)

    # ===== 训练循环：纯 tqdm 进度条（主流方式） =====
    epochs = 10
    num_steps = 2048
    num_minibatches = 32
    total_steps = epochs * num_steps

    train_start = time.perf_counter()
    pbar = tqdm(total=total_steps, desc="训练", unit="step", dynamic_ncols=True)

    for epoch in range(epochs):
        # 阶段 1：采集 rollout
        steps = collect_rollout(env, num_steps)
        pbar.update(steps)

        # 阶段 2：策略更新
        ppo_update(num_minibatches)

        # 周期性日志（用 tqdm.write 保持进度条原地刷新）
        if epoch == epochs // 2:
            elapsed = time.perf_counter() - train_start
            sps = pbar.n / elapsed if elapsed > 0 else 0
            pbar.write(f"📊 [epoch {epoch}] 已完成 {pbar.n}/{total_steps} 步, SPS={sps:.1f}")

    pbar.close()
    train_elapsed = time.perf_counter() - train_start
    avg_sps = total_steps / train_elapsed
    print(f"\n🏁 训练完成，总耗时: {train_elapsed:.2f} 秒, 平均 SPS: {avg_sps:.1f}")
