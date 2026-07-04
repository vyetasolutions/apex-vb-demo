# APEX — UI/UX Design System Guide

## Direction

Not a SaaS dashboard wearing Pepsi colors — a **branded arcade cabinet**.
Dark void background, neon brand accents, glass panels that feel like a
premium mobile game's HUD rather than an admin tool.

## Color tokens (`tailwind.config.js` → `theme.extend.colors.apex`)

| Token | Hex | Use |
|---|---|---|
| `void` | `#05070D` | Base background |
| `panel` / `panelLight` | `#0D1220` / `#141B2E` | Cards, game surfaces |
| `cobalt` / `cobaltDeep` | `#0057FF` / `#002E9E` | Pepsi — primary CTA color |
| `crimson` | `#E4002B` | Pepsi/Mirinda red — alerts, accents |
| `citrus` | `#F2C400` | Mountain Dew / Mirinda — Can Stack, Scratch card |
| `lime` | `#7ED321` | 7UP — Bottle Drop |
| `sting` | `#FFC200` | Sting — Memory Flip |
| `aqua` | `#3FD5FF` | Aquafina — Lucky Box, links |
| `platinum` | `#E7ECF7` | Primary text on dark |

Each of the six games owns one accent color end-to-end (icon tile, progress
bar, primary button) so a player learns to recognize "this is the green
game" before they've even read the label — the same way each Varun brand
owns a color in retail.

## Typography

- **Display**: Poppins (Clash Display as an optional paid upgrade) — bold,
  geometric, used for headlines, point totals, and tier badges.
  Google Fonts is used in the demo (`globals.css`) so the repo needs zero
  font-license setup.
- **Body**: Inter — clean and highly legible at small mobile sizes.

## Surfaces: glassmorphism, not flat cards

`.glass` (in `globals.css`) is the one signature surface treatment:
semi-transparent panel + `backdrop-filter: blur(16px)` + a 1px hairline
border at 8% white opacity. Used for every card, the wallet bar, and modal
overlays — consistent enough to read as a system, not decoration per-page.

## Motion principles

- **Page load**: content fades/slides in with a 0.3–0.5s stagger
  (`framer-motion`, see `page.tsx` game grid) — orchestrated, not scattered.
- **Wins**: `canvas-confetti` fires on every result, scaled up (more
  particles, wider spread) for bonus multipliers so the eye immediately
  distinguishes a normal win from a bonus one.
- **Micro-interactions**: buttons scale down slightly on tap
  (`whileTap={{ scale: 0.95 }}`), balance numbers pulse and briefly recolor
  cyan when they change (`WalletBar.tsx`).
- **Restraint**: no idle ambient animation beyond a slow 3.5s float on
  static icon tiles — enough to feel alive without feeling busy.

## Mobile-first layout

Single-column, `max-w-md` container, persistent bottom tab bar (Home / Games
/ Wallet / Admin) — the four things a field user or retailer needs one tap
away. Desktop (`md:`) widens the container rather than introducing a
separate layout, since the primary audience is a phone at point-of-sale.

## Tier visual language

Bronze → Silver → Gold → Platinum each get a distinct gradient badge
(`TierBadge.tsx`) rather than a color swap on one shape, so upgrading tiers
reads as a visible upgrade in material, not just in label.
