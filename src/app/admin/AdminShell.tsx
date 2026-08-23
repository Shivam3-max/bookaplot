"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import type { CurrentUser } from "@/lib/dal";

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

const isActive = (href: string, pathname: string) =>
  href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {NAV.map((n) => {
        const active = isActive(n.href, pathname);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13.5px] font-semibold transition-colors lg:py-2.5 ${
              active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="w-4 text-center" style={active ? { color: "var(--gold)" } : undefined}>{n.icon}</span>
            {n.label}
          </Link>
        );
      })}
    </>
  );
}

function SidebarFooter({ user }: { user: CurrentUser }) {
  return (
    <div className="space-y-2 border-t border-white/10 p-4">
      <p className="truncate text-xs font-bold text-white/70">{user.name}</p>
      <div className="flex gap-3 pt-1 text-xs font-bold">
        <Link href="/" className="text-white/50 hover:text-white">← Back to website</Link>
        <form action={logout}>
          <button type="submit" className="text-white/50 hover:text-white">Sign out</button>
        </form>
      </div>
    </div>
  );
}

export default function AdminShell({ user, children }: { user: CurrentUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the drawer whenever the route changes, so tapping a nav item
  // navigates and dismisses in one action.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // While the drawer is open, lock the page behind it and allow Esc to close.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const current = NAV.find((n) => isActive(n.href, pathname));

  return (
    <div className="flex min-h-screen bg-paper">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-slate text-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
            <Image src="/mondato-mark.png" alt="Mondato" width={512} height={512} className="h-full w-full object-contain" />
          </span>
          <div>
            <p className="font-display text-sm font-black leading-none">Mondato</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <NavList pathname={pathname} />
        </nav>
        <SidebarFooter user={user} />
      </aside>

      {/* mobile drawer + backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id="admin-mobile-nav"
        aria-hidden={!menuOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] max-w-[85vw] flex-col bg-slate text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
              <Image src="/mondato-mark.png" alt="Mondato" width={512} height={512} className="h-full w-full object-contain" />
            </span>
            <div>
              <p className="font-display text-sm font-black leading-none">Mondato</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Admin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-lg text-xl text-white/60 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <NavList pathname={pathname} onNavigate={() => setMenuOpen(false)} />
        </nav>
        <SidebarFooter user={user} />
      </aside>

      <div className="min-w-0 flex-1 lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/85 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="admin-mobile-nav"
              className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink hover:bg-paper"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-[2px] w-5 rounded bg-current" />
                <span className="block h-[2px] w-5 rounded bg-current" />
                <span className="block h-[2px] w-5 rounded bg-current" />
              </span>
            </button>
            <span className="truncate font-display text-sm font-black">{current?.label ?? "Mondato Admin"}</span>
          </div>
          <div className="hidden text-xs font-semibold text-graphite lg:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="chip badge-green !text-[11px] max-sm:hidden">● All systems live</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-black text-white">
              {user.name[0]?.toUpperCase()}
            </span>
          </div>
        </header>
        <main className="admin-main p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
