export interface Theme {
  id:    string;
  label: string;
}

export const THEMES: Theme[] = [
  { id: "default",   label: "Default"   },
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "matrix",    label: "Matrix"    },
  { id: "synthwave", label: "Synthwave" },
  { id: "glacier",   label: "Glacier"   },
];
