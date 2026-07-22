"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "◧" },
  { href: "/admin/partners", label: "CPs & Investors", icon: "◈" },
  { href: "/admin/asks", label: "Give & Ask Desk", icon: "⇄" },
  { href: "/admin/deals", label: "Deals & Mandates", icon: "▦" },
  { href: "/admin/leads", label: "Leads / CRM", icon: "☏" },
  { href: "/admin/visits", label: "Site Visits", icon: "⚑" },
  { href: "/admin/submissions", label: "Submissions", icon: "⇪" },
  { href: "/admin/blog", label: "Blog / CMS", icon: "✎" },
  { href: "/admin/analytics", label: "Analytics", icon: "◔" },
  { href: "/admin/settings", label: "Team & SEO", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-slate text-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5.5V14H2V5.5L8 1Z" stroke="var(--gold)" strokeWidth="1.6" />
              <circle cx="8" cy="8.5" r="2" fill="var(--gold)" />
            </svg>
          </span>
          <div>
            <p className="font-display text-sm font-black leading-none">BookAPlot</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
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
        <div className="border-t border-white/10 p-4">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white">
            ← Back to website
          </Link>
        </div>
      </aside>

      <div className="flex-1 lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/85 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="font-display text-sm font-black">BookAPlot Admin</span>
          </div>
          <div className="hidden text-xs font-semibold text-graphite lg:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center gap-3">
            <span className="chip badge-green !text-[11px]">● All systems live</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-black text-white">S</span>
          </div>
        </header>
        {/* mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-white px-4 py-2 lg:hidden">
          {NAV.map((n) => (
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
