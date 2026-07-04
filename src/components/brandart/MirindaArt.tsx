export default function MirindaArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 140" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mirindaBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB020" />
          <stop offset="100%" stopColor="#F2740C" />
        </linearGradient>
      </defs>
      {/* neck */}
      <rect x="42" y="6" width="16" height="22" rx="4" fill="#F2740C" />
      <rect x="40" y="4" width="20" height="8" rx="3" fill="#7A3B0A" />
      {/* shoulder + body */}
      <path
        d="M30 30 Q30 20 42 20 L58 20 Q70 20 70 30 L74 116 Q74 130 60 130 L40 130 Q26 130 26 116 Z"
        fill="url(#mirindaBody)"
      />
      {/* original citrus-burst mark */}
      <g transform="translate(50 78)" fill="#FFF4DC">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-3" y="-22" width="6" height="16" rx="3" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="12" fill="#FFF4DC" />
        <circle r="12" fill="none" stroke="#F2740C" strokeWidth="2" />
      </g>
      <rect x="34" y="34" width="5" height="70" rx="2.5" fill="#ffffff" opacity="0.25" />
    </svg>
  );
}
