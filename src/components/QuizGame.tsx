"use client";

import { useState } from "react";
import Link from "next/link";

export interface QuizItem {
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

/**
 * Shared engine for the IQ Quiz and Spot the Red Flag. Both are the same
 * shape — a prompt, options, one correct index and an explanation — so they
 * run through one component rather than two near-identical ones.
 */
export default function QuizGame({
  items, eyebrow, title, intro, promptLabel, scoreNoun,
}: {
  items: QuizItem[];
  eyebrow: string;
  title: string;
  intro: string;
  promptLabel?: string;
  scoreNoun: string;
}) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = items[i];
  const correct = picked === item?.answer;

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === item.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i + 1 < items.length) { setI(i + 1); setPicked(null); }
    else setDone(true);
  };

  const restart = () => { setI(0); setPicked(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / items.length) * 100);
    const verdict =
      pct >= 90 ? "Outstanding — you know this market cold."
      : pct >= 70 ? "Strong. A few gaps worth closing."
      : pct >= 50 ? "A reasonable base, but the details are where deals go wrong."
      : "Worth going through the explanations carefully before your next transaction.";

    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <p className="eyebrow">{eyebrow}</p>
        <div className="card p-8">
          <p className="text-[11px] font-bold uppercase tracking-wider text-graphite">Your score</p>
          <p className="mt-1 font-display text-6xl font-black" style={{ color: "var(--gold)" }}>
            {score}<span className="text-2xl text-graphite">/{items.length}</span>
          </p>
          <p className="mt-3 text-sm font-semibold">{verdict}</p>
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "var(--gold)" }} />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={restart} className="btn-gold !py-2.5 !text-sm">Try again</button>
          <Link href="/tools" className="btn-ghost !py-2.5 !text-sm">All tools</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-black">{title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-graphite">{intro}</p>
      </div>

      <div className="flex items-center justify-between text-xs font-bold text-graphite">
        <span>{promptLabel ?? "Question"} {i + 1} of {items.length}</span>
        <span>{scoreNoun}: {score}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((i + 1) / items.length) * 100}%`, background: "var(--gold)" }} />
      </div>

      <div className="card p-6 sm:p-8">
        <p className="font-display text-lg font-black leading-snug">{item.prompt}</p>

        <div className="mt-5 space-y-2.5">
          {item.options.map((o, idx) => {
            const isAnswer = idx === item.answer;
            const isPicked = idx === picked;
            let cls = "border-line bg-white hover:border-gold";
            if (picked !== null) {
              if (isAnswer) cls = "border-[var(--green)] bg-green-soft";
              else if (isPicked) cls = "border-[var(--red)] bg-[#faece9]";
              else cls = "border-line bg-white opacity-60";
            }
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                disabled={picked !== null}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-sm font-semibold transition-colors ${cls}`}
              >
                <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-black">
                  {picked !== null && isAnswer ? "✓" : picked !== null && isPicked ? "✕" : String.fromCharCode(65 + idx)}
                </span>
                <span>{o}</span>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="mt-5 rounded-xl p-4" style={{ background: correct ? "var(--green-soft)" : "var(--gold-soft)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: correct ? "var(--green)" : "#8a6b30" }}>
              {correct ? "Correct" : "Not quite"}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: correct ? "var(--green)" : "#6b5426" }}>
              {item.explain}
            </p>
          </div>
        )}
      </div>

      {picked !== null && (
        <button onClick={next} className="btn-gold !py-2.5 !text-sm w-full sm:w-auto">
          {i + 1 === items.length ? "See my score →" : "Next →"}
        </button>
      )}
    </div>
  );
}
