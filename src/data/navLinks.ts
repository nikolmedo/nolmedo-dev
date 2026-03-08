export interface NavLink {
  id:    string;
  label: string;
}

export const navLinks: NavLink[] = [
  { id: "hero",       label: "Home"       },
  { id: "about",      label: "About"      },
  { id: "tech",       label: "Tech Stack" },
  { id: "projects",   label: "Projects"   },
  { id: "experience", label: "Experience" },
  { id: "contact",    label: "Contact"    },
];
