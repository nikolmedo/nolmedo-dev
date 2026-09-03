export const COLORS = {
  neonGreen: "var(--green)",
  cyan:      "var(--cyan)",
  purple:    "var(--purple)",
  amber:     "var(--amber)",
} as const;

export type Colors = typeof COLORS;
