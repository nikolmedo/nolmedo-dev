interface Props {
  label: string;
  color: string;
  id?:   string;
}

export default function SectionTitle({ label, color, id }: Props) {
  return (
    <div className="section-title-wrap">
      <div className="section-title-line" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      <h2 id={id} className="section-title" style={{ color }}>{label}</h2>
      <div className="section-title-line" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}
