import { useEffect } from "react";

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
          const { techData } = await import("../data/techData");
          return { success: true, techStack: techData };
        }
      },
      {
        name: "getProjects",
        description: "Retrieves the list of featured projects developed by Nicolas, with descriptions and URLs.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          const { projectsData } = await import("../data/projectsData");
          return { success: true, projects: projectsData };
        }
      },
      {
        name: "getExperience",
        description: "Retrieves Nicolas's work experience and educational history.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          const { experienceData, educationData } = await import("../data/experienceData");
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

    const register = () => {
      if (nav.modelContext && typeof nav.modelContext.registerTool === "function") {
        try {
          tools.forEach((tool) => {
            nav.modelContext.registerTool(tool);
          });
          console.log("[WebMCP] Tools registered with navigator.modelContext");
        } catch (err) {
          console.warn("[WebMCP] Failed to register tools:", err);
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
        "%cWebMCP Interoperability Active %c\nYou can test it from the console using %cwindow.webmcp%c. Example:\n  %cawait window.webmcp.changeTheme({ theme: 'cyberpunk' })\n  %cawait window.webmcp.triggerPCBEvent({ type: 'burst' })",
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
            } catch {
              // best-effort cleanup: the tool may already be gone on unmount
            }
          });
        }
        delete (window as any).webmcp;
      };
    };

    // Registration is not needed for first paint; defer it until the browser is idle
    let unregister: (() => void) | undefined;
    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle
      ? window.requestIdleCallback(() => { unregister = register(); })
      : window.setTimeout(() => { unregister = register(); }, 1);

    return () => {
      if (unregister) {
        unregister();
      } else if (idle) {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, [changeTheme]);
}
