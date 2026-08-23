"use client";

import { useTransition } from "react";
import type { LeadRecord, LeadStageValue } from "@/lib/content-queries";
import { updateLeadStagePartner } from "@/app/actions/leads";

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

export default function PortalLeadsClient({ leads }: { leads: LeadRecord[] }) {
  const [isPending, startTransition] = useTransition();
  const move = (id: number, stage: LeadStageValue) => startTransition(() => updateLeadStagePartner(id, stage));

  if (leads.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display font-bold">No leads yet</p>
        <p className="mt-1 text-sm text-graphite">Real inquiries from site forms will appear here as they come in.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {leads.map((l) => (
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
          <div className="mt-3 flex justify-end">
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
  );
}
