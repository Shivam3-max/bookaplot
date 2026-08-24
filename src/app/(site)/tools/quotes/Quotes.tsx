"use client";

import { useState } from "react";
import { QUOTES } from "@/lib/tools-content";

export default function Quotes() {
  const [copied, setCopied] = useState<number | null>(null);

  const copy = async (i: number) => {
    const q = QUOTES[i];
    await navigator.clipboard.writeText(`"${q.text}" — ${q.author}`);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const share = (i: number) => {
    const q = QUOTES[i];
    const text = encodeURIComponent(`"${q.text}" — ${q.author}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Real Estate Quotes</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">
          Timeless wisdom on land and wealth
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-graphite">
          Ready to copy or send straight to a client. Every quote here is from a public-domain
          source, so you can use them freely in your own posts.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {QUOTES.map((q, i) => (
          <figure key={q.text} className="card flex flex-col p-6">
            <svg width="26" height="20" viewBox="0 0 26 20" fill="var(--gold)" opacity="0.5">
              <path d="M0 20V12C0 5 4 1 11 0v4c-3 1-5 3-5 6h5v10H0Zm15 0V12c0-7 4-11 11-12v4c-3 1-5 3-5 6h5v10H15Z" />
            </svg>
            <blockquote className="mt-4 flex-1 font-display text-lg font-bold leading-snug">
              {q.text}
            </blockquote>
            <figcaption className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
              <div>
                <p className="text-sm font-bold">{q.author}</p>
                <p className="text-xs text-graphite">{q.context}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copy(i)} className="btn-ghost !px-3 !py-1.5 !text-xs">
                  {copied === i ? "Copied ✓" : "Copy"}
                </button>
                <button onClick={() => share(i)} className="btn-ghost !px-3 !py-1.5 !text-xs">Share</button>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
