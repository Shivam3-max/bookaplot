import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Sell / List Your Property — Submit to BookAPlot",
  description:
    "Own or represent a property in Tricity? Submit it to BookAPlot for curated review and premium presentation to serious buyers.",
};

const WHAT = ["Plots", "Residential units", "Commercial property", "SCO / booths", "Township inventory", "Pre-launch opportunities", "Land parcels"];

const WHY = [
  { t: "Premium presentation", d: "Your property presented with benchmark context and opportunity logic — not buried in a feed." },
  { t: "Targeted audience", d: "A Tricity-focused buyer base actively evaluating deals, not casual browsers." },
  { t: "Curated positioning", d: "Selection means attention. Being on BookAPlot signals your inventory cleared a bar." },
  { t: "Qualified inquiries", d: "Leads arrive pre-framed on price, size and intent — fewer calls, better ones." },
];

export default function ListPropertyPage() {
  return (
    <>
      <section className="grid-bg border-b border-line py-16">
        <div className="container-x text-center">
          <Reveal>
            <p className="eyebrow">Sell / list your property</p>
            <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Have a Property or Plot to List?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-graphite">
              If you own or represent a property in Tricity and believe it deserves stronger
              visibility, submit it to BookAPlot for review.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {WHAT.map((w) => <span key={w} className="chip">{w}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Reveal>
            <h2 className="font-display text-2xl font-black">Why List With BookAPlot</h2>
          </Reveal>
          <div className="mt-5 space-y-4">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={i * 80}>
                <div className="card flex items-start gap-4 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-soft font-display font-black" style={{ color: "var(--gold)" }}>{i + 1}</span>
                  <div>
                    <h3 className="font-display font-bold">{w.t}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-graphite">{w.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-black">Submit Your Property</h2>
            <p className="mt-1 text-xs text-graphite">The curation desk reviews every submission within 3 working days.</p>
            <div className="mt-5">
              <LeadForm
                fields={[
                  { name: "owner", label: "Owner / company name", required: true },
                  { name: "phone", label: "Phone", type: "tel", required: true },
                  { name: "email", label: "Email", type: "email" },
                  { name: "type", label: "Property type", type: "select", options: WHAT, required: true },
                  { name: "location", label: "Location", required: true, placeholder: "City, sector / micro-market" },
                  { name: "size", label: "Size / area", placeholder: "e.g. 250 sq yd" },
                  { name: "price", label: "Expected price", placeholder: "e.g. ₹85 L" },
                  { name: "details", label: "Brief details", type: "textarea", placeholder: "Approvals, facing, road width, why it stands out…" },
                ]}
                cta="Submit Property"
                success="Submission received. The curation desk will review it and reach out within 3 working days."
              />
              <p className="mt-3 text-center text-[11px] text-graphite">
                Images and documents are collected after the initial review call.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
