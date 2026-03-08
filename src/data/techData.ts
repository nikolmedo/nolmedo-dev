import { COLORS } from "../constants/colors";

export interface TechCategory {
  category: string;
  color:    string;
  items:    string[];
}

export const techData: TechCategory[] = [
  {
    category: "Core",
    color:    COLORS.cyan,
    items:    ["React", "TypeScript", "JavaScript", "HTML/CSS", "GraphQL", "Node.js"],
  },
  {
    category: "Backend & Frameworks",
    color:    COLORS.purple,
    items:    ["Java", "Spring", "Hibernate", "Angular", "Ionic", "Python"],
  },
  {
    category: "Tools & AI",
    color:    COLORS.neonGreen,
    items:    ["Copilot", "Gemini", "OpenAI", "Anthropic", "Ollama/Llama", "n8n", "DeepSeek"],
  },
  {
    category: "Cloud & DevOps",
    color:    COLORS.cyan,
    items:    ["AWS", "Google Cloud", "Firebase", "CI/CD", "Docker", "Git"],
  },
  {
    category: "Hardware / IoT",
    color:    COLORS.purple,
    items:    ["Home Assistant", "ESP32", "Raspberry Pi", "ESPHome", "3D Printing"],
  },
];
