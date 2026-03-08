export interface ExperienceEntry {
  role:       string;
  company:    string;
  location:   string;
  period:     string;
  highlights: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  period: string;
  detail?: string;
}

export const experienceData: ExperienceEntry[] = [
  {
    role:     "Senior Software Engineer",
    company:  "Medallia",
    location: "Pleasanton, CA",
    period:   "July 2021 — Present",
    highlights: [
      "Built and implemented key functionalities for web applications with React",
      "Designed accessible interfaces in collaboration with cross-functional teams, ensuring optimal UX for diverse audiences",
      "Optimized web applications for speed, scalability, and security",
      "Engineered dashboards for effective data visualization and actionable insights",
      "Performed unit testing and resolved issues to ensure code quality and maintainability",
    ],
  },
  {
    role:     "Principal Software Architect",
    company:  "FactorIT",
    location: "Buenos Aires, Argentina",
    period:   "January 2016 — June 2021",
    highlights: [
      "Managed 3 top-spending accounts, driving end-to-end client satisfaction and account growth",
      "Architected robust, scalable software solutions across multiple platforms",
      "Developed cross-platform mobile applications with Ionic, Angular, and Cordova",
      "Led teams and served as lead internal technical consultant on development best practices",
      "Directed onboarding programs for new hires, accelerating team integration",
    ],
  },
  {
    role:     "Java & Mobile Developer",
    company:  "FactorIT",
    location: "Buenos Aires, Argentina",
    period:   "June 2013 — June 2016",
    highlights: [
      "Reviewed code and debugged errors to improve application performance",
      "Authored fixes and enhancements for production releases",
      "Crafted visually engaging and intuitive mobile layouts",
    ],
  },
];

export const educationData: EducationEntry[] = [
  {
    degree: "Master's Degree — Developing with AI",
    school: "University of Isabel I, Spain",
    period: "2026 (ongoing)",
    detail: "AI architecture, LLMs, RAG systems, LangChain, advanced TypeScript & Python",
  },
  {
    degree: "Technical Degree — Senior Programming",
    school: "Universidad Tecnológica Nacional, Argentina",
    period: "2015 — 2017",
  },
  {
    degree: "Course - React JS",
    school: "Coderhouse, Argentina",
    period: "2020",
  },
  {
    degree: "Course - Android Advanced Programming",
    school: "Universidad Tecnológica Nacional, Argentina",
    period: "2015",
  },
];
