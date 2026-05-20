import React, { useState } from "react";
import "../styles/tech.css";
import { COLORS } from "../constants/colors";
import { techData } from "../data/techData";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";
import { useReveal } from "../hooks/useReveal";
import { useFeedback } from "../hooks/useFeedback";

export default function TechStack() {
  const ref = useReveal();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { playGalacticHover } = useFeedback();

  const toggleCategory = (catName: string) => {
    playGalacticHover();
    setActiveCategory(prev => (prev === catName ? null : catName));
  };

  return (
    <section id="tech" className="section">
      <SectionTitle label="Tech Stack" color={COLORS.cyan} />

      <div ref={ref} className="tech-categories reveal">
        {techData.map((cat) => {
          const isSelected = activeCategory === cat.category;
          const isDimmed = activeCategory !== null && !isSelected;

          return (
            <div 
              key={cat.category} 
              className={`tech-category ${isDimmed ? "tech-category-dimmed" : ""} ${isSelected ? "tech-category-selected" : ""}`}
              style={{ opacity: isDimmed ? 0.35 : 1, transition: "all 0.4s ease" }}
            >

              <h3 
                className="tech-category-label" 
                style={{ color: cat.color, cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                onClick={() => toggleCategory(cat.category)}
              >
                <span 
                  className="tech-node" 
                  style={{ 
                    background: cat.color, 
                    boxShadow: isSelected ? `0 0 16px ${cat.color}` : `0 0 8px ${cat.color}`,
                    transform: isSelected ? "scale(1.3)" : "scale(1)",
                    transition: "all 0.3s ease"
                  }} 
                />
                {cat.category}
                {isSelected && <span style={{ fontSize: "11px", marginLeft: "8px", opacity: 0.7 }}>(active)</span>}
              </h3>

              <div className="tech-grid">
                {cat.items.map((item) => (
                  <GlassPanel
                    key={item}
                    className="tech-chip"
                    style={{ 
                      "--chip-color": cat.color,
                      transform: isSelected ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.3s ease"
                    } as React.CSSProperties}
                  >
                    <span 
                      className="tech-chip-dot" 
                      style={{ 
                        background: cat.color, 
                        boxShadow: `0 0 6px ${cat.color}`,
                        transform: isSelected ? "scale(1.2)" : "scale(1)",
                        transition: "all 0.3s ease"
                      }} 
                    />
                    {item}
                  </GlassPanel>
                ))}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
