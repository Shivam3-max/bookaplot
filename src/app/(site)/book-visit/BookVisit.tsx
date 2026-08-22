"use client";

import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { DealRecord } from "@/lib/content-queries";
import { createVisit } from "@/app/actions/visits";
import { useSaved } from "@/context/SavedContext";
import Reveal from "@/components/Reveal";
import { inr } from "@/lib/format";

export default function BookVisit({ deals: DEALS }: { deals: DealRecord[] }) {
  const params = useSearchParams();
  const preselected = params.get("deal");
  const { saved } = useSaved();
  const [selected, setSelected] = useState<string[]>(preselected ? [preselected] : []);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const shortlist = DEALS.filter((d) => saved.includes(d.slug) || selected.includes(d.slug));
  const options = shortlist.length > 0 ? shortlist : DEALS.slice(0, 6);

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  const submit = (formData: FormData) => {
    setError(null);
    formData.set("dealSlugs", selected.join(","));
    startTransition(async () => {
      const result = await createVisit(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSent(true);
    });
  };

  return (
    <>
      <section className="grid-bg border-b border-line py-14">
        <div className="container-x text-center">
          <Reveal>
            <p className="eyebrow">Assisted visits</p>
            <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Shortlist Online. Visit with Clarity.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-graphite">
              Book a site visit for one or multiple shortlisted opportunities and let the team
              coordinate the schedule — route, timings, and on-ground answers included.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x max-w-3xl py-12">
        {sent ? (
          <Reveal>
            <div className="card p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h2 className="mt-4 font-display text-2xl font-black">Visit request received</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-graphite">
                A visit coordinator will call you within a few hours to confirm the schedule
                {selected.length > 1 ? " and plan the multi-property route" : ""}. You&apos;ll also get a WhatsApp confirmation.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <form action={submit} className="card space-y-6 p-6 sm:p-8">
              <div>
                <p className="label">Select deal(s) to visit</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.map((d) => {
                    const on = selected.includes(d.slug);
                    return (
                      <button
                        type="button"
                        key={d.slug}
                        onClick={() => toggle(d.slug)}
                        className={`rounded-xl border p-3 text-left transition-colors ${on ? "border-gold bg-gold-soft" : "border-line hover:border-gold"}`}
                      >
                        <p className="text-[13px] font-bold leading-snug">{d.title}</p>
                        <p className="mt-0.5 text-[11px] text-graphite">{d.cityLabel} · from {inr(d.price)}</p>
                      </button>
                    );
                  })}
                </div>
                {saved.length > 0 && <p className="mt-2 text-[11px] text-graphite">Showing your saved shortlist. Save more deals to add them here.</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Name *</label><input name="name" required className="input" placeholder="Your name" /></div>
                <div><label className="label">Phone *</label><input name="phone" required type="tel" className="input" placeholder="+91" /></div>
                <div><label className="label">Email</label><input name="email" type="email" className="input" placeholder="you@email.com" /></div>
                <div><label className="label">Preferred date *</label><input name="preferredDate" required type="date" className="input" /></div>
                <div>
                  <label className="label">Budget</label>
                  <select name="budget" className="input" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Under ₹50 L</option><option>₹50 L – ₹1.5 Cr</option><option>Above ₹1.5 Cr</option>
                  </select>
                </div>
                <div>
                  <label className="label">Buying purpose</label>
                  <select name="purpose" className="input" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Investment</option><option>Self-use / construction</option><option>Commercial</option><option>Exploring</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Notes</label>
                  <textarea name="note" className="input min-h-20" placeholder="Anything the coordinator should know…" />
                </div>
              </div>

              {error && <p className="text-sm font-semibold text-red">{error}</p>}

              <button type="submit" disabled={isPending} className="btn-gold w-full justify-center disabled:opacity-60">
                {isPending ? "Sending…" : `Book Site Visit${selected.length > 0 ? ` (${selected.length} propert${selected.length === 1 ? "y" : "ies"})` : ""}`}
              </button>
            </form>
          </Reveal>
        )}
      </section>
    </>
  );
}
