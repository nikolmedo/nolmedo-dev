import { useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";
import { THEMES } from "../data/themes";

/**
 * Annotation layer for blueprint mode. Measures the live DOM and labels every
 * section, panel and heading with what it actually is: element, class, size.
 * The spec sheet documents the active theme tokens and their contrast on --bg.
 */

interface Box {
  key: string;
  kind: "section" | "panel";
  id?: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
}

interface HeadingTag {
  key: string;
  label: string;
  x: number;
  y: number;
  delay: number;
}

interface Token {
  name: string;
  value: string;
  ratio: number;
}

interface Viewport {
  w: number;
  h: number;
}

const MOBILE_QUERY = "(max-width: 768px)";
const TOKEN_NAMES = ["--text", "--muted", "--green", "--cyan", "--purple", "--amber"];
const WIPE_MS = 850; // matches the blueprint view transition in blueprint.css

/** Layout position relative to the root; unlike getBoundingClientRect it ignores hover and entrance transforms. */
function offsetIn(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function luminance(hex: string): number | null {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number | null {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** WCAG 2.x level a token reaches as text on --bg. */
function grade(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large";
  return "decorative";
}

function readTokens(root: HTMLElement): Token[] {
  const cs = getComputedStyle(root);
  const bg = cs.getPropertyValue("--bg");
  return TOKEN_NAMES.flatMap((name) => {
    const value = cs.getPropertyValue(name).trim();
    const ratio = contrast(value, bg);
    return ratio === null ? [] : [{ name, value, ratio }];
  });
}

function measure(root: HTMLElement, stagger: boolean) {
  const vh = window.innerHeight;
  const scrollY = window.scrollY;
  // Labels in view appear as the wipe passes over them; the rest are simply there
  const delayFor = (y: number) => {
    const rel = (y - scrollY) / vh;
    return stagger && rel >= 0 && rel <= 1 ? 120 + rel * WIPE_MS : 0;
  };

  const boxes: Box[] = [];
  root.querySelectorAll<HTMLElement>("main section[id], main .glass-panel").forEach((el, i) => {
    const section = el.tagName === "SECTION";
    const { x, y } = offsetIn(el, root);
    boxes.push({
      key: `${section ? "s" : "p"}${i}`,
      kind: section ? "section" : "panel",
      id: section ? el.id : undefined,
      label: section ? `section#${el.id}` : `.${el.classList[1] ?? el.classList[0]}`,
      x,
      y,
      w: el.offsetWidth,
      h: el.offsetHeight,
      delay: delayFor(y),
    });
  });

  const headings: HeadingTag[] = [];
  root.querySelectorAll<HTMLElement>("main :is(h1, h2, h3)").forEach((el, i) => {
    const { x, y } = offsetIn(el, root);
    headings.push({ key: `h${i}`, label: el.tagName.toLowerCase(), x, y, delay: delayFor(y) });
  });

  return { boxes, headings };
}

interface Props {
  rootRef: RefObject<HTMLDivElement | null>;
  theme: string;
}

export default function BlueprintOverlay({ rootRef, theme }: Props) {
  const [layout, setLayout] = useState<{ boxes: Box[]; headings: HeadingTag[] }>({ boxes: [], headings: [] });
  const [tokens, setTokens] = useState<Token[]>([]);
  const [viewport, setViewport] = useState<Viewport>({ w: window.innerWidth, h: window.innerHeight });
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [mobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setLayout(measure(root, !reducedMotion));

    let frame = 0;
    const remeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setLayout(measure(root, false));
        setViewport({ w: window.innerWidth, h: window.innerHeight });
      });
    };
    // Root height changes when lazy sections mount, so one observer covers resize and late content
    const observer = new ResizeObserver(remeasure);
    observer.observe(root);
    window.addEventListener("resize", remeasure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", remeasure);
    };
  }, [rootRef, reducedMotion]);

  useEffect(() => {
    if (rootRef.current) setTokens(readTokens(rootRef.current));
  }, [rootRef, theme]);

  const themeLabel = THEMES.find((t) => t.id === theme)?.label ?? theme;
  const breakpoint = viewport.w <= 768 ? "mobile (≤ 768)" : "desktop (> 768)";

  return (
    <>
      <div className="bp-layer" aria-hidden="true">
        {layout.boxes.map((b) => (
          <div
            key={b.key}
            className={`bp-box bp-box-${b.kind}`}
            data-id={b.id}
            style={{ left: b.x, top: b.y, width: b.w, height: b.h, "--d": `${b.delay}ms` } as CSSProperties}
          >
            <span className="bp-tag bp-tag-name">{b.label}</span>
            <span className="bp-tag bp-tag-size">{b.w} × {b.h}</span>
          </div>
        ))}
        {layout.headings.map((h) => (
          <span
            key={h.key}
            className="bp-tag bp-tag-heading"
            style={{ left: h.x, top: h.y, "--d": `${h.delay}ms` } as CSSProperties}
          >
            {h.label}
          </span>
        ))}
      </div>

      <details className="bp-sheet" open={!mobile}>
        <summary className="bp-sheet-title">Design spec</summary>
        <dl className="bp-sheet-rows">
          <div>
            <dt>Viewport</dt>
            <dd>{viewport.w} × {viewport.h}, {breakpoint}</dd>
          </div>
          <div>
            <dt>Theme</dt>
            <dd>{themeLabel}</dd>
          </div>
          <div>
            <dt>Motion</dt>
            <dd>{reducedMotion ? "reduced, as requested by the system" : "full"}</dd>
          </div>
        </dl>
        <table className="bp-sheet-tokens">
          <caption>Contrast on --bg</caption>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.name}>
                <th scope="row">
                  <span className="bp-swatch" style={{ background: t.value }} />
                  {t.name}
                </th>
                <td>{t.ratio.toFixed(1)}:1</td>
                <td>{grade(t.ratio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}
