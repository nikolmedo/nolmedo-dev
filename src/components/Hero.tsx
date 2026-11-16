import { useId } from "react";
import "../styles/hero.css";
import { COLORS } from "../constants/colors";
import GlassPanel from "./GlassPanel";
import { useFeedback } from "../hooks/useFeedback";
import { useSectionRef } from "../hooks/useSectionRef";
import { scrollToId } from "../utils/scrollToId";

type Accent = (typeof COLORS)[keyof typeof COLORS];

const PIN_PITCH = [68, 104, 140, 176, 212];

/* Escape routing for one side of the card, drawn from the board toward the pin
   so the load animation reads as signals arriving. Mirrored in CSS for the right side. */
const FANOUT_PATHS = [
  "M-240 -40 H240 L300 20 H452 L500 68 H552",
  "M-240 32 H140 L180 72 H438 L470 104 H552",
  "M120 140 H552",
  "M-240 248 H180 L220 208 H438 L470 176 H552",
  "M-240 320 H270 L330 260 H452 L500 212 H552",
];

function Fanout({ side, colors }: { side: "left" | "right"; colors: Accent[] }) {
  // Colon-free id keeps url(#id) references unambiguous
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`hero-fanout hero-fanout-${side}`}
      viewBox="0 0 560 280"
      width="560"
      height="280"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {colors.map((color, i) => (
          <linearGradient key={i} id={`${id}-${i}`} gradientUnits="userSpaceOnUse" x1="-240" y1="0" x2="200" y2="0">
            <stop offset="0" style={{ stopColor: color }} stopOpacity="0" />
            <stop offset="1" style={{ stopColor: color }} />
          </linearGradient>
        ))}
      </defs>
      {FANOUT_PATHS.map((d, i) => (
        <path
          key={d}
          className="hero-trace"
          d={d}
          pathLength={1}
          stroke={`url(#${id}-${i})`}
          strokeWidth="1.5"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      <circle className="hero-via" cx="120" cy="140" r="3.5" style={{ fill: colors[2] }} />
      <circle className="hero-via" cx="120" cy="140" r="8" style={{ stroke: colors[2] }} strokeWidth="1" opacity="0.5" />
      {PIN_PITCH.map((y, i) => (
        <circle key={y} className="hero-pin" cx="556.5" cy={y} r="3" style={{ fill: colors[i] }} />
      ))}
    </svg>
  );
}

function Corner({ corner, color, rail = false }: { corner: "tl" | "tr" | "bl" | "br"; color: Accent; rail?: boolean }) {
  return (
    <svg className={`hero-corner hero-corner-${corner}`} viewBox="0 0 110 90" width="110" height="90" fill="none" aria-hidden="true">
      <path d="M0 0 H80 L100 20" style={{ stroke: color }} strokeWidth="1.5" opacity="0.6" />
      {rail && <path d="M0 20 V80" style={{ stroke: color }} strokeWidth="1.5" opacity="0.4" />}
      <circle cx="100" cy="20" r="3" style={{ fill: color }} opacity="0.8" />
    </svg>
  );
}

export default function Hero() {
  const { triggerClick } = useFeedback();
  const sectionRef = useSectionRef();

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    triggerClick();
    scrollToId(id);
  };

  return (
    <section ref={sectionRef} id="hero" className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-content">
        <div className="hero-chip">
          <Fanout side="left" colors={[COLORS.cyan, COLORS.cyan, COLORS.neonGreen, COLORS.purple, COLORS.purple]} />
          <Fanout side="right" colors={[COLORS.purple, COLORS.purple, COLORS.neonGreen, COLORS.cyan, COLORS.cyan]} />
          <GlassPanel className="hero-panel">

          <Corner corner="tl" color={COLORS.cyan} rail />
          <Corner corner="tr" color={COLORS.purple} rail />
          <Corner corner="bl" color={COLORS.neonGreen} />
          <Corner corner="br" color={COLORS.cyan} />

          <p className="hero-greeting">Hello, I'm</p>
          <h1 id="hero-heading" className="hero-name">NICOLAS OLMEDO</h1>
          <h2 className="hero-title">SENIOR FRONTEND ENGINEER</h2>
          <p className="hero-tagline">
            13+ years shipping software · React & TypeScript at Medallia
          </p>

          <div className="hero-buttons">
            <a 
              className="btn-secondary" 
              href="https://github.com/nikolmedo" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={triggerClick}
            >
              GitHub
            </a>
            <a
              className="btn-primary"
              href="#experience"
              onClick={(e) => handleScrollClick(e, "experience")}
            >
              Experience
            </a>
            <a
              className="btn-secondary"
              href="#contact"
              onClick={(e) => handleScrollClick(e, "contact")}
            >
              Contact
            </a>
          </div>

          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
