# CLAUDE.md

Guidance for working in the `orbit` repo.

## What this is

`orbit` will become a social media app. Right now it hosts a small set of **reusable
React components** for that app, built on top of the sibling design system
`@your-org/design-system` (repo at `../Design-System`), wired together into a small
runnable app (Home + Profile routes).

## Commands

```bash
npm run dev          # Vite dev server (app routes: / and /profile)
npm run build        # tsc --noEmit then vite build
npm run typecheck    # tsc --noEmit (strict — must pass before pushing)
npm run preview      # preview the production build
```

There are no tests and no lint script.

## Design-system dependency

The design system is consumed as a local file link: `"@your-org/design-system":
"file:../Design-System"`. Its `dist/` must be built once for the link to resolve:

```bash
cd ../Design-System && npm install && npm run build
```

Design-system tokens, reset, fonts, and component CSS are imported once in
`src/main.tsx` via `import '@your-org/design-system/dist/index.css'`.

> Note: because it's a local file link, a standalone clone of `orbit` (with no sibling
> `Design-System` checkout) won't install. Publishing the design system or moving both
> repos into a workspace is a later step.

## Component conventions (mirror the design system)

Each component lives in `src/components/<Name>/` with three files: `<Name>.tsx`,
`<Name>.module.css`, and `index.ts` (barrel). Follow the design system's patterns:

- `forwardRef` for the root DOM element; spread `...rest` onto it.
- Extend the right HTML attributes interface (`Omit<...>` when a prop conflicts).
- Drive variants/state via `data-*` attributes styled in the CSS module — not JS branches.
- Merge classNames with `cn()` from `@your-org/design-system`.
- **Use design-system semantic tokens only** in CSS (`--color-*`, `--space-*`, `--radius-*`,
  `--text-*`, `--weight-*`, `--shadow-*`, `--z-*`). Never hard-code colors or spacing.
- Compose from existing design-system components rather than re-implementing primitives.

Dark mode needs no per-component logic: it follows a `data-theme="dark"` ancestor
(the demo page toggles this on its root wrapper).

Shared domain types live in `src/types.ts`. The public API is re-exported from `src/index.ts`.

## Components

- `PhotoGrid` — CSS-grid gallery with adjustable `cols`/`rows`/`gap`/`aspect`, plus
  loading (skeleton) and empty states.
- `PostCard` — a post built from the design system `Card` compound: author row, body,
  single image or nested `PhotoGrid`, and like/comment/share actions.
- `Feed` — vertical list of `PostCard`s with loading skeletons, empty state, and load-more.
- `ProfileHeader` — cover, avatar, name/handle/verified, bio, stat row, and section tabs.
- `PostComposer` — avatar + textarea + Post button with a character counter.

## App structure (demo shell around the components)

The reusable components above live in `src/components/`. The runnable app that wires
them together is intentionally separate:

- `src/app/AppState.tsx` — a small React context holding demo state (`user`, `posts`,
  `theme`) and actions (`toggleLike`, `toggleFollow`, `addPost`). Use `useAppState()`.
- `src/app/Layout.tsx` — the nav shell (brand, Home/Profile `NavLink`s, dark toggle) with
  a router `<Outlet />`. Dark mode is set via `data-theme` on the shell root.
- `src/pages/` — `HomePage` (composer + feed) and `ProfilePage` (header + tab-filtered feed).
- `src/App.tsx` — the route table; `src/main.tsx` wraps it in `<BrowserRouter>`.

Routing uses `react-router-dom` v6. Mock demo data lives in `src/mock/data.ts`.
