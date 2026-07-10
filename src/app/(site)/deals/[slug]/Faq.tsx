"use client";

import { useState } from "react";

export default function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-4 space-y-2.5">
      {faqs.map((f, i) => (
        <div key={f.q} className="card overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="font-display text-[14.5px] font-bold">{f.q}</span>
            <span
              className="text-lg transition-transform duration-300"
              style={{ color: "var(--gold)", transform: open === i ? "rotate(45deg)" : "none" }}
            >
              +
            </span>
          </button>
          {open === i && <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-graphite">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
