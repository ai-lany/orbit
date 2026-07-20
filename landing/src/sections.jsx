import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Chip,
  Input,
  PixelMark,
  StickyNote,
  Switch,
} from '@your-org/design-system';

/* ── Small helpers ──────────────────────────────────────────────────────────── */

// Fades content up the first time it scrolls into view. Reduced motion is
// handled in CSS (the .reveal transition is stripped), so this stays simple.
function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-visible={visible || undefined}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// The mono "code comment" eyebrow used above every section title.
function Kicker({ children }) {
  return (
    <p className="kicker">
      <PixelMark name="star" size={16} />
      {children}
    </p>
  );
}

/* ══ Anti-metric strip — the growth dashboard, subverted ═════════════════════ */

const METRICS = [
  { value: '0', hue: 'accent', label: 'ads. ever. we’re not kidding.' },
  { value: '0', hue: undefined, label: 'algorithms deciding your feed.' },
  { value: '0', hue: 'pink', label: 'public like counts to chase.' },
  { value: '∞', hue: 'lime', label: 'fonts, themes & ways to be you.' },
];

function AntiMetric() {
  return (
    <section className="section section--space" id="less">
      <div className="wrap">
        <Reveal>
          <Kicker>// a social network that’s missing a few things</Kicker>
          <h2 className="title">The best features are the ones we left&nbsp;out.</h2>
        </Reveal>
        <div className="antimetric">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 80}>
              <div className="metricValue" data-hue={m.hue}>{m.value}</div>
              <p className="metricLabel">{m.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══ Make it yours — live theme preview + block editor ══════════════════════ */

const THEMES = [
  { id: 'midnight',  label: 'Midnight',  dot: 'linear-gradient(135deg,#1a1230,#9180fb)', vars: { '--card-bg': '#0e0b1e', '--card-fg': '#ece9ff', '--card-accent': '#9180fb' } },
  { id: 'bubblegum', label: 'Bubblegum', dot: 'linear-gradient(135deg,#2a0f22,#ff5ecb)', vars: { '--card-bg': '#25091c', '--card-fg': '#ffe3f4', '--card-accent': '#ff5ecb' } },
  { id: 'matcha',    label: 'Matcha',    dot: 'linear-gradient(135deg,#10241a,#8fe39a)', vars: { '--card-bg': '#0f2016', '--card-fg': '#e9ffe9', '--card-accent': '#7bdc8b' } },
  { id: 'vaporwave', label: 'Vaporwave', dot: 'linear-gradient(135deg,#5b2a8c,#ff5ecb)', vars: { '--card-bg': '#180a2e', '--card-fg': '#f0e8ff', '--card-accent': '#c9a2ff' } },
  { id: 'sunset',    label: 'Sunset',    dot: 'linear-gradient(135deg,#3a1608,#f0a51b)', vars: { '--card-bg': '#241205', '--card-fg': '#ffeede', '--card-accent': '#f6b93b' } },
  { id: 'paper',     label: 'Paper',     dot: 'linear-gradient(135deg,#e8e2d4,#7b61ff)', vars: { '--card-bg': '#f4f1ea', '--card-fg': '#241f18', '--card-accent': '#7b61ff' } },
];

const BLOCKS = ['About', 'Photos', 'Guestbook', 'Links', 'Status'];

function ProfilePreview({ theme }) {
  return (
    <div className="preview" style={theme.vars}>
      <div className="previewHead">
        <span className="previewAvatar" aria-hidden="true">ay</span>
        <div>
          <div className="previewName">Ailany</div>
          <div className="previewHandle">@ailany</div>
        </div>
        <button className="previewFollow" type="button" tabIndex={-1} aria-hidden="true">Follow</button>
      </div>
      <div className="previewMood">✷ building orbit</div>
      <div className="previewBlocks">
        <div className="pblock">
          <div className="pblockLabel">About</div>
          <div className="pline" />
          <div className="pline" />
          <div className="pline pline--short" />
        </div>
        <div className="pblock">
          <div className="pblockLabel">Photos</div>
          <div className="pphotos"><span className="pphoto" /><span className="pphoto" /><span className="pphoto" /></div>
        </div>
        <div className="pblock">
          <div className="pblockLabel">Guestbook</div>
          <div className="pnote">“your corner of space goes hard ✦”</div>
        </div>
      </div>
    </div>
  );
}

function BlockEditor() {
  const [friendsOnly, setFriendsOnly] = useState(true);
  return (
    <div className="blocksPanel">
      <p className="blocksTitle"><PixelMark name="corner" size={16} /> editing · ailany</p>
      {BLOCKS.map((name) => (
        <div className="blockRow" key={name}>
          <span className="blockGrip" aria-hidden="true"><PixelMark name="dot" size={16} /></span>
          <span className="blockName">{name}</span>
          <span className="blockVis">
            {name === 'Guestbook' ? (
              <Chip tone={friendsOnly ? 'pink' : 'neutral'}>{friendsOnly ? 'Friends only' : 'Public'}</Chip>
            ) : name === 'Status' ? (
              <Chip tone="accent">Followers</Chip>
            ) : (
              <Chip tone="neutral">Public</Chip>
            )}
          </span>
        </div>
      ))}
      <div className="switchRow">
        <Switch
          switchSize="sm"
          checked={friendsOnly}
          onChange={(e) => setFriendsOnly(e.target.checked)}
          label="Keep the guestbook friends-only"
        />
      </div>
      <p className="blocksHint">
        drag to reorder · set who sees each block · fine-tune your 2D layout
        on desktop
      </p>
    </div>
  );
}

function MakeItYours() {
  const [theme, setTheme] = useState(THEMES[0]);
  return (
    <section className="section section--lift" id="make">
      <div className="wrap">
        <Reveal>
          <Kicker>// your profile, your rules</Kicker>
          <h2 className="title">Your profile is a place you <em>build</em> — not a form you fill&nbsp;out.</h2>
          <p className="lede">
            Drag blocks wherever you want them. Swap the entire vibe in one tap.
            Decide who sees what, block by block. No two profiles on Orbit look
            the same — that’s the whole idea.
          </p>
        </Reveal>

        <div className="makeGrid">
          <Reveal>
            <ProfilePreview theme={theme} />
            <div className="swatches" role="group" aria-label="Try a theme">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="swatch"
                  data-active={t.id === theme.id}
                  aria-pressed={t.id === theme.id}
                  onClick={() => setTheme(t)}
                >
                  <span className="swatchDot" style={{ background: t.dot }} />
                  {t.label}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <BlockEditor />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══ Guestbook — the signature: a wall of pinned sticky notes ═══════════════ */

const NOTES = [
  { id: 'welcome', color: 'yellow', rot: -4, text: '**welcome to my orbit** ✷\n\nrepainted the whole place teal today. no regrets.' },
  { id: 'guestbook-beats-likes', color: 'pink', rot: 3, text: 'ok a guestbook is *so* much better than a like button' },
  { id: 'featured', color: 'blue', rot: -2, text: 'found you on the featured page — your layout goes hard 🔥' },
  { id: 'no-ads', color: 'green', rot: 4, text: 'no ads?? no algorithm?? in THIS economy???' },
  { id: 'sign-back', color: 'purple', rot: -3, text: 'signed ♥ now come sign mine back, friend' },
  { id: 'feels-like-home', color: 'yellow', rot: 2, text: 'i forgot the internet could feel like this. thank you.' },
];

const GB_STYLES = ['Sticky notes', 'Chat bubbles', 'Handwritten letters'];

function Guestbook() {
  return (
    <section className="section section--warm" id="guestbook">
      <div className="wrap">
        <Reveal>
          <Kicker>// sign my guestbook</Kicker>
          <h2 className="title">Friends sign your guestbook. Not your&nbsp;DMs.</h2>
          <p className="lede">
            Remember guestbooks? They’re back. Only your mutual friends can leave
            a note — so your wall stays warm, personal, and yours to moderate.
            Pick the look that fits your space.
          </p>
          <div className="gbStyles">
            {GB_STYLES.map((s, i) => (
              <Chip key={s} tone={i === 0 ? 'accent' : 'neutral'} selected={i === 0}>{s}</Chip>
            ))}
          </div>
        </Reveal>

        <Reveal className="wall">
          {NOTES.map((n) => (
            <div className="pin" style={{ '--rot': `${n.rot}deg` }} key={n.id}>
              <StickyNote color={n.color} size="sm" readOnly value={n.text} />
            </div>
          ))}
        </Reveal>

        <Reveal className="composer" delay={60}>
          <div className="pin" style={{ '--rot': '-1deg' }}>
            <StickyNote color="blue" size="md" placeholder="leave something nice ♥" defaultValue="" />
          </div>
          <p className="composerHint">
            this one’s just a preview — on Orbit you’ll need to be mutual friends
            to post. that’s the point.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ══ Early access CTA ═══════════════════════════════════════════════════════ */

function EarlyAccess() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim()) setDone(true);
  }

  return (
    <section className="section section--join cta" id="join">
      <div className="wrap ctaInner">
        <Reveal>
          <Kicker>// find your people</Kicker>
          <h2 className="title">Find your orbit.</h2>
          <p className="lede">
            We roll out invites every week. Get in early and claim your username
            before someone cooler does.
          </p>

          {/* Live region stays mounted (empty until success) so assistive tech
              reliably announces the confirmation when it appears. */}
          <div className="ctaFeedback" role="status" aria-live="polite">
            {done && (
              <span className="success">
                <PixelMark name="star" size={16} />
                You’re on the list. Invites go out weekly — watch your inbox. ✦
              </span>
            )}
          </div>

          {!done && (
            <form className="form" onSubmit={handleSubmit}>
              <Input
                className="formField"
                inputSize="lg"
                type="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" size="lg">Get my invite</Button>
            </form>
          )}

          <p className="formFine">Free while in beta · No card, no spam, no algorithm.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ══ Footer ═════════════════════════════════════════════════════════════════ */

const SOMEDAY = ['Top Friends ✦', 'Music player', 'Video posts'];

function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="footerCol">
          <a className="brand" href={import.meta.env.BASE_URL} aria-label="Orbit home">
            <PixelMark name="star" size={16} />
            <span className="brandName">Orbit</span>
          </a>
          <p className="footerNote">
            The social web from the good timeline. Working title, real feelings —
            built for people who miss decorating their own corner of the internet.
          </p>
        </div>
        <div className="footerCol">
          <p className="footerLabel">// on the horizon</p>
          <div className="someday">
            {SOMEDAY.map((s) => <Chip key={s} tone="neutral">{s}</Chip>)}
          </div>
          <p className="footerNote" style={{ fontSize: 'var(--text-xs)' }}>
            Good things take time. These are coming — just not on day one.
          </p>
        </div>
      </div>
      <div className="footerLegal">
        <span>© 2026 Orbit · made for the expressive web</span>
        <span>no algorithm was harmed in the making of this page</span>
      </div>
    </footer>
  );
}

/* ── Everything below the hero ──────────────────────────────────────────────── */

export function Sections() {
  return (
    <>
      <AntiMetric />
      <MakeItYours />
      <Guestbook />
      <EarlyAccess />
      <Footer />
    </>
  );
}
