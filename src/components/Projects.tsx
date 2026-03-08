import "../styles/projects.css";
import { COLORS } from "../constants/colors";
import { projectsData } from "../data/projectsData";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <SectionTitle label="Projects" color={COLORS.neonGreen} />

      <div className="projects-grid">
        {projectsData.map((project) => (
          <GlassPanel
            key={project.name}
            className="project-card"
            style={{ borderTopColor: project.color }}
          >
            <div className="project-header">
              <span className="project-icon" style={{ color: project.color }}>
                {project.icon}
              </span>
              <h3 className="project-name">{project.name}</h3>
            </div>

            <p className="project-description">{project.description}</p>

            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>

            <div className="project-footer">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-github-link"
                style={{ color: project.color }}
              >
                <span>View on GitHub</span>
                <span className="project-github-arrow">→</span>
              </a>
            </div>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
