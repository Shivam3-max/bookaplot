"use client";

import { useState } from "react";
import { SUBMISSIONS, Submission } from "@/lib/admin-data";

const TONES: Record<Submission["status"], string> = {
  "Pending Review": "badge-gold",
  "Needs Details": "badge-steel",
  Approved: "badge-green",
  Rejected: "",
};

export default function AdminSubmissions() {
  const [subs, setSubs] = useState(SUBMISSIONS);

  const set = (id: string, status: Submission["status"]) =>
    setSubs((ss) => ss.map((s) => (s.id === id ? { ...s, status } : s)));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">Property Submissions</h1>
        <p className="text-sm text-graphite">Owner, broker and developer submissions — review, request details, approve into live deals.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {subs.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-black">{s.owner} <span className="ml-1 text-[10px] font-bold text-graphite">{s.id}</span></p>
                <p className="text-xs text-graphite">Received {s.received}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`chip ${TONES[s.status]}`}>{s.status}</span>
                <span className="chip !text-[10px]">{s.tag}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-paper p-3 text-xs">
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Type</p><p className="mt-0.5 font-semibold">{s.type}</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Location</p><p className="mt-0.5 font-semibold">{s.location}</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Size</p><p className="mt-0.5 font-semibold">{s.size}</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Expected</p><p className="mt-0.5 font-semibold">{s.expected}</p></div>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-2">
              <button onClick={() => set(s.id, "Approved")} className="btn !bg-green !px-4 !py-1.5 !text-xs text-white">Approve → Deal</button>
              <button onClick={() => set(s.id, "Needs Details")} className="btn-ghost !px-4 !py-1.5 !text-xs">Ask for Details</button>
              <button onClick={() => set(s.id, "Rejected")} className="btn-ghost !px-4 !py-1.5 !text-xs !text-graphite">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
