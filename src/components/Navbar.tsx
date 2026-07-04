"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Wallet, LayoutGrid, ShieldCheck } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/admin", label: "Admin", icon: ShieldCheck }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top brand bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-apex-void/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-md md:max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-apex-cobalt to-apex-crimson shadow-neon" />
            <span className="font-display text-lg font-bold tracking-tight text-apex-platinum">
              APEX<span className="text-apex-aqua">.</span>
            </span>
          </Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-apex-platinum/70">
            Varun Beverages · Demo
          </span>
        </div>
      </header>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-apex-void/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-md md:max-w-2xl items-center justify-around px-2 py-2">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs transition ${
                  active ? "text-apex-aqua" : "text-apex-platinum/50 hover:text-apex-platinum/80"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
