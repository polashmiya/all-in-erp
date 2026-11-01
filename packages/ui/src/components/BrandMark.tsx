import { useId } from 'react';
import { useBrand } from '../theme/brand-context';

/** The product mark in the active theme colour: stacked layers, a nod to "one ERP, many configured screens". */
export function BrandMark({ size = 28 }: { size?: number }) {
  const gradientId = useId();
  const { palette, accent } = useBrand();

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="myErp">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette[4]} />
          <stop offset="100%" stopColor={palette[7]} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <path d="M8 11.5 16 7l8 4.5-8 4.5-8-4.5Z" fill="#fff" />
      <path d="m8 16 8 4.5 8-4.5" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="2" strokeLinejoin="round" />
      <path d="m8 20.5 8 4.5 8-4.5" fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
