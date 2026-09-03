# AGENTS.md: Guide for AI Coding Agents

Personal portfolio site for Nicolas Olmedo ([nolmedo.dev](https://nolmedo.dev)).
React 18 + TypeScript + Vite, no router, no state library, no test framework.

## Commands

```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # Production build to dist/ (dist/ is gitignored)
npm run preview    # Serve the production build
npx tsc --noEmit   # Type-check (build does NOT run tsc; always run this before committing)
```

There are no tests or linters configured. Verification = `npx tsc --noEmit` + `npm run build`.

## Architecture

Single-page app, all sections rendered in [`src/App.tsx`](src/App.tsx):

| Path | Responsibility |
|------|----------------|
| `src/App.tsx` | Theme state (`data-theme` attr) + `localStorage` persistence, hosts the section IntersectionObserver via `SectionObserverContext`, scroll progress CSS var |
| `src/components/` | One component per page section + shared UI (`GlassPanel`, `SectionTitle`) |
| `src/components/PCBBackground.tsx` | Procedural canvas circuit-board background (see below) |
| `src/data/*.ts` | All content (experience, projects, tech, nav links) as typed data. Edit content here, never in components |
| `src/hooks/useWebMCP.ts` | WebMCP tool registration (`navigator.modelContext` + `window.webmcp` console helper) |
| `src/hooks/useFeedback.ts` + `src/utils/feedbackManager.ts` | Web Audio synthesized click sounds + Vibration API haptics, mute state in `localStorage` |
| `src/hooks/useReveal.ts` | Scroll-reveal via IntersectionObserver (`.reveal` / `.revealed` classes) |
| `src/hooks/useSectionRef.ts` | Registers a section element with the nav observer owned by `App.tsx` |
| `src/hooks/useScrollProgress.ts` | Single passive, rAF-coalesced scroll subscriber shared by `App` and `Navbar` |
| `src/styles/` | One CSS file per component, imported by that component; `global.css` holds themes, reset, shared UI |

## Conventions

- **Themes**: 5 themes (`default`, `cyberpunk`, `matrix`, `synthwave`, `glacier`) defined
  as CSS variables (`--cyan`, `--purple`, `--green`, `--bg`, `--text`, `--muted`) on
  `.nolmedo-root[data-theme=...]` in `global.css`. The navbar `ThemeSwitcher` selects the
  theme and `App.tsx` persists it under the `theme` key in `localStorage`. Never hardcode
  colors in components; use the CSS variables (or read them at runtime, as the canvas
  background does).
- **Styling**: plain CSS files, one per component, kebab-case class names. No CSS-in-JS,
  no Tailwind.
- **Code splitting**: below-the-fold sections are `lazy()`-loaded in `App.tsx`. Keep new
  heavy components lazy.
- **Dependencies**: only `react` + `react-dom`. Do not add runtime dependencies without
  explicit approval; bundle size is a feature.
- **Motion**: every animation must respect `prefers-reduced-motion` and avoid blocking
  interaction. Background effects stay subtle (low alpha, no flashing).
- **Language**: all code, comments, UI copy, and docs are written in English.

## PCB Background (`PCBBackground.tsx`)

Canvas-based procedural simulation. Key facts before modifying:

- The board (traces/pads/vias) is **regenerated on resize** and sized
  `viewport height + 200px` for two-layer scroll parallax.
- Colors are read from theme CSS variables at runtime and **cross-faded** when the
  `theme` prop changes (bridge: `retintRef`).
- Interaction is window-level (canvas has `pointer-events: none`): pointer move =
  flashlight + pad excitement, pointer down = ripple + pulses, scroll velocity = energy.
- Listens for the `pcb-trigger` CustomEvent (`detail.type`: `"burst" | "scan"`),
  dispatched by the WebMCP tool `triggerPCBEvent`. Keep this contract stable.
- Honors `prefers-reduced-motion` (static render) and pauses on `document.hidden`.

## WebMCP / llm.txt Contract

- Tools registered in `useWebMCP.ts`: `scrollToSection`, `getTechStack`, `getProjects`,
  `getExperience`, `changeTheme`, `triggerPCBEvent`.
- If you add/rename a tool, theme, or section ID, update **all** of:
  `useWebMCP.ts`, `public/llm.txt`, root `llm.txt` (kept in sync), and `README.md`.
- Section IDs (`hero`, `about`, `tech`, `projects`, `experience`, `contact`) are shared
  by `App.tsx`, `navLinks.ts`, and the `scrollToSection` tool enum.

## SEO

`index.html` carries the SEO payload: meta tags, Open Graph, Twitter card, and a
Schema.org `Person` JSON-LD block. Keep it consistent with `src/data/*.ts` when
content changes (experience, education, skills).
