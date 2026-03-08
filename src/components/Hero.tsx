import { useState, useEffect } from "react";
import "../styles/hero.css";
import { COLORS } from "../constants/colors";
import GlassPanel from "./GlassPanel";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className={`hero-content ${visible ? "hero-visible" : ""}`}>
        <GlassPanel className="hero-panel">

          {/* Decorative corner traces */}
          <svg className="hero-corner-svg" viewBox="0 0 600 400" fill="none">
            <path d="M0 0 H80 L100 20"    stroke={COLORS.cyan}      strokeWidth="1.5" opacity="0.6" />
            <path d="M0 20 V80"            stroke={COLORS.cyan}      strokeWidth="1.5" opacity="0.4" />
            <circle cx="100" cy="20" r="3" fill={COLORS.cyan}        opacity="0.8" />

            <path d="M600 0 H520 L500 20"  stroke={COLORS.purple}    strokeWidth="1.5" opacity="0.6" />
            <path d="M600 20 V80"           stroke={COLORS.purple}    strokeWidth="1.5" opacity="0.4" />
            <circle cx="500" cy="20" r="3" fill={COLORS.purple}      opacity="0.8" />

            <path d="M0 400 H80 L100 380"   stroke={COLORS.neonGreen} strokeWidth="1.5" opacity="0.5" />
            <circle cx="100" cy="380" r="3"  fill={COLORS.neonGreen}  opacity="0.7" />

            <path d="M600 400 H520 L500 380" stroke={COLORS.cyan}    strokeWidth="1.5" opacity="0.5" />
            <circle cx="500" cy="380" r="3"  fill={COLORS.cyan}      opacity="0.7" />
          </svg>

          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-name">NICOLAS OLMEDO</h1>
          <h2 className="hero-title">SENIOR SOFTWARE ENGINEER — FRONTEND</h2>
          <p className="hero-tagline">
            Building polished interfaces · AI-enhanced workflows
          </p>

          <div className="hero-buttons">
            <button className="btn-primary"   onClick={() => scrollTo("experience")}>Experience</button>
            <button className="btn-secondary" onClick={() => scrollTo("contact")}>Contact</button>
          </div>

        </GlassPanel>
      </div>
    </section>
  );
}
