import React from "react";
import "../styles/about.css";
import { COLORS } from "../constants/colors";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";
import { useReveal } from "../hooks/useReveal";

interface AboutCard {
  icon:  string;
  color: string;
  title: string;
  text:  string;
}

const cards: AboutCard[] = [
  {
    icon:  "{ }",
    color: COLORS.cyan,
    title: "Engineering Focus",
    text:  `12+ years of full-stack experience, now focused on frontend applications with React
      and TypeScript. Most of my work happens in cross-functional teams, turning complex
      requirements into interfaces that stay fast, accessible, and readable as they grow.`,
  },
  {
    icon:  ">_",
    color: COLORS.neonGreen,
    title: "AI-Enhanced Workflow",
    text:  `Currently pursuing a Master's degree in Development with AI, I fold generative tools
      (Copilot, LLMs, RAG systems) into my daily development workflow. I measure them the way
      I measure any tool: by whether they help ship better software faster.`,
  },
  {
    icon:  "◈",
    color: COLORS.purple,
    title: "Beyond the Screen",
    text:  `Away from the browser I automate my home with Home Assistant, design IoT devices
      with ESP32 and Raspberry Pi, experiment with 3D printing, and take photos. Most of my
      side projects end up connecting software to something physical.`,
  },
];

export default function About() {
  const ref = useReveal();
  return (
    <section id="about" className="section">
      <SectionTitle label="About Me" color={COLORS.neonGreen} />

      <div ref={ref} className="about-grid reveal">
        {cards.map((card) => (
          <GlassPanel
            key={card.title}
            className="about-card"
            style={{ "--card-color": card.color } as React.CSSProperties}
          >
            <div className="about-icon-row">
              <span className="about-icon" style={{ color: card.color }}>{card.icon}</span>
              <h3 className="about-card-title">{card.title}</h3>
            </div>
            <p>{card.text}</p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
