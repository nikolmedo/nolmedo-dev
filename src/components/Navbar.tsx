import { useState, useEffect } from "react";
import "../styles/navbar.css";
import { COLORS } from "../constants/colors";
import { navLinks } from "../data/navLinks";

interface Props {
  activeSection: string;
}

export default function Navbar({ activeSection }: Props) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">

        <button className="nav-logo" onClick={() => scrollTo("hero")}>
          <span style={{ color: COLORS.neonGreen }}>{"<"}</span>
          nolmedo
          <span style={{ color: COLORS.neonGreen }}>{"/>"}</span>
        </button>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          <span /><span /><span />
        </button>

        <div className={`nav-links ${mobileOpen ? "nav-links-open" : ""}`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`nav-link ${activeSection === link.id ? "nav-link-active" : ""}`}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>

      </div>
    </nav>
  );
}
