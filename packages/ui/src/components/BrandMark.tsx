import { useId } from 'react';

/** The product mark: stacked layers, a nod to "one ERP, many configured screens". */
export function BrandMark({ size = 28 }: { size?: number }) {
  const gradientId = useId();

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="myErp">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#597EF7" />
          <stop offset="100%" stopColor="#1D39C4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <path d="M8 11.5 16 7l8 4.5-8 4.5-8-4.5Z" fill="#fff" />
      <path d="m8 16 8 4.5 8-4.5" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2" strokeLinejoin="round" />
      <path d="m8 20.5 8 4.5 8-4.5" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
