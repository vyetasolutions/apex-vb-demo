export default function SevenUpArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sevenupBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9CE646" />
          <stop offset="100%" stopColor="#4E9A0F" />
        </linearGradient>
      </defs>
      <rect x="18" y="14" width="64" height="104" rx="10" fill="url(#sevenupBody)" />
      <rect x="18" y="14" width="64" height="8" rx="4" fill="#1F4906" opacity="0.35" />
      <rect x="18" y="110" width="64" height="8" rx="4" fill="#1F4906" opacity="0.35" />
      {/* original rising-bubbles mark */}
      <g fill="#F5FFE0">
        <circle cx="38" cy="94" r="5" />
        <circle cx="52" cy="80" r="7" />
        <circle cx="42" cy="62" r="4" />
        <circle cx="58" cy="48" r="6" />
        <circle cx="48" cy="34" r="3.5" />
      </g>
      <rect x="26" y="20" width="6" height="80" rx="3" fill="#ffffff" opacity="0.25" />
    </svg>
  );
}
