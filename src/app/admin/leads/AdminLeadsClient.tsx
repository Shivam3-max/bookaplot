"use client";

import { useState, useTransition } from "react";
import type { LeadRecord, LeadStageValue } from "@/lib/content-queries";
import { updateLeadStageAdmin } from "@/app/actions/leads";

const STAGES: LeadStageValue[] = ["NEW", "CONTACTED", "FOLLOW_UP", "VISIT_SCHEDULED", "HOT", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];

const STAGE_LABEL: Record<LeadStageValue, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  FOLLOW_UP: "Follow-up",
  VISIT_SCHEDULED: "Visit Scheduled",
  HOT: "Hot",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

const stageTone = (s: LeadStageValue) =>
  s === "HOT" || s === "NEGOTIATION" ? "badge-gold" : s === "CLOSED_WON" ? "badge-green" : s === "CLOSED_LOST" ? "" : "badge-steel";

export default function AdminLeadsClient({ leads }: { leads: LeadRecord[] }) {
  const [filter, setFilter] = useState<LeadStageValue | "All">("All");
  const [isPending, startTransition] = useTransition();

  const list = filter === "All" ? leads : leads.filter((l) => l.stage === filter);

  const move = (id: number, stage: LeadStageValue) => startTransition(() => updateLeadStageAdmin(id, stage));

  if (leads.length === 0) {
    return <p className="card p-8 text-center text-sm text-graphite">No leads yet — they'll appear here as visitors submit forms across the site.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["All", ...STAGES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === s ? "bg-ink text-white" : "bg-white text-graphite border border-line hover:text-ink"
            }`}
          >
            {s === "All" ? "All" : STAGE_LABEL[s]} {s !== "All" && `(${leads.filter((l) => l.stage === s).length})`}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((l) => (
          <div key={l.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-black">{l.name} <span className="ml-1 text-[10px] font-bold text-graphite">#{l.id}</span></p>
                <p className="text-xs text-graphite">{l.phone || l.email || "—"} · {l.createdAt}</p>
              </div>
              <span className={`chip ${stageTone(l.stage)}`}>{STAGE_LABEL[l.stage]}</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-graphite">Source: {l.source}</p>
            {l.note && <p className="mt-2.5 rounded-lg bg-gold-soft px-3 py-2 text-xs font-medium text-[#6b5426] whitespace-pre-line">{l.note}</p>}
            <div className="mt-3 flex items-center gap-2">
              <span className="ml-auto text-xs text-graphite">{l.assigneeName ? `Assigned: ${l.assigneeName}` : "Unassigned"}</span>
              <select
                value={l.stage}
                disabled={isPending}
                onChange={(e) => move(l.id, e.target.value as LeadStageValue)}
                className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-bold"
              >
                {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
