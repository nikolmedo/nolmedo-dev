import "../styles/about.css";
import { COLORS } from "../constants/colors";
import GlassPanel from "./GlassPanel";
import SectionTitle from "./SectionTitle";

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
    text:  `With 12+ years of full-stack experience, I specialize in crafting performant and
      accessible frontend applications using React and TypeScript. I thrive in cross-functional
      teams, translating complex requirements into clean, intuitive interfaces while optimizing
      for speed, scalability, and code quality.`,
  },
  {
    icon:  "⚡",
    color: COLORS.neonGreen,
    title: "AI-Enhanced Workflow",
    text:  `Currently pursuing a Master's degree in Development with AI, I integrate generative AI
      tools—Copilot, LLMs, RAG systems—directly into my development lifecycle. I'm passionate
      about leveraging AI not as a novelty, but as a genuine force multiplier for engineering
      productivity.`,
  },
  {
    icon:  "◈",
    color: COLORS.purple,
    title: "Beyond the Screen",
    text:  `My passion extends beyond the browser. I build smart home automations with Home Assistant,
      design custom IoT devices with ESP32 and Raspberry Pi, experiment with 3D printing, and
      capture moments through photography—always looking for ways to bridge the digital and
      physical worlds.`,
  },
];

export default function About() {
  return (
    <section id="about" className="section">
      <SectionTitle label="About Me" color={COLORS.neonGreen} />

      <div className="about-grid">
        {cards.map((card) => (
          <GlassPanel key={card.title} className="about-card">
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
