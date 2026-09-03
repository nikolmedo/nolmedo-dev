import { useState, useEffect, useRef, useCallback } from "react";
import "./styles/global.css";

import { lazy, Suspense } from "react";
import PCBBackground from "./components/PCBBackground";
import Navbar        from "./components/Navbar";
import Hero          from "./components/Hero";
import { useWebMCP } from "./hooks/useWebMCP";
import { SectionObserverContext } from "./hooks/useSectionRef";

const About      = lazy(() => import("./components/About"));
const TechStack  = lazy(() => import("./components/TechStack"));
const Projects   = lazy(() => import("./components/Projects"));
const Experience = lazy(() => import("./components/Experience"));
const Contact    = lazy(() => import("./components/Contact"));

export default function NolmedoDev() {
  const [activeSection, setActiveSection] = useState("hero");
  const [theme, setTheme] = useState("default");
  const sectionsRef = useRef(new Set<Element>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((el: Element) => {
    sectionsRef.current.add(el);
    observerRef.current?.observe(el);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sectionsRef.current.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  // Update scroll progress bar Custom Property
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  useWebMCP(setTheme);

  return (
    <div className="nolmedo-root" data-theme={theme}>
      <a className="skip-link sr-only" href="#main">Skip to content</a>

      {/* Cyber-Grid background container */}
      <div className="cyber-grid" />

      <div className="scroll-progress-bar" />
      <PCBBackground theme={theme} />
      <header>
        <Navbar activeSection={activeSection} />
      </header>
      <SectionObserverContext.Provider value={observe}>
        <main id="main">
          <Hero />
          <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
            <About />
            <TechStack />
            <Projects />
            <Experience />
            <Contact />
          </Suspense>
        </main>
      </SectionObserverContext.Provider>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Nicolas Olmedo · Built with React & TypeScript</p>
      </footer>
    </div>
  );
}
