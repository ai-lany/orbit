# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Orbit** is a social network (working title) centered on deep profile customization and a chronological, algorithm-free feed. The repo is a monorepo with four directories — each is an independent package with its own git repo, `package.json`, and (where relevant) its own `CLAUDE.md`:

| Directory | Purpose |
|-----------|---------|
| `Design-System/` | React + TypeScript component library (`@your-org/design-system`) |
| `templating-language/` | Profile templating language + renderer (`@your-org/profile-templating-language`) |
| `landing/` | Marketing landing page (React, consumes the design system) |
| `docs/` | PRDs and other planning documents |
| `mockups/` | Static HTML mockups for design reference |

There is no workspace tooling tying these together. Each directory is worked on independently.

`Design-System/` and `templating-language/` are **git submodules** (each its own repo); `landing/` and `docs/` live directly in this repo. Clone with `git clone --recurse-submodules`, or run `git submodule update --init` in an existing checkout, or those two directories will be empty. Each submodule repo also deploys its own GitHub Pages site (the design system's example/docs page, the templating language's Profile Studio editor); this repo's Pages deploy only builds `landing/`.

## Working with the submodules

The submodule folder (`Design-System/`, `templating-language/`) **is** a live checkout of the child repo — editing files there edits the child. Orbit only records *which child commit it is pinned to*; that pointer moves only when you commit it. There is no automatic mirror. Keep changes flowing in both directions like this:

**One-time setup per clone** (not stored in the repo, so run it after cloning):

```bash
git clone --recurse-submodules <orbit-url>    # or: git submodule update --init
git config push.recurseSubmodules on-demand   # pushing orbit auto-pushes child commits it needs
git config submodule.recurse true             # pull/checkout/switch recurse into submodules
git config status.submoduleSummary true       # git status shows what changed in each child
git config diff.submodule log                 # git diff shows child commit logs, not just SHAs
```

**Edited child files while working in orbit → land them in the child repo and reflect in orbit:**

```bash
cd templating-language
git add -A && git commit -m "…" && git push   # commit to the CHILD repo first (also runs its Pages deploy)
cd ..
git add templating-language && git commit -m "Bump templating-language" && git push
```

**Child repo advanced on its own remote → pull it into orbit's pointer:**

```bash
git submodule update --remote --merge templating-language   # follows the branch in .gitmodules (master)
git add templating-language && git commit -m "Update templating-language to latest" && git push
```

Always push the child **before** (or with `push.recurseSubmodules on-demand`, alongside) the orbit pointer bump — otherwise orbit points at a commit no one else (or CI) can fetch. The Pages deploy (`.github/workflows/deploy.yml`) reads the `Design-System` pointer from the gitlink, so bumping the pointer is all it takes to deploy a new design-system commit.

## Commands

Each sub-project is run from its own directory. There is no root-level build or dev command.

### Design-System

```bash
cd Design-System
npm run dev          # Vite dev server for the docs/example page
npm run build        # build the library (tsup → dist/)
npm run build:docs   # build the static docs site
npm run typecheck    # tsc --noEmit (must pass before pushing)
```

### templating-language

```bash
cd templating-language
npm install          # always npm install, no lockfile committed
npm run dev          # live "Profile Studio" editor
npm run build        # build the library (tsup → dist/)
npm run build:docs   # build the static editor/demo site
npm run typecheck    # tsc --noEmit (must pass before pushing)
```

### landing

```bash
cd landing
npm run dev          # Vite dev server on port 5173 (strictPort)
npm run build        # production build
```

## Architecture

### Dependency chain

```
Design-System  ←  templating-language  ←  (future app)
Design-System  ←  landing
```

`templating-language` depends on `@your-org/design-system` as a **git dependency** (`github:ai-lany/design-system#master`). Running `npm install` inside `templating-language/` triggers the design system's `prepare` script, which builds it automatically. When working on both packages locally, use `npm install ../Design-System` or link them to avoid stale dist files.

### Design-System

- Two-layer CSS token system in `src/styles/tokens.css`: **primitives** (`--gray-*`, `--accent-*`, …) and **semantic tokens** (`--color-bg`, `--color-accent`, `--space-*`, etc.). Components use semantic tokens only — never primitives.
- Dark mode via `data-theme="dark"` on any ancestor; no component-level dark mode logic.
- Component pattern: `src/components/<Name>/` with `<Name>.tsx`, `<Name>.module.css`, `index.ts`. Variants are styled via `data-*` attribute selectors (e.g., `.button[data-variant='primary']`), not extra CSS classes.
- All public exports go through `src/index.ts`; CSS (`fonts.css`, `tokens.css`, `reset.css`) is also imported there so consumers need only `dist/index.css`.
- See `Design-System/CLAUDE.md` for the full component conventions.

### templating-language

- The data model is `Profile = { theme, blocks[] }` where every `Block` has `{ id, type, attrs, text?, children[] }` — a plain serializable tree. Each node carries a **named, stable, human-readable `id`** (authored in the template, with a readable derived fallback), surfaced in the editor and emitted as the rendered HTML `id`; see the v2 PRD §8.3.4.
- `src/parse.ts` converts the bracket-tag DSL to a `Profile`; `src/serialize.ts` converts it back. Both are generic — adding a new block type requires no changes to either.
- `src/blocks/` contains one component per type plus `registry.tsx`, `render.tsx`, and `attrs.ts`. `render.tsx`'s `BlockView` is the single recursion point; containers just render `{children}`.
- Theme overrides land as inline CSS variables on the profile wrapper (SSR-safe, supports multiple profiles per page).
- See `templating-language/CLAUDE.md` for the full architecture and "adding a block type" steps.

### Fonts (Design-System)

Fonts are not tracked in version control. Clone the Funnel typeface into `Design-System/fonts/` if needed:

```bash
git clone https://github.com/Dicotype/Funnel.git Design-System/fonts/Funnel
# then move fonts/Funnel/fonts/Funnel_1001, Funnel_Display, Funnel_Sans into Design-System/fonts/
```

## Key product context

The v2 PRD (`docs/prds/orbit-prd-v2.md`) describes the overall product vision. The relevant architectural decision: Orbit's advanced customization mode is deliberately **not** a raw HTML/CSS editor — users interact only with known Orbit components via the templating language. This is a permanent product decision.
