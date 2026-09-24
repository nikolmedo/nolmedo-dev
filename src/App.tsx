import { useState, useEffect, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import "./styles/global.css";

import { lazy, Suspense } from "react";
import PCBBackground from "./components/PCBBackground";
import Navbar        from "./components/Navbar";
import Hero          from "./components/Hero";
import { useWebMCP } from "./hooks/useWebMCP";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { SectionObserverContext } from "./hooks/useSectionRef";
import { THEMES } from "./data/themes";

const About      = lazy(() => import("./components/About"));
const TechStack  = lazy(() => import("./components/TechStack"));
const Projects   = lazy(() => import("./components/Projects"));
const Experience = lazy(() => import("./components/Experience"));
const Contact    = lazy(() => import("./components/Contact"));

const sectionFallback = (
  <div className="section-fallback" role="status" aria-label="Loading section" />
);

const readStoredTheme = () => {
  try {
    const stored = localStorage.getItem("theme");
    return stored && THEMES.some((t) => t.id === stored) ? stored : "default";
  } catch {
    return "default";
  }
};

export default function NolmedoDev() {
  const [activeSection, setActiveSection] = useState("hero");
  const [theme, setTheme] = useState(readStoredTheme);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef(new Set<Element>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hashHandledRef = useRef(false);
  const observedSectionRef = useRef("hero");
  const atBottomRef = useRef(false);

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
          if (!entry.isIntersecting) return;
          observedSectionRef.current = entry.target.id;
          if (!atBottomRef.current) setActiveSection(entry.target.id);
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

  // The observer strip never reaches the last section, so the page bottom claims "contact"
  // and hands control back to the last observed section once the user scrolls up again.
  useScrollProgress((progress) => {
    document.documentElement.style.setProperty("--scroll-progress", String(progress));
    const atBottom = progress >= 0.995;
    if (atBottom === atBottomRef.current) return;
    atBottomRef.current = atBottom;
    setActiveSection(atBottom ? "contact" : observedSectionRef.current);
  });

  // Persist the theme and keep the browser chrome color in sync with --bg
  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Storage can be blocked; the theme still applies for this session
    }
    if (!rootRef.current) return;
    const bg = getComputedStyle(rootRef.current).getPropertyValue("--bg").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
  }, [theme]);

  // Cross-fades the whole page in one snapshot where View Transitions are supported
  const changeTheme = useCallback((id: string) => {
    if (!THEMES.some((t) => t.id === id)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced || id === themeRef.current) {
      setTheme(id);
      return;
    }
    const html = document.documentElement;
    html.classList.add("theme-transition");
    const transition = document.startViewTransition(() => flushSync(() => setTheme(id)));
    transition.finished.finally(() => html.classList.remove("theme-transition"));
  }, []);

  useWebMCP(changeTheme);

  return (
    <div ref={rootRef} className="nolmedo-root" data-theme={theme}>
      <a className="skip-link sr-only" href="#main">Skip to content</a>

      {/* Cyber-Grid background container */}
      <div className="cyber-grid" />

      <div className="scroll-progress-bar" />
      <PCBBackground theme={theme} />
      <header>
        <Navbar activeSection={activeSection} theme={theme} onThemeChange={changeTheme} />
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
