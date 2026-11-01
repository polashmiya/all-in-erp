import { useBrand } from '../theme/brand-context';

/** Decorative illustration for the sign-in brand panel: an app window with a configuration card floating over it. */
export function LoginIllustration() {
  const { primary, accent, palette } = useBrand();
  const line = 'rgba(255,255,255,0.28)';
  const soft = 'rgba(255,255,255,0.12)';
  const strong = 'rgba(255,255,255,0.9)';

  return (
    <svg viewBox="0 0 480 330" width="100%" role="presentation" aria-hidden="true" style={{ maxWidth: 480 }}>
      {/* app window */}
      <rect x="20" y="40" width="380" height="260" rx="16" fill={soft} stroke={line} />
      <circle cx="42" cy="60" r="5" fill={accent} />
      <circle cx="58" cy="60" r="5" fill={line} />
      <circle cx="74" cy="60" r="5" fill={line} />
      <line x1="20" y1="78" x2="400" y2="78" stroke={line} />

      {/* sider with a three-level menu */}
      <rect x="36" y="94" width="84" height="190" rx="10" fill={soft} />
      <rect x="46" y="106" width="56" height="8" rx="4" fill={strong} />
      <rect x="56" y="124" width="50" height="7" rx="3.5" fill={line} />
      <rect x="66" y="140" width="42" height="7" rx="3.5" fill={accent} />
      <rect x="66" y="156" width="36" height="7" rx="3.5" fill={line} />
      <rect x="56" y="172" width="46" height="7" rx="3.5" fill={line} />
      <rect x="46" y="194" width="52" height="8" rx="4" fill={line} />
      <rect x="46" y="214" width="44" height="8" rx="4" fill={line} />

      {/* KPI tiles */}
      {[136, 222, 308].map((x, i) => (
        <g key={x}>
          <rect x={x} y="94" width="76" height="52" rx="10" fill={soft} />
          <rect x={x + 10} y="106" width="34" height="6" rx="3" fill={line} />
          <rect x={x + 10} y="120" width={[44, 52, 38][i]} height="12" rx="4" fill={i === 1 ? accent : strong} />
        </g>
      ))}

      {/* bar chart */}
      <rect x="136" y="158" width="248" height="126" rx="10" fill={soft} />
      {[38, 62, 48, 80, 58, 92, 70].map((h, i) => (
        <rect key={i} x={154 + i * 32} y={268 - h} width="18" height={h} rx="4" fill={i === 5 ? accent : i === 3 ? strong : line} />
      ))}

      {/* floating configuration card */}
      <g transform="translate(300 8)">
        <rect width="164" height="112" rx="14" fill="#fff" />
        <rect x="16" y="16" width="70" height="9" rx="4.5" fill={primary} />
        {[40, 64, 88].map((y, i) => (
          <g key={y}>
            <rect x="16" y={y} width={[78, 64, 86][i]} height="8" rx="4" fill={palette[1]} />
            <rect x="122" y={y - 3} width="26" height="14" rx="7" fill={i === 1 ? '#D9D9D9' : primary} />
            <circle cx={i === 1 ? 129 : 141} cy={y + 4} r="5" fill="#fff" />
          </g>
        ))}
      </g>
    </svg>
  );
}
