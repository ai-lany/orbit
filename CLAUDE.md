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

There is no workspace tooling tying these together. Each directory is worked on independently.

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

- The data model is `Profile = { theme, blocks[] }` where every `Block` has `{ type, attrs, text?, children[] }` — a plain serializable tree.
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
