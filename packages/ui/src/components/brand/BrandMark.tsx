import { useBrand } from '../../theme/brand-context';

export function BrandMark({ size = 28, label = 'logo' }: { size?: number; label?: string }) {
  const { primary, accent } = useBrand();

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label={label} className="erp-brandmark">
      <rect width="32" height="32" rx="9" fill={primary} />
      <path d="M8 11.5 16 7l8 4.5-8 4.5-8-4.5Z" fill="currentColor" />
      <path
        d="m8 16 8 4.5 8-4.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity=".8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="m8 20.5 8 4.5 8-4.5" fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
