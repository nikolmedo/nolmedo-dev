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
    name:  "PixelPotion",
    icon:  "◈",
    color: COLORS.neonGreen,
    description:
      "A Raspberry Pi camera system that transforms photos into artistic styles—Pixar 3D, anime, watercolor, oil painting, cyberpunk—at the press of a physical button. Powered by Google Gemini AI and delivered instantly via Telegram.",
    tags:   ["Python", "Raspberry Pi", "Google Gemini", "Nano Banana", "Telegram API", "IoT"],
    github: "https://github.com/nikolmedo/PixelPotion",
  },
  {
    name:  "ClaudePulse",
    icon:  "⚡",
    color: COLORS.cyan,
    description:
      "A Home Assistant custom integration that monitors Claude.ai usage metrics directly in your smart home dashboard. Tracks session and weekly consumption with 10 sensor entities and automatic updates every two minutes.",
    tags:   ["Python", "Home Assistant", "HACS", "YAML", "Claude API"],
    github: "https://github.com/nikolmedo/ClaudePulse",
  },
];
