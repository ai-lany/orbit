# orbit

Social media app — early work in progress.

Right now this repo contains a small set of reusable React components for the app,
built on top of the [`@your-org/design-system`](../Design-System) library, wired into a
small runnable app with **Home** and **Profile** routes.

## Components

- **PhotoGrid** — responsive photo grid with adjustable columns/rows/gap.
- **PostCard** — a single post (author, body, media, like/comment/share).
- **Feed** — a vertical list of posts with loading and empty states.
- **ProfileHeader** — profile cover, avatar, stats, and section tabs.
- **PostComposer** — avatar + textarea + Post button for writing a new post.

## Getting started

The design system is linked locally, so build its `dist/` once first:

```bash
cd ../Design-System && npm install && npm run build
cd ../orbit && npm install
npm run dev        # open the demo page
```

See [CLAUDE.md](./CLAUDE.md) for conventions and the full command list.

## Deployment

Every push to `main` builds the app and deploys it to GitHub Pages at
`https://ai-lany.github.io/orbit/` via `.github/workflows/deploy.yml`. Because the
design system is a local `file:` dependency, the workflow checks out
[`ai-lany/Design-System`](https://github.com/ai-lany/Design-System) alongside this repo
and builds it first, then builds orbit and publishes `dist/`.

**One-time setup:** in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions**. You can also run the workflow manually from the **Actions** tab.

Notes:
- `vite.config.ts` sets `base: '/orbit/'` for production builds (dev stays at `/`), and
  the router uses that base, so client-side routes resolve under the Pages subpath.
- The workflow copies `index.html` to `404.html` so deep links (e.g. `/orbit/profile`)
  work on reload — GitHub Pages has no server-side routing.
