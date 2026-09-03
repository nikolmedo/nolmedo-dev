import React from "react";
import "../styles/about.css";
import { COLORS } from "../constants/colors";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";
import { useReveal } from "../hooks/useReveal";
import { useSectionRef } from "../hooks/useSectionRef";

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
    text:  `I have spent 13+ years across the stack and the last several on frontend work in React
      and TypeScript, mostly in cross-functional teams turning complex requirements into
      interfaces that stay fast, accessible and readable as they grow.`,
  },
  {
    icon:  ">_",
    color: COLORS.neonGreen,
    title: "AI-Enhanced Workflow",
    text:  `Currently pursuing a Master's Degree in Developing with AI, I fold generative tools
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
  const sectionRef = useSectionRef();
  return (
    <section ref={sectionRef} id="about" className="section" aria-labelledby="about-title">
      <SectionTitle id="about-title" label="About" color={COLORS.neonGreen} />

      <div ref={ref} className="about-grid reveal">
        {cards.map((card) => (
          <GlassPanel
            key={card.title}
            className="about-card"
            style={{ "--card-color": card.color } as React.CSSProperties}
          >
            <div className="about-icon-row">
              <span className="about-icon" style={{ color: card.color }} aria-hidden="true">{card.icon}</span>
              <h3 className="about-card-title">{card.title}</h3>
            </div>
            <p>{card.text}</p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
