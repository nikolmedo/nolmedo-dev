import { useState, useEffect } from "react";
import "./styles/global.css";

import PCBBackground from "./components/PCBBackground";
import Navbar        from "./components/Navbar";
import Hero          from "./components/Hero";
import About         from "./components/About";
import TechStack     from "./components/TechStack";
import Projects      from "./components/Projects";
import Experience    from "./components/Experience";
import Contact       from "./components/Contact";

const SECTION_IDS = ["hero", "about", "tech", "projects", "experience", "contact"];

export default function NolmedoDev() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="nolmedo-root">
      <PCBBackground />
      <Navbar activeSection={activeSection} />
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Experience />
      <Contact />
    </div>
  );
}
