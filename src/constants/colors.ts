export const COLORS = {
  neonGreen: "var(--green)",
  cyan:      "var(--cyan)",
  purple:    "var(--purple)",
} as const;

export type Colors = typeof COLORS;
