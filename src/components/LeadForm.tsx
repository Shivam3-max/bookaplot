"use client";

import { useState, FormEvent } from "react";

interface Field {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export default function LeadForm({
  fields,
  cta = "Submit",
  success = "Thank you — the team will reach out shortly.",
  compact = false,
}: {
  fields: Field[];
  cta?: string;
  success?: string;
  compact?: boolean;
}) {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent)
    return (
      <div className="rounded-2xl border border-[#c5dcd2] bg-green-soft p-6 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <p className="mt-3 font-display font-bold text-green">Request received</p>
        <p className="mt-1 text-sm text-slate">{success}</p>
      </div>
    );

  return (
    <form onSubmit={submit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      {fields.map((f) => (
        <div key={f.name} className={f.type === "textarea" ? "sm:col-span-full" : ""}>
          <label className="label" htmlFor={f.name}>
            {f.label}
            {f.required && <span style={{ color: "var(--gold)" }}> *</span>}
          </label>
          {f.type === "textarea" ? (
            <textarea id={f.name} className="input min-h-24" placeholder={f.placeholder} required={f.required} />
          ) : f.type === "select" ? (
            <select id={f.name} className="input" required={f.required} defaultValue="">
              <option value="" disabled>
                Select…
              </option>
              {f.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input id={f.name} type={f.type || "text"} className="input" placeholder={f.placeholder} required={f.required} />
          )}
        </div>
      ))}
      <div className="sm:col-span-full">
        <button type="submit" className="btn-gold w-full justify-center">
          {cta}
        </button>
        <p className="mt-2 text-center text-[11px] text-graphite">
          By submitting, you agree to be contacted by the BookAPlot team. No spam, ever.
        </p>
      </div>
    </form>
  );
}
