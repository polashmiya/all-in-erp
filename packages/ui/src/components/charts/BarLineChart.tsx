import { useEffect, useRef, useState } from 'react';

export interface BarLinePoint {
  label: string;
  line: number;
  bar: number;
}

export interface BarLineChartProps {
  data: BarLinePoint[];
  lineName: string;
  barName: string;
  format?: (value: number) => string;
  height?: number;
}

const PAD = { top: 12, right: 8, bottom: 26, left: 44 };

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry?.contentRect.width ?? 0));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function niceMax(value: number) {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude * 4 >= value) ?? 10;
  return step * magnitude * 4;
}

export function BarLineChart({
  data,
  lineName,
  barName,
  format = (v) => String(v),
  height = 260,
}: BarLineChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [ref, measured] = useWidth<HTMLDivElement>();
  const VIEW_W = Math.max(240, measured);

  const max = niceMax(data.length === 0 ? 0 : Math.max(...data.flatMap((d) => [d.line, d.bar])));
  const plotW = VIEW_W - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;
  const slot = plotW / data.length;
  const barW = Math.min(22, slot * 0.46);
  const x = (i: number) => PAD.left + slot * i + slot / 2;
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const line = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.line).toFixed(1)}`)
    .join(' ');
  const active = hover === null ? null : data[hover];

  return (
    <div ref={ref} className="erp-chart" style={{ height }} onMouseLeave={() => setHover(null)}>
      {data.length > 0 && measured > 0 && (
        <svg
          viewBox={`0 0 ${VIEW_W} ${height}`}
          width={VIEW_W}
          height={height}
          role="img"
          aria-label={`${lineName} / ${barName}`}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={VIEW_W - PAD.right}
                y1={y(tick)}
                y2={y(tick)}
                className="erp-chart__grid"
              />
              <text x={PAD.left - 8} y={y(tick) + 4} textAnchor="end" className="erp-chart__tick">
                {format(tick)}
              </text>
            </g>
          ))}
          {data.map((d, i) => (
            <g key={d.label} onMouseEnter={() => setHover(i)}>
              <rect
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={plotH}
                fill="transparent"
              />
              <rect
                x={x(i) - barW / 2}
                y={y(d.bar)}
                width={barW}
                height={Math.max(0, PAD.top + plotH - y(d.bar))}
                rx={3}
                className={`erp-chart__bar${hover === i ? ' is-hover' : ''}`}
              />
              <text x={x(i)} y={height - 8} textAnchor="middle" className="erp-chart__tick">
                {d.label}
              </text>
            </g>
          ))}
          <path
            d={line}
            fill="none"
            stroke="var(--erp-primary)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((d, i) => (
            <circle
              key={d.label}
              cx={x(i)}
              cy={y(d.line)}
              r={hover === i ? 4.5 : 0}
              fill="var(--erp-surface)"
              stroke="var(--erp-primary)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      )}
      {active && hover !== null && (
        <div className="erp-chart__tip" style={{ left: `${(x(hover) / VIEW_W) * 100}%` }}>
          <strong>{active.label}</strong>
          <span>
            <i className="is-line" />
            {lineName}: {format(active.line)}
          </span>
          <span>
            <i className="is-bar" />
            {barName}: {format(active.bar)}
          </span>
        </div>
      )}
    </div>
  );
}

export function ChartLegend({ lineName, barName }: { lineName: string; barName: string }) {
  return (
    <span className="erp-legend">
      <span>
        <i className="is-line" />
        {lineName}
      </span>
      <span>
        <i className="is-bar" />
        {barName}
      </span>
    </span>
  );
}
