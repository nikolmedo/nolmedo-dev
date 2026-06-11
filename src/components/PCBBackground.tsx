import { useEffect, useRef, useState } from "react";
import "../styles/pcb.css";

/**
 * Procedural PCB background rendered on <canvas>.
 *
 * - Board layout (traces, pads, vias) is generated per viewport size,
 *   so density adapts to mobile/desktop instead of slicing a fixed SVG.
 * - Pulses travel along traces with constant motion; scroll velocity feeds
 *   extra energy into the system (brighter traces, faster pulses).
 * - Pointer/touch interactions are physical: clicks spawn ripples that excite
 *   nearby pads and emit pulses from the closest traces.
 * - Colors are read from the active theme CSS variables and cross-faded on
 *   theme change. Honors prefers-reduced-motion with a static render.
 */

interface Pt {
  x: number;
  y: number;
}

interface Trace {
  pts: Pt[];
  cum: number[]; // cumulative length at each vertex
  total: number;
  color: number; // palette index: 0 cyan, 1 purple, 2 green
  width: number;
  phase: number; // breathing offset
  layer: number; // parallax layer: 0 far, 1 near
}

interface Pad {
  x: number;
  y: number;
  r: number;
  color: number;
  ring: boolean;
  exc: number; // excitement from ripples / pointer, decays over time
  layer: number;
}

interface Pulse {
  trace: number;
  dist: number;
  speed: number;
  dir: 1 | -1;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  max: number;
  speed: number;
}

type RGB = [number, number, number];

const GRID = 8;
const PARALLAX_EXTRA = 200; // board is taller than viewport by this much
const LAYER_SHIFT = [100, 200]; // max parallax offset per layer

const snap = (v: number) => Math.round(v / GRID) * GRID;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "").trim();
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(f, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const mixRgb = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const rgba = (c: RGB, a: number) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

/** Random weighted palette index — cyan dominant, purple/green accents. */
function pickColor(): number {
  const r = Math.random();
  return r < 0.45 ? 0 : r < 0.75 ? 1 : 2;
}

/**
 * Generates one trace path: horizontal runs joined by 45° jogs, snapped to a
 * grid — the classic PCB routing style. Vertical traces swap axes.
 */
function makePath(
  span: number,
  cross: number,
  vertical: boolean,
  boardW: number,
  boardH: number,
): Pt[] {
  const pts: Pt[] = [];
  let main = -40;
  let side = snap(cross);
  const push = () =>
    pts.push(vertical ? { x: side, y: main } : { x: main, y: side });

  push();
  while (main < span + 40) {
    main += snap(rand(90, 300));
    push();
    if (main >= span + 40) break;
    // 45° jog
    const jog = snap(rand(24, 88)) * (Math.random() < 0.5 ? -1 : 1);
    const limit = vertical ? boardW : boardH;
    if (side + jog < 24 || side + jog > limit - 24) continue;
    main += Math.abs(jog);
    side += jog;
    push();
  }
  return pts;
}

function buildTrace(pts: Pt[], color: number, layer: number): Trace {
  const cum: number[] = [0];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    cum.push(total);
  }
  return {
    pts,
    cum,
    total,
    color,
    width: rand(1.1, 1.6),
    phase: rand(0, Math.PI * 2),
    layer,
  };
}

function pointAt(tr: Trace, d: number): Pt {
  if (d <= 0) return tr.pts[0];
  if (d >= tr.total) return tr.pts[tr.pts.length - 1];
  let i = 1;
  while (tr.cum[i] < d) i++;
  const a = tr.pts[i - 1];
  const b = tr.pts[i];
  const seg = tr.cum[i] - tr.cum[i - 1];
  const t = seg === 0 ? 0 : (d - tr.cum[i - 1]) / seg;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

interface Board {
  traces: Trace[];
  pads: Pad[];
}

/** Procedurally lays out the whole board for the current viewport. */
function buildBoard(w: number, h: number, mobile: boolean): Board {
  const boardH = h + PARALLAX_EXTRA;
  const traces: Trace[] = [];
  const pads: Pad[] = [];

  // Horizontal traces: mostly single lines, occasionally one parallel pair
  const busCount = Math.max(
    5,
    Math.min(12, Math.round((w * boardH) / (mobile ? 70000 : 95000))),
  );
  for (let b = 0; b < busCount; b++) {
    const y = rand(40, boardH - 40);
    const color = pickColor();
    const layer = Math.random() < 0.6 ? 0 : 1;
    const lines = !mobile && Math.random() < 0.3 ? 2 : 1;
    const base = makePath(w, y, false, w, boardH);
    for (let l = 0; l < lines; l++) {
      const off = l * 14;
      const pts = base.map((p) => ({ x: p.x, y: p.y + off }));
      traces.push(buildTrace(pts, color, layer));
    }
    // Vias at some interior bend points of the first line
    for (let i = 1; i < base.length - 1; i++) {
      if (Math.random() < 0.18) {
        pads.push({
          x: base[i].x,
          y: base[i].y,
          r: 2,
          color,
          ring: false,
          exc: 0,
          layer,
        });
      }
    }
  }

  // A few vertical traces for texture (desktop only)
  if (!mobile) {
    const vCount = 2 + ((Math.random() * 2) | 0);
    for (let v = 0; v < vCount; v++) {
      const x = rand(60, w - 60);
      const pts = makePath(boardH, x, true, w, boardH);
      traces.push(buildTrace(pts, pickColor(), 0));
    }
  }

  // Terminal pads: place at trace interior vertices so the network feels alive
  const padCount = mobile ? 10 : 18;
  for (let i = 0; i < padCount; i++) {
    const tr = traces[(Math.random() * traces.length) | 0];
    const vi = 1 + ((Math.random() * (tr.pts.length - 2)) | 0);
    const p = tr.pts[vi];
    if (p.x < 16 || p.x > w - 16 || p.y < 16 || p.y > boardH - 16) continue;
    pads.push({
      x: p.x,
      y: p.y,
      r: 3.5,
      color: tr.color,
      ring: true,
      exc: 0,
      layer: tr.layer,
    });
  }

  return { traces, pads };
}

export default function PCBBackground({ theme }: { theme: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanActive, setScanActive] = useState(false);
  // Bridges the theme effect to the render loop living inside the main effect
  const retintRef = useRef<() => void>(() => {});

  useEffect(() => {
    retintRef.current();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let mobile = w < 768;
    let board = buildBoard(w, h, mobile);

    // Theme palette with cross-fade on change
    let palFrom: RGB[] = [
      [0, 229, 255],
      [180, 74, 255],
      [57, 255, 20],
    ];
    let palTo: RGB[] = palFrom;
    let palT = 1; // 0..1 fade progress
    let palette: RGB[] = palFrom;

    const readPalette = (): RGB[] => {
      const root = canvas.parentElement;
      if (!root) return palTo;
      const cs = getComputedStyle(root);
      return ["--cyan", "--purple", "--green"].map((v) =>
        hexToRgb(cs.getPropertyValue(v) || "#00e5ff"),
      );
    };

    const retint = () => {
      palFrom = palette.map((c) => [...c] as RGB);
      palTo = readPalette();
      palT = 0;
      if (reducedMotion) {
        palT = 1;
        palette = palTo;
        drawFrame(0, 0);
      }
    };
    retintRef.current = retint;

    // Dynamic state
    const pulses: Pulse[] = [];
    const ripples: Ripple[] = [];
    const pointer = { x: 0, y: 0, has: false };
    let energy = 0; // 0..1.5 — scroll / burst excitement
    let progress = 0; // scroll progress 0..1 for parallax
    let spawnIn = 0.5; // seconds until next pulse spawn
    const maxPulses = () => (mobile ? 4 : 8);

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    palTo = readPalette();
    palFrom = palTo;
    palette = palTo;

    const spawnPulse = (traceIdx?: number, atDist?: number) => {
      if (board.traces.length === 0) return;
      const trace =
        traceIdx ?? ((Math.random() * board.traces.length) | 0);
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      const tr = board.traces[trace];
      pulses.push({
        trace,
        dist: atDist ?? (dir === 1 ? 0 : tr.total),
        speed: rand(mobile ? 90 : 120, mobile ? 160 : 220),
        dir,
      });
    };

    /** Click/tap physics: ripple + pulses emitted from the nearest traces. */
    const excite = (x: number, y: number, strength: number) => {
      ripples.push({ x, y, r: 6, max: mobile ? 220 : 320, speed: 380 });
      // Find the two traces with a vertex closest to the impact point
      const scored: { idx: number; vi: number; d: number }[] = [];
      board.traces.forEach((tr, idx) => {
        const offY = progress * LAYER_SHIFT[tr.layer];
        let best = { vi: 0, d: Infinity };
        tr.pts.forEach((p, vi) => {
          const d = Math.hypot(p.x - x, p.y - offY - y);
          if (d < best.d) best = { vi, d };
        });
        if (best.d < 200) scored.push({ idx, vi: best.vi, d: best.d });
      });
      scored
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach((s) => {
          const tr = board.traces[s.idx];
          spawnPulse(s.idx, tr.cum[s.vi]);
        });
      energy = Math.min(1.5, energy + strength);
    };

    const drawTraces = (
      g: CanvasRenderingContext2D,
      layer: number,
      t: number,
      boost: number,
    ) => {
      for (const tr of board.traces) {
        if (tr.layer !== layer) continue;
        const breath = 0.8 + 0.2 * Math.sin(t * 0.7 + tr.phase);
        const alpha =
          (0.1 + 0.05 * breath) * (1 + energy * 1.1) * boost;
        g.strokeStyle = rgba(palette[tr.color], Math.min(alpha, 0.55));
        g.lineWidth = tr.width + (boost > 1 ? 0.3 : 0);
        g.beginPath();
        g.moveTo(tr.pts[0].x, tr.pts[0].y);
        for (let i = 1; i < tr.pts.length; i++) {
          g.lineTo(tr.pts[i].x, tr.pts[i].y);
        }
        g.stroke();
      }
    };

    // Offscreen layer for the pointer flashlight: boosted traces are masked
    // by a radial gradient so the highlight fades out with no hard edge.
    const fl = document.createElement("canvas");
    const flCtx = fl.getContext("2d");

    const drawFlashlight = (t: number) => {
      if (!flCtx || !pointer.has || mobile) return;
      if (fl.width !== canvas.width || fl.height !== canvas.height) {
        fl.width = canvas.width;
        fl.height = canvas.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        flCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      flCtx.clearRect(0, 0, w, h);
      for (let layer = 0; layer < 2; layer++) {
        flCtx.save();
        flCtx.translate(0, -progress * LAYER_SHIFT[layer]);
        drawTraces(flCtx, layer, t, 2.2);
        flCtx.restore();
      }
      const R = 210;
      const grad = flCtx.createRadialGradient(
        pointer.x, pointer.y, 0,
        pointer.x, pointer.y, R,
      );
      grad.addColorStop(0, "rgba(0,0,0,0.7)");
      grad.addColorStop(0.5, "rgba(0,0,0,0.32)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      flCtx.globalCompositeOperation = "destination-in";
      flCtx.fillStyle = grad;
      flCtx.fillRect(0, 0, w, h);
      flCtx.globalCompositeOperation = "source-over";
      ctx.drawImage(fl, 0, 0, w, h);
    };

    const drawPads = (layer: number, t: number) => {
      for (const pad of board.pads) {
        if (pad.layer !== layer) continue;
        const pulse = 0.75 + 0.25 * Math.sin(t * 1.4 + pad.x);
        const e = Math.min(pad.exc, 1.5);
        const alpha = Math.min((0.3 + 0.25 * pulse) * (1 + e), 1);
        const r = pad.r * (1 + e * 0.6);
        const c = palette[pad.color];
        ctx.fillStyle = rgba(c, alpha * 0.8);
        ctx.beginPath();
        ctx.arc(pad.x, pad.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (pad.ring) {
          ctx.strokeStyle = rgba(c, alpha * 0.35);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pad.x, pad.y, r + 4 + e * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (e > 0.05) {
          const g = ctx.createRadialGradient(
            pad.x, pad.y, 0,
            pad.x, pad.y, r + 18,
          );
          g.addColorStop(0, rgba(c, e * 0.25));
          g.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(pad.x, pad.y, r + 18, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawPulses = (layer: number) => {
      for (const pu of pulses) {
        const tr = board.traces[pu.trace];
        if (!tr || tr.layer !== layer) continue;
        const c = palette[tr.color];
        // Fading tail sampled behind the head
        for (let k = 6; k >= 1; k--) {
          const d = pu.dist - pu.dir * k * 10;
          if (d < 0 || d > tr.total) continue;
          const p = pointAt(tr, d);
          const f = 1 - k / 7;
          ctx.fillStyle = rgba(c, 0.35 * f);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2 * f + 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        const head = pointAt(tr, pu.dist);
        const g = ctx.createRadialGradient(
          head.x, head.y, 0,
          head.x, head.y, 12,
        );
        g.addColorStop(0, rgba(c, 0.9));
        g.addColorStop(0.3, rgba(c, 0.35));
        g.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 12, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawLayer = (layer: number, t: number) => {
      const offY = -progress * LAYER_SHIFT[layer];
      ctx.save();
      ctx.translate(0, offY);
      drawTraces(ctx, layer, t, 1);
      drawPulses(layer);
      drawPads(layer, t);
      ctx.restore();
    };

    const drawFrame = (t: number, dt: number) => {
      // Palette cross-fade
      if (palT < 1) {
        palT = Math.min(1, palT + dt / 0.6);
        palette = palFrom.map((c, i) => mixRgb(c, palTo[i], palT));
      }

      ctx.clearRect(0, 0, w, h);
      drawLayer(0, t);
      drawLayer(1, t);
      drawFlashlight(t);

      // Ripples in screen space
      for (const rp of ripples) {
        const f = 1 - rp.r / rp.max;
        ctx.strokeStyle = rgba(palette[0], 0.35 * f);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const step = (dt: number) => {
      // Pulse motion
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pu = pulses[i];
        const tr = board.traces[pu.trace];
        if (!tr) {
          pulses.splice(i, 1);
          continue;
        }
        pu.dist += pu.speed * (1 + energy) * pu.dir * dt;
        if (pu.dist < -70 || pu.dist > tr.total + 70) pulses.splice(i, 1);
      }
      // Ambient spawning
      spawnIn -= dt * (1 + energy * 2);
      if (spawnIn <= 0 && pulses.length < maxPulses()) {
        spawnPulse();
        spawnIn = rand(0.6, 1.6);
      }
      // Ripple expansion + pad excitement
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.speed * dt;
        if (rp.r >= rp.max) {
          ripples.splice(i, 1);
          continue;
        }
        for (const pad of board.pads) {
          const offY = -progress * LAYER_SHIFT[pad.layer];
          const d = Math.hypot(pad.x - rp.x, pad.y + offY - rp.y);
          if (Math.abs(d - rp.r) < 16) {
            pad.exc = Math.min(2, pad.exc + dt * 8);
          }
        }
      }
      // Pointer proximity excites pads (desktop hover)
      if (pointer.has && !mobile) {
        for (const pad of board.pads) {
          const offY = -progress * LAYER_SHIFT[pad.layer];
          const d = Math.hypot(pad.x - pointer.x, pad.y + offY - pointer.y);
          if (d < 130) {
            pad.exc = Math.min(2, pad.exc + dt * 5 * (1 - d / 130));
          }
        }
      }
      // Decay
      for (const pad of board.pads) pad.exc *= Math.exp(-dt * 2.5);
      energy *= Math.exp(-dt * 1.4);
    };

    // ── Render loop ──
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      step(dt);
      drawFrame(t, dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reducedMotion) {
        drawFrame(0, 0);
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => cancelAnimationFrame(raf);
    start();

    // ── Listeners ──
    const onVisibility = () => {
      stop();
      if (!document.hidden) start();
    };

    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      progress = maxScroll > 0 ? y / maxScroll : 0;
      // Scroll velocity feeds energy — board "wakes up" while you move
      energy = Math.min(1.2, energy + Math.abs(y - lastScrollY) * 0.0012);
      lastScrollY = y;
    };
    let lastScrollY = window.scrollY;

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.has = true;
    };
    const onPointerLeave = () => {
      pointer.has = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      excite(e.clientX, e.clientY, 0.35);
    };

    const onTrigger = (e: Event) => {
      const type = (e as CustomEvent).detail?.type;
      if (type === "burst") {
        energy = 1.5;
        const n = mobile ? 8 : 14;
        for (let i = 0; i < n; i++) spawnPulse();
        excite(w / 2, h / 2, 1);
      } else if (type === "scan") {
        setScanActive(true);
        setTimeout(() => setScanActive(false), 4000);
      }
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        w = window.innerWidth;
        h = window.innerHeight;
        mobile = w < 768;
        board = buildBoard(w, h, mobile);
        pulses.length = 0;
        ripples.length = 0;
        resizeCanvas();
        if (reducedMotion) drawFrame(0, 0);
      }, 200);
    };

    window.addEventListener("pcb-trigger", onTrigger);
    window.addEventListener("resize", onResize);
    if (!reducedMotion) {
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      document.documentElement.addEventListener(
        "pointerleave",
        onPointerLeave,
      );
    }

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pcb-trigger", onTrigger);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      retintRef.current = () => {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Horizontal scan line sweeping down (WebMCP "scan" event) */}
      <div className={`scan-line ${scanActive ? "scan-line-active" : ""}`} />
      <canvas ref={canvasRef} className="pcb-bg" aria-hidden="true" />
    </>
  );
}
