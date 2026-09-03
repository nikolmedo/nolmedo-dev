import { type ReactNode, type CSSProperties, useRef, useEffect, type HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children:   ReactNode;
  className?: string;
  style?:     CSSProperties;
  id?:        string;
}

export default function GlassPanel({ children, className = "", style = {}, id, ...rest }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const pointRef = useRef({ x: 0, y: 0 });

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    pointRef.current = { x: e.clientX, y: e.clientY };
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0;
        const el = panelRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mouse-x", `${pointRef.current.x - rect.left}px`);
        el.style.setProperty("--mouse-y", `${pointRef.current.y - rect.top}px`);
      });
    }

    // Call parent onMouseMove if present
    if (rest.onMouseMove) {
      rest.onMouseMove(e);
    }
  };

  return (
    <div
      ref={panelRef}
      id={id}
      className={`glass-panel ${className}`}
      style={style}
      {...rest}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}
