export default function StingArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stingBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>
      <rect x="18" y="14" width="64" height="104" rx="10" fill="url(#stingBody)" />
      <rect x="18" y="14" width="64" height="8" rx="4" fill="#FFC200" opacity="0.5" />
      <rect x="18" y="110" width="64" height="8" rx="4" fill="#FFC200" opacity="0.5" />
      {/* original bold bolt mark */}
      <path d="M58 22 L34 68 L48 68 L40 112 L70 58 L54 58 Z" fill="#FFC200" />
      <rect x="26" y="20" width="6" height="80" rx="3" fill="#ffffff" opacity="0.1" />
    </svg>
  );
}
