# Product Requirements Document — Orbit
### Social Network v2.0 — Advanced Profile Customization
*Status: Draft · Version: 2.0 · Last updated: 2026-07-20 · Owner: Ailany*

---

## Table of Contents
1. [Overview](#1-overview)
2. [What's New in V2](#2-whats-new-in-v2)
3. [Problem Statement](#3-problem-statement)
4. [Goals](#4-goals)
5. [Non-Goals](#5-non-goals)
6. [User Personas](#6-user-personas)
7. [User Stories](#7-user-stories)
8. [Feature Requirements](#8-feature-requirements)
9. [Success Metrics](#9-success-metrics)
10. [Open Questions](#10-open-questions)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Timeline Considerations](#12-timeline-considerations)
13. [Appendix: Architecture Notes](#13-appendix-architecture-notes)

---

## 1. Overview

**Product name:** Orbit *(working title)*
**One-line pitch:** A fun, light-hearted social network built around deep profile customization and a chronological, algorithm-free feed.

Orbit is a social network that prioritizes genuine connection and self-expression over engagement metrics. Inspired by the early MySpace era — where your profile was a personal space, not a performance — Orbit gives users meaningful control over how they present themselves online, without the dopamine-loop mechanics that define modern social platforms.

The business model is freemium: the core product is free. Premium cosmetic upgrades (exclusive themes, animated elements, custom fonts, additional guestbook styles, and — new in v2 — advanced customization capabilities) are the sole revenue mechanism. There are no ads, no sponsored posts, and no algorithmic ranking. Ever.

**The V2 headline:** Orbit's promise is that "your profile is arranged exactly how you like it." V1 delivered that through a block editor — a fixed menu of blocks you rearrange and set visibility on. V2 goes deeper: an **Advanced customization mode** built on Orbit's own **profile template language**, where a profile is an editable tree of components down to individual headings, images, and dividers — each one selectable, nameable, and addressable — without ever writing raw HTML or CSS. This is the feature that makes Orbit *the* expressive social platform rather than a nicer-looking one.

---

## 2. What's New in V2

V2 is a focused release. It carries the entire v1 product forward unchanged and adds one major capability plus the model changes required to support it.

| Area | v1 | v2 |
|---|---|---|
| **Profile customization** | Two tiers: preset themes (Tier 1) and a block editor (Tier 2). Tier 3 "code editing" deferred. | Adds **Tier 3 — Advanced customization** via the profile template language. Reframed from "code editing" to a safe, component-only advanced editor. |
| **Profile document model** | A flat-ish set of blocks with per-block visibility. | A **canonical tree of nodes**. Every component — including titles, subtitles, images, dividers — is a node. The block editor operates on the same tree as a constrained subset. |
| **Element identity** | Blocks tracked internally. | **Named, stable, human-readable ids** authored in the template, surfaced in the editor (Figma-layer style) and rendered as the element's HTML `id`. |
| **Editing modes** | One block editor. | **Basic mode** (block editor, the default) and **Advanced mode** (the template + advanced visual editor), with a defined convertibility model between them. |
| **Reuse** | N/A | **Composite presets** — prebuilt modules (Header, Link stack, Photo wall) that expand into editable nodes. |

Two constraints scope this release deliberately:

- **Mobile customization is out of scope for this document.** The advanced editor and the mobile authoring experience are treated separately; this PRD specs the desktop advanced editor only. Mobile *rendering* of advanced profiles is noted as an open item, not specced here.
- **Tier 3 is no longer "raw code."** Orbit does not ship a raw HTML/CSS editor. The advanced mode is a constrained template language that can only ever emit known Orbit components — this is a permanent product decision, not a temporary limitation (see §5 and §8.3).

---

## 3. Problem Statement

Modern social networks have optimized so aggressively for engagement and retention that they've become anxiety-inducing, manipulative, and exhausting for the people who use them. Algorithmic feeds, engagement metrics, and attention-capture mechanics have replaced genuine connection as the core product value. Users — particularly younger ones who never experienced the earlier, more expressive web — have no mainstream alternative that prioritizes self-expression and friendship over reach and virality.

The cost of not solving this: a growing segment of users is disengaging from social media entirely rather than finding a better one. That is an addressable market.

**The V2-specific problem:** self-expression on Orbit currently tops out at the block editor. A user can rearrange a fixed set of blocks, but they can't compose their own — they can't split a header apart, restyle a single heading, or build a layout that isn't in the menu. The most expressive users — the exact people who make profiles worth visiting, and the ones most likely to pay — hit a ceiling. Every prior platform that offered real expressive depth (MySpace, Tumblr, Neocities) did so by exposing the page's structure. The challenge is to offer that depth *without* exposing the user to raw code, its security surface, or its intimidation factor.

---

## 4. Goals

### User goals
1. **A new user can build a profile that feels genuinely personal within 10 minutes of signing up** — without writing a single line of code.
2. **A user with no existing followers sees meaningful content on day one** via the curated featured section, and has a clear path to their first follow connection.
3. **A user can control exactly who sees what on their profile** — per component, not just per account — without needing to understand the full permission model upfront.
4. **An expressive user can customize their profile down to the individual element** — selecting, restyling, renaming, and rearranging any title, image, or divider — using an approachable advanced editor, never raw HTML/CSS. *(New in v2.)*
5. **A user can move into advanced customization without fear of a dead end** — going advanced is reversible via a single, clearly-warned reset, and their basic layout is never silently destroyed. *(New in v2.)*

### Business goals
6. **Achieve a 30% day-30 retention rate in the first cohort of users** — the baseline signal that people are coming back, not just signing up.
7. **Validate the freemium model: target 5% of active users converting to a paid cosmetic upgrade within 90 days of launch.**
8. **Establish advanced customization as a premium-conversion driver** — advanced capabilities and the cosmetics they unlock (custom fonts, animated elements, premium presets) are a primary reason the Expressive Personalizer upgrades. *(New in v2.)*

---

## 5. Non-Goals

The following are explicitly out of scope. Each is either a deliberate deferral or a permanent product decision, as noted.

| Non-Goal | Rationale |
|---|---|
| **Raw HTML/CSS editing** | **Permanent, not deferred.** Orbit's advanced mode is a constrained, component-only template language. Raw code is the highest security surface (XSS/CSS injection), the worst experience for the non-coder persona, and unnecessary given the template language delivers the expressive depth. We are not building it. |
| **Algorithmic feed ranking** | Fundamentally at odds with the product's identity. Permanent non-goal. |
| **Mobile advanced customization** | The advanced editor is desktop-only for this release (consistent with v1's desktop-only freeform layout). Mobile authoring is deferred; mobile *rendering* of advanced profiles is an open item (§10). |
| **Lossless advanced → basic round-trip** | Going from Basic to Advanced is lossless (blocks are a subset of the tree). Going back is destructive by design — a single warned "Reset to basic layout." Building a GUI that can losslessly represent any advanced tree is the classic no-code trap and is explicitly not attempted in v2. |
| **Linked component instances** | Composite presets are inserted as *detached snippets*, not live-linked components. A user has one profile, so instance-propagation has near-zero value. Master/instance linking, overrides, and "detach" UX are deferred. |
| **Per-node arbitrary CSS overrides** | Styling flows through the design system's semantic tokens and a bounded set of per-node style attributes — not freeform CSS. Preserves consistency, safety, and cross-device rendering. (Exact per-node styling scope is an open question, §10.) |
| **Music / audio player block** | Music licensing is a legal and financial minefield. Unresolved. Defer until a clear model exists. |
| **Video posts** | Storage cost, encoding complexity, and moderation surface are all disproportionate to current value. |
| **Creator monetization or tipping** | Not the platform's identity at launch. Revisit if user behavior signals demand. |
| **Top Friends widget** | Strong nostalgia value but not essential. Easy to add later. |
| **Curation team / additional curator roles** | The featured section is owner-curated. Role-based expansion is architected for but not built. |

---

## 6. User Personas

### The Expressive Personalizer
*"I want my profile to look like me, not like everyone else's."*
- Age 18–28, heavy social media user but increasingly burned out by mainstream platforms.
- Cares deeply about aesthetic and self-presentation.
- Has opinions about fonts. Has very strong opinions about fonts.
- Not necessarily a coder, but willing to tinker if the tools are approachable.
- **The primary audience for Advanced mode.** Will happily spend an afternoon decomposing a header and restyling individual elements — as long as the on-ramp is visual, not a blank code file. Primary driver for the customization system and the freemium upsell.

### The Social Connector
*"I just want a place to hang out with my actual friends."*
- Age 20–35, uses social media primarily to stay connected, not to broadcast.
- Finds follower counts and likes anxiety-inducing and would happily live without them.
- Values the guestbook, DMs, and friends-only posts more than the public feed.
- Will likely never open Advanced mode — and shouldn't have to. The default block editor and presets must stay complete and satisfying on their own.

### The Curious Browser
*"I saw this profile linked somewhere and it looked really cool."*
- No account yet, may or may not convert.
- Arrives via a shared profile link or the featured section.
- The experience of *viewing* a profile as a stranger is their first impression of the platform.
- Advanced-mode profiles are the acquisition mechanism for this persona — the most distinctive profiles are what get shared and screenshotted.

---

## 7. User Stories

### Onboarding & Identity
- As a **new user**, I want to choose whether my profile is public or private during sign-up so that I have control over my visibility from day one.
- As a **new user**, I want to apply a theme to my profile in one tap so that my space looks personal before I've written anything.
- As a **new user with no friends yet**, I want to see curated featured profiles and posts so that the app doesn't feel empty on day one.

### Profile & Customization (Basic)
- As an **Expressive Personalizer**, I want to rearrange my profile blocks by dragging them so that my layout reflects my personality, not a default template.
- As an **Expressive Personalizer**, I want to set each block's visibility independently (public / followers / friends) so that I can share different things with different audiences on the same profile.
- As an **Expressive Personalizer on desktop**, I want to freely position and resize blocks on a canvas so that I have precise control over my profile's layout.

### Advanced Customization *(new in v2)*
- As an **Expressive Personalizer**, I want to switch my profile into an advanced editing mode so that I can customize beyond the fixed block menu — down to individual elements.
- As an **advanced editor**, I want every component on my profile — every title, subtitle, image, section, and divider — to be individually selectable so that I can style and arrange each one, not just whole blocks.
- As an **advanced editor**, I want each element to have a stable, human-readable id that becomes visible when I select it (like selecting a layer in Figma) so that I always know which element I'm working on.
- As an **advanced editor**, I want that id to correspond directly to the element in my template so that I can find the same element whether I'm working visually or in the template code.
- As an **advanced editor**, I want to drop in prebuilt modules (a header, a link stack, a photo wall) that expand into editable pieces so that I don't have to assemble everything from scratch.
- As an **advanced editor**, I want an inspectable code view of my profile template alongside the visual editor so that I can make precise edits directly if I want to — but I'm never forced to.
- As a **cautious user**, I want to be able to leave advanced mode and return to the simple block editor so that experimenting with advanced customization is never a one-way trap.
- As any **profile owner**, I want to keep rearranging my main blocks directly from my profile even after I've customized in advanced mode so that everyday tidying doesn't require the advanced editor.

### Guestbook
- As a **profile owner**, I want to choose how my guestbook looks (sticky notes, chat bubbles, letters, etc.) so that it matches the aesthetic of the rest of my profile.
- As a **mutual friend**, I want to post a message in someone's guestbook so that I can leave a personal, visible note on their space.
- As a **guestbook writer**, I want to see a preview of how my message will look in the owner's chosen guestbook style so that I'm not surprised by how it renders.
- As a **profile owner**, I want to delete guestbook entries on my profile so that I can moderate what appears in my space.

### Social Graph & Feed
- As a **Social Connector**, I want to follow anyone with a public profile without needing their approval so that I can start seeing their posts immediately.
- As a **Social Connector**, I want a clear signal when someone follows me back (becoming a mutual friend) so that I understand what new access that unlocks.
- As a **Social Connector**, I want a chronological feed of posts from everyone I follow so that I see content in the order it was posted, not the order an algorithm chose.
- As a **Social Connector**, I want to filter my feed to mutual friends only so that I can have a cozier, more intimate view when I want it.
- As a **user**, I want to post text and images with either public or friends-only visibility so that I can share different things with different audiences.

### Direct Messages
- As a **mutual friend**, I want to send a direct message to another mutual friend so that we can have a private conversation.
- As a **DM recipient**, I want to block or report someone from within a conversation so that I can protect myself without leaving the app.

### Discovery & Featured Section
- As a **Curious Browser**, I want to see a featured section of hand-picked profiles and posts so that I can discover what this platform is about before I've made any connections.
- As the **curator (app owner)**, I want to feature specific profiles or posts from an admin interface so that I can shape what new users discover when they arrive.

### Finding Friends via Contacts
- As a **new user**, I want to find people I already know by syncing my phone contacts so that I can start building my network immediately without searching for people manually.
- As a **user**, I want to see a list of matched contacts who are already on Orbit so that I can choose who to follow without being auto-connected to anyone.
- As a **user**, I want to invite contacts who aren't on Orbit yet via SMS so that I can bring my real-world network onto the platform.
- As a **user**, I want to be clearly told that my contacts are never stored on Orbit's servers so that I can trust the feature with my personal data.
- As a **user who doesn't want to share contacts**, I want to skip contact syncing entirely and find friends another way so that I'm never pressured into granting access I'm not comfortable with.

### Safety & Moderation
- As a **user**, I want to block another user so that they cannot interact with me or view my profile.
- As a **user**, I want to report a post, profile, or guestbook entry so that I can flag harmful content for review.
- As a **user**, I want to report a direct message so that abuse in private conversations is actionable.

### Monetization
- As a **premium user**, I want access to exclusive themes, animated backgrounds, additional guestbook styles, custom fonts, and premium presets so that I can make my profile even more distinctive.
- As a **free user**, I want to use all core social features — posting, following, guestbook, DMs — without paying so that the social graph isn't paywalled.

---

## 8. Feature Requirements

Sections 8.1, 8.2, 8.4–8.11 carry forward from v1 and are unchanged except where the template model touches them (noted inline). Section **8.3 (Customization)** is substantially expanded and is the core of this release.

### 8.1 Authentication & Accounts

**P0 — Must have**
- Email/password sign-up with email verification.
- Login, logout, password reset, and session management.
- Onboarding flow that captures: display name, username, profile photo, public/private toggle, and initial theme selection.
- Account deletion with data removal.

*Acceptance criteria:*
- [ ] A user can sign up, verify their email, and reach their profile in under 3 minutes.
- [ ] Password reset sends a tokenized link that expires after 24 hours.
- [ ] Private/public toggle is presented as an explicit choice during onboarding, not defaulted without user awareness.

**P1 — Nice to have**
- OAuth sign-in (Google, Apple) to reduce friction.
- Username change (with a cooldown period to prevent squatting).

---

### 8.2 Social Graph

**P0 — Must have**
- Asymmetric follow model: any user can follow any public account without approval.
- Private accounts: follow requests must be approved before the relationship is established.
- Mutual friends tier: automatically established when two users follow each other.
- Unfollow without notification to the other party.
- Follow request inbox for private accounts.
- Clear UI signal distinguishing "following," "follower," and "mutual friend" states.

*Acceptance criteria:*
- [ ] Following a public account immediately adds their posts to the follower's feed.
- [ ] When a mutual friendship is created, both users receive a notification.
- [ ] The profile UI clearly distinguishes between followers, following, and mutual friends without requiring the user to read a tooltip to understand the difference.
- [ ] Private account follow requests can be approved or declined individually; declined requests do not notify the requester.

**P1 — Nice to have**
- Suggested follows based on mutual friends (non-algorithmic: "people your friends follow").
- Soft block: remove a follower without blocking them.

---

### 8.3 Profile Customization

Customization is organized into three tiers and two modes.

- **Tier 1 — Themes:** one-tap presets. Available to everyone.
- **Tier 2 — Basic editor (Blocks):** the **default** experience. Rearrange, add, remove, resize, and set visibility on a fixed menu of blocks.
- **Tier 3 — Advanced customization:** opt-in. The profile template language plus an advanced visual editor, exposing the profile as an editable tree of components.

**Modes:** Basic mode = Tiers 1–2. Advanced mode = Tier 3 (which still includes Tiers 1–2 capabilities). A profile carries a `mode` flag; the relationship between the modes is defined in §8.3.7.

#### Tier 1 — Themes

**P0 — Must have**
- At least 8 preset themes at launch: covering light, dark, colorful, and minimal aesthetics.
- One-tap theme application.
- Theme preview before applying.
- Premium theme tier (locked for free users, purchasable).

*Acceptance criteria:*
- [ ] Applying a theme updates colors, fonts, and background across the entire profile in under 1 second.
- [ ] Premium themes are visually distinguishable in the theme picker with a clear lock/upgrade prompt.

Themes are expressed as the template's `theme` (accent, corner radius, font, light/dark, background) and apply identically in Basic and Advanced modes.

#### Tier 2 — Basic Editor (Blocks)

The default editor. Operates on the top level of the profile tree using a fixed vocabulary of block types.

**P0 — Must have** *(desktop; mobile authoring is out of scope for this document)*
- Freeform drag-and-drop block positioning on a canvas; block resizing.
- Add, remove, and reorder blocks.
- Per-block visibility selector: Public / Followers only / Friends only.
- Block types: Bio/About, Photo gallery, Post stream, Friends list, Guestbook, Links, Status/mood.
- Visibility badges on each block (lock icon or color indicator) visible in editor mode.
- Save / discard changes flow.
- **Composite presets** available as insertable starter modules (see §8.3.5).

*Acceptance criteria:*
- [ ] The visibility picker on a block is reachable in 2 clicks or fewer.
- [ ] Friends-only blocks are completely invisible to strangers and followers — not grayed out, not present in the DOM (server-enforced; see §8.3.7 and §13).
- [ ] All blocks reflow gracefully across desktop viewport widths.

**P1 — Nice to have**
- Block duplication.
- Undo/redo in the editor.

#### Tier 3 — Advanced Customization *(the V2 headline feature)*

Advanced customization exposes the profile as an editable **tree of components**, built on Orbit's **profile template language**. It is opt-in, desktop-only, and designed so that a non-coder can use it entirely through a visual editor while a power user can drop into the underlying template text.

The template language is a bracket-tag DSL — `[type attr=value ...] ... [/type]` — that compiles to a plain, serializable tree (`Profile = { theme, blocks[] }`, where each node is `{ id, type, attrs, text?, children[] }`). The tree is the single source of truth; the visual editor and the template text are two views of it. The language can only ever emit known Orbit components — never arbitrary markup or styles.

##### 8.3.1 The profile document model

**P0 — Must have**
- The profile is stored as a **canonical tree of nodes**. Every visual component is a node: layout containers (`row`, `col`, `grid`, `section`), content components, and — critically — the fine-grained pieces such as headings, subtitles, images, and dividers.
- The template text (DSL) is a **serialization** of this tree. Parsing text produces the tree; serializing the tree reproduces text. The visual editor manipulates the tree directly.
- The Basic block editor operates on this **same tree** as a constrained subset (see §8.3.7).

*Acceptance criteria:*
- [ ] Any profile authored in Basic mode has a valid template representation with no user action required.
- [ ] Editing the template text and editing via the visual controls converge on the same tree — a change made one way is reflected the other way.
- [ ] The canonical stored artifact is the tree; the delivered profile is rendered from the tree after server-side filtering (§8.3.7, §13).

##### 8.3.2 Node model: presentational vs. widget nodes

Nodes fall into two internal classes. **This distinction lives in the data model and backend; it is never presented to the user as terminology.** The user only ever *feels* it, through which nodes can be opened up and which cannot.

- **Presentational nodes** — headings, subtitles, text, images, dividers, and layout containers. Fully decomposable, rearrangeable, and styleable. These are what advanced customization is *for*.
- **Widget nodes** — data-bound, rule-bound components: the guestbook, post stream, friends list, and any component driven by live data and enforced behavior (e.g. mutual-only guestbook posting, chronological feed ordering, moderation). These are **sealed leaves**: a user can place, move, resize, theme, and set visibility on them, but cannot open them up or rearrange their internals, because their internals are driven by data and safety rules, not authored content.

**P0 — Must have**
- The node schema tags each node type as presentational or widget.
- Widget nodes are treated as opaque units in both editors: selectable, movable, resizable, themeable, visibility-settable — but not decomposable.
- The editor communicates a widget node's sealed nature with a light-touch cue (e.g. a small lock affordance or "Managed by Orbit" label) and simply does not offer a "decompose/open" action. No taxonomy or jargon is shown.

*Acceptance criteria:*
- [ ] Attempting to drill into a widget node (e.g. a guestbook) offers styling, placement, and visibility controls but no way to edit or reorder its internal, data-driven elements.
- [ ] A widget node displays a clear but unobtrusive indication that its contents are managed, without using internal terms like "widget node."

##### 8.3.3 The advanced editor (visual-first)

Advanced mode is **visual-first**: the primary surface is a canvas + a Layers tree + an Inspector, with a template **code pane** as an inspectable, editable power-user surface alongside them. All surfaces drive the one canonical tree. The user is never required to write template text.

**P0 — Must have**
- **Canvas:** a live rendering of the profile where any element can be clicked to select it.
- **Layers panel:** a tree view of every node (indented by nesting), mirroring the canvas. Supports selecting, reordering, and reparenting nodes (drag-and-drop).
- **Inspector:** context panel for the selected node — its id, its editable attributes, its text, its visibility, and its bounded style options.
- **Code pane:** a live, editable view of the template text. Edits here update the tree (and therefore the canvas and Layers) and vice versa. This is a power-user surface, not the required entry point.
- **Theme controls:** accent, corner radius, typeface, light/dark, background (Tier 1) available in the Inspector.
- Save / discard flow, distinct from live viewing.

*Acceptance criteria:*
- [ ] A user can perform a complete advanced customization (add nodes, decompose a preset, restyle and rename elements, set visibility) without ever typing template text.
- [ ] Selecting a node in the canvas highlights it in the Layers panel and the code pane, and vice versa (see §8.3.4).
- [ ] An edit in the code pane is reflected in the canvas and Layers within one render cycle, and an invalid/incomplete template never crashes the editor (the parser is tolerant and always yields a valid tree).

##### 8.3.4 Selection & the id system

Every component is selectable and carries a **named, stable, human-readable id** that becomes the element's rendered HTML `id` and is surfaced in the editor when the element is selected — the Figma-layer pattern the owner asked for.

**P0 — Must have**
- **Named ids:** ids are authored in the template (e.g. `[section title=About id=about]`) and are **stable** across edits and reordering. They are *not* positional/auto-incrementing sequence ids.
- **Readable fallback:** when a user hasn't named a node, the system derives a readable id from its type and context (e.g. `section-about`, `heading-1`) — never an opaque `b7`.
- **Uniqueness:** ids are unique within a profile; the editor validates and disambiguates on entry (rules are an open item — §10).
- **Surface on selection:** selecting any element displays its id prominently (above/adjacent to the selection), matching the "click a layer, see its id" interaction.
- **Bidirectional selection:** selection is synchronized across canvas ↔ Layers ↔ code pane. Placing the caret in the template text selects the corresponding node; selecting a node scrolls/positions the code pane to it.
- **Rendered id:** the node's id is emitted as the HTML `id` on its root element in the delivered profile, so the visible id corresponds directly to the element in both the template and the live page.

*Acceptance criteria:*
- [ ] Selecting a component in the canvas shows its id, and the same id appears on that node in the Layers panel and at the corresponding location in the code pane.
- [ ] Renaming a node's id updates all three surfaces and the rendered HTML `id`.
- [ ] Reordering or inserting nodes does not change any existing node's id.
- [ ] A friends-only (or otherwise restricted) node's id does **not** appear in the DOM delivered to a viewer not permitted to see it (§8.3.7).

##### 8.3.5 Composite presets

Presets are prebuilt modules — a Header, a Link stack, a Photo wall, a titled Section — that let users start from a module instead of assembling primitives. They behave like Figma components in that they are larger modules composed of smaller building blocks, **with one deliberate difference: they are inserted as detached snippets, not live-linked instances.**

**P0 — Must have**
- A library of composite presets, each of which **expands on insertion into its underlying tree of editable nodes** and immediately **detaches** — there is no live link back to a master.
- Presets are available in both Basic and Advanced modes; in Basic mode they behave as a single block, in Advanced mode they can be opened and their inner nodes edited.
- Free vs. premium presets, with premium presets gated (§8.10, enforced per §8.3.8).

*Acceptance criteria:*
- [ ] Inserting a preset produces editable nodes with readable ids; editing them never affects any other preset instance (they are detached).
- [ ] Premium presets are visibly labeled and gated with a clear upgrade prompt.

**P1 / Future**
- Linked components (master/instance with propagating edits and overrides) — deferred; low value while each user has a single profile (§5).
- User-saved custom presets; shared/community preset library.

##### 8.3.6 Containment schema *(defined requirement, rules unresolved — see §10 follow-up)*

Because every component is now a free node, the implicit guarantees that composite blocks used to provide (e.g. "a header always has a name," "there is exactly one profile header") are gone. The tree can otherwise express invalid or nonsensical structures — a heading floating outside any container, a subtitle dropped inside a photo grid, two profile headers, a stat with no value.

**P0 — Must have**
- A **containment schema** governs the tree: which node types may nest inside which (containment rules), which fields are required per type, and cardinality constraints (e.g. at most one profile header).
- The editor prevents or gracefully corrects invalid structures at authoring time; the server validates the tree on save and rejects/repairs invalid trees rather than persisting them.
- The current coarse container/content split is insufficient and must be replaced by this richer schema.

*This is a defined V2 requirement whose specific rules are an open follow-up (§10, Q4). The feature is not complete without it, but the exact ruleset needs a dedicated design pass.*

##### 8.3.7 Editing modes & convertibility

The governing insight: **blocks are a strict subset of the template tree.** The Basic block editor and the template produce and consume the same tree; Basic simply understands a smaller vocabulary. Therefore:

- **Basic → Advanced is lossless.** Entering advanced mode reveals and expands the tree that already exists. It is free and available at any time.
- **Advanced → Basic is lossy** — the block GUI cannot represent a deeply nested, decomposed, per-node-styled tree. This direction is handled by an explicit, destructive reset, never silently.

**P0 — Must have**
- **Opt-in, per profile:** a profile has a `mode` flag (`basic` | `advanced`). Basic is the default.
- **Enter Advanced:** available anytime; lossless; sets `mode = advanced`.
- **Top-level arrangement stays live in both modes:** even on an advanced profile, the owner can rearrange, reorder, show/hide, and set visibility on **top-level blocks** directly from the profile — because that operates on the top of the tree, which both editors understand. Blocks the user has hand-customized in advanced mode appear in the Basic surface as a single opaque "custom" unit: movable and visibility-settable, but not openable in the Basic editor.
- **Reset to basic layout:** the only path from Advanced back to Basic internals. It is an explicit, clearly-warned, destructive action that re-collapses the profile to the nearest block representation and discards node-level custom work. Nothing else reverts advanced work.

*Acceptance criteria:*
- [ ] A user can enter advanced mode from any basic profile with no loss of layout or content.
- [ ] On an advanced profile, the owner can still reorder and set visibility on top-level blocks without opening the advanced editor.
- [ ] A hand-customized block appears in the Basic editor as a single movable unit that cannot be opened there.
- [ ] "Reset to basic layout" shows a clear warning describing exactly what will be lost, requires confirmation, and only then discards node-level customization.

##### 8.3.8 Visibility & premium enforcement in the template

Because the template is user-authored, two of Orbit's guarantees cannot be enforced in the client and must be enforced on the **server**, which parses the tree, applies access and entitlement rules, and only then renders and delivers HTML.

**P0 — Must have**
- **Per-node visibility:** every node supports a visibility setting (public / followers / friends), authored via a `vis` attribute in the template and via the Inspector in the editor.
- **Server-enforced visibility:** friends-only and followers-only nodes (and their ids and content) are **stripped from the tree server-side** for viewers not permitted to see them — never present in the delivered DOM, never merely CSS-hidden. Restricted content remains reportable despite limited visibility.
- **Premium enforcement:** premium cosmetics (custom fonts, animations, premium presets/themes) carry an entitlement flag. Because a free user could hand-author premium attributes in the template, the server **strips or gracefully downgrades** premium cosmetics for non-subscribers before rendering — mirroring the graceful-degradation behavior in §8.10. Hand-writing a premium attribute never unlocks it.

*Acceptance criteria:*
- [ ] A friends-only node is absent from the HTML delivered to a stranger or follower, including its id and text, in every surface (profile, search, share preview).
- [ ] A free user who authors a premium font/animation/preset in the template sees it downgraded to the nearest free equivalent on the delivered profile, with no broken layout.
- [ ] Visibility and entitlement enforcement occur server-side regardless of whether the profile was authored in Basic or Advanced mode.

##### 8.3.9 Security & sanitization

Reframing Tier 3 from raw HTML/CSS to a constrained, component-only template language removes the bulk of the classic customization threat surface — a user cannot inject scripts, arbitrary CSS, or app-chrome-breaking markup, because the language only emits known Orbit components. The residual surface is attribute values and text, which are handled explicitly.

**P0 — Must have**
- **Component allowlist:** the renderer only instantiates registered node types; unknown types render as an inert empty state, never as raw markup.
- **Attribute allowlist & validation:** each node type accepts a defined set of attributes with typed validation. URL-bearing attributes (`src`, `url`) are validated and scheme-restricted (e.g. no `javascript:`), checked for SSRF/abuse, and safe-rendered. Color/dimension attributes (accent, background, radius) are format-validated before being injected as inline style variables.
- **Text escaping:** all user text is escaped/sanitized on render; no user text can introduce active content.
- **Server as the parser and renderer of record:** the server parses the template, validates against the containment schema (§8.3.6), enforces visibility and entitlements (§8.3.8), sanitizes, and renders. The client editor's parsing is a convenience, never the security boundary.
- **Sandboxed iframe rendering:** profiles continue to render inside sandboxed iframes (carried from v1), isolating profile content from the app chrome as defense in depth.

*Acceptance criteria:*
- [ ] A template containing an unknown tag, a `javascript:` URL, or a malformed color renders safely (inert fallback / rejected value) and never emits active or malformed content.
- [ ] Server-side sanitization runs on every save and every render, independent of client validation.
- [ ] No user-authored template can alter or script the surrounding Orbit application chrome.

---

### 8.4 Guestbook

*Unchanged from v1. In the template model, the guestbook is a **widget node** (§8.3.2): placeable, themeable, and visibility-settable, but not decomposable.*

**P0 — Must have**
- Guestbook block with at least 3 visual themes at launch (recommended: sticky notes, chat bubbles, handwritten letters).
- Only mutual friends can post to a guestbook.
- Character limit per entry: 300–500 characters (exact value to be validated in design).
- Live preview for the entry composer showing how the message will render in the owner's chosen theme.
- Profile owner can delete any entry on their guestbook.
- Entries are paginated ("load more") with the count configurable by the owner.

*Acceptance criteria:*
- [ ] A user cannot post to a guestbook unless they are a mutual friend of the owner.
- [ ] The entry composer shows a live visual preview in the owner's active guestbook theme.
- [ ] Entries exceeding the character limit cannot be submitted — not truncated silently.
- [ ] Deleted entries are removed immediately from the owner's view and within 60 seconds for all other viewers.

**P1 — Nice to have**
- Owner can pin a specific entry to the top.
- Owner can reply to entries (publicly or privately).
- Additional guestbook themes as premium cosmetic upgrades.

---

### 8.5 Feed

*Unchanged from v1.*

**P0 — Must have**
- Chronological following feed: posts from all followed accounts, newest first.
- Friends filter: toggle to show only posts from mutual friends.
- Friends-only post type: posts that only appear to mutual friends.
- Infinite scroll (non-algorithmic — purely time-ordered pagination).
- "You're all caught up" end-of-feed state.

*Acceptance criteria:*
- [ ] Feed posts appear in strict reverse-chronological order with no ranking applied.
- [ ] Friends filter shows exclusively mutual friend posts — no following-only posts bleed through.
- [ ] Friends-only posts do not appear in any feed view for non-mutual-friends, including in search or profile visits.

**P1 — Nice to have**
- "Unread since last visit" marker.
- Per-person mute (hide their posts from feed without unfollowing).

---

### 8.6 Posts

*Unchanged from v1.*

**P0 — Must have**
- Text posts (max length TBD — see open questions).
- Image posts (single image; multi-image gallery TBD).
- Post visibility: public or friends-only (set at post time, changeable after).
- Post deletion and reporting.

*Acceptance criteria:*
- [ ] A post marked friends-only is not visible to strangers or followers in any surface (feed, profile, search).
- [ ] Post visibility can be changed after publishing without deleting and re-creating the post.
- [ ] Image uploads are validated for file type (jpg, png, gif, webp) and size (max TBD) on the server side, not just client side.

**P1 — Nice to have**
- Post editing with an edit history visible to viewers.
- Comments on posts (threading model TBD — see open questions).
- Reactions (lightweight, non-metric — no public like counts).

---

### 8.7 Direct Messages

*Unchanged from v1.*

**P0 — Must have**
- DMs restricted to mutual friends only.
- Text messages and image sharing.
- Block and report from within a conversation.
- Read receipts (optional — needs design decision).
- Message deletion (sender can delete for both parties within a time window).

*Acceptance criteria:*
- [ ] A DM conversation cannot be initiated unless both users are mutual friends.
- [ ] Blocking a user from DMs also removes them from the DM thread list.
- [ ] Reported DM content is flagged for admin review without notifying the reported user.

**P1 — Nice to have**
- Message requests from non-friends (with explicit opt-in by the recipient).
- Typing indicators; reactions to individual messages.

---

### 8.8 Featured Section

*Unchanged from v1.*

**P0 — Must have**
- Featured section displayed prominently on the home/discovery page.
- Admin interface for the curator to add/remove featured profiles and posts.
- Featured content clearly labeled as curator-selected (not paid placement).
- Featured profiles are linkable and followable directly from the featured section.

*Acceptance criteria:*
- [ ] A new featured item is visible to all users within 5 minutes of the curator publishing it.
- [ ] The featured section is the first thing a logged-out visitor sees when landing on the app.
- [ ] Featured content is visually distinguished from organic feed content.

**P1 — Nice to have**
- Multiple featured slots with different formats (profile spotlight, post of the week, etc.).
- Curator notes or editorial context displayed alongside featured content.

---

### 8.9 Moderation & Trust & Safety

*Unchanged from v1.*

**P0 — Must have**
- User blocking: blocked users cannot view your profile, follow you, or contact you.
- Content reporting: posts, profiles, guestbook entries, DMs all reportable.
- Admin review queue for reported content.
- Account suspension and permanent ban capability; content removal by admin.

*Acceptance criteria:*
- [ ] Blocking a user takes effect immediately — their follow relationship is severed and they cannot re-follow.
- [ ] All user-generated content surfaces (posts, guestbook, DMs) have a report action reachable in 2 taps or fewer.
- [ ] Suspended accounts see a clear, non-alarming message explaining their status.

**P1 — Nice to have**
- Keyword filters for guestbooks.
- Automated NSFW image detection (third-party API).
- Appeal flow for suspended accounts.

---

### 8.10 Monetization (Freemium)

*Carried from v1; extended so that entitlement is enforced against user-authored templates (§8.3.8).*

**P0 — Must have**
- Free tier: full access to all social features, Tier 1 default themes, Tier 2 block editor, Tier 3 advanced editor with free presets and free cosmetics, 3 default guestbook themes.
- Premium tier: exclusive themes, animated backgrounds, additional guestbook styles, custom font options, premium presets, profile badge.
- Payment flow (Stripe or equivalent).
- Subscription management: upgrade, downgrade, cancel.
- If a premium user cancels, they retain their settings but premium-only cosmetics revert gracefully (no broken layouts — fall back to the nearest free equivalent). **This reversion is enforced server-side against the profile tree, so it applies equally to cosmetics authored in the advanced template.**

*Acceptance criteria:*
- [ ] All core social features (posting, following, guestbook, DMs) work without a paid subscription.
- [ ] Advanced customization itself is available to free users; only specific premium cosmetics (custom fonts, animations, premium presets/themes) are gated.
- [ ] Cancellation reverts premium cosmetics within 24 hours of the billing period ending, with no data loss and no broken layout — including cosmetics authored via the template.
- [ ] Hand-authoring a premium attribute in the template does not unlock it for a non-subscriber.

**P2 — Future consideration**
- One-time cosmetic purchases (individual themes/presets rather than a subscription).
- Gift subscriptions.

---

### 8.11 Finding Friends via Contacts

*Unchanged from v1. Full spec (on-device hashing, no server-side contact storage, explicit skip, native SMS invites, re-sync, privacy disclosure) carries forward as written in v1 §7.3 and its acceptance criteria and privacy/legal notes.*

---

## 9. Success Metrics

### Leading indicators (evaluate at 2 and 4 weeks post-launch)

| Metric | Target | Measurement |
|---|---|---|
| Time to first profile personalization | < 10 min median | Timestamp from signup to first theme or block save |
| Day-7 retention | ≥ 40% | % of week-1 signups who return in week 2 |
| Follows per new user (first 7 days) | ≥ 5 | Average follows initiated per new account |
| Guestbook entries per active user (monthly) | ≥ 2 | Total entries / MAU |
| Featured section click-through rate | ≥ 15% | Featured item clicks / featured section impressions |
| Contact sync adoption rate | ≥ 40% of new users | % of signups who complete contact sync (opt-in only) |
| **Advanced mode adoption** | **≥ 10% of active users try it in first 30 days** | % of MAU who enter advanced mode at least once |
| **Preset usage** | **≥ 60% of advanced sessions insert a preset** | Advanced sessions using ≥1 preset / all advanced sessions |

### Lagging indicators (evaluate at 30, 60, 90 days)

| Metric | Target | Measurement |
|---|---|---|
| Day-30 retention | ≥ 30% | % of signup cohort active on day 30 |
| Mutual friend formation rate | ≥ 60% of follows result in mutual | Mutual friendships / total follows (30-day window) |
| Premium conversion rate | ≥ 5% of MAU | Paid subscribers / monthly active users |
| **Advanced-mode → premium conversion lift** | **Advanced-mode users convert at ≥ 2× baseline** | Premium conversion among advanced-mode users vs. all users |
| **Advanced → basic reset rate** | **< 15% of advanced profiles reset** | Profiles that hit "Reset to basic" / profiles that entered advanced (high rate signals a broken advanced experience) |
| Reported content rate | < 0.5% of posts | Reports / total posts (flag if higher) |
| NPS | ≥ 40 | In-app survey, 60+ days post-signup cohort |

---

## 10. Open Questions

| # | Question | Owner | Blocking? |
|---|---|---|---|
| 1 | **Advanced-mode entry model — visual vs. code.** Confirmed direction: visual-first, with the code pane as a power-user surface. Remaining: how much editing does the v1 code pane allow — full free-text DSL, or a structured/constrained editor? | Product + Design | No — but scopes the advanced editor build |
| 2 | **Per-node styling scope.** How much can an individual node override — visibility and content only, or also bounded style (its own accent, font, spacing)? Where is the line between "expressive" and "inconsistent/unsafe"? | Design + Eng | Yes — shapes the Inspector and the schema |
| 3 | **Id namespace rules.** Allowed characters, max length, reserved ids, and collision/disambiguation behavior on rename and on preset insertion. | Eng + Design | Yes — blocks the id/selection build |
| 4 | **Containment schema (follow-up from §8.3.6).** The concrete ruleset: which node types nest in which, required fields per type, cardinality (e.g. one header), and how the editor/server prevent or repair invalid trees. Needs a dedicated design pass. | Eng + Design | Yes — blocks the node-tree build |
| 5 | **Template text persistence.** Is the stored artifact only the canonical tree (regenerating text, normalizing formatting), or is the raw DSL text also persisted to preserve hand-authored formatting? | Eng | No — can decide in the advanced sprint |
| 6 | **Mobile rendering of advanced profiles.** Mobile authoring is out of scope, but advanced profiles must still render for mobile viewers. How does an arbitrarily-nested desktop tree collapse to mobile? (Deferred here; must be resolved before advanced profiles are broadly shareable.) | Design + Eng | No for this doc — flagged for the release that adds mobile |
| 7 | **Preset library scope.** Which composite presets ship at launch, and which are premium? | Product + Design | No — finalize in the preset design sprint |
| 8 | **Post length limit.** Max character count for a text post (short vs. long-form). Carried from v1. | Design + Product | Yes — blocks feed/post design |
| 9 | **Comment model.** Do posts have comments; flat or threaded; can strangers comment on public posts? Carried from v1. | Product | Yes — blocks post spec |
| 10 | **App name.** "Orbit" is the working title; needs a trademark check before any public materials. Carried from v1. | Product | No — but before any public materials |

---

## 11. Risks & Mitigations

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| **Advanced editor scope creep (the no-code trap)** | High | High | Anchor on "blocks are a subset of the tree." Basic→Advanced is lossless; Advanced→Basic is an explicit destructive reset, **not** a lossless round-trip. No linked components in v1. Treat the advanced editor as a bounded feature, not an open-ended design tool. |
| **Non-coder alienation** | High | Medium | Visual-first advanced editor; code pane is optional and secondary. Composite presets so users start from modules, not primitives. Basic mode stays the default and stays complete. |
| **Security of user-authored templates (XSS/CSS injection, SSRF, phishing URLs)** | Critical | Medium | Component-only DSL (no raw HTML/CSS) removes most of the surface. Attribute allowlists + typed validation, URL scheme restriction, text escaping, server as parser/renderer of record, sandboxed iframes as defense in depth (§8.3.9). |
| **Visibility leakage via the template** | Critical | Medium | Server-side node stripping for restricted content — friends-only nodes never reach an unauthorized viewer's DOM, ids included. Independent of authoring mode (§8.3.8). |
| **Premium leakage via hand-authored templates** | Medium | High | Server-side entitlement enforcement strips/downgrades premium cosmetics for non-subscribers before render; hand-writing a premium attribute never unlocks it (§8.3.8, §8.10). |
| **Invalid / nonsensical trees from free-node editing** | Medium | High | Containment schema + authoring-time prevention + server-side validation on save (§8.3.6). |
| **Cold start / empty network** | High | High | Asymmetric follow model; featured section provides day-one content; prioritize frequent featured updates in early weeks. Advanced-mode profiles are strong shareable acquisition assets. |
| **Moderation cost** | High | High | Guestbook and DMs are friends-only, reducing exposure. Build reporting and an admin review queue before launch. Restricted template content remains reportable. |
| **Featured section going stale** | High | Medium | Build a content-calendar habit from day one; a stale featured section kills the discovery loop. |
| **Business model viability** | High | Medium | Freemium cosmetics validated by Roblox, Discord Nitro, Tumblr. Advanced customization is an additional conversion lever. Set a 90-day checkpoint to evaluate the 5% target and the advanced→premium lift. |
| **Contact sync privacy mishandling** | High | Low | On-device hashing is non-negotiable; raw contacts never leave the device; document the data flow; legal review before shipping (carried from v1). |

---

## 12. Timeline Considerations

### Hard constraints
- No hard deadlines established. This document assumes v1 is delivered (or being delivered per the v1 phasing) and v2 builds on it.

### Dependency on v1
Advanced customization is only coherent once the profile is modeled as a tree and rendered from a canonical document (the foundation the v1 architecture notes required — sandboxed iframes, server-side visibility enforcement, a serializable block model). Those must be in place before Tier 3 work begins.

### Suggested phasing for the V2 feature

**Phase A — Model & schema foundation**
- Canonical node tree formalized (presentational vs. widget classes).
- Containment schema designed and enforced (server + editor) — resolves §10 Q4.
- Named-id system with stable ids and readable fallbacks — resolves §10 Q3.
- Server-side parse → validate → visibility-strip → entitlement-downgrade → sanitize → render pipeline.

**Phase B — Advanced editor**
- Visual-first advanced editor: canvas + Layers + Inspector + code pane, all driving one tree.
- Bidirectional selection and the id chip.
- Per-node visibility in the editor; per-node styling scope per §10 Q2.

**Phase C — Presets & mode model**
- Composite presets (detached snippets), free + premium.
- Mode flag, Basic↔Advanced convertibility, top-level arrangement in both modes, "Reset to basic layout."
- Premium enforcement end-to-end (including the cancellation-reversion path).

**Beta gate**
- Do not expose advanced mode broadly until: server-side visibility/entitlement enforcement is verified against hand-authored templates; the containment schema rejects invalid trees; and the reset path is tested for data safety.

### Key dependency
The containment schema (§8.3.6 / §10 Q4) and the id namespace rules (§10 Q3) both block the node-tree build and should be resolved first, in Phase A.

---

## 13. Appendix: Architecture Notes

These are constraints the architecture should respect from day one to avoid expensive rework. Notes carried from v1 are marked *(v1)*; the rest are new for the template model.

- **Sandboxed iframe rendering** *(v1)* — every profile renders inside a sandboxed iframe, isolating user-authored content from the app chrome regardless of customization tier. Do not defer.
- **Canonical tree, text as a serialization** — the profile document is a plain, serializable **tree of nodes** (`{ theme, blocks[] }`, each node `{ id, type, attrs, text?, children[] }`). The bracket-tag template text and the visual editor are two views that produce/consume this one tree. The tree — not the text — is the source of truth.
- **Basic is a subset of the tree** — the block editor and the template operate on the same tree; Basic understands a smaller vocabulary. This is what makes Basic→Advanced lossless and Advanced→Basic a deliberate, destructive reset.
- **Named, stable ids** — node ids are human-readable and authored (with readable derived fallbacks), stable across reordering/insertion, unique within a profile, and emitted as the rendered HTML `id`. Ids are **not** positional/auto-incrementing. The editor keeps selection synchronized across canvas, Layers, and the template text by mapping between node ids and their spans in the source.
- **Presentational vs. widget node classes** — the node schema distinguishes decomposable presentational nodes from sealed, data-bound widget nodes (guestbook, posts, friends). Widget internals are never user-rearrangeable. This distinction is a backend/model concern and is never surfaced to users as terminology — only as a "can't be opened" behavior with a light UI cue.
- **Containment schema** — a schema governs legal nesting, required fields, and cardinality. The current coarse container/content split is insufficient. The server validates trees on save; the editor prevents invalid structures at authoring time.
- **Server is the parser and enforcer of record** — the server parses the template, validates against the containment schema, **strips restricted nodes for the viewer's access level**, **downgrades premium cosmetics for non-subscribers**, sanitizes attributes/text, and renders. Client-side parsing is a convenience, never the security or entitlement boundary.
- **Block visibility enforcement server-side** *(v1, extended)* — friends-only nodes must not be present in the HTML/DOM delivered to unauthorized viewers — not merely CSS-hidden — including their ids and text. Visibility is a data-access concern, not a display concern, and now applies at node granularity.
- **Freemium flag on cosmetics** *(v1, extended)* — every premium cosmetic (theme, guestbook style, font, animation, preset) carries an entitlement flag. On lapse, cosmetics revert by checking the flag, not by deleting user data — enforced against the profile tree so it applies to template-authored cosmetics too.
- **Presets are detached snippets** — inserting a preset expands it into editable nodes and detaches; there is no master/instance link in v1.
- **Desktop layout as source of truth** *(v1)* — the tree stores one layout (the desktop arrangement); mobile is a derived, responsive interpretation. Mobile authoring is out of scope for v2, but the single-source-of-truth constraint is preserved for the eventual mobile rendering work (§10 Q6).
- **Contact sync — no server-side storage of contact data** *(v1)* — hashed phone numbers computed on-device, sent for a single match query, and immediately discarded; the server stores only the user's own hashed number. Must be auditable.

---

*Document owner: Ailany*
*Next suggested action: Resolve §10 Q3 (id namespace) and Q4 (containment schema) — both block the Phase A node-tree foundation. Q2 (per-node styling scope) shapes the editor and should follow closely.*
