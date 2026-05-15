interface StatsCardProps {
  value: string | number;
  label: string;
  color?: string;
}

export function StatsCard({ value, label, color }: StatsCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
      <div className="font-heading text-3xl mb-1" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="font-mono text-xs text-[#6b6560] uppercase tracking-wider">{label}</div>
    </div>
  );
}
