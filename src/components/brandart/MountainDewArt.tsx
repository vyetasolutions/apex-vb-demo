export default function MountainDewArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 140" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dewBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2E100" />
          <stop offset="100%" stopColor="#9FB800" />
        </linearGradient>
      </defs>
      <rect x="42" y="6" width="16" height="22" rx="4" fill="#7A8A00" />
      <rect x="40" y="4" width="20" height="8" rx="3" fill="#4A5400" />
      <path
        d="M30 30 Q30 20 42 20 L58 20 Q70 20 70 30 L74 116 Q74 130 60 130 L40 130 Q26 130 26 116 Z"
        fill="url(#dewBody)"
      />
      {/* original energy zigzag mark */}
      <path
        d="M56 40 L40 76 L52 76 L44 108 L74 66 L60 66 Z"
        fill="#0D3B00"
        opacity="0.85"
      />
      <rect x="34" y="34" width="5" height="70" rx="2.5" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}
