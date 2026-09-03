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
    name:  "AIOversight",
    icon:  "⊙",
    color: COLORS.purple,
    description:
      "A desktop tray app that acts as a control tower for AI coding agents. Notifies the instant an agent finishes or needs approval, and tracks quota and spend across Anthropic, OpenAI, Copilot, and Cursor. Local-first: encrypted credentials, no cloud, no telemetry.",
    tags:   ["TypeScript", "Electron", "Claude Code", "Anthropic API", "OpenAI"],
    github: "https://github.com/nikolmedo/AIOversight",
  },
  {
    name:  "PixelPotion",
    icon:  "◈",
    color: COLORS.neonGreen,
    description:
      "A Raspberry Pi camera system that transforms photos into artistic styles (Pixar 3D, anime, watercolor, oil painting, cyberpunk) at the press of a physical button. Powered by Google Gemini AI and delivered instantly via Telegram.",
    tags:   ["Python", "Raspberry Pi", "Google Gemini", "Nano Banana", "Telegram API", "IoT"],
    github: "https://github.com/nikolmedo/PixelPotion",
  },
  {
    name:  "ClaudePulse",
    icon:  "%",
    color: COLORS.cyan,
    description:
      "A Home Assistant custom integration that monitors Claude.ai usage metrics directly in your smart home dashboard. Tracks session and weekly consumption with 10 sensor entities and automatic updates every two minutes.",
    tags:   ["Python", "Home Assistant", "HACS", "YAML", "Claude API"],
    github: "https://github.com/nikolmedo/ClaudePulse",
  },
];
