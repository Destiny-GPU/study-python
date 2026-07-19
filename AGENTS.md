# AGENTS.md

## Project overview

Python learning project ("study-python") with two independent halves:
- `src/study_python/` — Python source (learning exercises, utilities). Pure Python, no Python tests in CI.
- `docs/` — Docusaurus 3.10 documentation site. Separate Node.js app; does NOT share Python tooling.

The live site is served from Cloudflare Pages (`study-python-zj.pages.dev`), but **CI deploys to GitHub Pages** via `.github/workflows/deploy.yml` on push to `main` when `docs/**` changes. A second workflow (`.github/workflows/docs-ci.yml`) builds on every `docs/**` pull request. There is no Python CI.

## Python environment

- Python 3.14, pinned in `.python-version` and `requires-python` in `pyproject.toml`.
- Package manager: **uv** (not pip). Tsinghua mirror is the default index; `torch`/`torchvision` come from the explicit `pytorch-cpu` index (see `[tool.uv.sources]`).
- Build backend: hatchling. Package root: `src/study_python/`.
- Runtime deps: matplotlib, scipy, tqdm, torch, torchvision. Dev group: pytest, ruff. Optional `build` extra: cairosvg (for the social-card script).

```bash
uv sync                                   # install deps
uv run python src/study_python/timer.py   # run a single script
uv run ruff check src/                    # lint (rules: E, F, W; line-length 100, py314)
uv run ruff format src/                   # format
uv run pytest                             # tests/ dir (currently empty)
```

## Documentation site

```bash
cd docs
npm ci                    # install deps (lockfile committed)
npm start                 # dev server, localhost:3000 (no AI support)
npm run build             # production build -> docs/build
npm run serve             # serve the production build locally (no AI support)
npm run lint              # markdownlint-cli2 over docs/**/*.mdx and blog/**/*.mdx

# AI 聊天功能本地测试（必须用这个，npm run serve 不支持 Functions）
npx wrangler pages dev build --port 8788
# 访问 http://localhost:8788/ai-chat
```

- **`prestart` and `prebuild` auto-run `npm run generate-doc-tags`** (runs `docs/scripts/generate-doc-tags.py`, which writes `tags` frontmatter into every `docs/docs/**` MDX). Never bypass this — builds rely on the generated tags. If you edit MDX, expect this step to rewrite frontmatter.
- Node 22 in CI (`.github/workflows/*.yml`); use Node ≥ 20 locally.
- Docs are MDX in `docs/docs/` (auto-generated sidebar). Blog posts (学习笔记) live in `docs/blog/`, served at `/notes`.
- `og:image` / social card: source SVG `docs/scripts/social-card.svg` is rendered to `docs/static/img/docusaurus-social-card.jpg` by `docs/scripts/generate_social_card.py` (needs the `build` extra: `cairosvg`).
- **Cache-poison fix:** a stale `.docusaurus` cache can make `npm run build` fail with a spurious `ParseError: Unexpected token ... :0`. Fix is `rm -rf .docusaurus build node_modules/.cache` then rebuild — do not edit source to "fix" that error.
- A ready-made `.mimocode/command/docs-build-verify.md` encodes this build+verify loop.

## Source code notes

- Some source files use Chinese filenames (e.g. `文本加密解密.py`, `文本词频统计.py`) — intentional for a learning project; match them exactly in commands.
- `.gitignore` excludes the `complement/` directory.

## Commit conventions

- Commit messages MUST be written in Chinese (project rule; summary line especially). Verify with `git log --oneline -1`.
- Do NOT auto-commit or auto-push. The user decides when to commit.
- A ready-made `.mimocode/command/chinese-git-commit.md` encodes this workflow.

## AI 聊天功能

- **后端**: Cloudflare Pages Functions (`docs/functions/api/chat.js`)，非 Workers
- **LLM**: 硅基流动 GLM-Z1-9B-0414，API Key 通过 Pages Secrets 配置
- **RAG**: 构建时通过 `docs/src/plugins/docs-index-plugin.js` 生成 `docs-content.json`（104 页），BM25 关键词搜索
- **本地测试**: `npx wrangler pages dev build --port 8788`（`npm run serve` 不支持 Functions）
- **本地 API Key**: `docs/.dev.vars` 文件（不提交到 git）
- **代码块「问 AI」**: Swizzle `@theme/CodeBlock`，点击跳转 `/ai-chat?code=...`
- **聊天记录**: localStorage 持久化，key `ai-chat-history`
- **AI 工具链接**: `docs/src/components/AiChat/AiToolsLinks.jsx`，图标在 `docs/static/img/ai-tools/`

### 注意事项

- `workers.dev` 域名在国内不可用，必须用 Pages Functions
- 修改 `functions/api/chat.js` 后需要重启 wrangler 才能生效
- 修改 `docs-index-plugin.js` 后需要 `npm run build` 重新生成索引
- 系统提示词在 `functions/api/chat.js` 的 `SYSTEM_PROMPT` 和 `CODE_PROMPT` 常量中
- 硅基流动 API 文档: https://docs.siliconflow.cn/

## Key files

- `pyproject.toml` — all Python config (deps, ruff, pytest, uv indexes).
- `docs/docusaurus.config.js` — site config (title, og:* metadata, deploy org/project).
- `docs/functions/api/chat.js` — AI API: CORS + BM25 search + SiliconFlow proxy + SSE streaming.
- `docs/src/plugins/docs-index-plugin.js` — builds docs-content.json at build time.
- `docs/src/components/AiChat/` — chat UI components.
- `docs/.dev.vars` — local API key (gitignored).
- `docs/scripts/generate-doc-tags.py` — auto-runs before build/start; edits MDX frontmatter.
- `.github/workflows/deploy.yml`, `.github/workflows/docs-ci.yml` — docs CI/deploy.
