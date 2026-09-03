import { useState, useEffect, useRef, useId } from "react";
import "../styles/navbar.css";
import { COLORS } from "../constants/colors";
import { navLinks } from "../data/navLinks";
import { THEMES } from "../data/themes";
import { useFeedback } from "../hooks/useFeedback";
import { scrollToId } from "../utils/scrollToId";
import { useScrollProgress } from "../hooks/useScrollProgress";

const SCROLL_THRESHOLD = 40;

interface Props {
  activeSection: string;
  theme: string;
  onThemeChange: (theme: string) => void;
}

interface ThemePickerProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  className: string;
}

function ThemePicker({ theme, onThemeChange, className }: ThemePickerProps) {
  const { triggerClick } = useFeedback();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selectedIndex = Math.max(0, THEMES.findIndex((t) => t.id === theme));
  const currentLabel = THEMES[selectedIndex].label;
  const optionId = (id: string) => `${listId}-${id}`;

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const select = (id: string) => {
    triggerClick();
    onThemeChange(id);
    close(true);
  };

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") openAt(selectedIndex);
    else if (e.key === "ArrowUp") openAt(THEMES.length - 1);
    else return;
    e.preventDefault();
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const last = THEMES.length - 1;
    switch (e.key) {
      case "ArrowDown": setActiveIndex((i) => (i === last ? 0 : i + 1)); break;
      case "ArrowUp":   setActiveIndex((i) => (i === 0 ? last : i - 1)); break;
      case "Home":      setActiveIndex(0); break;
      case "End":       setActiveIndex(last); break;
      case "Enter":     select(THEMES[activeIndex].id); break;
      case " ":         break;
      case "Escape":    e.stopPropagation(); close(true); break;
      case "Tab":       setOpen(false); return;
      default:          return;
    }
    e.preventDefault();
  };

  const onListKeyUp = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== " ") return;
    e.preventDefault();
    select(THEMES[activeIndex].id);
  };

  return (
    <div ref={rootRef} className={`theme-picker ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className="theme-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Color theme: ${currentLabel}`}
        onClick={() => (open ? close(false) : openAt(selectedIndex))}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="theme-swatch" data-theme={theme} />
        <span className="theme-picker-chevron" />
      </button>
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label="Color theme"
        aria-activedescendant={open ? optionId(THEMES[activeIndex].id) : undefined}
        tabIndex={-1}
        className={`theme-picker-list ${open ? "theme-picker-list-open" : ""}`}
        onKeyDown={onListKeyDown}
        onKeyUp={onListKeyUp}
      >
        {THEMES.map((t, i) => (
          <li
            key={t.id}
            id={optionId(t.id)}
            role="option"
            aria-selected={theme === t.id}
            data-theme={t.id}
            className={`theme-picker-option ${i === activeIndex ? "theme-picker-option-active" : ""}`}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => select(t.id)}
          >
            <span className="theme-swatch" data-theme={t.id} />
            {t.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Navbar({ activeSection, theme, onThemeChange }: Props) {
  const [scrolled, setScrolled]     = useState(
    () => typeof window !== "undefined" && window.scrollY > SCROLL_THRESHOLD
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const scrolledRef = useRef(scrolled);
  const { soundEnabled, toggleSound, triggerClick } = useFeedback();

  useScrollProgress((_, y) => {
    const next = y > SCROLL_THRESHOLD;
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
          <ThemePicker theme={theme} onThemeChange={onThemeChange} className="theme-picker-mobile" />
        </div>

        <div className="nav-right">
          <ThemePicker theme={theme} onThemeChange={onThemeChange} className="theme-picker-desktop" />
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
