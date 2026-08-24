"use client";

import { Fragment, useState, useTransition } from "react";
import Link from "next/link";
import type { DealRecord } from "@/lib/content-queries";
import { createDeal, updateDeal, updateDealQuickFields, deleteDeal } from "@/app/actions/deals";
import { inr } from "@/lib/format";

function DealForm({ deal, onCancel }: { deal?: DealRecord; onCancel: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(deal?.images ?? []);

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = deal ? await updateDeal(deal.id, formData) : await createDeal(formData);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onCancel();
    });
  };

  const joinLines = (arr: string[]) => arr.join("\n");
  const joinLA = (arr: { label: string; value: string }[]) => arr.map((a) => `${a.label}: ${a.value}`).join("\n");
  const joinFaqs = (arr: { q: string; a: string }[]) => arr.map((f) => `${f.q}|${f.a}`).join("\n");

  return (
    <form action={submit} className="card space-y-4 p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className="label">Slug *</label><input name="slug" required defaultValue={deal?.slug} className="input" placeholder="my-new-deal" /></div>
        <div><label className="label">Title *</label><input name="title" required defaultValue={deal?.title} className="input" /></div>
        <div><label className="label">Subtitle</label><input name="subtitle" defaultValue={deal?.subtitle} className="input" /></div>
        <div><label className="label">City key (slug)</label><input name="city" defaultValue={deal?.city} className="input" placeholder="e.g. mohali" /></div>
        <div><label className="label">City label</label><input name="cityLabel" defaultValue={deal?.cityLabel} className="input" /></div>
        <div><label className="label">Micro-location</label><input name="microLocation" defaultValue={deal?.microLocation} className="input" /></div>
        <div><label className="label">Type</label><input name="type" defaultValue={deal?.type} className="input" placeholder="Residential Plot" /></div>
        <div><label className="label">Status</label><input name="status" defaultValue={deal?.status} className="input" placeholder="Ready" /></div>
        <div><label className="label">Unit</label><input name="unit" defaultValue={deal?.unit} className="input" placeholder="sq yd" /></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div><label className="label">Price (₹)</label><input name="price" type="number" required defaultValue={deal?.price} className="input" /></div>
        <div><label className="label">Price max (₹)</label><input name="priceMax" type="number" defaultValue={deal?.priceMax} className="input" /></div>
        <div><label className="label">Price / unit</label><input name="pricePerUnit" type="number" defaultValue={deal?.pricePerUnit} className="input" /></div>
        <div><label className="label">Benchmark / unit</label><input name="benchmarkPerUnit" type="number" defaultValue={deal?.benchmarkPerUnit} className="input" /></div>
        <div><label className="label">Booking amount (₹)</label><input name="bookingAmount" type="number" defaultValue={deal?.bookingAmount} className="input" /></div>
        <div><label className="label">Score (0-100)</label><input name="score" type="number" defaultValue={deal?.score} className="input" /></div>
        <div><label className="label">Map X (%)</label><input name="mapX" type="number" defaultValue={deal?.mapX ?? 50} className="input" /></div>
        <div><label className="label">Map Y (%)</label><input name="mapY" type="number" defaultValue={deal?.mapY ?? 50} className="input" /></div>
        <div><label className="label">Hue (0-360)</label><input name="hue" type="number" defaultValue={deal?.hue ?? 200} className="input" /></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className="label">Area label</label><input name="areaLabel" defaultValue={deal?.areaLabel} className="input" /></div>
        <div><label className="label">Facing</label><input name="facing" defaultValue={deal?.facing} className="input" /></div>
        <div><label className="label">Road width</label><input name="roadWidth" defaultValue={deal?.roadWidth} className="input" /></div>
        <div><label className="label">Possession</label><input name="possession" defaultValue={deal?.possession} className="input" /></div>
        <div><label className="label">Approval</label><input name="approval" defaultValue={deal?.approval} className="input" /></div>
        <div><label className="label">Upside note</label><input name="upsideNote" defaultValue={deal?.upsideNote} className="input" /></div>
      </div>

      <div>
        <label className="label">Overview</label>
        <textarea name="overview" defaultValue={deal?.overview} className="input min-h-20" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label">Purpose (comma-separated: investment, self-use, commercial)</label><input name="purpose" defaultValue={deal?.purpose.join(", ")} className="input" /></div>
        <div><label className="label">Badges (comma-separated)</label><input name="badges" defaultValue={deal?.badges.join(", ")} className="input" /></div>
        <div><label className="label">Sizes (comma-separated)</label><input name="sizes" defaultValue={deal?.sizes.join(", ")} className="input" /></div>
        <div><label className="label">Suits who (comma-separated)</label><input name="suitsWho" defaultValue={deal?.suitsWho.join(", ")} className="input" /></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label">Highlights (one per line)</label><textarea name="highlights" defaultValue={deal ? joinLines(deal.highlights) : ""} className="input min-h-20" /></div>
        <div><label className="label">Why it stands out (one per line)</label><textarea name="whyStandsOut" defaultValue={deal ? joinLines(deal.whyStandsOut) : ""} className="input min-h-20" /></div>
        <div><label className="label">Demand drivers (one per line)</label><textarea name="demandDrivers" defaultValue={deal ? joinLines(deal.demandDrivers) : ""} className="input min-h-20" /></div>
        <div><label className="label">Location advantages (one per line: Label: Value)</label><textarea name="locationAdvantages" defaultValue={deal ? joinLA(deal.locationAdvantages) : ""} className="input min-h-20" /></div>
        <div className="sm:col-span-2"><label className="label">FAQs (one per line: Question|Answer)</label><textarea name="faqs" defaultValue={deal ? joinFaqs(deal.faqs) : ""} className="input min-h-20" /></div>
      </div>

      <div>
        <label className="label">Photos (max 12, 4MB each)</label>
        {images.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {images.map((url, i) => (
              <Fragment key={i}>
                <div className="group relative h-20 w-20 overflow-hidden rounded-lg border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate/80 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
                <input type="hidden" name="existingImages" value={url} />
              </Fragment>
            ))}
          </div>
        )}
        <input type="file" name="newImages" multiple accept="image/*" className="input" />
      </div>

      <div className="flex flex-wrap gap-4">
        {(["featured", "hot", "investorPick", "newListing"] as const).map((f) => (
          <label key={f} className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name={f} defaultChecked={deal?.[f]} /> {f}
          </label>
        ))}
      </div>

      {error && <p className="text-sm font-semibold text-red">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="btn-gold !py-2.5 disabled:opacity-60">
          {isPending ? "Saving…" : deal ? "Save Changes" : "Create Deal"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost !py-2.5">Cancel</button>
      </div>
    </form>
  );
}

export default function AdminDealsClient({ deals }: { deals: DealRecord[] }) {
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const list = deals.filter(
    (d) => d.title.toLowerCase().includes(q.toLowerCase()) || d.cityLabel.toLowerCase().includes(q.toLowerCase())
  );

  const toggleFeatured = (id: number, featured: boolean) => startTransition(() => updateDealQuickFields(id, { featured: !featured }));
  const setStatus = (id: number, status: string) => startTransition(() => updateDealQuickFields(id, { status }));
  const remove = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    startTransition(() => deleteDeal(id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">Deals Management</h1>
          <p className="text-sm text-graphite">{deals.length} deals · {deals.filter((d) => d.featured).length} featured</p>
        </div>
        <button onClick={() => { setCreating((v) => !v); setEditingId(null); }} className="btn-gold !py-2.5 max-sm:w-full">
          {creating ? "Close" : "+ Add New Deal"}
        </button>
      </div>

      {creating && <DealForm onCancel={() => setCreating(false)} />}

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="input max-w-sm"
        placeholder="Search deals by title or city…"
      />

      <div className="card table-card overflow-x-auto">
        <table className="table-stack w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[10px] font-bold uppercase tracking-wider text-graphite">
              <th className="px-5 py-3">Deal</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Score</th>
              <th className="px-5 py-3">Badges</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Featured</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => (
              <Fragment key={d.id}>
                <tr className="border-b border-line last:border-0 hover:bg-paper/60">
                  <td className="px-5 py-3.5">
                    <p className="font-bold leading-snug">{d.title}</p>
                    <p className="text-xs text-graphite">{d.cityLabel} · {d.type}</p>
                    <p className="text-[10px] text-graphite/70">
                      {d.updatedByName ? `Updated by ${d.updatedByName}` : d.createdByName ? `Created by ${d.createdByName}` : "—"}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 font-bold" data-label="Price">{inr(d.price)}</td>
                  <td className="px-5 py-3.5" data-label="Score">
                    <span className="chip badge-green">{d.score}</span>
                  </td>
                  <td className="px-5 py-3.5" data-label="Badges">
                    <div className="flex max-w-44 flex-wrap gap-1">
                      {d.badges.slice(0, 2).map((b) => <span key={b} className="chip !text-[10px]">{b}</span>)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5" data-label="Status">
                    <select
                      value={d.status}
                      disabled={isPending}
                      onChange={(e) => setStatus(d.id, e.target.value)}
                      className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-bold"
                    >
                      <option>Ready</option><option>Pre-Launch</option><option>Resale</option><option>Fresh Inventory</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5" data-label="Featured">
                    <button
                      onClick={() => toggleFeatured(d.id, d.featured ?? false)}
                      disabled={isPending}
                      className={`relative h-5.5 w-10 rounded-full transition-colors ${d.featured ? "bg-gold" : "bg-line"}`}
                      style={{ height: 22 }}
                      aria-label="Toggle featured"
                    >
                      <span
                        className="absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-all"
                        style={{ left: d.featured ? 20 : 2 }}
                      />
                    </button>
                  </td>
                  <td className="cell-actions px-5 py-3.5 text-right">
                    <Link href={`/deals/${d.slug}`} className="text-xs font-bold" style={{ color: "var(--gold)" }}>View ↗</Link>
                    <button onClick={() => { setEditingId(editingId === d.id ? null : d.id); setCreating(false); }} className="ml-3 text-xs font-bold text-graphite hover:text-ink">
                      {editingId === d.id ? "Close" : "Edit"}
                    </button>
                    <button onClick={() => remove(d.id, d.title)} className="ml-3 text-xs font-bold text-red hover:underline">Delete</button>
                  </td>
                </tr>
                {editingId === d.id && (
                  <tr>
                    <td colSpan={7} className="cell-form bg-paper/60 p-4">
                      <DealForm deal={d} onCancel={() => setEditingId(null)} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
