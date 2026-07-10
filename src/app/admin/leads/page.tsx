"use client";

import { useState } from "react";
import { LEADS, Lead, LeadStage } from "@/lib/admin-data";

const STAGES: LeadStage[] = ["New", "Contacted", "Follow-up", "Visit Scheduled", "Hot", "Negotiation", "Closed Won", "Closed Lost"];

const stageTone = (s: LeadStage) =>
  s === "Hot" || s === "Negotiation" ? "badge-gold" : s === "Closed Won" ? "badge-green" : s === "Closed Lost" ? "" : "badge-steel";

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [filter, setFilter] = useState<LeadStage | "All">("All");

  const move = (id: string, stage: LeadStage) =>
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage } : l)));

  const list = filter === "All" ? leads : leads.filter((l) => l.stage === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">Leads / CRM</h1>
          <p className="text-sm text-graphite">All forms across the site feed here — with source, budget, and stage tracking.</p>
        </div>
        <button className="btn-ghost !py-2 !text-xs">Export CSV</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["All", ...STAGES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === s ? "bg-ink text-white" : "bg-white text-graphite border border-line hover:text-ink"
            }`}
          >
            {s} {s !== "All" && `(${leads.filter((l) => l.stage === s).length})`}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((l) => (
          <div key={l.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-black">{l.name} <span className="ml-1 text-[10px] font-bold text-graphite">{l.id}</span></p>
                <p className="text-xs text-graphite">{l.phone} · {l.created}</p>
              </div>
              <span className={`chip ${stageTone(l.stage)}`}>{l.stage}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-paper p-3 text-xs">
              <div><p className="font-bold uppercase tracking-wider text-graphite text-[9px]">Source</p><p className="mt-0.5 font-semibold leading-snug">{l.source}</p></div>
              <div><p className="font-bold uppercase tracking-wider text-graphite text-[9px]">Budget</p><p className="mt-0.5 font-semibold">{l.budget}</p></div>
              <div><p className="font-bold uppercase tracking-wider text-graphite text-[9px]">Purpose</p><p className="mt-0.5 font-semibold">{l.purpose}</p></div>
              <div><p className="font-bold uppercase tracking-wider text-graphite text-[9px]">Assigned</p><p className="mt-0.5 font-semibold">{l.assignee}</p></div>
            </div>
            {l.note && <p className="mt-2.5 rounded-lg bg-gold-soft px-3 py-2 text-xs font-medium text-[#6b5426]">📝 {l.note}</p>}
            <div className="mt-3 flex items-center gap-2">
              <span className="chip badge-green !text-[10px]">Score {l.score}</span>
              <div className="ml-auto flex items-center gap-2">
                <button className="text-xs font-bold text-graphite hover:text-ink">Call</button>
                <button className="text-xs font-bold text-green">WhatsApp</button>
                <select
                  value={l.stage}
                  onChange={(e) => move(l.id, e.target.value as LeadStage)}
                  className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-bold"
                >
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
