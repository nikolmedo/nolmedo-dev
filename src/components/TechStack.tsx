import "../styles/tech.css";
import { COLORS } from "../constants/colors";
import { techData } from "../data/techData";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";

export default function TechStack() {
  return (
    <section id="tech" className="section">
      <SectionTitle label="Tech Stack" color={COLORS.cyan} />

      <div className="tech-categories">
        {techData.map((cat) => (
          <div key={cat.category} className="tech-category">

            <h3 className="tech-category-label" style={{ color: cat.color }}>
              <span className="tech-node" style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
              {cat.category}
            </h3>

            <div className="tech-grid">
              {cat.items.map((item) => (
                <GlassPanel key={item} className="tech-chip">
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
