# orbit

Social media app — early work in progress.

Right now this repo contains a small set of reusable React components for the app,
built on top of the [`@your-org/design-system`](../Design-System) library, plus a
runnable demo page.

## Components

- **PhotoGrid** — responsive photo grid with adjustable columns/rows/gap.
- **PostCard** — a single post (author, body, media, like/comment/share).
- **Feed** — a vertical list of posts with loading and empty states.
- **ProfileHeader** — profile cover, avatar, stats, and section tabs.

## Getting started

The design system is linked locally, so build its `dist/` once first:

```bash
cd ../Design-System && npm install && npm run build
cd ../orbit && npm install
npm run dev        # open the demo page
```

See [CLAUDE.md](./CLAUDE.md) for conventions and the full command list.
