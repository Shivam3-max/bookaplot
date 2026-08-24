"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AGREEMENT_TYPES, buildDraft, type AgreementType } from "@/lib/agreements";

type Stage = "pick" | "interview" | "review" | "draft";

export default function AgreementAssistant() {
  const [stage, setStage] = useState<Stage>("pick");
  const [type, setType] = useState<AgreementType | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const draftRef = useRef<HTMLDivElement>(null);

  const q = type?.questions[step];
  const total = type?.questions.length ?? 0;
  const draft = useMemo(
    () => (type && stage === "draft" ? buildDraft(type, answers) : []),
    [type, answers, stage]
  );

  const start = (t: AgreementType) => {
    setType(t);
    setAnswers({});
    setStep(0);
    setStage("interview");
  };

  const set = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));

  const next = () => {
    if (step + 1 < total) setStep(step + 1);
    else setStage("review");
  };

  const plainText = () => {
    if (!type) return "";
    const lines = [type.documentTitle, ""];
    for (const c of draft) {
      lines.push(c.heading.toUpperCase(), "");
      for (const p of c.body) lines.push(p, "");
    }
    return lines.join("\n");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(plainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([plainText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type?.slug ?? "agreement"}-draft.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------- pick a type ---------------- */
  if (stage === "pick" || !type) {
    return (
      <div className="space-y-8">
        <div>
          <p className="eyebrow">Agreement Drafting Assistant</p>
          <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">
            Draft an agreement in a few minutes
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-graphite">
            Answer a short set of questions and get a ready-to-print draft, with a plain-English
            note on why each question matters. The clause wording is fixed template text — the
            interview only fills in your particulars. Nothing you type leaves your browser.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {AGREEMENT_TYPES.map((t) => (
            <button
              key={t.slug}
              onClick={() => start(t)}
              className="card card-hover p-6 text-left transition-colors hover:border-gold"
            >
              <span className="font-display text-2xl" style={{ color: "var(--gold)" }}>{t.icon}</span>
              <h2 className="mt-3 font-display text-lg font-black">{t.name}</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-graphite">{t.blurb}</p>
              <p className="mt-4 text-xs font-bold" style={{ color: "var(--gold)" }}>
                {t.questions.length} questions →
              </p>
            </button>
          ))}
        </div>

        <div className="card border-l-4 p-5" style={{ borderLeftColor: "var(--red)" }}>
          <p className="text-sm font-bold">Not covered here: the Sale Deed</p>
          <p className="mt-1 text-[13px] leading-relaxed text-graphite">
            The final registered transfer document always needs advocate-supervised drafting and
            registration at the Sub-Registrar office. It is deliberately excluded from this tool.
          </p>
        </div>

        <Disclaimer />
      </div>
    );
  }

  /* ---------------- interview ---------------- */
  if (stage === "interview" && q) {
    const pct = Math.round(((step + 1) / total) * 100);
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">{type.short}</p>
            <p className="mt-1 text-xs font-bold text-graphite">
              Question {step + 1} of {total}
            </p>
          </div>
          <button onClick={() => setStage("pick")} className="text-xs font-bold text-graphite hover:text-ink">
            Cancel
          </button>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "var(--gold)" }} />
        </div>

        <div className="card p-6 sm:p-8">
          <label className="font-display text-xl font-black leading-snug">
            {q.label}
            {q.optional && <span className="ml-2 align-middle text-[11px] font-bold text-graphite">optional</span>}
          </label>

          <div className="mt-5">
            <Field
              q={q}
              value={answers[q.id] ?? ""}
              onChange={(v) => set(q.id, v)}
              onEnter={next}
            />
          </div>

          <div className="mt-5 rounded-xl bg-gold-soft p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8a6b30" }}>
              Why this matters
            </p>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "#6b5426" }}>{q.why}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => (step === 0 ? setStage("pick") : setStep(step - 1))}
            className="btn-ghost !py-2.5 !text-sm"
          >
            ← Back
          </button>
          {q.optional && (
            <button onClick={next} className="text-sm font-bold text-graphite hover:text-ink">
              Skip
            </button>
          )}
          <button onClick={next} className="btn-gold !py-2.5 !text-sm max-sm:w-full sm:ml-auto">
            {step + 1 === total ? "Review answers →" : "Next →"}
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- review ---------------- */
  if (stage === "review") {
    const missing = type.questions.filter((x) => !x.optional && !(answers[x.id] ?? "").trim());
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="eyebrow">{type.short}</p>
          <h1 className="mt-2 font-display text-2xl font-black">Review your answers</h1>
          <p className="mt-1.5 text-sm text-graphite">
            Edit anything before the draft is generated. {missing.length > 0
              ? `${missing.length} required answer${missing.length > 1 ? "s are" : " is"} still blank — those will print as a blank line.`
              : "All required answers are filled in."}
          </p>
        </div>

        <div className="card divide-y divide-line">
          {type.questions.map((x, i) => {
            const val = (answers[x.id] ?? "").trim();
            return (
              <div key={x.id} className="flex items-start gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-graphite">{x.label}</p>
                  <p className={`mt-0.5 text-sm ${val ? "font-semibold" : "italic text-graphite"}`}>
                    {val || (x.optional ? "skipped" : "not answered")}
                  </p>
                </div>
                <button
                  onClick={() => { setStep(i); setStage("interview"); }}
                  className="shrink-0 text-xs font-bold" style={{ color: "var(--gold)" }}
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => { setStep(total - 1); setStage("interview"); }} className="btn-ghost !py-2.5 !text-sm">
            ← Back
          </button>
          <button onClick={() => setStage("draft")} className="btn-gold !py-2.5 !text-sm max-sm:w-full sm:ml-auto">
            Generate draft →
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- generated draft ---------------- */
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <p className="eyebrow">{type.short}</p>
          <h1 className="mt-2 font-display text-2xl font-black">Your draft is ready</h1>
          <p className="mt-1.5 max-w-xl text-sm text-graphite">{type.stampNote}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setStage("review")} className="btn-ghost !py-2.5 !text-sm">← Edit answers</button>
          <button onClick={copy} className="btn-ghost !py-2.5 !text-sm">{copied ? "Copied ✓" : "Copy text"}</button>
          <button onClick={download} className="btn-ghost !py-2.5 !text-sm">Download .txt</button>
          <button onClick={() => window.print()} className="btn-gold !py-2.5 !text-sm">Print / Save PDF</button>
        </div>
      </div>

      <div ref={draftRef} className="card print-sheet p-6 sm:p-10">
        <h2 className="text-center font-display text-xl font-black tracking-wide sm:text-2xl">
          {type.documentTitle}
        </h2>
        <div className="mx-auto mt-2 h-px w-24" style={{ background: "var(--gold)" }} />

        <div className="mt-8 space-y-6">
          {draft.map((c) => (
            <section key={c.heading}>
              <h3 className="font-display text-[15px] font-black">{c.heading}</h3>
              <div className="mt-2 space-y-2.5">
                {c.body.map((p, i) => (
                  <p key={i} className="text-[13.5px] leading-relaxed text-slate" style={{ textAlign: "justify" }}>
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="print:hidden">
        <Disclaimer />
      </div>
    </div>
  );
}

function Field({
  q, value, onChange, onEnter,
}: {
  q: AgreementType["questions"][number];
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
}) {
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && q.kind !== "textarea") { e.preventDefault(); onEnter(); }
  };

  if (q.kind === "select") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input" autoFocus>
        <option value="">Select…</option>
        {q.options?.map((o) => <option key={o}>{o}</option>)}
      </select>
    );
  }

  if (q.kind === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder}
        rows={3}
        className="input resize-y"
        autoFocus
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      {q.prefix && <span className="font-display text-lg font-black text-graphite">{q.prefix}</span>}
      <input
        type={q.kind === "number" ? "number" : q.kind === "date" ? "date" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={key}
        placeholder={q.placeholder}
        className="input"
        autoFocus
      />
      {q.suffix && <span className="whitespace-nowrap text-sm font-bold text-graphite">{q.suffix}</span>}
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <p className="text-[12.5px] leading-relaxed text-graphite">
        <b className="text-ink">This is a draft for reference and discussion only — not legal advice.</b>{" "}
        Have a qualified advocate review any document before signing, and confirm your state&apos;s exact
        stamp duty and registration requirements. Nothing you enter here is sent to a server or stored.{" "}
        <Link href="/contact" className="font-bold underline" style={{ color: "var(--gold)" }}>
          Talk to the Mondato desk
        </Link>{" "}
        if you want help with a specific transaction.
      </p>
    </div>
  );
}
