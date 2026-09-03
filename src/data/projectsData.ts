import { COLORS } from "../constants/colors";

export interface Project {
  name:        string;
  description: string;
  tags:        string[];
  color:       string;
  github:      string;
  icon:        string;
}

export const projectsData: Project[] = [
  {
    name:  "GenderReveal",
    icon:  "◐",
    color: COLORS.purple,
    description:
      "A web app for synchronized gender reveal events. Guests open a shared countdown link and learn the answer at the exact same second, with the secret kept server-side until reveal time and clock drift corrected across devices. Includes anonymous voting, a custom two-color palette, and a bilingual English/Spanish interface.",
    tags:   ["TypeScript", "Next.js", "React", "Turso", "SQLite", "Vercel"],
    github: "https://github.com/nikolmedo/GenderReveal",
  },
  {
    name:  "AIOversight",
    icon:  "⊙",
    color: COLORS.purple,
    description:
      "A desktop tray app that acts as a control tower for AI coding agents. Notifies the instant an agent finishes or needs approval, and tracks quota and spend across Anthropic, OpenAI, Copilot, and Cursor. Local-first: encrypted credentials, no cloud, no telemetry.",
    tags:   ["TypeScript", "Electron", "Claude Code", "Anthropic", "OpenAI"],
    github: "https://github.com/nikolmedo/AIOversight",
  },
  {
    name:  "PixelPotion",
    icon:  "◈",
    color: COLORS.neonGreen,
    description:
      "Raspberry Pi camera system that transforms photos into artistic styles (Pixar 3D, anime, watercolor, oil painting, cyberpunk) at the press of a physical button. Powered by Google Gemini AI and delivered instantly via Telegram.",
    tags:   ["Python", "Raspberry Pi", "Gemini", "Telegram API", "IoT"],
    github: "https://github.com/nikolmedo/PixelPotion",
  },
  {
    name:  "ClaudePulse",
    icon:  "%",
    color: COLORS.cyan,
    description:
      "Home Assistant custom integration that monitors Claude.ai usage metrics directly in a Home Assistant dashboard. Tracks session and weekly consumption with 10 sensor entities and automatic updates every two minutes.",
    tags:   ["Python", "Home Assistant", "HACS", "YAML", "Anthropic"],
    github: "https://github.com/nikolmedo/ClaudePulse",
  },
];
