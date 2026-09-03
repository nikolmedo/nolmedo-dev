import { useState, useEffect, useRef, useCallback } from "react";
import "./styles/global.css";

import { lazy, Suspense } from "react";
import PCBBackground from "./components/PCBBackground";
import Navbar        from "./components/Navbar";
import Hero          from "./components/Hero";
import { useWebMCP } from "./hooks/useWebMCP";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { SectionObserverContext } from "./hooks/useSectionRef";

const About      = lazy(() => import("./components/About"));
const TechStack  = lazy(() => import("./components/TechStack"));
const Projects   = lazy(() => import("./components/Projects"));
const Experience = lazy(() => import("./components/Experience"));
const Contact    = lazy(() => import("./components/Contact"));

const sectionFallback = (
  <div className="section-fallback" role="status" aria-label="Loading section" />
);

export default function NolmedoDev() {
  const [activeSection, setActiveSection] = useState("hero");
  const [theme, setTheme] = useState("default");
  const sectionsRef = useRef(new Set<Element>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hashHandledRef = useRef(false);

  // Lazy sections mount late; the one matching the URL hash is scrolled into view once on cold load.
  const observe = useCallback((el: Element) => {
    sectionsRef.current.add(el);
    observerRef.current?.observe(el);

    if (!hashHandledRef.current && location.hash === `#${el.id}`) {
      hashHandledRef.current = true;
      el.scrollIntoView({ behavior: "auto" });
    }
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

  useScrollProgress((progress) => {
    document.documentElement.style.setProperty("--scroll-progress", String(progress));
  });

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
          <Suspense fallback={sectionFallback}>
            <About />
          </Suspense>
          <Suspense fallback={sectionFallback}>
            <TechStack />
          </Suspense>
          <Suspense fallback={sectionFallback}>
            <Projects />
          </Suspense>
          <Suspense fallback={sectionFallback}>
            <Experience />
          </Suspense>
          <Suspense fallback={sectionFallback}>
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
