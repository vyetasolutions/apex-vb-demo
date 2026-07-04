export default function PepsiArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pepsiBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E7BFF" />
          <stop offset="100%" stopColor="#002E9E" />
        </linearGradient>
      </defs>
      {/* can body */}
      <rect x="18" y="14" width="64" height="104" rx="10" fill="url(#pepsiBody)" />
      {/* rim highlights */}
      <rect x="18" y="14" width="64" height="8" rx="4" fill="#0A1330" opacity="0.35" />
      <rect x="18" y="110" width="64" height="8" rx="4" fill="#0A1330" opacity="0.35" />
      {/* original diagonal tri-band mark (not the real swirl) */}
      <path d="M18 70 L82 46 L82 66 L18 90 Z" fill="#F5F7FF" />
      <path d="M18 82 L82 58 L82 74 L18 98 Z" fill="#E4002B" />
      {/* highlight streak */}
      <rect x="26" y="20" width="6" height="80" rx="3" fill="#ffffff" opacity="0.25" />
    </svg>
  );
}
