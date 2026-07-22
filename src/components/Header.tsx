"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSaved } from "@/context/SavedContext";
import { useNetwork } from "@/context/NetworkContext";

const NAV = [
  { href: "/deals", label: "Deals" },
  { href: "/locations", label: "Locations" },
  { href: "/map", label: "Tricity Map" },
  { href: "/calculators", label: "Calculators" },
  { href: "/why-bookaplot", label: "Why BookAPlot" },
  { href: "/nri", label: "NRI" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { saved } = useSaved();
  const { account } = useNetwork();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/85 shadow-[0_4px_24px_-12px_rgba(17,17,17,0.18)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5.5V14H2V5.5L8 1Z" stroke="var(--gold)" strokeWidth="1.6" />
              <circle cx="8" cy="8.5" r="2" fill="var(--gold)" />
            </svg>
          </span>
          <span className="font-display text-lg font-black tracking-tight">
            BookA<span style={{ color: "var(--gold)" }}>Plot</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-[13.5px] font-semibold transition-colors hover:text-ink ${
                pathname.startsWith(n.href) ? "text-ink" : "text-graphite"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link href="/saved" className="relative text-[13.5px] font-semibold text-graphite hover:text-ink">
            Saved
            {saved.length > 0 && (
              <span className="absolute -right-3.5 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                {saved.length}
              </span>
            )}
          </Link>
          {account ? (
            <Link href="/portal" className="btn-primary !px-4 !py-2 !text-[13px]">
              {account.role === "cp" ? "CP Dashboard" : "Investor Dashboard"}
            </Link>
          ) : (
            <Link href="/join" className="btn-gold !px-4 !py-2 !text-[13px]">
              Join Network
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Menu"
        >
          <span className={`h-0.5 w-5 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white/95 backdrop-blur-xl lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-4">
            {[...NAV, { href: "/saved", label: `Saved (${saved.length})` }, { href: "/list-property", label: "List Property" }].map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate hover:bg-paper">
                {n.label}
              </Link>
            ))}
            {account ? (
              <Link href="/portal" className="btn-primary mt-2 justify-center">
                Open {account.role === "cp" ? "CP" : "Investor"} Dashboard
              </Link>
            ) : (
              <Link href="/join" className="btn-gold mt-2 justify-center">
                Join Network
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
