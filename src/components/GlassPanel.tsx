import { type ReactNode, type CSSProperties, useRef } from "react";

interface Props {
  children:   ReactNode;
  className?: string;
  style?:     CSSProperties;
  id?:        string;
}

export default function GlassPanel({ children, className = "", style = {}, id }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={panelRef}
      id={id}
      className={`glass-panel ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}
