# Product Requirements Document — Orbit
### Social Network v1.0
*Status: Draft · Version: 1.0 · Last updated: 2026-05-22 · Owner: Ailany*

---

## Table of Contents
1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals](#3-goals)
4. [Non-Goals](#4-non-goals)
5. [User Personas](#5-user-personas)
6. [User Stories](#6-user-stories)
7. [Feature Requirements](#7-feature-requirements)
8. [Success Metrics](#8-success-metrics)
9. [Open Questions](#9-open-questions)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Timeline Considerations](#11-timeline-considerations)
12. [Appendix: Architecture Notes](#12-appendix-architecture-notes)

---

## 1. Overview

**Product name:** Orbit *(working title)*
**One-line pitch:** A fun, light-hearted social network built around deep profile customization and a chronological, algorithm-free feed.

Orbit is a social network that prioritizes genuine connection and self-expression over engagement metrics. Inspired by the early MySpace era — where your profile was a personal space, not a performance — Orbit gives users meaningful control over how they present themselves online, without the dopamine-loop mechanics that define modern social platforms.

The business model is freemium: the core product is free. Premium cosmetic upgrades (exclusive themes, animated elements, custom fonts, additional guestbook styles) are the sole revenue mechanism. There are no ads, no sponsored posts, and no algorithmic ranking. Ever.

---

## 2. Problem Statement

Modern social networks have optimized so aggressively for engagement and retention that they've become anxiety-inducing, manipulative, and exhausting for the people who use them. Algorithmic feeds, engagement metrics, and attention-capture mechanics have replaced genuine connection as the core product value. Users — particularly younger ones who never experienced the earlier, more expressive web — have no mainstream alternative that prioritizes self-expression and friendship over reach and virality.

The cost of not solving this: a growing segment of users is disengaging from social media entirely rather than finding a better one. That is an addressable market.

---

## 3. Goals

### User goals
1. **A new user can build a profile that feels genuinely personal within 10 minutes of signing up** — without writing a single line of code.
2. **A user with no existing followers sees meaningful content on day one** via the curated featured section, and has a clear path to their first follow connection.
3. **A user can control exactly who sees what on their profile** — per block, not just per account — without needing to understand the full permission model upfront.

### Business goals
4. **Achieve a 30% day-30 retention rate in the first cohort of users** — the baseline signal that people are coming back, not just signing up.
5. **Validate the freemium model: target 5% of active users converting to a paid cosmetic upgrade within 90 days of launch.**

---

## 4. Non-Goals

The following are explicitly out of scope for v1. Each is a deliberate deferral, not a permanent exclusion.

| Non-Goal | Rationale |
|---|---|
| **Algorithmic feed ranking** | Fundamentally at odds with the product's identity. Not deferred — this is a permanent non-goal. |
| **Tier 3 code editing (HTML/CSS)** | Highest security risk, worst mobile story, most QA surface. Defer until the platform is hardened and demand is validated. |
| **Music / audio player block** | Music licensing is a legal and financial minefield. Unresolved. Defer until a clear model exists. |
| **Video posts** | Storage cost, encoding complexity, and moderation surface are all disproportionate to v1 value. |
| **Creator monetization or tipping** | Not the platform's identity at launch. Revisit if user behavior signals demand. |
| **Top Friends widget** | Strong nostalgia value but not essential for proving the concept. Easy to add in v1.1. |
| **Curation team / additional curator roles** | The featured section is owner-curated at launch. Role-based expansion is architected for but not built. |

---

## 5. User Personas

### The Expressive Personalizer
*"I want my profile to look like me, not like everyone else's."*
- Age 18–28, heavy social media user but increasingly burned out by mainstream platforms.
- Cares deeply about aesthetic and self-presentation.
- Has opinions about fonts. Has very strong opinions about fonts.
- Not necessarily a coder, but willing to tinker if the tools are approachable.
- Primary driver for the customization system and the freemium upsell.

### The Social Connector
*"I just want a place to hang out with my actual friends."*
- Age 20–35, uses social media primarily to stay connected, not to broadcast.
- Finds follower counts and likes anxiety-inducing and would happily live without them.
- Values the guestbook, DMs, and friends-only posts more than the public feed.
- Will follow the Expressive Personalizer's link when featured and stick around for the community.

### The Curious Browser
*"I saw this profile linked somewhere and it looked really cool."*
- No account yet, may or may not convert.
- Arrives via a shared profile link or the featured section.
- The experience of *viewing* a profile as a stranger is their first impression of the platform.
- Great profile aesthetics are the acquisition mechanism for this persona.

---

## 6. User Stories

### Onboarding & Identity

- As a **new user**, I want to choose whether my profile is public or private during sign-up so that I have control over my visibility from day one.
- As a **new user**, I want to apply a theme to my profile in one tap so that my space looks personal before I've written anything.
- As a **new user with no friends yet**, I want to see curated featured profiles and posts so that the app doesn't feel empty on day one.

### Profile & Customization

- As an **Expressive Personalizer**, I want to rearrange my profile blocks by dragging them so that my layout reflects my personality, not a default template.
- As an **Expressive Personalizer**, I want to set each block's visibility independently (public / followers / friends) so that I can share different things with different audiences on the same profile.
- As an **Expressive Personalizer on mobile**, I want to reorder my blocks and edit their content from my phone so that I don't need a desktop to maintain my profile.
- As an **Expressive Personalizer on desktop**, I want to freely position and resize blocks on a 2D canvas so that I have precise control over my profile's layout.
- As a **profile visitor**, I want to see a beautifully rendered profile on my phone even if it was customized on desktop so that the experience isn't broken by the device I'm using.

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
- As a **user**, I want to re-sync my contacts from settings at any time so that I can find friends who joined after I did.
- As a **user**, I want to be clearly told that my contacts are never stored on Orbit's servers so that I can trust the feature with my personal data.
- As a **user who doesn't want to share contacts**, I want to skip contact syncing entirely and find friends another way so that I'm never pressured into granting access I'm not comfortable with.

### Safety & Moderation

- As a **user**, I want to block another user so that they cannot interact with me or view my profile.
- As a **user**, I want to report a post, profile, or guestbook entry so that I can flag harmful content for review.
- As a **user**, I want to report a direct message so that abuse in private conversations is actionable.

### Monetization

- As a **premium user**, I want access to exclusive themes, animated backgrounds, and additional guestbook styles so that I can make my profile even more distinctive.
- As a **free user**, I want to use all core social features — posting, following, guestbook, DMs — without paying so that the social graph isn't paywalled.

---

## 7. Feature Requirements

### 7.1 Authentication & Accounts

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

### 7.2 Social Graph

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

### 7.3 Finding Friends via Contacts

**P0 — Must have**
- Contact sync permission request with a plain-language explanation of what data is used and how before the OS permission dialog appears.
- Explicit skip option — contact sync is never mandatory.
- On-device phone number hashing before any data leaves the device. Raw contact data is never transmitted to Orbit servers.
- Server-side match against hashed phone numbers registered on Orbit accounts. Hashes are discarded immediately after matching — not stored.
- Results presented as a manually selectable list: user taps who they want to follow. No auto-following.
- Unmatched contacts can be invited via the user's native SMS app (pre-filled message, sent by the user — Orbit does not send SMS programmatically).
- Re-sync available from Settings at any time.
- Clear disclosure in the UI: "Your contacts are hashed on your device and never stored by Orbit."

*Acceptance criteria:*
- [ ] The contact permission explanation screen appears before the OS permission dialog, not after.
- [ ] Skipping contact sync at any point does not affect any other feature or onboarding step.
- [ ] No raw contact names, numbers, or emails are transmitted to or stored on Orbit servers at any point.
- [ ] The match results list shows Orbit display name and profile photo only — no contact metadata (e.g. the contact's saved name in the user's phone) is surfaced.
- [ ] A user can follow zero, some, or all matched contacts from the results list. There is no "follow all" default.
- [ ] The SMS invite opens the device's native Messages app with a pre-filled invite text. Orbit does not send the message.
- [ ] Re-syncing from settings runs the same hashing and matching flow and shows newly joined contacts since the last sync.
- [ ] If the user denies the OS contact permission, the app gracefully explains how to re-enable it in device settings without blocking progress.

**P1 — Nice to have**
- "New on Orbit" notification when a contact joins after the user's last sync (requires re-consent framing — notify only if user opts in).
- Ability to dismiss individual suggested contacts so they don't reappear on future syncs.

**⚠️ Privacy & legal notes**
- Contact data handling must comply with GDPR, CCPA, and App Store / Play Store privacy guidelines. Document the data flow explicitly in your privacy policy before launch.
- Apple's App Store guidelines require that contact access be used only for features the user would reasonably expect. The matching and invite flows described here are compliant; any expansion (e.g. using contacts for ad targeting) would not be.
- The SMS invite flow must use the native share sheet or Messages app — programmatic SMS from your backend requires carrier agreements and exposes you to TCPA liability in the US.

---

#### Tier 1 — Themes

**P0 — Must have**
- At least 8 preset themes at launch: covering light, dark, colorful, and minimal aesthetics.
- One-tap theme application.
- Theme preview before applying.
- Premium theme tier (locked for free users, purchasable).

*Acceptance criteria:*
- [ ] Applying a theme updates colors, fonts, and background across the entire profile in under 1 second.
- [ ] Premium themes are visually distinguishable in the theme picker with a clear lock/upgrade prompt.

#### Tier 2 — Block / Widget Editor

**P0 — Must have**

*Desktop editor:*
- Freeform drag-and-drop block positioning on a 2D canvas.
- Block resizing.
- Per-block visibility selector: Public / Followers only / Friends only.
- Add, remove, and reorder blocks.
- Save / discard changes flow.

*Mobile editor:*
- Vertical stack reordering (drag up/down).
- Per-block visibility toggle.
- Block content editing (text, images, links).
- Theme switching.
- Clear in-app messaging that freeform layout requires desktop.

*Both editors:*
- Block types: Bio/About, Photo gallery, Post stream, Friends list, Guestbook, Links, Status/mood.
- "Mobile preview" button in the desktop editor showing how the layout will collapse.
- Visibility badges on each block (lock icon or color indicator) visible in editor mode.

*Acceptance criteria:*
- [ ] A user can reorder blocks on mobile in under 30 seconds without a tutorial.
- [ ] The visibility picker on a block is reachable in 2 taps or fewer.
- [ ] Desktop layout collapses to mobile using left-to-right, top-to-bottom ordering — documented in the UI.
- [ ] Friends-only blocks are completely invisible to strangers and followers — not grayed out, not present in the DOM.
- [ ] All blocks reflow gracefully at viewport widths from 320px to 1920px.

**P1 — Nice to have**
- Block duplication.
- Block templates (pre-filled starter layouts for common profile types).
- Undo/redo in the editor.

#### Tier 3 — Code Editing

**Deferred to v2.** Not in scope for v1. Architecture should not preclude it — profiles must be rendered in sandboxed iframes from day one so Tier 3 can be introduced without a rendering rearchitecture.

---

### 7.4 Guestbook

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
- [ ] Each guestbook theme renders correctly across entry lengths from 10 to 500 characters.

**P1 — Nice to have**
- Owner can pin a specific entry to the top.
- Owner can reply to entries (publicly or privately).
- Additional guestbook themes as premium cosmetic upgrades.

---

### 7.5 Feed

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
- [ ] Friends-only posts are reportable despite their limited visibility.

**P1 — Nice to have**
- "Unread since last visit" marker.
- Per-person mute (hide their posts from feed without unfollowing).

---

### 7.6 Posts

**P0 — Must have**
- Text posts (max length TBD — see open questions).
- Image posts (single image; multi-image gallery TBD).
- Post visibility: public or friends-only (set at post time, changeable after).
- Post deletion.
- Post reporting.

*Acceptance criteria:*
- [ ] A post marked friends-only is not visible to strangers or followers in any surface (feed, profile, search).
- [ ] Post visibility can be changed after publishing without deleting and re-creating the post.
- [ ] Image uploads are validated for file type (jpg, png, gif, webp) and size (max TBD) on the server side, not just client side.

**P1 — Nice to have**
- Post editing with an edit history visible to viewers.
- Comments on posts (threading model TBD — see open questions).
- Reactions (lightweight, non-metric — no public like counts).

---

### 7.7 Direct Messages

**P0 — Must have**
- DMs restricted to mutual friends only.
- Text messages.
- Image sharing in DMs.
- Block and report from within a conversation.
- Read receipts (optional — may add anxiety; needs design decision).
- Message deletion (sender can delete for both parties within a time window).

*Acceptance criteria:*
- [ ] A DM conversation cannot be initiated unless both users are mutual friends.
- [ ] Blocking a user from DMs also removes them from the DM thread list.
- [ ] Reported DM content is flagged for admin review without notifying the reported user.

**P1 — Nice to have**
- Message requests from non-friends (with explicit opt-in by the recipient).
- Typing indicators.
- Reactions to individual messages.

---

### 7.8 Featured Section

**P0 — Must have**
- Featured section displayed prominently on the home/discovery page.
- Admin interface for the curator to add/remove featured profiles and posts.
- Featured content clearly labeled as curator-selected (not paid placement).
- Featured profiles are linkable and followable directly from the featured section.

*Acceptance criteria:*
- [ ] A new featured item is visible to all users within 5 minutes of the curator publishing it.
- [ ] Removing a featured item removes it from the section within 5 minutes.
- [ ] The featured section is the first thing a logged-out visitor sees when landing on the app.
- [ ] Featured content is visually distinguished from organic feed content.

**P1 — Nice to have**
- Multiple featured slots with different formats (profile spotlight, post of the week, etc.).
- Curator notes or editorial context displayed alongside featured content.

---

### 7.9 Moderation & Trust & Safety

**P0 — Must have**
- User blocking: blocked users cannot view your profile, follow you, or contact you.
- Content reporting: posts, profiles, guestbook entries, DMs all reportable.
- Admin review queue for reported content.
- Account suspension and permanent ban capability.
- Content removal by admin.

*Acceptance criteria:*
- [ ] Blocking a user takes effect immediately — their follow relationship is severed and they cannot re-follow.
- [ ] All user-generated content surfaces (posts, guestbook, DMs) have a report action reachable in 2 taps or fewer.
- [ ] Reported content is held for admin review; it remains visible until actioned unless it meets auto-removal thresholds (TBD).
- [ ] Suspended accounts see a clear, non-alarming message explaining their status.

**P1 — Nice to have**
- Keyword filters for guestbooks (owner-defined words that auto-hold entries for review).
- Automated NSFW image detection (third-party API).
- Appeal flow for suspended accounts.

---

### 7.10 Monetization (Freemium)

**P0 — Must have**
- Free tier: full access to all social features, Tier 1 default themes, Tier 2 block editor, 3 default guestbook themes.
- Premium tier: exclusive themes, animated backgrounds, additional guestbook styles, custom font options, profile badge.
- Payment flow (Stripe or equivalent).
- Subscription management: upgrade, downgrade, cancel.
- If a premium user cancels, they retain their settings but premium-only cosmetics revert gracefully (no broken layouts — fall back to the nearest free equivalent).

*Acceptance criteria:*
- [ ] All core social features (posting, following, guestbook, DMs) work without a paid subscription.
- [ ] Premium cosmetics are clearly labeled as premium in the UI without being obnoxious.
- [ ] Cancellation reverts premium cosmetics within 24 hours of the billing period ending, with no data loss.
- [ ] Payment flow completes in under 60 seconds on mobile.

**P2 — Future consideration**
- One-time cosmetic purchases (individual themes rather than a subscription).
- Gift subscriptions.

---

## 8. Success Metrics

### Leading indicators (evaluate at 2 and 4 weeks post-launch)

| Metric | Target | Measurement |
|---|---|---|
| Time to first profile personalization | < 10 min median | Timestamp from signup to first theme or block save |
| Day-7 retention | ≥ 40% | % of week-1 signups who return in week 2 |
| Follows per new user (first 7 days) | ≥ 5 | Average follows initiated per new account |
| Guestbook entries per active user (monthly) | ≥ 2 | Total entries / MAU |
| Featured section click-through rate | ≥ 15% | Featured item clicks / featured section impressions |
| Contact sync adoption rate | ≥ 40% of new users | % of signups who complete contact sync (opt-in only) |

### Lagging indicators (evaluate at 30, 60, 90 days)

| Metric | Target | Measurement |
|---|---|---|
| Day-30 retention | ≥ 30% | % of signup cohort active on day 30 |
| Mutual friend formation rate | ≥ 60% of follows result in mutual | Mutual friendships / total follows (30-day window) |
| Premium conversion rate | ≥ 5% of MAU | Paid subscribers / monthly active users |
| Reported content rate | < 0.5% of posts | Reports / total posts (flag if higher) |
| NPS | ≥ 40 | In-app survey, 60+ days post-signup cohort |

---

## 9. Open Questions

| # | Question | Owner | Blocking? |
|---|---|---|---|
| 1 | **Post length limit.** What is the max character count for a text post? Short (280–500, keeps it conversational) vs. long-form (2,000+, enables journaling). This shapes the post block UI and the feed design. | Design + Product | Yes — blocks feed design |
| 2 | **Comment model.** Do posts have comments? If so: flat or threaded? Can strangers comment on public posts? This is a significant moderation surface decision. | Product | Yes — blocks post spec |
| 3 | **Music licensing.** What is the model for the music/audio player block? User uploads (copyright risk), licensed catalog (cost), or embedded Spotify/SoundCloud link (dependency)? | Legal + Product | No — block deferred to v2 |
| 4 | **Notification design.** What triggers a notification? New follower, new mutual friend, new guestbook entry, new DM, post comment, featured section placement. Push, email, in-app — or some combination? A bloated notification system is its own dark pattern. | Design | No — can finalize during build |
| 5 | **Read receipts in DMs.** Do sent messages show read receipts by default? Optional setting? Off entirely? Small decision, real anxiety implications. | Design | No — can decide in DM sprint |
| 6 | **Guestbook character limit.** 300 or 500? Needs to be tested against the visual themes before finalizing. | Design | No — finalize in guestbook design sprint |
| 7 | **App name.** "Orbit" is the working title. Needs trademark check before committing. | Product | No — but before any public materials |

---

## 10. Risks & Mitigations

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| **Cold start / empty network** | High | High | Asymmetric follow model lowers barrier to connection. Featured section provides day-one content. Prioritize frequent featured updates in early weeks — this is your most important editorial job. |
| **Customization security (XSS/CSS injection)** | Critical | Medium | Render all profiles in sandboxed iframes from day one. Server-side sanitizer (DOMPurify-class) on all user content. Tier 3 deferred until hardened. |
| **Moderation cost** | High | High | Guestbook and DMs are friends-only, which reduces exposure significantly. Build reporting and an admin review queue before launch — not after. |
| **Two-editor scope creep** | Medium | High | Treat the mobile and desktop editors as two separate product surfaces with separate design and QA sprints. Don't let mobile become an afterthought. |
| **Featured section going stale** | High | Medium | Build a content calendar habit from day one. A stale featured section kills the discovery loop and damages first impressions. |
| **Business model viability** | High | Medium | Freemium cosmetics are validated by Roblox, Discord Nitro, and Tumblr's model. Risk is low conversion at small user base. Target 5% conversion — set a 90-day checkpoint to evaluate. |
| **Premium cancellation causing broken profiles** | Medium | Low | Graceful degradation: premium cosmetics revert to nearest free equivalent, never to a broken state. Test this path explicitly before launch. |
| **Contact sync privacy mishandling** | High | Low | On-device hashing is non-negotiable — raw contacts must never leave the device. Document the data flow in the privacy policy before launch. Get legal review before shipping. |

---

## 11. Timeline Considerations

### Hard constraints
- No hard deadlines established. This doc assumes a greenfield build.

### Suggested phasing

**Phase 1 — Foundation (Months 1–3)**
- Auth, accounts, onboarding.
- Asymmetric social graph.
- Chronological feed (text + image posts).
- Profile with Tier 1 themes only.
- Core moderation (block, report, admin queue).

**Phase 2 — Customization (Months 3–5)**
- Tier 2 block editor (mobile + desktop).
- Per-block visibility system.
- Guestbook block with 3 themes.
- DMs (mutual friends only).

**Phase 3 — Monetization & Discovery (Months 5–6)**
- Premium tier + payment flow.
- Featured section with admin curation interface.
- Premium cosmetics (themes, guestbook styles, fonts).

**Beta / soft launch — Month 6**
Invite-only or closed beta with a seeded initial community. Do not open-register publicly until the featured section has at least 2 weeks of content backlog and the moderation queue is staffed.

### Key dependency
Post comments (open question #2) must be decided before Phase 2 begins, since comments affect the post block, the feed, and the notification system.

---

## 12. Appendix: Architecture Notes

These are not implementation mandates — they are constraints the architecture should respect from day one to avoid expensive rework.

- **Sandboxed iframe rendering:** Every profile must be rendered inside a sandboxed iframe. This is the foundational requirement for eventual Tier 3 (code editing) and protects the app's chrome from user-authored CSS/HTML regardless of tier. Do not defer this.
- **Curator role in the permission model:** The featured section should be backed by a `CURATOR` role in the permission system, not hardcoded to a single admin account. Only one person holds it at launch, but the role must be assignable.
- **Block visibility enforcement server-side:** Friends-only blocks must not be present in the HTML/DOM delivered to strangers or followers — not just CSS-hidden. Visibility is a data access concern, not a display concern.
- **Desktop layout as source of truth:** The block layout data structure stores one layout (the desktop/2D arrangement). The mobile view is a derived, responsive interpretation of that layout. There is no separate mobile layout data.
- **Freemium flag on cosmetics:** Every premium cosmetic (theme, guestbook style, font, animation) should carry a `premium: true` flag in the data model. When a subscription lapses, cosmetics are reverted by checking this flag — not by deleting user data.
- **Contact sync — no server-side storage of contact data:** The contact matching flow must be architected so that hashed phone numbers are computed on-device, sent to the server for a single match query, and immediately discarded. The server should store only the hashed phone number associated with a user's own account (for matching purposes) — never the contents of anyone's contact list. This must be auditable.

---

*Document owner: Ailany*
*Next suggested action: Resolve open questions #1 (post length) and #2 (comments) — both block the Phase 2 design sprint.*
