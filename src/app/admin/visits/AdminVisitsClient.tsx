"use client";

import { useState, useTransition } from "react";
import type { VisitRecord } from "@/lib/content-queries";
import { updateVisitStatus } from "@/app/actions/visits";

const TONES: Record<VisitRecord["status"], string> = {
  Requested: "badge-gold",
  Confirmed: "badge-steel",
  Completed: "badge-green",
  Cancelled: "",
};

const STATUS_VALUE: Record<VisitRecord["status"], "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED"> = {
  Requested: "REQUESTED",
  Confirmed: "CONFIRMED",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
};

export default function AdminVisitsClient({ visits }: { visits: VisitRecord[] }) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const set = (id: number, status: VisitRecord["status"]) => {
    setPendingId(id);
    startTransition(async () => {
      await updateVisitStatus(id, STATUS_VALUE[status]);
      setPendingId(null);
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">Site Visit Management</h1>
        <p className="text-sm text-graphite">Coordinate schedules, assign coordinators, capture post-visit feedback.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {(["Requested", "Confirmed", "Completed"] as const).map((s) => (
          <div key={s} className="card p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">{s}</p>
            <p className="mt-1 font-display text-2xl font-black" style={{ color: s === "Completed" ? "var(--green)" : "var(--gold)" }}>
              {visits.filter((v) => v.status === s).length}
            </p>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[10px] font-bold uppercase tracking-wider text-graphite">
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Properties</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Coordinator</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {visits.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-graphite">No site visit requests yet.</td></tr>
            )}
            {visits.map((v) => (
              <tr key={v.id} className="border-b border-line last:border-0 hover:bg-paper/60">
                <td className="px-5 py-3.5">
                  <p className="font-bold">{v.customer}</p>
                  <p className="text-xs text-graphite">{v.phone}</p>
                  {v.updatedByName && <p className="text-[10px] text-graphite/70">Updated by {v.updatedByName}</p>}
                </td>
                <td className="max-w-56 px-5 py-3.5 text-xs font-medium">{v.deals.length > 0 ? v.deals.join(" + ") : "—"}</td>
                <td className="px-5 py-3.5 font-bold">{new Date(v.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                <td className="px-5 py-3.5">{v.coordinator}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={v.status}
                    disabled={isPending && pendingId === v.id}
                    onChange={(e) => set(v.id, e.target.value as VisitRecord["status"])}
                    className={`chip ${TONES[v.status]} cursor-pointer`}
                  >
                    <option>Requested</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option>
                  </select>
                </td>
                <td className="max-w-52 px-5 py-3.5 text-xs text-graphite">{v.feedback || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
