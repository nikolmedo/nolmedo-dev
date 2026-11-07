import React from "react";
import "../styles/projects.css";
import { COLORS } from "../constants/colors";
import { projectsData } from "../data/projectsData";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";
import { useReveal } from "../hooks/useReveal";
import { useFeedback } from "../hooks/useFeedback";
import { useSectionRef } from "../hooks/useSectionRef";

export default function Projects() {
  const ref = useReveal();
  const { triggerClick } = useFeedback();
  const sectionRef = useSectionRef();
  return (
    <section ref={sectionRef} id="projects" className="section" aria-labelledby="projects-title">
      <SectionTitle id="projects-title" label="Projects" color={COLORS.neonGreen} />

      <div ref={ref} className="projects-grid reveal-stagger">
        {projectsData.map((project, i) => {
          const href  = project.website ?? project.github;
          const label = project.website ? "Visit website" : "View on GitHub";
          return (
          <GlassPanel
            key={project.name}
            className={`project-card${project.featured ? " project-card--featured" : ""}`}
            style={{ borderTopColor: project.color, "--project-color": project.color, "--accent": project.color, "--i": i } as React.CSSProperties}
          >
            <div className="project-header">
              <span className="project-icon accent-text" aria-hidden="true">
                {project.icon}
              </span>
              <h3 className="project-name">{project.name}</h3>
              {project.badge && (
                <span className="project-badge accent-text">{project.badge}</span>
              )}
            </div>

            <p className="project-description">{project.description}</p>

            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>

            {href && (
            <div className="project-footer">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-github-link accent-text"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerClick();
                }}
              >
                <span>{label}</span>
                <span className="project-github-arrow">→</span>
              </a>
            </div>
            )}
          </GlassPanel>
          );
        })}
      </div>
    </section>
  );
}
