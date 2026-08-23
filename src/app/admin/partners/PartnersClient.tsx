"use client";

import { useState, useTransition } from "react";
import { setPartnerStatus } from "@/app/actions/network";
import { TERRITORIES } from "@/lib/network-data";
import type { PartnerStatus, PublicUser } from "@/lib/db-types";

const tone = (s: PartnerStatus) =>
  s === "TERRITORY_LOCKED" ? "badge-gold" : s === "VERIFIED" ? "badge-green" : "badge-steel";
const label: Record<PartnerStatus, string> = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  TERRITORY_LOCKED: "Territory Locked",
};

export default function PartnersClient({ partners }: { partners: PublicUser[] }) {
  const [tab, setTab] = useState<"CP" | "INVESTOR">("CP");
  const [isPending, startTransition] = useTransition();
  const list = partners.filter((p) => p.role === tab);
  const takenTerritories = partners.filter((p) => p.status === "TERRITORY_LOCKED" && p.territory).map((p) => p.territory);

  const update = (id: number, status: PartnerStatus, territory?: string) =>
    startTransition(async () => { await setPartnerStatus(id, status, territory); });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">CPs &amp; Investors</h1>
        <p className="text-sm text-graphite">
          Network members — including live signups from the join forms. Verify, lock territories, manage the network.
        </p>
      </div>

      <div className="flex gap-2">
        {(["CP", "INVESTOR"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${tab === t ? "bg-ink text-white" : "border border-line bg-white text-graphite"}`}
          >
            {t === "CP" ? `Channel Partners (${partners.filter((p) => p.role === "CP").length})` : `Investors (${partners.filter((p) => p.role === "INVESTOR").length})`}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[10px] font-bold uppercase tracking-wider text-graphite">
              <th className="px-5 py-3">Member</th>
              <th className="px-5 py-3">{tab === "CP" ? "Territory" : "Budget band"}</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper/60">
                <td className="px-5 py-3.5">
                  <p className="font-bold">{p.name} <span className="ml-1 text-[10px] font-bold text-graphite">#{p.id}</span></p>
                  <p className="text-xs text-graphite">{p.firm || "—"} · {p.phone}</p>
                  {p.updatedByName && <p className="text-[10px] text-graphite/70">Updated by {p.updatedByName}</p>}
                </td>
                <td className="px-5 py-3.5">
                  {tab === "CP" ? (
                    <select
                      value={p.territory || ""}
                      onChange={(e) => update(p.id, p.status, e.target.value)}
                      disabled={isPending}
                      className="input !w-auto !py-1.5 !text-xs"
                    >
                      <option value="">Unassigned</option>
                      {TERRITORIES.map((t) => (
                        <option key={t} disabled={takenTerritories.includes(t) && p.territory !== t}>
                          {t}{takenTerritories.includes(t) && p.territory !== t ? " (locked)" : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="font-semibold">{p.budget || "—"}</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-xs font-semibold text-graphite">{p.createdAt.toLocaleDateString("en-IN")}</td>
                <td className="px-5 py-3.5"><span className={`chip ${tone(p.status)}`}>{label[p.status]}</span></td>
                <td className="px-5 py-3.5 text-right">
                  {p.status === "PENDING" && (
                    <button disabled={isPending} onClick={() => update(p.id, "VERIFIED")} className="btn !bg-green !px-3.5 !py-1.5 !text-xs text-white disabled:opacity-60">
                      Verify
                    </button>
                  )}
                  {tab === "CP" && p.status === "VERIFIED" && (
                    <button
                      disabled={isPending || !p.territory}
                      onClick={() => update(p.id, "TERRITORY_LOCKED")}
                      className="btn-gold !px-3.5 !py-1.5 !text-xs disabled:opacity-40"
                      title={p.territory ? "" : "Assign a territory first"}
                    >
                      Lock Territory
                    </button>
                  )}
                  {p.status === "TERRITORY_LOCKED" && (
                    <button disabled={isPending} onClick={() => update(p.id, "VERIFIED")} className="text-xs font-bold text-graphite underline disabled:opacity-60">
                      Unlock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-graphite">
        New join-form signups appear here instantly with Pending status. One CP per territory is enforced — locked zones are disabled in the picker.
      </p>
    </div>
  );
}
