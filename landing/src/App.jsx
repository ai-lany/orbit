import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Link, PixelMark } from '@your-org/design-system';
import { PulsarMap } from './PulsarMap.jsx';
import { Sections } from './sections.jsx';

// Smooth-scroll to a section; the browser honors prefers-reduced-motion here.
function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function App() {
  const navRef = useRef(null);

  // The nav is transparent over the hero and tints in once you leave it.
  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.toggleAttribute('data-scrolled', window.scrollY > 8);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Light / dark theme, persisted. The inline script in index.html applies the
  // stored choice before paint; we read it back here so state stays in sync.
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('orbit-theme', theme); } catch { /* private mode */ }
  }, [theme]);

  return (
    <div className="page">
      <PulsarMap theme={theme} />

      <nav className="nav" aria-label="Main" ref={navRef}>
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="Orbit home">
          <PixelMark name="star" size={16} />
          <span className="brandName">Orbit</span>
        </a>
        <div className="navLinks">
          <Link variant="nav" href="#make">Your space</Link>
          <Link variant="nav" href="#guestbook">Guestbook</Link>
          <Button variant="primary" size="sm" onClick={() => scrollToId('join')}>
            Get early access
          </Button>
        </div>
      </nav>

      <header className="hero">
        <section className="copy">
          <Badge tone="lime" variant="soft">Early access · v1.0</Badge>
          <h1 className="heroTitle">Where ideas find gravity.</h1>
          <p className="heroBody">
            Orbit is a social network from the good timeline. Build a profile
            that’s <strong>actually yours</strong>, see your friends’ posts in the
            order they posted them, and never get ranked, counted, or advertised
            to again.
          </p>
          <div className="actions">
            <Button variant="primary" size="lg" onClick={() => scrollToId('join')}>
              Enter Orbit
            </Button>
            <Button variant="ghost" size="lg" onClick={() => scrollToId('less')}>
              Take the tour
            </Button>
          </div>
          <span className="heroFine">Free while in beta · Invites roll out weekly</span>
        </section>

        <a
          className="scrollHint"
          href="#less"
          onClick={(e) => { e.preventDefault(); scrollToId('less'); }}
        >
          scroll <PixelMark name="arrow" size={16} style={{ transform: 'rotate(90deg)' }} />
        </a>
      </header>

      <Sections />

      <button
        type="button"
        className="themeToggle"
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        <span className="themeIcon" aria-hidden="true">{theme === 'dark' ? '🌙' : '☀️'}</span>
        <span className="themeLabel">{theme === 'dark' ? 'dark' : 'light'}</span>
      </button>
    </div>
  );
}
