import { useId } from 'react';

export interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

export function Sparkline({
  values,
  width = 84,
  height = 32,
  color = 'var(--erp-primary)',
  label,
}: SparklineProps) {
  const gradientId = useId();
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values.map(
    (v, i) => [i * step, height - 2 - ((v - min) / range) * (height - 4)] as const,
  );
  const line = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className="erp-sparkline"
      style={{ color }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
