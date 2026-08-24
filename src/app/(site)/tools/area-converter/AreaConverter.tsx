"use client";

import { useState } from "react";

/**
 * Area Unit Converter. Factors are expressed in square feet.
 *
 * Marla and Kanal follow the Punjab/Haryana/Chandigarh standard (1 marla =
 * 272.25 sq ft, 1 kanal = 20 marla), which is what Tricity transacts in.
 * Bigha is deliberately flagged as regional — it has no single national value.
 */
const UNITS: { id: string; name: string; sqft: number; note?: string }[] = [
  { id: "sqft", name: "Square feet", sqft: 1 },
  { id: "sqyd", name: "Square yard (Gaj)", sqft: 9, note: "The standard unit for Tricity plots" },
  { id: "sqm", name: "Square metre", sqft: 10.763910417 },
  { id: "marla", name: "Marla", sqft: 272.25, note: "Punjab / Haryana / Chandigarh standard" },
  { id: "kanal", name: "Kanal", sqft: 5445, note: "20 marla" },
  { id: "cent", name: "Cent", sqft: 435.6, note: "South India" },
  { id: "guntha", name: "Guntha", sqft: 1089, note: "Maharashtra / Karnataka" },
  { id: "ground", name: "Ground", sqft: 2400, note: "Tamil Nadu" },
  { id: "acre", name: "Acre", sqft: 43560 },
  { id: "hectare", name: "Hectare", sqft: 107639.10417 },
  { id: "bigha", name: "Bigha (pucca, ~27,225 sq ft)", sqft: 27225, note: "Varies widely by state — confirm locally" },
];

export default function AreaConverter() {
  const [value, setValue] = useState(300);
  const [from, setFrom] = useState("sqyd");

  const unit = UNITS.find((u) => u.id === from)!;
  const inSqft = value * unit.sqft;

  const fmt = (n: number) => {
    if (!Number.isFinite(n)) return "—";
    if (n >= 1000) return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
    if (n >= 1) return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
    return n.toLocaleString("en-IN", { maximumFractionDigits: 4 });
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Area Unit Converter</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Convert any land unit</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-graphite">
          Square feet, gaj, marla, kanal, acre, hectare and the regional units you will actually
          meet on a Tricity site visit — converted at once, so you can sanity-check a quote on the spot.
        </p>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <label className="label">Amount</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="input font-display !text-xl !font-black"
            />
          </div>
          <div>
            <label className="label">Unit</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="input">
              {UNITS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
        {unit.note && <p className="mt-2 text-[11px] font-semibold text-graphite">{unit.note}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {UNITS.filter((u) => u.id !== from).map((u) => (
          <div key={u.id} className="card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">{u.name}</p>
            <p className="mt-0.5 font-display text-xl font-black">{fmt(inSqft / u.sqft)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-paper p-4">
        <p className="text-[12.5px] leading-relaxed text-graphite">
          <b className="text-ink">Bigha has no single value in India.</b> It ranges from roughly 1,600 to 27,000+
          sq ft depending on the state and even the district, so the figure above is one common
          &ldquo;pucca bigha&rdquo; convention only. For any transaction, confirm the local conversion in writing
          before agreeing a price.
        </p>
      </div>
    </div>
  );
}
