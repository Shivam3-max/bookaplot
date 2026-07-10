"use client";

import { useState } from "react";
import Link from "next/link";
import { DEALS } from "@/lib/data";
import { inr } from "@/lib/format";

type Row = { slug: string; status: "Live" | "Paused" | "Sold"; featured: boolean };

export default function AdminDeals() {
  const [rows, setRows] = useState<Row[]>(
    DEALS.map((d) => ({ slug: d.slug, status: "Live", featured: !!d.featured }))
  );
  const [q, setQ] = useState("");

  const set = (slug: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, ...patch } : r)));

  const list = DEALS.filter(
    (d) => d.title.toLowerCase().includes(q.toLowerCase()) || d.cityLabel.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">Deals Management</h1>
          <p className="text-sm text-graphite">{rows.filter((r) => r.status === "Live").length} live · {rows.filter((r) => r.featured).length} featured</p>
        </div>
        <button className="btn-gold !py-2.5">+ Add New Deal</button>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="input max-w-sm"
        placeholder="Search deals by title or city…"
      />

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
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
            {list.map((d) => {
              const row = rows.find((r) => r.slug === d.slug)!;
              return (
                <tr key={d.slug} className="border-b border-line last:border-0 hover:bg-paper/60">
                  <td className="px-5 py-3.5">
                    <p className="font-bold leading-snug">{d.title}</p>
                    <p className="text-xs text-graphite">{d.cityLabel} · {d.type}</p>
                  </td>
                  <td className="px-5 py-3.5 font-bold">{inr(d.price)}</td>
                  <td className="px-5 py-3.5">
                    <span className="chip badge-green">{d.score}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex max-w-44 flex-wrap gap-1">
                      {d.badges.slice(0, 2).map((b) => <span key={b} className="chip !text-[10px]">{b}</span>)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={row.status}
                      onChange={(e) => set(d.slug, { status: e.target.value as Row["status"] })}
                      className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                        row.status === "Live" ? "border-green bg-green-soft text-green" : row.status === "Sold" ? "border-line bg-paper text-graphite" : "border-[#e6d7b4] bg-gold-soft text-[#8a6b30]"
                      }`}
                    >
                      <option>Live</option><option>Paused</option><option>Sold</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => set(d.slug, { featured: !row.featured })}
                      className={`relative h-5.5 w-10 rounded-full transition-colors ${row.featured ? "bg-gold" : "bg-line"}`}
                      style={{ height: 22 }}
                      aria-label="Toggle featured"
                    >
                      <span
                        className="absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-all"
                        style={{ left: row.featured ? 20 : 2 }}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/deals/${d.slug}`} className="text-xs font-bold" style={{ color: "var(--gold)" }}>
                      View ↗
                    </Link>
                    <button className="ml-3 text-xs font-bold text-graphite hover:text-ink">Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-graphite">
        Status and featured toggles are UI state in this build — they&apos;ll persist once the PostgreSQL + Prisma backend is connected.
      </p>
    </div>
  );
}
