"use client";

import { useState } from "react";
import Link from "next/link";
import { useNetwork } from "@/context/NetworkContext";
import { LEADS, Lead, LeadStage } from "@/lib/admin-data";

const STAGES: LeadStage[] = ["New", "Contacted", "Follow-up", "Visit Scheduled", "Hot", "Negotiation", "Closed Won", "Closed Lost"];

export default function TerritoryLeads() {
  const { account } = useNetwork();
  const [leads, setLeads] = useState<Lead[]>(LEADS.map((l) => ({ ...l, assignee: "You" })));
  if (!account) return null;
  if (account.role !== "cp")
    return (
      <div className="card p-10 text-center">
        <p className="font-display font-bold">Territory leads are a Channel Partner feature.</p>
        <Link href="/portal" className="btn-primary mt-4">Back to Overview</Link>
      </div>
    );

  const move = (id: string, stage: LeadStage) =>
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage } : l)));

  const active = leads.filter((l) => !["Closed Won", "Closed Lost"].includes(l.stage));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">Territory Leads</h1>
        <p className="text-sm text-graphite">
          {account.territory || "Your zone"} — {active.length} active leads routed exclusively to you. Update stages as you work them.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {leads.map((l) => (
          <div key={l.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-black">{l.name}</p>
                <p className="text-xs text-graphite">{l.phone} · via {l.source}</p>
              </div>
              <select
                value={l.stage}
                onChange={(e) => move(l.id, e.target.value as LeadStage)}
                className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                  ["Hot", "Negotiation"].includes(l.stage) ? "border-[#e6d7b4] bg-gold-soft text-[#8a6b30]" :
                  l.stage === "Closed Won" ? "border-[#c5dcd2] bg-green-soft text-green" : "border-line bg-white text-slate"
                }`}
              >
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-paper p-3 text-xs">
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Budget</p><p className="mt-0.5 font-semibold">{l.budget}</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Purpose</p><p className="mt-0.5 font-semibold">{l.purpose}</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Interest</p><p className="mt-0.5 truncate font-semibold">{l.deal || "General"}</p></div>
            </div>
            {l.note && <p className="mt-2.5 rounded-lg bg-gold-soft px-3 py-2 text-xs font-medium text-[#6b5426]">📝 {l.note}</p>}
            <div className="mt-3 flex gap-2">
              <button className="btn-ghost flex-1 justify-center !py-2 !text-xs">📞 Call</button>
              <button className="btn flex-1 justify-center !bg-green !py-2 !text-xs text-white">WhatsApp</button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-graphite">Stage changes are saved for this session; they sync to the CRM once the backend goes live.</p>
    </div>
  );
}
