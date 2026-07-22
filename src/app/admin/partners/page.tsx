"use client";

import { useState } from "react";
import { useNetwork } from "@/context/NetworkContext";
import { TERRITORIES } from "@/lib/network-data";
import { Partner } from "@/lib/network-data";

const tone = (s: Partner["status"]) =>
  s === "Territory Locked" ? "badge-gold" : s === "Verified" ? "badge-green" : "badge-steel";

export default function AdminPartners() {
  const { partners, setPartnerStatus } = useNetwork();
  const [tab, setTab] = useState<"cp" | "investor">("cp");
  const list = partners.filter((p) => p.role === tab);
  const takenTerritories = partners.filter((p) => p.status === "Territory Locked" && p.territory).map((p) => p.territory);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">CPs &amp; Investors</h1>
        <p className="text-sm text-graphite">
          Network members — including live signups from the join forms. Verify, lock territories, manage the network.
        </p>
      </div>

      <div className="flex gap-2">
        {(["cp", "investor"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${tab === t ? "bg-ink text-white" : "border border-line bg-white text-graphite"}`}
          >
            {t === "cp" ? `Channel Partners (${partners.filter((p) => p.role === "cp").length})` : `Investors (${partners.filter((p) => p.role === "investor").length})`}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[10px] font-bold uppercase tracking-wider text-graphite">
              <th className="px-5 py-3">Member</th>
              <th className="px-5 py-3">{tab === "cp" ? "Territory" : "Budget band"}</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper/60">
                <td className="px-5 py-3.5">
                  <p className="font-bold">{p.name} <span className="ml-1 text-[10px] font-bold text-graphite">{p.id}</span></p>
                  <p className="text-xs text-graphite">{p.firm} · {p.phone}</p>
                </td>
                <td className="px-5 py-3.5">
                  {tab === "cp" ? (
                    <select
                      value={p.territory || ""}
                      onChange={(e) => setPartnerStatus(p.id, p.status, e.target.value)}
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
                <td className="px-5 py-3.5 text-xs font-semibold text-graphite">{p.joined}</td>
                <td className="px-5 py-3.5"><span className={`chip ${tone(p.status)}`}>{p.status}</span></td>
                <td className="px-5 py-3.5 text-right">
                  {p.status === "Pending" && (
                    <button onClick={() => setPartnerStatus(p.id, "Verified")} className="btn !bg-green !px-3.5 !py-1.5 !text-xs text-white">
                      Verify
                    </button>
                  )}
                  {tab === "cp" && p.status === "Verified" && (
                    <button
                      onClick={() => setPartnerStatus(p.id, "Territory Locked")}
                      disabled={!p.territory}
                      className="btn-gold !px-3.5 !py-1.5 !text-xs disabled:opacity-40"
                      title={p.territory ? "" : "Assign a territory first"}
                    >
                      Lock Territory
                    </button>
                  )}
                  {p.status === "Territory Locked" && (
                    <button onClick={() => setPartnerStatus(p.id, "Verified")} className="text-xs font-bold text-graphite underline">
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
