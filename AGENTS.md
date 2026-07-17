# AGENTS.md

## Project overview

Python learning project ("study-python") with two halves:
- `src/study_python/` — Python source (learning exercises, utilities)
- `docs/` — Docusaurus 3.10 documentation site, deployed to GitHub Pages

## Python environment

- Python 3.14 (cutting-edge; pinned in `.python-version` and `pyproject.toml`)
- Package manager: **uv** (not pip). Uses Tsinghua mirror by default.
- Build backend: hatchling
- Source layout: `src/study_python/` (declared via `tool.hatch.build.targets.wheel`)
- Dependencies: matplotlib, scipy, tqdm, torch, torchvision (runtime); pytest, ruff (dev)

```bash
# Install dependencies
uv sync

# Run a single script
uv run python src/study_python/timer.py
```

## Linting & formatting

```bash
uv run ruff check src/          # lint (rules: E, F, W)
uv run ruff format src/         # format
```

Ruff config: line-length 100, target py314.

## Testing

```bash
uv run pytest                   # run all tests (configured for tests/ dir)
uv run pytest tests/test_foo.py # run single file
uv run pytest -k "test_name"    # run by keyword
```

Note: `tests/` directory currently empty. `pyproject.toml` points pytest at `tests/`, not `src/study_python/tests/`.

## Documentation site

The docs site is a separate Node.js app inside `docs/`. It does NOT share Python tooling.

```bash
cd docs
npm ci                    # install dependencies
npm start                 # dev server (localhost:3000)
npm run build             # production build
npm run serve             # serve production build locally
```

- Node >= 20 required
- Docs use MDX format, stored in `docs/docs/` (auto-generated sidebar)
- Blog posts (学习笔记) in `docs/blog/`, served at `/notes` route
- `scripts/optimize_docs.py` — batch-adds emoji titles and converts `## 小结` to summary admonitions

### CI

GitHub Actions deploys docs to GitHub Pages on push to `main` when `docs/**` files change. No CI for Python code (no lint/test workflows).

## Source code notes

- Some source files use Chinese filenames (e.g. `文本加密解密.py`, `文本词频统计.py`) — this is intentional for a learning project
- `src/study_python/tests/` exists but is empty and not configured as the test path
- `.gitignore` excludes `complement/` directory

## Key files

- `pyproject.toml` — all Python project config (deps, ruff, pytest, uv)
- `docs/docusaurus.config.js` — docs site config
- `scripts/optimize_docs.py` — docs formatting utility
