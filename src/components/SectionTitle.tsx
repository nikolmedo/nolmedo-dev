interface Props {
  label: string;
  color: string;
}

export default function SectionTitle({ label, color }: Props) {
  return (
    <div className="section-title-wrap">
      <div className="section-title-line" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      <h2 className="section-title" style={{ color }}>{label}</h2>
      <div className="section-title-line" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}
