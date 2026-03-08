import { type ReactNode, type CSSProperties } from "react";

interface Props {
  children:   ReactNode;
  className?: string;
  style?:     CSSProperties;
  id?:        string;
}

export default function GlassPanel({ children, className = "", style = {}, id }: Props) {
  return (
    <div id={id} className={`glass-panel ${className}`} style={style}>
      {children}
    </div>
  );
}
