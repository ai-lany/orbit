# Orbit

A social network centered on deep profile customization and a chronological, algorithm-free feed.

## Repo structure

This is a monorepo. Each directory is an independent package worked on separately — there is no root-level build or dev command.

| Directory | Purpose |
|-----------|---------|
| [`Design-System/`](./Design-System) | React + TypeScript component library (`@your-org/design-system`) |
| [`templating-language/`](./templating-language) | Profile templating language + renderer |
| [`landing/`](./landing) | Marketing landing page |
| [`docs/`](./docs) | PRDs and planning documents |
| [`mockups/`](./mockups) | Static HTML mockups for design reference |

## Getting started

### Design-System

```bash
cd Design-System
npm install
npm run dev
```

### Templating language

```bash
cd templating-language
npm install   # builds the design system automatically via prepare script
npm run dev
```

### Landing

```bash
cd landing
npm install
npm run dev
```

## Dependency chain

```
Design-System  ←  templating-language  ←  (future app)
Design-System  ←  landing
```

When working on both `Design-System` and another package locally, run `npm install ../Design-System` inside the consuming package to avoid using a stale `dist/`.

## Docs

- Product vision: [`docs/prds/orbit-prd-v2.md`](./docs/prds/orbit-prd-v2.md)
- Claude Code conventions: [`CLAUDE.md`](./CLAUDE.md)
