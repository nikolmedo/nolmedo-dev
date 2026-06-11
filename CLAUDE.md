# CLAUDE.md

Read [AGENTS.md](AGENTS.md) for the full repository guide: commands, architecture,
conventions, and the WebMCP/llm.txt contract.

Quick reminders:

- Verify with `npx tsc --noEmit && npm run build` — the build script does not type-check.
- Content changes go in `src/data/*.ts`, never inside components.
- Never hardcode colors — use the theme CSS variables (`--cyan`, `--purple`, `--green`, …).
- Keep `useWebMCP.ts`, `public/llm.txt`, root `llm.txt`, and `README.md` in sync when
  tools, themes, or section IDs change.
- All code, comments, UI copy, and documentation are written in English.
