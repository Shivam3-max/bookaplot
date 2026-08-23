"use client";

import { useTransition } from "react";
import type { SellerSubmissionRecord } from "@/lib/db-types";
import { updateSubmissionStatus } from "@/app/actions/network";

const TONES: Record<SellerSubmissionRecord["status"], string> = {
  PENDING_REVIEW: "badge-gold",
  APPROVED: "badge-green",
  REJECTED: "",
};

const LABELS: Record<SellerSubmissionRecord["status"], string> = {
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default function SubmissionsClient({ submissions }: { submissions: SellerSubmissionRecord[] }) {
  const [isPending, startTransition] = useTransition();

  const set = (id: number, status: SellerSubmissionRecord["status"]) =>
    startTransition(() => updateSubmissionStatus(id, status));

  if (submissions.length === 0) {
    return <p className="card p-8 text-center text-sm text-graphite">No property submissions yet.</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {submissions.map((s) => (
        <div key={s.id} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display font-black">{s.name}</p>
              <p className="text-xs text-graphite">{s.phone} · Received {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <span className={`chip ${TONES[s.status]}`}>{LABELS[s.status]}</span>
          </div>
          <div className="mt-3 grid gap-2 rounded-xl bg-paper p-3 text-xs">
            <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Property detail</p><p className="mt-0.5 font-semibold">{s.propertyDetail}</p></div>
            <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Expected price</p><p className="mt-0.5 font-semibold">{s.expectedPrice || "—"}</p></div>
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <button disabled={isPending} onClick={() => set(s.id, "APPROVED")} className="btn !bg-green !px-4 !py-1.5 !text-xs text-white disabled:opacity-60">Approve</button>
            <button disabled={isPending} onClick={() => set(s.id, "REJECTED")} className="btn-ghost !px-4 !py-1.5 !text-xs !text-graphite disabled:opacity-60">Reject</button>
            {s.status !== "PENDING_REVIEW" && (
              <button disabled={isPending} onClick={() => set(s.id, "PENDING_REVIEW")} className="btn-ghost !px-4 !py-1.5 !text-xs disabled:opacity-60">Reset to Pending</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
