import "../styles/contact.css";
import { COLORS } from "../constants/colors";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";

export default function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <SectionTitle label="Get in Touch" color={COLORS.cyan} />

      <div className="contact-grid">
        <BusinessCard />
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Nicolas Olmedo · Built with React</p>
      </footer>
    </section>
  );
}

function BusinessCard() {
  return (
    <div className="bcard-wrap">
      <GlassPanel className="bcard">

        {/* PCB traces overlay */}
        <svg className="bcard-svg" viewBox="0 0 500 300" fill="none">
          <path d="M0 40 H60 L80 20 H200 L210 30 H300"        stroke={COLORS.cyan}      strokeWidth="1" opacity="0.5" />
          <path d="M500 60 H420 L400 40 H320 L310 50 H240"    stroke={COLORS.purple}    strokeWidth="1" opacity="0.5" />
          <path d="M0 260 H50 L70 280 H180 L190 270 H280"     stroke={COLORS.neonGreen} strokeWidth="1" opacity="0.5" />
          <path d="M500 250 H440 L420 270 H340 L330 260 H260" stroke={COLORS.cyan}      strokeWidth="1" opacity="0.5" />
          <path d="M80 0 V40"    stroke={COLORS.cyan}      strokeWidth="1" opacity="0.3" />
          <path d="M400 0 V40"   stroke={COLORS.purple}    strokeWidth="1" opacity="0.3" />
          <path d="M70 300 V280"  stroke={COLORS.neonGreen} strokeWidth="1" opacity="0.3" />
          <path d="M420 300 V270" stroke={COLORS.cyan}      strokeWidth="1" opacity="0.3" />
          <circle cx="80"  cy="20"  r="3"   fill={COLORS.cyan}      opacity="0.7" />
          <circle cx="400" cy="40"  r="3"   fill={COLORS.purple}    opacity="0.7" />
          <circle cx="70"  cy="280" r="3"   fill={COLORS.neonGreen} opacity="0.7" />
          <circle cx="420" cy="270" r="3"   fill={COLORS.cyan}      opacity="0.7" />
          <circle cx="210" cy="30"  r="2.5" fill={COLORS.cyan}      opacity="0.5" />
          <circle cx="310" cy="50"  r="2.5" fill={COLORS.purple}    opacity="0.5" />
          <circle cx="190" cy="270" r="2.5" fill={COLORS.neonGreen} opacity="0.5" />
          <circle cx="330" cy="260" r="2.5" fill={COLORS.cyan}      opacity="0.5" />
        </svg>

        <div className="bcard-content">
          <h3 className="bcard-name">NICOLAS OLMEDO</h3>
          <p className="bcard-role">SENIOR SOFTWARE ENGINEER — FRONTEND</p>
          <div className="bcard-info">
            <div className="bcard-row">
              <a className="bcard-link" href="mailto:nikolmedo@gmail.com">
                <span className="bcard-icon">✉</span>&nbsp;
                <span>nikolmedo@gmail.com</span>
              </a>
            </div>
            <div className="bcard-row">
              <a className="bcard-link" href="https://www.linkedin.com/in/nolmedo" target="_blank" rel="noopener noreferrer">
                <span className="bcard-icon">in</span>&nbsp;
                <span>/in/nolmedo</span>
              </a>
            </div>
            <div className="bcard-row">
              <a className="bcard-link" href="https://github.com/nolmedo" target="_blank" rel="noopener noreferrer">
                <span className="bcard-icon">⚙</span>&nbsp;
                <span>github.com/nolmedo</span>
              </a>
            </div>
            <div className="bcard-row">
              <a className="bcard-link" href="https://nolmedo.dev" target="_blank" rel="noopener noreferrer">
                <span className="bcard-icon">⊕</span>&nbsp;
                <span>nolmedo.dev</span>
              </a>
            </div>
          </div>
        </div>

      </GlassPanel>
    </div>
  );
}
