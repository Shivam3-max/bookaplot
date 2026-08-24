"use client";

import { useState } from "react";

/**
 * Carpet Area Checker.
 *
 * Indian convention used here: loading is expressed against carpet area, so
 * Super built-up = Carpet x (1 + loading/100). Built-up is taken as carpet
 * plus wall thickness, conventionally about 10%.
 */

const WALL_FACTOR = 1.1;

function verdict(loading: number) {
  if (loading <= 20) return { label: "Very efficient", tone: "var(--green)", note: "Unusually low. Worth confirming what is actually counted in the super built-up area." };
  if (loading <= 27) return { label: "Efficient", tone: "var(--green)", note: "Comfortably within the normal range for most Indian projects." };
  if (loading <= 33) return { label: "Typical", tone: "var(--gold)", note: "The common band for projects with standard amenities and lobbies." };
  if (loading <= 40) return { label: "High", tone: "var(--gold)", note: "You are paying for a lot of common area. Ask what amenities justify it." };
  return { label: "Very high", tone: "var(--red)", note: "Well above normal. Compare the per-sq-ft rate on carpet before proceeding." };
}

export default function CarpetArea() {
  const [mode, setMode] = useState<"fromSuper" | "fromCarpet">("fromSuper");
  const [superArea, setSuperArea] = useState(1650);
  const [carpetInput, setCarpetInput] = useState(1200);
  const [loading, setLoading] = useState(30);
  const [rate, setRate] = useState(6500);

  const carpet = mode === "fromSuper" ? superArea / (1 + loading / 100) : carpetInput;
  const sba = mode === "fromSuper" ? superArea : carpetInput * (1 + loading / 100);
  const builtUp = carpet * WALL_FACTOR;
  const common = sba - carpet;
  const v = verdict(loading);

  const quotedTotal = sba * rate;
  const effectiveOnCarpet = carpet > 0 ? quotedTotal / carpet : 0;

  const n = (x: number) => Math.round(x).toLocaleString("en-IN");

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Carpet Area Checker</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">
          What carpet area are you actually getting?
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-graphite">
          Builders quote super built-up area, but you only live on the carpet. Enter what you have
          been quoted and see the real usable area — and what your rate works out to per square
          foot of carpet.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="card space-y-5 p-6">
          <div>
            <label className="label">What do you know?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("fromSuper")}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-bold transition-colors ${mode === "fromSuper" ? "bg-ink text-white" : "border border-line bg-white text-graphite"}`}
              >
                Super built-up
              </button>
              <button
                onClick={() => setMode("fromCarpet")}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-bold transition-colors ${mode === "fromCarpet" ? "bg-ink text-white" : "border border-line bg-white text-graphite"}`}
              >
                Carpet area
              </button>
            </div>
          </div>

          {mode === "fromSuper" ? (
            <Num label="Super built-up area quoted" value={superArea} onChange={setSuperArea} suffix="sq ft" />
          ) : (
            <Num label="Carpet area" value={carpetInput} onChange={setCarpetInput} suffix="sq ft" />
          )}

          <div>
            <div className="flex items-center justify-between">
              <label className="label !mb-0">Loading</label>
              <span className="rounded-lg bg-paper px-2.5 py-1 font-display text-sm font-black">{loading}%</span>
            </div>
            <input
              type="range" min={5} max={60} step={1} value={loading}
              onChange={(e) => setLoading(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--gold)]"
            />
            <p className="mt-1 text-[11px] text-graphite">
              Ask the builder directly. If they will not state it, work it back from the carpet area on the RERA portal.
            </p>
          </div>

          <Num label="Rate quoted (per sq ft on super built-up)" value={rate} onChange={setRate} prefix="₹" />
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Out label="Carpet area" value={`${n(carpet)} sq ft`} hero />
            <Out label="Built-up (approx)" value={`${n(builtUp)} sq ft`} />
            <Out label="Super built-up" value={`${n(sba)} sq ft`} />
          </div>

          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Loading verdict</p>
                <p className="mt-0.5 font-display text-xl font-black" style={{ color: v.tone }}>{v.label}</p>
              </div>
              <span className="chip" style={{ borderColor: v.tone, color: v.tone }}>{loading}% loading</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-graphite">{v.note}</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (carpet / sba) * 100)}%`, background: "var(--green)" }} />
            </div>
            <p className="mt-1.5 text-[11px] text-graphite">
              {Math.round((carpet / sba) * 100)}% of what you pay for is usable carpet · {n(common)} sq ft is common area
            </p>
          </div>

          <div className="card p-5">
            <p className="font-display text-sm font-black">What the rate really is</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Out label="Quoted rate (on super built-up)" value={`₹${n(rate)} / sq ft`} />
              <Out label="Effective rate on carpet" value={`₹${n(effectiveOnCarpet)} / sq ft`} hero />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-graphite">
              Same total price of <b className="text-ink">₹{n(quotedTotal)}</b> — but measured against the area you
              can actually use, the rate is{" "}
              <b className="text-ink">₹{n(effectiveOnCarpet - rate)} / sq ft higher</b> than quoted. Compare two
              projects on this number, not the headline rate.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-paper p-4">
            <p className="text-[12.5px] leading-relaxed text-graphite">
              <b className="text-ink">Under RERA, carpet area must be disclosed.</b> Section 2(k) of the Real Estate
              (Regulation and Development) Act, 2016 defines carpet area as the net usable floor area within the
              walls, excluding the exclusive balcony and open terrace areas but including internal partition walls.
              For a registered project, the declared carpet area is on your state RERA portal — check it against
              what you have been told verbally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Num({ label, value, onChange, prefix, suffix }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-2">
        {prefix && <span className="font-display text-lg font-black text-graphite">{prefix}</span>}
        <input type="number" value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} className="input !py-2.5" />
        {suffix && <span className="whitespace-nowrap text-xs font-bold text-graphite">{suffix}</span>}
      </div>
    </div>
  );
}

function Out({ label, value, hero = false }: { label: string; value: string; hero?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${hero ? "bg-ink text-white" : "card"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${hero ? "text-white/60" : "text-graphite"}`}>{label}</p>
      <p className={`mt-0.5 font-display font-black ${hero ? "text-2xl" : "text-lg"}`} style={hero ? { color: "var(--gold)" } : undefined}>
        {value}
      </p>
    </div>
  );
}
