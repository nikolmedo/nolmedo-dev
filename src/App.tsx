import { useState, useEffect } from "react";
import "./styles/global.css";

import { lazy, Suspense } from "react";
import PCBBackground from "./components/PCBBackground";
import Navbar        from "./components/Navbar";
import Hero          from "./components/Hero";

const About      = lazy(() => import("./components/About"));
const TechStack  = lazy(() => import("./components/TechStack"));
const Projects   = lazy(() => import("./components/Projects"));
const Experience = lazy(() => import("./components/Experience"));
const Contact    = lazy(() => import("./components/Contact"));

const SECTION_IDS = [
  "hero",
  "about",
  "tech",
  "projects",
  "experience",
  "contact",
];

export default function NolmedoDev() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="nolmedo-root">
      <PCBBackground />
      <Navbar activeSection={activeSection} />
      <Hero />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <About />
        <TechStack />
        <Projects />
        <Experience />
        <Contact />
      </Suspense>
    </main>
  );
}
