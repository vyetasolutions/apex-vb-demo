export default function AquafinaArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 140" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aquaBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFF7FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3FD5FF" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect x="44" y="6" width="12" height="20" rx="3" fill="#0E8FB8" />
      <rect x="42" y="4" width="16" height="7" rx="2.5" fill="#0A6F8F" />
      {/* slender bottle body, translucent like water */}
      <path
        d="M34 28 Q34 20 42 20 L58 20 Q66 20 66 28 L70 118 Q70 130 58 130 L42 130 Q30 130 30 118 Z"
        fill="url(#aquaBody)"
        stroke="#3FD5FF"
        strokeWidth="1.5"
      />
      {/* original ripple mark */}
      <g stroke="#0A6F8F" strokeWidth="3" fill="none" opacity="0.6">
        <path d="M36 92 Q50 84 64 92" />
        <path d="M36 102 Q50 94 64 102" />
        <path d="M36 112 Q50 104 64 112" />
      </g>
      <rect x="38" y="32" width="4" height="60" rx="2" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}
