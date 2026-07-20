import { useEffect, useRef } from 'react';

/**
 * The Pioneer / Voyager pulsar map — Frank Drake's radial "you are here"
 * diagram locating the Sun relative to 14 pulsars, drawn as a full-bleed
 * background.
 *
 * Real data, not decorative noise. Each ray carries a pulsar's genuine binary
 * period (units of the hydrogen hyperfine period, 7.04024183647e-10 s), points
 * in its true direction, and its LENGTH is the pulsar's real relative distance
 * (galactic centre = 100). Values transcribed from W. R. Johnston's
 * reconstruction (Table 1): https://www.johnstonsarchive.net/astro/pulsarmap.html
 *
 * Styling follows the classic coloured rendering: rays hued by direction, faint
 * concentric range rings, the long horizontal galactic-centre line as the axis.
 *
 * Canvas, pixel-accurate, drawn on resize with a barely-there origin pulse.
 * Honors prefers-reduced-motion (then it's fully static).
 */

const DEG = Math.PI / 180;

// 14 pulsars, clockwise from the galactic-centre line. `bits` = real binary
// period (MSB nearest the Sun); `ang` = true direction (screen degrees,
// clockwise from the +x galactic-centre line); `dist` = relative distance with
// the galactic centre set to 100.
const PULSARS = [
  { bits: '1000110001111100100011011101010',   ang: 17,  dist: 27, psr: 'J1731-4744' }, //  1  0.830 s
  { bits: '10110010011000101011101101111',     ang: 49,  dist: 2,  psr: 'J1456-6843' }, //  2  0.263 s
  { bits: '100000110110010110001001111000',    ang: 58,  dist: 56, psr: 'J1243-6423' }, //  3  0.388 s
  { bits: '111100011011011001010100111',       ang: 95,  dist: 15, psr: 'J0835-4510' }, //  4  Vela, 0.089 s
  { bits: '10101011011001101100101000011',     ang: 129, dist: 1,  psr: 'J0826+2637' }, //  5  0.253 s
  { bits: '101100111011010101011110001011',    ang: 162, dist: 2,  psr: 'J0953+0755' }, //  6  0.531 s
  { bits: '10110011100000101010000010',        ang: 174, dist: 18, psr: 'J0534+2200' }, //  7  Crab, 0.033 s
  { bits: '100111101000110101000100111000100', ang: 177, dist: 11, psr: 'J1900-2600' }, //  8  3.745 s
  { bits: '111100011111100011111000010110',    ang: 215, dist: 7,  psr: 'J0332+5434' }, //  9  B0329+54, 0.715 s
  { bits: '101101100101101001000010110001',    ang: 263, dist: 10, psr: 'J2219+4754' }, // 10  0.538 s
  { bits: '101111001111001110011000001101',    ang: 292, dist: 3,  psr: 'J2018+2839' }, // 11  0.558 s
  { bits: '11110010111110001110100011110',     ang: 308, dist: 40, psr: 'J1935+1616' }, // 12  0.359 s
  { bits: '10011001011010111010010111000',     ang: 315, dist: 1,  psr: 'J1932+1059' }, // 13  B1929+10, 0.227 s
  { bits: '100000110100101010001110101100',    ang: 344, dist: 4,  psr: 'J1645-0317' }, // 14  0.388 s
];

// The 15th line: the Sun's distance to the galactic centre — the reference
// axis. Longest line (distance 100), horizontal (+x), no period code.
const GC = { ang: 0, dist: 100 };

const N_RINGS = 8;

// Rotate the entire map by this many degrees (clockwise).
const ROTATION = 80;

// Length as a fraction of the max radius: linear in real distance, with a floor
// so the closest pulsars still hold their binary. distance 100 → 1.0.
function lenFrac(dist) {
  return 0.24 + 0.76 * (dist / 100);
}

// Hue from direction, so the burst reads as a spectrum around the origin.
function hue(ang) {
  return (ang + 8) % 360;
}

function draw(ctx, w, h, t, rotExtra = 0, scaleExtra = 1, theme = 'dark') {
  const light = theme === 'light';
  ctx.clearRect(0, 0, w, h);

  const ox = w * 0.5; // origin: dead centre of the page
  const oy = h * 0.5;

  ctx.save();
  ctx.translate(ox, oy);
  ctx.rotate((ROTATION + rotExtra) * DEG);
  ctx.scale(scaleExtra, scaleExtra);
  ctx.translate(-ox, -oy);
  const R = Math.min(w, h) * 0.62; // max radius — the galactic-centre line

  // ── Concentric range rings ────────────────────────────────────────────────
  ctx.lineWidth = 1;
  for (let i = 1; i <= N_RINGS; i++) {
    ctx.strokeStyle = light
      ? `rgba(70,68,96,${i === N_RINGS ? 0.10 : 0.14})`
      : `rgba(184,188,204,${i === N_RINGS ? 0.05 : 0.07})`;
    ctx.beginPath();
    ctx.arc(ox, oy, (R / N_RINGS) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.lineCap = 'round';
  const gap = R * 0.02; // clear space around the origin

  function ray(angDeg, dist, bits) {
    const a = angDeg * DEG;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const px = -dy; // perpendicular
    const py = dx;
    const total = lenFrac(dist) * R;
    const H = hue(angDeg);

    // Spine.
    ctx.strokeStyle = light
      ? `hsla(${H}, 68%, 46%, ${bits ? 0.62 : 0.72})`
      : `hsla(${H}, 55%, 62%, ${bits ? 0.5 : 0.62})`;
    ctx.lineWidth = bits ? 1 : 1.25;
    ctx.beginPath();
    ctx.moveTo(ox + dx * gap, oy + dy * gap);
    ctx.lineTo(ox + dx * total, oy + dy * total);
    ctx.stroke();

    // Binary period ticks, spaced to fill the line: long marks for 1, short
    // for 0. The galactic-centre line carries no code — clean spine.
    if (bits) {
      const span = total - gap;
      const step = span / (bits.length + 1);
      for (let i = 0; i < bits.length; i++) {
        const d = gap + (i + 1) * step;
        const one = bits[i] === '1';
        const half = one ? 3.5 : 1.5;
        const cxp = ox + dx * d;
        const cyp = oy + dy * d;
        ctx.strokeStyle = light
          ? `hsla(${H}, 66%, ${one ? 44 : 60}%, ${one ? 0.8 : 0.42})`
          : `hsla(${H}, 60%, ${one ? 72 : 58}%, ${one ? 0.72 : 0.4})`;
        ctx.lineWidth = one ? 1.15 : 1;
        ctx.beginPath();
        ctx.moveTo(cxp - px * half, cyp - py * half);
        ctx.lineTo(cxp + px * half, cyp + py * half);
        ctx.stroke();
      }
    }

    // Terminal cap — the plaque's z-coordinate tick at each line's end.
    const ex = ox + dx * total;
    const ey = oy + dy * total;
    const cap = bits ? 4 : 6;
    ctx.strokeStyle = light
      ? `hsla(${H}, 66%, 48%, ${bits ? 0.8 : 0.9})`
      : `hsla(${H}, 60%, 74%, ${bits ? 0.7 : 0.8})`;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(ex - px * cap, ey - py * cap);
    ctx.lineTo(ex + px * cap, ey + py * cap);
    ctx.stroke();
  }

  for (const p of PULSARS) ray(p.ang, p.dist, p.bits);
  ray(GC.ang, GC.dist, null);

  // Origin: soft glow + bright point (the Sun), with a slow, subtle pulse.
  const pulse = 0.5 + 0.5 * Math.sin(t * 1.6);
  const glowR = 26 + pulse * 8;
  const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, glowR);
  if (light) {
    g.addColorStop(0, `rgba(70,54,150,${(0.30 + pulse * 0.14).toFixed(3)})`);
    g.addColorStop(0.4, 'rgba(90,78,150,0.10)');
    g.addColorStop(1, 'rgba(90,78,150,0)');
  } else {
    g.addColorStop(0, `rgba(240,240,245,${(0.5 + pulse * 0.18).toFixed(3)})`);
    g.addColorStop(0.4, 'rgba(200,200,220,0.14)');
    g.addColorStop(1, 'rgba(200,200,220,0)');
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(ox, oy, glowR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = light ? 'rgba(40,32,80,0.92)' : 'rgba(245,245,245,0.95)';
  ctx.beginPath();
  ctx.arc(ox, oy, 2.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function PulsarMap({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  // Latest theme, read live by the render loop so a toggle just recolors the
  // next frame instead of tearing down and rebuilding the whole effect.
  const themeRef = useRef(theme);
  themeRef.current = theme;
  // Set by the effect so the theme effect below can force an immediate redraw
  // (needed under reduced motion, where there is no animation loop).
  const redrawRef = useRef(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let rotExtra = 0;
    let scaleExtra = 1;
    const FRAME = 1000 / 15;

    function render(t) {
      draw(ctx, w, h, t, rotExtra, scaleExtra, themeRef.current);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Nudge rotation and scale based on aspect ratio.
      const ratio = w / h;
      rotExtra = (ratio - 1) * 15;
      scaleExtra = 1 + Math.abs(ratio - 1) * 0.15;
      render(reduced ? 1.2 : performance.now() / 1000);
    }
    redrawRef.current = () => render(reduced ? 1.2 : performance.now() / 1000);

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    // Re-run resize when the device pixel ratio changes (e.g. the window is
    // dragged to a monitor of different density) even if the CSS size doesn't.
    let dprQuery;
    function onDprChange() { resize(); watchDpr(); }
    function watchDpr() {
      if (dprQuery) dprQuery.removeEventListener('change', onDprChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprQuery.addEventListener('change', onDprChange);
    }
    watchDpr();

    if (!reduced) {
      const loop = (ts) => {
        if (ts - last >= FRAME) {
          render(ts / 1000);
          last = ts;
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (dprQuery) dprQuery.removeEventListener('change', onDprChange);
    };
  }, []); // set up once; theme is read live via themeRef

  // A theme toggle just redraws — no loop/observer teardown.
  useEffect(() => {
    redrawRef.current();
  }, [theme]);

  return (
    <div className="pulsar" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
