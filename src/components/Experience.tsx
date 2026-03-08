import "../styles/experience.css";
import { COLORS } from "../constants/colors";
import { experienceData, educationData } from "../data/experienceData";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <SectionTitle label="Experience" color={COLORS.purple} />

      <div className="timeline">
        <div className="timeline-line" />

        {experienceData.map((job, i) => (
          <div key={i} className="timeline-item">
            <div
              className="timeline-node"
              style={{ background: COLORS.cyan, boxShadow: `0 0 12px ${COLORS.cyan}` }}
            />
            <GlassPanel className="timeline-card">
              <div className="timeline-header">
                <h3 className="timeline-role">{job.role}</h3>
                <span className="timeline-period">{job.period}</span>
              </div>
              <p className="timeline-company">{job.company} · {job.location}</p>
              <ul className="timeline-highlights">
                {job.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            </GlassPanel>
          </div>
        ))}
      </div>

      <SectionTitle label="Education" color={COLORS.neonGreen} />

      <div className="education-grid">
        {educationData.map((ed, i) => (
          <GlassPanel key={i} className="education-card">
            <div
              className="edu-node"
              style={{ background: COLORS.neonGreen, boxShadow: `0 0 8px ${COLORS.neonGreen}` }}
            />
            <h3 className="edu-degree">{ed.degree}</h3>
            <p className="edu-school">{ed.school} · {ed.period}</p>
            <p className="edu-detail">{ed.detail}</p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
