import { useState, useEffect } from "react";
import "../styles/navbar.css";
import { COLORS } from "../constants/colors";
import { navLinks } from "../data/navLinks";
import { useFeedback } from "../hooks/useFeedback";

interface Props {
  activeSection: string;
}

export default function Navbar({ activeSection }: Props) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { soundEnabled, toggleSound, triggerClick } = useFeedback();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    triggerClick();
    scrollTo("hero");
  };

  const handleNavLinkClick = (id: string) => {
    triggerClick();
    scrollTo(id);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
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

        <div className={`nav-links ${mobileOpen ? "nav-links-open" : ""}`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`nav-link ${activeSection === link.id ? "nav-link-active" : ""}`}
              onClick={() => handleNavLinkClick(link.id)}
            >
              {link.label}
            </button>
          ))}
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

          <button 
            className="mobile-toggle" 
            onClick={() => {
              triggerClick();
              setMobileOpen(!mobileOpen);
            }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>

      </div>
    </nav>
  );
}

