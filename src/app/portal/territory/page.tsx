"use client";

import { useNetwork } from "@/context/NetworkContext";
import { TERRITORIES } from "@/lib/network-data";
import { LEADS } from "@/lib/admin-data";
import { DEALS } from "@/lib/data";
import TricityMap from "@/components/TricityMap";
import Link from "next/link";

export default function TerritoryPage() {
  const { account } = useNetwork();
  if (!account) return null;
  if (account.role !== "cp")
    return (
      <div className="card p-10 text-center">
        <p className="font-display font-bold">Territory rights are a Channel Partner feature.</p>
        <Link href="/portal" className="btn-primary mt-4">Back to Overview</Link>
      </div>
    );

  const mine = account.territory || "Territory pending verification";
  const activeLeads = LEADS.filter((l) => !["Closed Won", "Closed Lost"].includes(l.stage)).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">My Territory</h1>
        <p className="text-sm text-graphite">Exclusive rights — one CP per territory, enforced by the platform.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="card p-2">
          <TricityMap showDeals corridors heat className="aspect-[4/3.4]" />
        </div>
        <div className="space-y-4">
          <div className="card border-l-4 p-5" style={{ borderLeftColor: "var(--gold)" }}>
            <p className="eyebrow">Locked to you</p>
            <p className="mt-1 font-display text-2xl font-black">{mine}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "All mandates inside this zone route to you first",
                "Territory leads land in your dashboard, not a shared pool",
                "Your name & number go on zone creatives",
                "No second CP is onboarded in a locked territory",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2.5">
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <span className="font-medium">{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <p className="eyebrow">Zone snapshot</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-paper p-3">
                <p className="font-display text-xl font-black" style={{ color: "var(--green)" }}>{DEALS.length}</p>
                <p className="text-[11px] font-semibold text-graphite">Network mandates</p>
              </div>
              <div className="rounded-xl bg-paper p-3">
                <p className="font-display text-xl font-black" style={{ color: "var(--gold)" }}>{activeLeads.length}</p>
                <p className="text-[11px] font-semibold text-graphite">Active leads</p>
              </div>
              <div className="rounded-xl bg-paper p-3">
                <p className="font-display text-xl font-black" style={{ color: "var(--steel)" }}>{TERRITORIES.length}</p>
                <p className="text-[11px] font-semibold text-graphite">Total territories</p>
              </div>
            </div>
            <Link href="/portal/leads" className="btn-primary mt-4 w-full justify-center !py-2.5">Open Territory Leads</Link>
          </div>
          <div className="card p-5">
            <p className="eyebrow">Want a second zone?</p>
            <p className="mt-1 text-sm text-graphite">
              Additional territories unlock after 3 closed transactions. Talk to your network manager to queue a request.
            </p>
            <Link href="/contact" className="btn-ghost mt-3 !px-4 !py-2 !text-xs">Request Additional Territory</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
