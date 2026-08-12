"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { postAsk } from "@/app/actions/network";
import type { CurrentUser } from "@/lib/dal";
import type { Ask, AskReply, User } from "@prisma/client";

type AskWithRelations = Ask & { investor: Pick<User, "name">; replies: AskReply[] };

const statusLabel: Record<Ask["status"], string> = {
  OPEN: "Open",
  PLATFORM_REVERTED: "Platform Reverted",
  MATCHED: "Matched",
};
const statusTone = (s: Ask["status"]) =>
  s === "MATCHED" ? "badge-green" : s === "PLATFORM_REVERTED" ? "badge-gold" : "badge-steel";

function AskCard({ ask, cpView, onPitch, pitched }: { ask: AskWithRelations; cpView?: boolean; onPitch?: () => void; pitched?: boolean }) {
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-display font-black">{ask.type}</p>
          <p className="text-xs text-graphite">{ask.investor.name} · {ask.createdAt.toLocaleDateString("en-IN")}</p>
        </div>
        <div className="flex items-center gap-2">
          {ask.urgency.startsWith("Urgent") && (
            <span className="chip !border-[#f0c9c0] !bg-[#faece9] !text-[10px] !text-[var(--red)]">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--red)]" /> Desperate deal
            </span>
          )}
          <span className={`chip !text-[10px] ${statusTone(ask.status)}`}>{statusLabel[ask.status]}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-paper p-3 text-xs">
        <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Budget</p><p className="mt-0.5 font-semibold">{ask.budget}</p></div>
        <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Locations</p><p className="mt-0.5 font-semibold">{ask.locations}</p></div>
        <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Urgency</p><p className="mt-0.5 font-semibold">{ask.urgency}</p></div>
      </div>
      {ask.note && <p className="mt-2.5 text-[13px] italic text-slate">&ldquo;{ask.note}&rdquo;</p>}

      {!cpView && ask.replies.length > 0 && (
        <div className="mt-3.5 space-y-2">
          {ask.replies.map((r) => (
            <div key={r.id} className="rounded-xl border border-[#c5dcd2] bg-green-soft p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-green">↳ Platform revert · {r.createdAt.toLocaleDateString("en-IN")}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {cpView && (
        <div className="mt-3.5 flex items-center justify-between">
          <p className="text-[11px] text-graphite">Have matching inventory in your territory?</p>
          <button
            onClick={onPitch}
            className={`btn !px-4 !py-2 !text-xs text-white ${pitched ? "!bg-green" : "!bg-ink hover:!bg-green"}`}
          >
            {pitched ? "✓ Pitched to desk" : "Pitch My Inventory"}
          </button>
        </div>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold justify-center sm:col-span-2 disabled:opacity-60">
      {pending ? "Posting…" : "Post to the Give & Ask Desk"}
    </button>
  );
}

export default function AsksClient({ account, asks }: { account: CurrentUser; asks: AskWithRelations[] }) {
  const [, formAction] = useActionState(async (_prev: null, formData: FormData) => {
    await postAsk(formData);
    return null;
  }, null);
  const [pitched, setPitched] = useState<string[]>([]);
  const isCp = account.role === "CP";

  const mine = asks.filter((a) => a.investorId === account.id);
  const network = asks.filter((a) => a.investorId !== account.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">
          {isCp ? "Investor Asks — Live Demand Feed" : "Give & Ask"}
        </h1>
        <p className="text-sm text-graphite">
          {isCp
            ? "Real requirements from verified investors. If your territory holds a fit, pitch it — the desk routes matched pitches."
            : "State the requirement once. The platform matches it against live mandates and reverts to you — no hunting."}
        </p>
      </div>

      {!isCp && (
        <div className="card overflow-hidden">
          <div className="bg-ink px-6 py-4">
            <p className="font-display font-black text-white">Post a requirement</p>
            <p className="text-xs text-white/60">Reverts typically land within 24 hours. Urgent asks route to the desperate-deals desk.</p>
          </div>
          <form action={formAction} className="grid gap-4 p-6 sm:grid-cols-2">
            <div>
              <label className="label">What are you looking for? *</label>
              <input name="type" required className="input" placeholder="e.g. Tenanted SCO / residential plot" />
            </div>
            <div>
              <label className="label">Budget *</label>
              <select name="budget" required className="input" defaultValue="">
                <option value="" disabled>Select…</option>
                <option>Under ₹50 L</option><option>₹50 L – 1 Cr</option><option>₹1 – 2 Cr</option><option>₹2 – 5 Cr</option><option>₹5 Cr+</option>
              </select>
            </div>
            <div>
              <label className="label">Preferred locations *</label>
              <input name="locations" required className="input" placeholder="e.g. Zirakpur, Mohali airport road" />
            </div>
            <div>
              <label className="label">Urgency *</label>
              <select name="urgency" required className="input" defaultValue="">
                <option value="" disabled>Select…</option>
                <option>Exploring</option>
                <option>Ready in 30 days</option>
                <option>Urgent — desperate deal wanted</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Anything specific?</label>
              <textarea name="note" className="input min-h-16" placeholder="Yield target, title preferences, payment mode…" />
            </div>
            <SubmitButton />
          </form>
        </div>
      )}

      {!isCp && mine.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-black">Your asks &amp; platform reverts</h2>
          {mine.map((a) => <AskCard key={a.id} ask={a} />)}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-display text-lg font-black">
          {isCp ? `Live investor asks (${network.length})` : "What other investors are asking"}
        </h2>
        {(isCp ? network : network.slice(0, 3)).map((a) => (
          <AskCard
            key={a.id}
            ask={a}
            cpView={isCp}
            pitched={pitched.includes(a.id)}
            onPitch={() => setPitched((p) => [...p, a.id])}
          />
        ))}
      </div>
    </div>
  );
}
