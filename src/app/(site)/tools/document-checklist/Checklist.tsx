"use client";

import { useMemo, useState } from "react";
import { CHECKLISTS } from "@/lib/tools-content";

type Mode = keyof typeof CHECKLISTS;

export default function Checklist() {
  const [mode, setMode] = useState<Mode>("buy");
  const [ticked, setTicked] = useState<Record<string, boolean>>({});

  const active = CHECKLISTS[mode];
  const all = useMemo(() => active.groups.flatMap((g) => g.items.map((it) => `${mode}:${it.doc}`)), [active, mode]);
  const doneCount = all.filter((k) => ticked[k]).length;
  const pct = all.length ? Math.round((doneCount / all.length) * 100) : 0;

  const criticalLeft = active.groups
    .flatMap((g) => g.items)
    .filter((it) => it.critical && !ticked[`${mode}:${it.doc}`]).length;

  const toggle = (k: string) => setTicked((t) => ({ ...t, [k]: !t[k] }));

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Document Checklist</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">
          The paperwork to verify before you sign
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-graphite">
          Every document a careful buyer, seller or landlord should see — and why each one matters.
          Tick as you collect them. Items marked critical are the ones that most often stop a deal
          at the last stage.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        {(Object.keys(CHECKLISTS) as Mode[]).map((k) => (
          <button
            key={k}
            onClick={() => setMode(k)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              mode === k ? "bg-ink text-white" : "border border-line bg-white text-graphite hover:text-ink"
            }`}
          >
            {CHECKLISTS[k].label}
          </button>
        ))}
      </div>

      <div className="card p-5 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-black">{doneCount} of {all.length} collected</p>
            <p className="text-xs text-graphite">
              {criticalLeft > 0
                ? `${criticalLeft} critical document${criticalLeft > 1 ? "s" : ""} still outstanding`
                : "All critical documents ticked"}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTicked({})} className="btn-ghost !py-2 !text-xs">Reset</button>
            <button onClick={() => window.print()} className="btn-ghost !py-2 !text-xs">Print</button>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: criticalLeft > 0 ? "var(--gold)" : "var(--green)" }}
          />
        </div>
      </div>

      <p className="text-sm text-graphite">{active.blurb}</p>

      <div className="space-y-6">
        {active.groups.map((g) => (
          <div key={g.group} className="card overflow-hidden">
            <div className="border-b border-line bg-paper px-5 py-3">
              <h2 className="font-display text-sm font-black uppercase tracking-wider">{g.group}</h2>
            </div>
            <ul className="divide-y divide-line">
              {g.items.map((it) => {
                const k = `${mode}:${it.doc}`;
                const on = !!ticked[k];
                return (
                  <li key={it.doc}>
                    <label className="flex cursor-pointer items-start gap-3.5 p-4 transition-colors hover:bg-paper/60">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(k)}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--green)]"
                      />
                      <span className="min-w-0">
                        <span className={`flex flex-wrap items-center gap-2 text-sm font-bold ${on ? "text-graphite line-through" : ""}`}>
                          {it.doc}
                          {it.critical && (
                            <span className="chip !border-[#f0c9c0] !bg-[#faece9] !px-2 !py-0.5 !text-[9px]" style={{ color: "var(--red)" }}>
                              CRITICAL
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-graphite">{it.why}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-paper p-4">
        <p className="text-[12.5px] leading-relaxed text-graphite">
          <b className="text-ink">This is a general checklist, not legal advice.</b> Requirements vary by state,
          by property type and by whether the project is RERA-registered. Have an advocate run title due
          diligence on any transaction of consequence.
        </p>
      </div>
    </div>
  );
}
