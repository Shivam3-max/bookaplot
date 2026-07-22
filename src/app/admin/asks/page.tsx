"use client";

import { useState } from "react";
import { useNetwork } from "@/context/NetworkContext";
import { Ask } from "@/lib/network-data";

const statusTone = (s: Ask["status"]) =>
  s === "Matched" ? "badge-green" : s === "Platform Reverted" ? "badge-gold" : "badge-steel";

export default function AdminAsks() {
  const { asks, replyAsk } = useNetwork();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const open = asks.filter((a) => a.status === "Open").length;
  const urgent = asks.filter((a) => a.urgency.startsWith("Urgent")).length;

  const send = (id: string, matched: boolean) => {
    const text = drafts[id]?.trim();
    if (!text) return;
    replyAsk(id, text, matched ? "Matched" : "Platform Reverted");
    setDrafts((d) => ({ ...d, [id]: "" }));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">Give &amp; Ask Desk</h1>
        <p className="text-sm text-graphite">
          Investor requirements in, platform reverts out. Replies you send here appear live in the investor&apos;s dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total asks", asks.length, "var(--steel)"],
          ["Awaiting revert", open, "var(--gold)"],
          ["Urgent / desperate", urgent, "var(--red)"],
        ].map(([k, v, tone]) => (
          <div key={k as string} className="card p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">{k}</p>
            <p className="mt-1 font-display text-2xl font-black" style={{ color: tone as string }}>{v}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {asks.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-display font-black">{a.type} <span className="ml-1 text-[10px] font-bold text-graphite">{a.id}</span></p>
                <p className="text-xs text-graphite">{a.investor} · {a.created}</p>
              </div>
              <div className="flex items-center gap-2">
                {a.urgency.startsWith("Urgent") && (
                  <span className="chip !border-[#f0c9c0] !bg-[#faece9] !text-[10px] !text-[var(--red)]">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--red)]" /> Desperate desk
                  </span>
                )}
                <span className={`chip !text-[10px] ${statusTone(a.status)}`}>{a.status}</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-paper p-3 text-xs">
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Budget</p><p className="mt-0.5 font-semibold">{a.budget}</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Locations</p><p className="mt-0.5 font-semibold">{a.locations}</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Urgency</p><p className="mt-0.5 font-semibold">{a.urgency}</p></div>
            </div>
            {a.note && <p className="mt-2 text-[13px] italic text-slate">&ldquo;{a.note}&rdquo;</p>}

            {a.replies.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {a.replies.map((r, i) => (
                  <p key={i} className="rounded-lg bg-green-soft px-3 py-2 text-xs text-slate">
                    <b className="text-green">Sent {r.date}:</b> {r.text}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
              <input
                value={drafts[a.id] || ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [a.id]: e.target.value }))}
                className="input flex-1 !py-2.5"
                placeholder="Write the revert — matched inventory, sheets shared, next steps…"
              />
              <div className="flex gap-2">
                <button onClick={() => send(a.id, false)} className="btn-primary !px-4 !py-2.5 !text-xs">Send Revert</button>
                <button onClick={() => send(a.id, true)} className="btn-gold !px-4 !py-2.5 !text-xs">Revert + Mark Matched</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
