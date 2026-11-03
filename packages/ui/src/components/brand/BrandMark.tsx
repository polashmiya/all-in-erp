import { useBrand } from '../../theme/brand-context';

export function BrandMark({ size = 28 }: { size?: number }) {
  const { primary, accent } = useBrand();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="myErp"
      style={{
        flex: '0 0 auto',
        borderRadius: size * 0.29,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18), 0 1px 2px rgba(15,23,42,0.2)',
      }}
    >
      <rect width="32" height="32" rx="9" fill={primary} />
      <path d="M8 11.5 16 7l8 4.5-8 4.5-8-4.5Z" fill="#fff" />
      <path
        d="m8 16 8 4.5 8-4.5"
        fill="none"
        stroke="#fff"
        strokeOpacity=".8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m8 20.5 8 4.5 8-4.5"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
