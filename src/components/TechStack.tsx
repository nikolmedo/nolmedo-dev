import React, { useState } from "react";
import "../styles/tech.css";
import { COLORS } from "../constants/colors";
import { techData } from "../data/techData";
import SectionTitle from "./SectionTitle";
import { useReveal } from "../hooks/useReveal";
import { useFeedback } from "../hooks/useFeedback";
import { useSectionRef } from "../hooks/useSectionRef";

export default function TechStack() {
  const ref = useReveal();
  const sectionRef = useSectionRef();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { playChipClick } = useFeedback();

  const toggleCategory = (catName: string) => {
    playChipClick();
    setActiveCategory(prev => (prev === catName ? null : catName));
  };

  return (
    <section ref={sectionRef} id="tech" className="section" aria-labelledby="tech-title">
      <SectionTitle id="tech-title" label="Tech Stack" color={COLORS.cyan} />

      <div ref={ref} className="tech-categories reveal">
        {techData.map((cat) => {
          const isSelected = activeCategory === cat.category;
          const isDimmed = activeCategory !== null && !isSelected;

          return (
            <div 
              key={cat.category} 
              className={`tech-category ${isDimmed ? "tech-category-dimmed" : ""} ${isSelected ? "tech-category-selected" : ""}`}
            >

              <h3 style={{ color: cat.color }}>
                <button
                  type="button"
                  className="tech-category-label"
                  aria-pressed={isSelected}
                  onClick={() => toggleCategory(cat.category)}
                >
                  <span
                    className="tech-node"
                    style={{
                      background: cat.color,
                      boxShadow: isSelected ? `0 0 16px ${cat.color}` : `0 0 8px ${cat.color}`
                    }}
                  />
                  {cat.category}
                </button>
              </h3>

              <div className="tech-grid">
                {cat.items.map((item) => (
                  <div
                    key={item}
                    className={`tech-chip ${isSelected ? "tech-chip-active" : ""}`}
                    style={{ "--chip-color": cat.color } as React.CSSProperties}
                  >
                    <span
                      className="tech-chip-dot"
                      style={{
                        background: cat.color,
                        boxShadow: `0 0 6px ${cat.color}`
                      }}
                    />
                    {item}
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
