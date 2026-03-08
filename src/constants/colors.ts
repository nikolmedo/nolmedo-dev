export const COLORS = {
  bg:          "#060610",
  neonGreen:   "#39FF14",
  cyan:        "#00E5FF",
  purple:      "#B44AFF",
  glass:       "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassHover:  "rgba(255,255,255,0.08)",
  text:        "#e8e8f0",
  textMuted:   "#8888aa",
} as const;

export type Colors = typeof COLORS;
