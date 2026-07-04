// Tailwind's JIT scanner only picks up class names it can see as literal
// strings in source. Since game accent colors are chosen dynamically at
// runtime (from GAMES[].color), we declare every variant once here so the
// scanner includes them in the production build.
export const ACCENT_BG: Record<string, string> = {
  cobalt: "bg-apex-cobalt",
  citrus: "bg-apex-citrus",
  lime: "bg-apex-lime",
  sting: "bg-apex-sting",
  aqua: "bg-apex-aqua",
  crimson: "bg-apex-crimson"
};

export const ACCENT_TEXT: Record<string, string> = {
  cobalt: "text-apex-cobalt",
  citrus: "text-apex-citrus",
  lime: "text-apex-lime",
  sting: "text-apex-sting",
  aqua: "text-apex-aqua",
  crimson: "text-apex-crimson"
};

export const ACCENT_SHADOW: Record<string, string> = {
  cobalt: "shadow-neon",
  citrus: "shadow-neon",
  lime: "shadow-neon",
  sting: "shadow-neon",
  aqua: "shadow-neon",
  crimson: "shadow-neonRed"
};
