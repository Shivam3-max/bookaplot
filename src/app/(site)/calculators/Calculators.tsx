"use client";

import { useEffect, useState, ReactNode } from "react";
import { inr, inrFull } from "@/lib/format";
import Reveal from "@/components/Reveal";

/* ---------- shared UI ---------- */

function Slider({
  label, value, onChange, min, max, step = 1, format = (v: number) => v.toLocaleString("en-IN"), suffix = "",
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; format?: (v: number) => string; suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="label !mb-0">{label}</label>
        <span className="rounded-lg bg-paper px-2.5 py-1 font-display text-sm font-black">
          {format(value)}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--gold)]"
      />
    </div>
  );
}

function Out({ label, value, hero = false }: { label: string; value: string; hero?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${hero ? "bg-ink text-white" : "bg-paper"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${hero ? "text-white/60" : "text-graphite"}`}>{label}</p>
      <p className={`mt-0.5 font-display font-black ${hero ? "text-2xl" : "text-lg"}`} style={hero ? { color: "var(--gold)" } : undefined}>
        {value}
      </p>
    </div>
  );
}

function CalcCard({ id, title, purpose, children }: { id: string; title: string; purpose: string; children: ReactNode }) {
  return (
    <div id={id} className="card scroll-mt-36 p-6 sm:p-8">
      <h2 className="font-display text-2xl font-black">{title}</h2>
      <p className="mt-1 text-sm text-graphite">{purpose}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/* ---------- calculators ---------- */

function Emi() {
  const [price, setPrice] = useState(8000000);
  const [down, setDown] = useState(2000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(15);
  const loan = Math.max(price - down, 0);
  const r = rate / 1200;
  const n = years * 12;
  const emi = loan > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const total = emi * n;
  const ltv = price ? (loan / price) * 100 : 0;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Slider label="Property price" value={price} onChange={setPrice} min={1000000} max={100000000} step={100000} format={inr} />
        <Slider label="Down payment" value={down} onChange={setDown} min={0} max={price} step={100000} format={inr} />
        <Slider label="Interest rate" value={rate} onChange={setRate} min={6} max={14} step={0.1} format={(v) => v.toFixed(1)} suffix="%" />
        <Slider label="Tenure" value={years} onChange={setYears} min={1} max={30} format={(v) => `${v}`} suffix=" yrs" />
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><Out hero label="Monthly EMI" value={inrFull(emi)} /></div>
        <Out label="Loan amount" value={inr(loan)} />
        <Out label="Loan-to-value" value={`${ltv.toFixed(0)}%`} />
        <Out label="Total interest" value={inr(Math.max(total - loan, 0))} />
        <Out label="Total repayment" value={inr(total)} />
        <p className="text-xs leading-relaxed text-graphite sm:col-span-2">
          {ltv > 80 ? "LTV above 80% — most lenders will ask for a larger down payment on plots." : ltv > 0 ? "Comfortable LTV band for plot financing with most partner banks." : "Fully self-funded purchase — no financing cost."}
        </p>
      </div>
    </div>
  );
}

function Stamp() {
  const [value, setValue] = useState(6000000);
  const [buyer, setBuyer] = useState<"male" | "female" | "joint">("male");
  const [extra, setExtra] = useState(50000);
  const dutyRate = buyer === "female" ? 0.05 : buyer === "joint" ? 0.06 : 0.07;
  const duty = value * dutyRate;
  const reg = Math.min(value * 0.01, 200000);
  const total = duty + reg + extra;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Slider label="Property value" value={value} onChange={setValue} min={500000} max={100000000} step={100000} format={inr} />
        <div>
          <label className="label">Buyer type (Punjab indicative)</label>
          <div className="flex gap-2">
            {(["male", "female", "joint"] as const).map((b) => (
              <button key={b} onClick={() => setBuyer(b)} className={`chip !px-4 !py-2 capitalize ${buyer === b ? "badge-gold" : ""}`}>{b}</button>
            ))}
          </div>
        </div>
        <Slider label="Legal / misc charges" value={extra} onChange={setExtra} min={0} max={500000} step={5000} format={inr} />
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><Out hero label="Total acquisition outflow" value={inr(value + total)} /></div>
        <Out label={`Stamp duty (${(dutyRate * 100).toFixed(0)}%)`} value={inr(duty)} />
        <Out label="Registration (est.)" value={inr(reg)} />
        <Out label="Other charges" value={inr(extra)} />
        <Out label="Total transaction cost" value={inr(total)} />
        <p className="text-xs leading-relaxed text-graphite sm:col-span-2">
          Indicative Punjab slabs; Chandigarh (UT) and Haryana differ. Final rates depend on prevailing state notifications.
        </p>
      </div>
    </div>
  );
}

function Roi() {
  const [price, setPrice] = useState(5000000);
  const [growth, setGrowth] = useState(9);
  const [years, setYears] = useState(7);
  const [devCost, setDevCost] = useState(300000);
  const future = price * Math.pow(1 + growth / 100, years);
  const deployed = price + devCost;
  const gain = future - deployed;
  const cagr = (Math.pow(future / deployed, 1 / years) - 1) * 100;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Slider label="Purchase price" value={price} onChange={setPrice} min={1000000} max={100000000} step={100000} format={inr} />
        <Slider label="Expected annual appreciation" value={growth} onChange={setGrowth} min={2} max={20} step={0.5} format={(v) => v.toFixed(1)} suffix="%" />
        <Slider label="Holding period" value={years} onChange={setYears} min={1} max={25} format={(v) => `${v}`} suffix=" yrs" />
        <Slider label="Additional investment / dev cost" value={devCost} onChange={setDevCost} min={0} max={10000000} step={50000} format={inr} />
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><Out hero label={`Estimated value after ${years} yrs`} value={inr(future)} /></div>
        <Out label="Total capital deployed" value={inr(deployed)} />
        <Out label="Estimated gain" value={inr(gain)} />
        <Out label="Effective CAGR" value={`${cagr.toFixed(1)}%`} />
        <Out label="Multiple" value={`${(future / deployed).toFixed(2)}×`} />
        <p className="text-xs leading-relaxed text-graphite sm:col-span-2">
          Appreciation assumptions are scenarios, not predictions. Tricity growth pockets have varied widely by micro-market.
        </p>
      </div>
    </div>
  );
}

function Yield() {
  const [price, setPrice] = useState(9000000);
  const [rent, setRent] = useState(45000);
  const [maint, setMaint] = useState(60000);
  const annual = rent * 12;
  const gross = (annual / price) * 100;
  const net = ((annual - maint) / price) * 100;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Slider label="Purchase price" value={price} onChange={setPrice} min={1000000} max={100000000} step={100000} format={inr} />
        <Slider label="Monthly rental income" value={rent} onChange={setRent} min={5000} max={500000} step={1000} format={inrFull} />
        <Slider label="Annual maintenance / holding cost" value={maint} onChange={setMaint} min={0} max={1000000} step={5000} format={inr} />
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><Out hero label="Net rental yield" value={`${net.toFixed(2)}%`} /></div>
        <Out label="Gross yield" value={`${gross.toFixed(2)}%`} />
        <Out label="Annual rent" value={inr(annual)} />
        <Out label="Annual net cash" value={inr(annual - maint)} />
        <Out label="Monthly net" value={inrFull((annual - maint) / 12)} />
        <p className="text-xs leading-relaxed text-graphite sm:col-span-2">
          {net >= 6 ? "Strong yield for Tricity commercial — verify tenancy quality and lease terms." : net >= 3 ? "Typical range for quality Tricity commercial assets." : "Below-typical yield — the case would need to rest on appreciation."}
        </p>
      </div>
    </div>
  );
}

function BuyRent() {
  const [price, setPrice] = useState(9000000);
  const [down, setDown] = useState(2500000);
  const [rate, setRate] = useState(9);
  const [rent, setRent] = useState(30000);
  const [esc, setEsc] = useState(5);
  const [growth, setGrowth] = useState(7);
  const [years, setYears] = useState(10);

  const loan = Math.max(price - down, 0);
  const r = rate / 1200;
  const n = years * 12;
  const emi = loan > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const ownCost = down + emi * n;
  let rentCost = 0;
  for (let y = 0; y < years; y++) rentCost += rent * 12 * Math.pow(1 + esc / 100, y);
  const futureValue = price * Math.pow(1 + growth / 100, years);
  const ownNet = ownCost - futureValue;
  const verdict = ownNet < rentCost ? "Buying" : "Renting";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Slider label="Property price" value={price} onChange={setPrice} min={2000000} max={50000000} step={100000} format={inr} />
        <Slider label="Down payment" value={down} onChange={setDown} min={0} max={price} step={100000} format={inr} />
        <Slider label="Loan rate" value={rate} onChange={setRate} min={6} max={14} step={0.1} format={(v) => v.toFixed(1)} suffix="%" />
        <Slider label="Current monthly rent" value={rent} onChange={setRent} min={5000} max={200000} step={1000} format={inrFull} />
        <Slider label="Rent escalation" value={esc} onChange={setEsc} min={0} max={12} step={0.5} format={(v) => v.toFixed(1)} suffix="%/yr" />
        <Slider label="Expected appreciation" value={growth} onChange={setGrowth} min={0} max={15} step={0.5} format={(v) => v.toFixed(1)} suffix="%/yr" />
        <Slider label="Horizon" value={years} onChange={setYears} min={3} max={25} format={(v) => `${v}`} suffix=" yrs" />
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Out hero label={`Over ${years} years, the numbers favour`} value={verdict} />
        </div>
        <Out label="Total ownership outflow" value={inr(ownCost)} />
        <Out label="Total renting cost" value={inr(rentCost)} />
        <Out label={`Asset value in ${years} yrs`} value={inr(futureValue)} />
        <Out label="Ownership net cost after asset" value={ownNet < 0 ? `+${inr(-ownNet)} surplus` : inr(ownNet)} />
        <p className="text-xs leading-relaxed text-graphite sm:col-span-2">
          A neutral comparison — excludes tax benefits, society charges, and the flexibility value of renting. Use it as a directional read.
        </p>
      </div>
    </div>
  );
}

function PlotTotal() {
  const [plot, setPlot] = useState(5000000);
  const [size, setSize] = useState(150);
  const [registry, setRegistry] = useState(400000);
  const [broker, setBroker] = useState(50000);
  const [devCost, setDevCost] = useState(200000);
  const [construction, setConstruction] = useState(0);
  const [years, setYears] = useState(7);
  const [growth, setGrowth] = useState(9);

  const acquisition = plot + registry + broker;
  const totalInvest = acquisition + devCost + construction;
  const future = totalInvest * Math.pow(1 + growth / 100, years);
  const perSqYd = totalInvest / size;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Slider label="Plot cost" value={plot} onChange={setPlot} min={1000000} max={100000000} step={100000} format={inr} />
        <Slider label="Plot size" value={size} onChange={setSize} min={50} max={1000} step={10} format={(v) => `${v}`} suffix=" sq yd" />
        <Slider label="Registry + legal charges" value={registry} onChange={setRegistry} min={0} max={5000000} step={25000} format={inr} />
        <Slider label="Broker / facilitation" value={broker} onChange={setBroker} min={0} max={2000000} step={10000} format={inr} />
        <Slider label="Boundary / leveling / filling" value={devCost} onChange={setDevCost} min={0} max={3000000} step={25000} format={inr} />
        <Slider label="Construction budget (optional)" value={construction} onChange={setConstruction} min={0} max={30000000} step={100000} format={inr} />
        <Slider label="Holding period" value={years} onChange={setYears} min={1} max={25} format={(v) => `${v}`} suffix=" yrs" />
        <Slider label="Expected appreciation" value={growth} onChange={setGrowth} min={2} max={20} step={0.5} format={(v) => v.toFixed(1)} suffix="%/yr" />
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><Out hero label="Total investment (all-in)" value={inr(totalInvest)} /></div>
        <Out label="Initial acquisition cost" value={inr(acquisition)} />
        <Out label="All-in cost per sq yd" value={inrFull(perSqYd)} />
        <Out label={`Projected value (${years} yrs)`} value={inr(future)} />
        <Out label="Estimated gain" value={inr(future - totalInvest)} />
        <p className="text-xs leading-relaxed text-graphite sm:col-span-2">
          The all-in per-sq-yd figure is the honest number to compare against benchmark pricing — most buyers only compare the sticker price.
        </p>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

const TABS = [
  { id: "emi", label: "EMI / Loan", title: "Home Loan / EMI Calculator", purpose: "Estimate EMI, total interest, and total repayment.", el: <Emi /> },
  { id: "stamp", label: "Stamp Duty", title: "Stamp Duty + Registration Calculator", purpose: "Estimate total transaction cost over and above property value.", el: <Stamp /> },
  { id: "roi", label: "ROI / Appreciation", title: "ROI / Appreciation Calculator", purpose: "Estimate value growth over your holding period.", el: <Roi /> },
  { id: "yield", label: "Rental Yield", title: "Rental Yield Calculator", purpose: "Gross and net yield for commercial or built assets.", el: <Yield /> },
  { id: "buyrent", label: "Buy vs Rent", title: "Buy vs Rent Calculator", purpose: "A neutral comparison for residential decision-making.", el: <BuyRent /> },
  { id: "plot", label: "Total Plot Investment", title: "Total Plot Investment Calculator", purpose: "All-in acquisition, development, and projected exit — the BookAPlot special.", el: <PlotTotal /> },
];

export default function Calculators() {
  const [tab, setTab] = useState("emi");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (TABS.some((t) => t.id === hash)) setTab(hash);
  }, []);

  const active = TABS.find((t) => t.id === tab)!;

  return (
    <>
      <section className="grid-bg border-b border-line py-12">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Decision tools</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Real Estate Calculators for Smarter Buying Decisions
            </h1>
            <p className="mt-4 max-w-2xl text-graphite">
              Estimate affordability, total acquisition cost, appreciation scenarios, rental
              performance, and decision trade-offs — before you commit.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="sticky top-16 z-40 border-b border-line bg-white/85 py-3 backdrop-blur-xl">
        <div className="container-x flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); history.replaceState(null, "", `#${t.id}`); }}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
                tab === t.id ? "bg-ink text-white" : "bg-paper text-graphite hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <section className="container-x py-10">
        <Reveal key={active.id}>
          <CalcCard id={active.id} title={active.title} purpose={active.purpose}>
            {active.el}
          </CalcCard>
        </Reveal>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-graphite">
          Calculator outputs are indicative estimates only and should not be treated as financial,
          legal, tax, or investment advice. Verify assumptions independently before any decision.
        </p>
      </section>
    </>
  );
}
