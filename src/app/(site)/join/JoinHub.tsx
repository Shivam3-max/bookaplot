"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { useNetwork } from "@/context/NetworkContext";
import { TERRITORIES, CP_BENEFITS, INVESTOR_BENEFITS } from "@/lib/network-data";

type Tab = "cp" | "investor" | "seller";

export default function JoinHub() {
  const params = useSearchParams();
  const initial = (params.get("as") as Tab) || "cp";
  const [tab, setTab] = useState<Tab>(["cp", "investor", "seller"].includes(initial) ? initial : "cp");
  const [sellerSent, setSellerSent] = useState(false);
  const { login, addPartner, account, logout } = useNetwork();
  const router = useRouter();

  const submitCp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const acc = {
      role: "cp" as const,
      name: String(f.get("name")),
      phone: String(f.get("phone")),
      firm: String(f.get("firm") || ""),
      territory: String(f.get("territory") || ""),
    };
    addPartner({ name: acc.name, firm: acc.firm || "—", phone: acc.phone, role: "cp", territory: acc.territory });
    login(acc);
    router.push("/portal");
  };

  const submitInvestor = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const acc = {
      role: "investor" as const,
      name: String(f.get("name")),
      phone: String(f.get("phone")),
      budget: String(f.get("budget") || ""),
      interest: String(f.get("interest") || ""),
    };
    addPartner({ name: acc.name, firm: "—", phone: acc.phone, role: "investor", budget: acc.budget });
    login(acc);
    router.push("/portal");
  };

  const TABS: { id: Tab; label: string; sub: string }[] = [
    { id: "cp", label: "Channel Partner", sub: "Mandates · territory · leads" },
    { id: "investor", label: "Investor", sub: "Verified deals · Give & Ask" },
    { id: "seller", label: "Seller / Owner", sub: "List your property" },
  ];

  return (
    <>
      <section className="grid-bg border-b border-line py-12">
        <div className="container-x text-center">
          <Reveal>
            <p className="eyebrow">Join the network</p>
            <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              One Network. Three Ways In.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-graphite">
              Two minutes, a few fields — no long forms. Channel partners and investors get instant
              dashboard access; sellers get a curation review within 3 working days.
            </p>
            {account && (
              <p className="mx-auto mt-4 max-w-md rounded-xl bg-green-soft px-4 py-2.5 text-sm font-bold text-green">
                Signed in as {account.name} ({account.role === "cp" ? "Channel Partner" : "Investor"}) —{" "}
                <Link href="/portal" className="underline">open dashboard</Link> ·{" "}
                <button onClick={logout} className="underline">sign out</button>
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <section className="container-x max-w-4xl py-10">
        <div className="grid gap-2 sm:grid-cols-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                tab === t.id ? "border-ink bg-ink text-white shadow-lg" : "border-line bg-white hover:border-gold"
              }`}
            >
              <p className="font-display font-black">{t.label}</p>
              <p className={`text-xs ${tab === t.id ? "text-white/60" : "text-graphite"}`}>{t.sub}</p>
            </button>
          ))}
        </div>

        <div className="card mt-6 p-6 sm:p-8">
          {tab === "cp" && (
            <form onSubmit={submitCp} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h2 className="font-display text-xl font-black">Channel Partner — Quick Onboarding</h2>
                <p className="mt-1 text-sm text-graphite">Verification call follows; territory locks after verification.</p>
              </div>
              <div><label className="label">Name *</label><input name="name" required className="input" placeholder="Your name" /></div>
              <div><label className="label">Phone *</label><input name="phone" required type="tel" className="input" placeholder="+91" /></div>
              <div><label className="label">Firm / brand</label><input name="firm" className="input" placeholder="e.g. Dhillon Realty" /></div>
              <div>
                <label className="label">Preferred territory *</label>
                <select name="territory" required className="input" defaultValue="">
                  <option value="" disabled>Select…</option>
                  {TERRITORIES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-gold justify-center sm:col-span-2">Join as Channel Partner → Open Dashboard</button>
            </form>
          )}

          {tab === "investor" && (
            <form onSubmit={submitInvestor} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h2 className="font-display text-xl font-black">Investor — Quick Onboarding</h2>
                <p className="mt-1 text-sm text-graphite">Instant access to verified mandates and the Give &amp; Ask desk.</p>
              </div>
              <div><label className="label">Name *</label><input name="name" required className="input" placeholder="Your name" /></div>
              <div><label className="label">Phone / WhatsApp *</label><input name="phone" required type="tel" className="input" placeholder="+91 or intl." /></div>
              <div>
                <label className="label">Budget band *</label>
                <select name="budget" required className="input" defaultValue="">
                  <option value="" disabled>Select…</option>
                  <option>Under ₹50 L</option><option>₹50 L – 1 Cr</option><option>₹1 – 2 Cr</option><option>₹2 – 5 Cr</option><option>₹5 Cr+</option>
                </select>
              </div>
              <div>
                <label className="label">Interest</label>
                <select name="interest" className="input" defaultValue="">
                  <option value="" disabled>Select…</option>
                  <option>Residential plots</option><option>Commercial / yield</option><option>Land parcels</option><option>Distress / urgent deals</option><option>Open to anything strong</option>
                </select>
              </div>
              <button type="submit" className="btn-gold justify-center sm:col-span-2">Join as Investor → Open Dashboard</button>
            </form>
          )}

          {tab === "seller" && (
            sellerSent ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h2 className="mt-3 font-display text-xl font-black">Submission received</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-graphite">
                  The curation desk reviews every property within 3 working days. Approved inventory
                  goes to the network as a verified mandate.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSellerSent(true); }} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="font-display text-xl font-black">Seller / Owner — Quick Submission</h2>
                  <p className="mt-1 text-sm text-graphite">Approved properties become verified mandates pushed to {"the network's"} CPs and investors.</p>
                </div>
                <div><label className="label">Name *</label><input required className="input" placeholder="Owner / company" /></div>
                <div><label className="label">Phone *</label><input required type="tel" className="input" placeholder="+91" /></div>
                <div><label className="label">Property & location *</label><input required className="input" placeholder="e.g. 200 sq yd plot, Sector 115 Mohali" /></div>
                <div><label className="label">Expected price</label><input className="input" placeholder="e.g. ₹85 L" /></div>
                <button type="submit" className="btn-gold justify-center sm:col-span-2">Submit Property for Review</button>
                <p className="text-center text-[11px] text-graphite sm:col-span-2">
                  Need the detailed form? <Link href="/list-property" className="font-bold underline">Use the full listing page</Link>.
                </p>
              </form>
            )
          )}
        </div>

        {/* benefits under form */}
        {tab !== "seller" && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {(tab === "cp" ? CP_BENEFITS : INVESTOR_BENEFITS).map((b, i) => (
              <Reveal key={b.t} delay={i * 60}>
                <div className="card h-full p-5">
                  <p className="font-display text-sm font-black" style={{ color: "var(--gold)" }}>{b.t}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-graphite">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
