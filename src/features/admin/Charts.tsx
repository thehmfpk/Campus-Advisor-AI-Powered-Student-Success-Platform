/**
 * Dependency-free SVG charts for the admin analytics (free, tiny, themable).
 */

export function BarChart({
  data,
  height = 180,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold text-fg">{d.value}</span>
          <div className="flex w-full flex-1 items-end rounded-lg bg-surface-2">
            <div
              className="w-full rounded-lg"
              style={{
                height: `${(d.value / max) * 100}%`,
                minHeight: d.value > 0 ? 6 : 0,
                background: d.color ?? 'linear-gradient(180deg, hsl(var(--brand)), hsl(var(--brand-2)))',
                transition: 'height 0.6s ease',
              }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="w-full truncate text-center text-[10px] text-muted" title={d.label}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  segments,
  size = 160,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = Math.max(
    1,
    segments.reduce((s, x) => s + x.value, 0),
  );
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--surface-2))" strokeWidth="16" />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <ul className="space-y-1.5 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-fg">{s.label}</span>
            <span className="text-muted">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
