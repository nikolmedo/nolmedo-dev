<div align="center">

# nolmedo.dev

### Nicolas Olmedo · Senior Frontend Engineer

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![WebMCP](https://img.shields.io/badge/WebMCP-Enabled-00E5FF?style=for-the-badge)](public/llm.txt)

**Live → [nolmedo.dev](https://nolmedo.dev)**

An interactive, AI-agent-friendly portfolio with a procedural PCB background rendered in
real time, synthesized audio feedback, haptics, and five switchable neon themes.

</div>

## Highlights

| Area | What it does |
|------|--------------|
| ⚡ **Procedural PCB background** | Canvas-rendered circuit board generated per viewport: traces with 45° routing, pads, and vias. Pulses flow along traces, clicks send ripples through the network, and scrolling feeds energy into the board. |
| 🤖 **WebMCP interoperability** | Implements the Web Model Context Protocol so AI agents can scroll the page, read tech/projects/experience data, switch themes, and trigger animations programmatically. |
| 📄 **llm.txt** | Machine-readable site description at [`/llm.txt`](public/llm.txt) for LLM and agent discovery. |
| 🎨 **Five live themes** | `default`, `cyberpunk`, `matrix`, `synthwave`, `glacier`, all driven by CSS variables and cross-faded in real time (background included). The navbar picker is a dropdown whose trigger shows the active palette, and the choice persists in `localStorage`. |
| 🔊 **Synthesized audio feedback** | Web Audio API tones with calibrated attack/decay envelopes for clicks and category filters, plus a persistent mute toggle (`localStorage`). |
| 📳 **Haptic feedback** | 10 ms micro-vibrations via the Vibration API on mobile. |
| 📱 **Mobile-first background** | Board density, pulse count, and effects adapt to viewport size; touch ripples replace hover physics; ambient glow keeps small screens rich. |
| 🚀 **Performance & a11y** | Lazy-loaded sections, ~46 kB gzipped vendor chunk, semantic HTML, `prefers-reduced-motion` support, animations paused on hidden tabs. |

## The PCB Background

The background is a small physics-flavored simulation, not a static asset
([`src/components/PCBBackground.tsx`](src/components/PCBBackground.tsx)):

- Traces, pads, and vias are generated procedurally for the exact viewport, so mobile
  gets a properly dense board instead of a cropped desktop one.
- The circuit is alive: data pulses travel along traces with glowing tails, traces
  breathe, pads flicker.
- Every click or tap emits an expanding ripple that excites nearby pads and fires
  pulses from the closest traces. On desktop, the pointer acts as a flashlight
  revealing the circuitry underneath.
- Scroll velocity charges the board (brighter traces, faster pulses) and drives a
  two-layer parallax for depth.
- Colors are read from the active theme's CSS variables and cross-faded on theme
  change.
- It honors `prefers-reduced-motion` with a static render and pauses the loop when
  the tab is hidden.

## Built for AI Agents

The site registers WebMCP tools on `navigator.modelContext` and exposes a console
helper at `window.webmcp`. Try it in the browser DevTools on [nolmedo.dev](https://nolmedo.dev):

```js
await window.webmcp.changeTheme({ theme: "cyberpunk" });
await window.webmcp.triggerPCBEvent({ type: "burst" });
await window.webmcp.getProjects();
```

| Tool | Description |
|------|-------------|
| `scrollToSection({ section })` | Smooth-scrolls to `hero`, `about`, `tech`, `projects`, `experience`, or `contact` |
| `getTechStack()` | Tech stack grouped by category |
| `getProjects()` | Featured projects with descriptions and links |
| `getExperience()` | Work experience and education |
| `changeTheme({ theme })` | Switches between the five color themes in real time |
| `triggerPCBEvent({ type })` | Fires a `burst` (pulse storm) or `scan` (sweep) on the background |

## Quick Start

```bash
git clone https://github.com/nikolmedo/nolmedo-dev.git
cd nolmedo-dev
npm install
npm run dev       # http://localhost:5173
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Project Structure

```
src/
├── App.tsx                  # Root: theme state, section observer, scroll progress
├── components/              # One component per section + shared UI
│   ├── PCBBackground.tsx    # Procedural canvas circuit board
│   ├── Navbar.tsx           # Navigation, theme & mute controls
│   └── ...                  # Hero, About, TechStack, Projects, Experience, Contact
├── data/                    # Content as typed data (experience, projects, tech, nav)
├── hooks/                   # useWebMCP, useReveal, useFeedback
├── styles/                  # One CSS file per component + global themes
└── utils/                   # Web Audio feedback manager
```

Content lives in `src/data/*.ts`, so updating experience, projects, or the tech stack
never requires touching components.

## About Me

Senior Frontend Engineer with 13+ years of experience building high-performance web
applications with React & TypeScript. Currently at Medallia, pursuing a Master's
degree in Developing with AI.

### Experience

| Period | Role | Company |
|--------|------|---------|
| Jul 2021 - Present | Senior Software Engineer | Medallia · Pleasanton, CA |
| Jan 2016 - Jun 2021 | Principal Software Architect | FactorIT · Buenos Aires, AR |
| Jun 2013 - Jun 2016 | Java & Mobile Developer | FactorIT · Buenos Aires, AR |

### Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/Spring-6DB33F?style=flat-square&logo=spring&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)

![Claude AI](https://img.shields.io/badge/Claude-000000?style=flat-square&logo=claude&logoColor=white)
![GitHub Copilot](https://img.shields.io/badge/Copilot-000000?style=flat-square&logo=github&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-4285F4?style=flat-square&logo=google&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white)

![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazon-web-services&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=flat-square&logo=google-cloud&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=flat-square&logo=firebase&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Home Assistant](https://img.shields.io/badge/Home_Assistant-41BDF5?style=flat-square&logo=home-assistant&logoColor=white)
![Raspberry Pi](https://img.shields.io/badge/Raspberry_Pi-A22846?style=flat-square&logo=raspberry-pi&logoColor=white)
![ESP32](https://img.shields.io/badge/ESP32-000000?style=flat-square&logo=espressif&logoColor=white)

### Featured Projects

| Project | Description | Tags |
|---------|-------------|------|
| [ClaudePulse](https://github.com/nikolmedo/ClaudePulse) | Home Assistant custom integration that monitors Claude.ai usage metrics in a Home Assistant dashboard. 10 sensor entities, automatic updates every 2 minutes. | `Python` `Home Assistant` `HACS` `Anthropic` |
| [AIOversight](https://github.com/nikolmedo/AIOversight) | Desktop tray app that monitors AI coding agents in real time: instant notifications when an agent finishes or needs approval, plus quota and spend tracking across Anthropic, OpenAI, Copilot, and Cursor. Local-first, no cloud, no telemetry. | `TypeScript` `Electron` `Claude Code` `OpenAI` |
| [PixelPotion](https://github.com/nikolmedo/PixelPotion) | Raspberry Pi camera that transforms photos into artistic styles (Pixar 3D, anime, watercolor, oil painting, cyberpunk) at the press of a physical button. Powered by Gemini, delivered via Telegram. | `Python` `Raspberry Pi` `Gemini` `IoT` |
| [GenderReveal](https://github.com/nikolmedo/GenderReveal) | Web app for synchronized gender reveal events: everyone opens the same countdown link and learns the answer at the same second, with the secret kept server-side and clock drift corrected across devices. Anonymous voting and a bilingual interface. | `TypeScript` `Next.js` `Turso` `Vercel` |
| [Cortex](https://github.com/nikolmedo/cortex) | Generative knowledge graph visualizer: any query goes to a Gemini model with Google Search grounding that returns the facts plus a presentation spec (layout archetype, mood, motif, palette), rendered as an animated, pan-and-zoom node graph. | `TypeScript` `React` `Gemini` `Genkit` `d3-force` |

## Contact

[![Website](https://img.shields.io/badge/nolmedo.dev-0A0A0F?style=for-the-badge&logo=google-chrome&logoColor=00FFFF)](https://nolmedo.dev)
[![Email](https://img.shields.io/badge/nikolmedo@gmail.com-0A0A0F?style=for-the-badge&logo=gmail&logoColor=EA4335)](mailto:nikolmedo@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A0A0F?style=for-the-badge&logo=linkedin&logoColor=0A66C2)](https://www.linkedin.com/in/nolmedo)
[![GitHub](https://img.shields.io/badge/GitHub-0A0A0F?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nikolmedo)

<div align="center">

© 2026 Nicolas Olmedo · Built with React & TypeScript

</div>
