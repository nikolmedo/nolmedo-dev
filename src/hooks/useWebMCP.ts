import { useEffect } from "react";
import { techData } from "../data/techData";
import { projectsData } from "../data/projectsData";
import { experienceData, educationData } from "../data/experienceData";

export function useWebMCP(
  changeTheme: (theme: string) => void
) {
  useEffect(() => {
    const nav = navigator as any;
    const tools = [
      {
        name: "scrollToSection",
        description: "Smoothly scrolls the page to the specified section (hero, about, tech, projects, experience, contact).",
        inputSchema: {
          type: "object",
          properties: {
            section: {
              type: "string",
              enum: ["hero", "about", "tech", "projects", "experience", "contact"],
              description: "The target section ID to scroll to"
            }
          },
          required: ["section"]
        },
        execute: async ({ section }: { section: string }) => {
          const el = document.getElementById(section);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            return { success: true, message: `Scrolled to section ${section}` };
          }
          return { success: false, error: `Section ${section} not found.` };
        }
      },
      {
        name: "getTechStack",
        description: "Returns Nicolas Olmedo's tech stack and skills grouped by category.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          return { success: true, techStack: techData };
        }
      },
      {
        name: "getProjects",
        description: "Retrieves the list of featured projects developed by Nicolas, with descriptions and URLs.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          return { success: true, projects: projectsData };
        }
      },
      {
        name: "getExperience",
        description: "Retrieves Nicolas's work experience and educational history.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          return { success: true, experience: experienceData, education: educationData };
        }
      },
      {
        name: "changeTheme",
        description: "Changes the portfolio's color theme and visual style in real-time (default, cyberpunk, matrix, synthwave, glacier).",
        inputSchema: {
          type: "object",
          properties: {
            theme: {
              type: "string",
              enum: ["default", "cyberpunk", "matrix", "synthwave", "glacier"],
              description: "The color theme name"
            }
          },
          required: ["theme"]
        },
        execute: async ({ theme }: { theme: string }) => {
          changeTheme(theme);
          return { success: true, theme, message: `Theme changed to: ${theme}` };
        }
      },
      {
        name: "triggerPCBEvent",
        description: "Triggers an extra electromagnetic pulse animation or a data scan on the background PCB board.",
        inputSchema: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["burst", "scan"], description: "Type of data pulse event" }
          },
          required: ["type"]
        },
        execute: async ({ type }: { type: string }) => {
          const event = new CustomEvent("pcb-trigger", { detail: { type } });
          window.dispatchEvent(event);
          return { success: true, message: `PCB event '${type}' triggered.` };
        }
      }
    ];

    if (nav.modelContext && typeof nav.modelContext.registerTool === "function") {
      try {
        tools.forEach((tool) => {
          nav.modelContext.registerTool(tool);
        });
        console.log("🚀 WebMCP registered successfully with navigator.modelContext");
      } catch (err) {
        console.warn("⚠️ Error registering WebMCP:", err);
      }
    }

    const webmcpHelper: Record<string, any> = {};
    tools.forEach((tool) => {
      webmcpHelper[tool.name] = async (args: any = {}) => {
        console.log(`[WebMCP-Sim] Executing tool '${tool.name}' with args:`, args);
        const result = await tool.execute(args);
        console.log(`[WebMCP-Sim] Result of '${tool.name}':`, result);
        return result;
      };
    });
    
    (window as any).webmcp = webmcpHelper;
    
    console.log(
      "%c🤖 WebMCP Interoperability Active %c\nYou can test it from the console using %cwindow.webmcp%c. Example:\n  %cawait window.webmcp.changeTheme({ theme: 'cyberpunk' })\n  %cawait window.webmcp.triggerPCBEvent({ type: 'burst' })",
      "background: #00e5ff; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;",
      "color: inherit;",
      "color: #39ff14; font-family: monospace; font-weight: bold;",
      "color: inherit;",
      "color: #b44aff; font-family: monospace;",
      "color: #b44aff; font-family: monospace;"
    );

    return () => {
      if (nav.modelContext && typeof nav.modelContext.unregisterTool === "function") {
        tools.forEach((tool) => {
          try {
            nav.modelContext.unregisterTool(tool.name);
          } catch (e) {}
        });
      }
      delete (window as any).webmcp;
    };
  }, [changeTheme]);
}
