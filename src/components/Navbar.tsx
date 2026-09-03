import { useState, useEffect, useRef } from "react";
import "../styles/navbar.css";
import { COLORS } from "../constants/colors";
import { navLinks } from "../data/navLinks";
import { useFeedback } from "../hooks/useFeedback";
import { scrollToId } from "../utils/scrollToId";
import { useScrollProgress } from "../hooks/useScrollProgress";

interface Props {
  activeSection: string;
}

export default function Navbar({ activeSection }: Props) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const scrolledRef = useRef(false);
  const { soundEnabled, toggleSound, triggerClick } = useFeedback();

  useScrollProgress((_, y) => {
    const next = y > 40;
    if (next !== scrolledRef.current) {
      scrolledRef.current = next;
      setScrolled(next);
    }
  });

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    scrollToId(id);
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    triggerClick();
    scrollTo("hero");
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    triggerClick();
    scrollTo(id);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`} aria-label="Main">
      <div className="navbar-inner">

        <button 
          className="nav-logo" 
          onClick={handleLogoClick} 
          aria-label="Home"
        >
          <span style={{ color: COLORS.neonGreen }}>{"<"}</span>
          nolmedo
          <span style={{ color: COLORS.neonGreen }}>{"/>"}</span>
        </button>

        <div id="nav-menu" className={`nav-links ${mobileOpen ? "nav-links-open" : ""}`}>
          {navLinks.map((link) => {
            const active = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
                aria-current={active ? "true" : undefined}
                onClick={(e) => handleNavLinkClick(e, link.id)}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="nav-right">
          <button
            className={`mute-toggle ${soundEnabled ? "sound-active" : "sound-muted"}`}
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
          >
            {soundEnabled ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mute-icon">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mute-icon">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            )}
          </button>
          <span className="sr-only" aria-live="polite">
            {soundEnabled ? "Sound on" : "Sound off"}
          </span>

          <button 
            ref={toggleRef}
            className="mobile-toggle" 
            onClick={() => {
              triggerClick();
              setMobileOpen(!mobileOpen);
            }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="nav-menu"
          >
            <span /><span /><span />
          </button>
        </div>

      </div>
    </nav>
  );
}
