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
    period:   "July 2021 - Present",
    highlights: [
      "Built key features for web applications with React",
      "Designed accessible interfaces in collaboration with design and product teams",
      "Worked on the Cloud Builder, Manager & Installer SDK, cutting up to 70,000 hours quarterly from client instance configuration",
      "Redesigned the application's core navigation interface, accelerating task completion by 70%",
      "Built data-visualization dashboards",
    ],
  },
  {
    role:     "Principal Software Architect",
    company:  "FactorIT",
    location: "Buenos Aires, Argentina",
    period:   "January 2016 - June 2021",
    highlights: [
      "Managed the 3 top-spending client accounts end to end",
      "Designed software architectures for web and mobile platforms",
      "Developed cross-platform mobile applications with Ionic, Angular, and Cordova",
      "Led development teams and advised internally on development best practices",
      "Directed onboarding programs for new hires",
    ],
  },
  {
    role:     "Java & Mobile Developer",
    company:  "FactorIT",
    location: "Buenos Aires, Argentina",
    period:   "June 2013 - June 2016",
    highlights: [
      "Reviewed code and debugged errors to improve application performance",
      "Authored fixes and enhancements for production releases",
      "Designed and built mobile UI layouts",
    ],
  },
];

export const educationData: EducationEntry[] = [
  {
    degree: "Master's Degree in Developing with AI",
    school: "Universidad Isabel I, Spain",
    period: "2026 (in progress)",
    detail: "AI architecture, LLMs, RAG systems, LangChain, advanced TypeScript & Python",
  },
  {
    degree: "Diploma - React",
    school: "Coderhouse, Argentina",
    period: "2020",
  },
  {
    degree: "Higher Technical Degree in Programming",
    school: "Universidad Tecnológica Nacional, Argentina",
    period: "2015 - 2017",
  },
  {
    degree: "Diploma - Android Advanced Programming",
    school: "Universidad Tecnológica Nacional, Argentina",
    period: "2015",
  },
  {
    degree: "Bachelor of Science - Software Engineering (incomplete)",
    school: "Universidad Nacional de la Matanza, Argentina",
    period: "2012 - 2015",
  },
];
