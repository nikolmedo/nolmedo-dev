import React from "react";
import "../styles/projects.css";
import { COLORS } from "../constants/colors";
import { projectsData } from "../data/projectsData";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";
import { useReveal } from "../hooks/useReveal";

export default function Projects() {
  const ref = useReveal();
  return (
    <section id="projects" className="section">
      <SectionTitle label="Projects" color={COLORS.neonGreen} />

      <div ref={ref} className="projects-grid reveal">
        {projectsData.map((project) => (
          <GlassPanel
            key={project.name}
            className="project-card"
            style={{ borderTopColor: project.color, "--project-color": project.color } as React.CSSProperties}
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
