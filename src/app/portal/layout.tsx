"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useNetwork } from "@/context/NetworkContext";

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

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { account, logout } = useNetwork();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // small delay so hydration can restore the session before redirecting
    const t = setTimeout(() => {
      if (!localStorage.getItem("bap:account") || localStorage.getItem("bap:account") === "null") {
        router.replace("/join");
      }
    }, 150);
    return () => clearTimeout(t);
  }, [router]);

  if (!account) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm font-bold text-graphite">Opening your dashboard…</p>
      </div>
    );
  }

  const nav = account.role === "cp" ? CP_NAV : INV_NAV;

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-slate text-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5.5V14H2V5.5L8 1Z" stroke="var(--gold)" strokeWidth="1.6" />
              <circle cx="8" cy="8.5" r="2" fill="var(--gold)" />
            </svg>
          </span>
          <div>
            <p className="font-display text-sm font-black leading-none">BookAPlot</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>
              {account.role === "cp" ? "Partner Portal" : "Investor Portal"}
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
          <p className="truncate text-xs font-bold text-white/70">{account.name}</p>
          <p className="truncate text-[11px] text-white/40">
            {account.role === "cp" ? account.territory || "Territory pending" : account.budget || "Investor"}
          </p>
          <div className="flex gap-3 pt-1 text-xs font-bold">
            <Link href="/" className="text-white/50 hover:text-white">← Website</Link>
            <button onClick={() => { logout(); router.push("/"); }} className="text-white/50 hover:text-white">Sign out</button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/85 px-5 backdrop-blur-xl sm:px-8">
          <span className="font-display text-sm font-black lg:hidden">BookAPlot Portal</span>
          <span className="hidden text-xs font-semibold text-graphite lg:block">
            Welcome back, {account.name.split(" ")[0]} — {account.role === "cp" ? "your territory is live." : "the desk is watching the market for you."}
          </span>
          <div className="flex items-center gap-3">
            <span className={`chip !text-[11px] ${account.role === "cp" ? "badge-gold" : "badge-green"}`}>
              {account.role === "cp" ? "● Channel Partner" : "● Verified Investor"}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-black text-white">
              {account.name[0]?.toUpperCase()}
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
