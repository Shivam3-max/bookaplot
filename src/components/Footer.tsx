import Link from "next/link";

const COLS = [
  {
    title: "Explore",
    links: [
      { href: "/deals", label: "Deals Marketplace" },
      { href: "/locations", label: "Locations" },
      { href: "/calculators", label: "Calculators" },
      { href: "/map", label: "Tricity Map" },
      { href: "/nri", label: "NRI Investment" },
      { href: "/insights", label: "Insights" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About BookAPlot" },
      { href: "/why-bookaplot", label: "Why BookAPlot" },
      { href: "/contact", label: "Contact" },
      { href: "/partner", label: "Partner With Us" },
      { href: "/list-property", label: "Sell / List Property" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-slate text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 5.5V14H2V5.5L8 1Z" stroke="var(--gold)" strokeWidth="1.6" />
                <circle cx="8" cy="8.5" r="2" fill="var(--gold)" />
              </svg>
            </span>
            <span className="font-display text-lg font-black">
              BookA<span style={{ color: "var(--gold)" }}>Plot</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Curated undervalued real estate opportunities across Chandigarh, Mohali, Panchkula,
            Zirakpur, New Chandigarh, Kharar and Tricity&apos;s growth corridors.
          </p>
          <div className="mt-5 space-y-1.5 text-sm text-white/70">
            <p>+91 98XXX XXXXX &nbsp;·&nbsp; hello@bookaplot.com</p>
            <p>Sector 82, Mohali, Punjab</p>
          </div>
          <a
            href="https://wa.me/919800000000"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-green px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5 13.9c-.2.6-1.2 1.1-1.7 1.2-.4 0-1 .1-1.6-.1a13 13 0 0 1-5.9-5.2c-.6-1-.9-2-.9-2.3 0-.7.4-1.3.8-1.7.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7a9 9 0 0 0 3.9 3.5c.3.1.5.1.7-.1l.7-.8c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.4 0 .1 0 .7-.4 1.2Z"/></svg>
            WhatsApp Us
          </a>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6">
        <div className="container-x flex flex-col gap-3 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} BookAPlot.com — Premium Tricity real estate discovery.</p>
          <p className="max-w-xl leading-relaxed">
            BookAPlot presents curated opportunities and informational tools. Verify all details and
            documents independently before any purchase decision.
          </p>
        </div>
      </div>
    </footer>
  );
}
