"use client";

import { useState, useTransition } from "react";
import { createLead } from "@/app/actions/leads";

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
  source,
}: {
  fields: Field[];
  cta?: string;
  success?: string;
  compact?: boolean;
  source: string;
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createLead(formData, source);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSent(true);
    });
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
    <form action={submit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      {fields.map((f) => (
        <div key={f.name} className={f.type === "textarea" ? "sm:col-span-full" : ""}>
          <label className="label" htmlFor={f.name}>
            {f.label}
            {f.required && <span style={{ color: "var(--gold)" }}> *</span>}
          </label>
          {f.type === "textarea" ? (
            <textarea id={f.name} name={f.name} className="input min-h-24" placeholder={f.placeholder} required={f.required} />
          ) : f.type === "select" ? (
            <select id={f.name} name={f.name} className="input" required={f.required} defaultValue="">
              <option value="" disabled>
                Select…
              </option>
              {f.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input id={f.name} name={f.name} type={f.type || "text"} className="input" placeholder={f.placeholder} required={f.required} />
          )}
        </div>
      ))}
      {error && <p className="sm:col-span-full text-sm font-semibold text-red">{error}</p>}
      <div className="sm:col-span-full">
        <button type="submit" disabled={isPending} className="btn-gold w-full justify-center disabled:opacity-60">
          {isPending ? "Sending…" : cta}
        </button>
        <p className="mt-2 text-center text-[11px] text-graphite">
          By submitting, you agree to be contacted by the Mondato team. No spam, ever.
        </p>
      </div>
    </form>
  );
}
