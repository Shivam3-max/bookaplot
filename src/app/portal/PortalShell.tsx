"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import type { CurrentUser } from "@/lib/dal";

const CP_NAV = [
  { href: "/portal", label: "Overview", icon: "◧" },
  { href: "/portal/deals", label: "Mandate Deals", icon: "▦" },
  { href: "/portal/territory", label: "My Territory", icon: "⚑" },
  { href: "/portal/leads", label: "Territory Leads", icon: "☏" },
  { href: "/portal/creatives", label: "Creatives & Videos", icon: "▶" },
  { href: "/portal/asks", label: "Investor Asks", icon: "⇄" },
];

const INV_NAV = [
  { href: "/portal", label: "Overview", icon: "◧" },
  { href: "/portal/deals", label: "Verified Deals", icon: "▦" },
  { href: "/portal/asks", label: "Give & Ask", icon: "⇄" },
  { href: "/portal/creatives", label: "Deal Videos", icon: "▶" },
];

export default function PortalShell({ user, children }: { user: CurrentUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const nav = user.role === "CP" ? CP_NAV : INV_NAV;

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-slate text-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
            <Image src="/mondato-mark.png" alt="Mondato" width={512} height={512} className="h-full w-full object-contain" />
          </span>
          <div>
            <p className="font-display text-sm font-black leading-none">Mondato</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>
              {user.role === "CP" ? "Partner Portal" : "Investor Portal"}
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((n) => {
            const active = n.href === "/portal" ? pathname === "/portal" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors ${
                  active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="w-4 text-center" style={active ? { color: "var(--gold)" } : undefined}>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-4">
          <p className="truncate text-xs font-bold text-white/70">{user.name}</p>
          <p className="truncate text-[11px] text-white/40">
            {user.role === "CP" ? user.territory || "Territory pending" : user.budget || "Investor"}
          </p>
          <div className="flex gap-3 pt-1 text-xs font-bold">
            <Link href="/" className="text-white/50 hover:text-white">← Website</Link>
            <form action={logout}>
              <button type="submit" className="text-white/50 hover:text-white">Sign out</button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/85 px-5 backdrop-blur-xl sm:px-8">
          <span className="font-display text-sm font-black lg:hidden">Mondato Portal</span>
          <span className="hidden text-xs font-semibold text-graphite lg:block">
            Welcome back, {user.name.split(" ")[0]} — {user.role === "CP" ? "your territory is live." : "the desk is watching the market for you."}
          </span>
          <div className="flex items-center gap-3">
            <span className={`chip !text-[11px] ${user.role === "CP" ? "badge-gold" : "badge-green"}`}>
              {user.role === "CP" ? "● Channel Partner" : "● Verified Investor"}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-black text-white">
              {user.name[0]?.toUpperCase()}
            </span>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-white px-4 py-2 lg:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${pathname === n.href ? "bg-ink text-white" : "text-graphite"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
