import React from "react";
import "../styles/tech.css";
import { COLORS } from "../constants/colors";
import { techData } from "../data/techData";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";
import { useReveal } from "../hooks/useReveal";

export default function TechStack() {
  const ref = useReveal();
  return (
    <section id="tech" className="section">
      <SectionTitle label="Tech Stack" color={COLORS.cyan} />

      <div ref={ref} className="tech-categories reveal">
        {techData.map((cat) => (
          <div key={cat.category} className="tech-category">

            <h3 className="tech-category-label" style={{ color: cat.color }}>
              <span className="tech-node" style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
              {cat.category}
            </h3>

            <div className="tech-grid">
              {cat.items.map((item) => (
                <GlassPanel
                  key={item}
                  className="tech-chip"
                  style={{ "--chip-color": cat.color } as React.CSSProperties}
                >
                  <span className="tech-chip-dot" style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }} />
                  {item}
                </GlassPanel>
              ))}
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
