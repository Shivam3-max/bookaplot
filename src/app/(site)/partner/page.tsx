import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Partner With Us — A Premium Discovery Channel for Your Inventory",
  description: "Developers, brokers, land aggregators and channel partners: put selected inventory in front of Tricity's most serious buyers.",
};

const WHO = [
  "Developers", "Brokers", "Land aggregators", "Channel partners", "Property consultants", "Investment advisors", "Local market specialists",
];

export default function PartnerPage() {
  return (
    <>
      <section className="grid-bg border-b border-line py-16">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Partner with us</p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              A Premium Discovery Channel for Selected Inventory
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-graphite">
              BookAPlot puts curated inventory in front of serious, high-intent Tricity buyers.
              If your stock has genuine price logic or location value, we present it the way it
              deserves — benchmarked, explained, premium.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {WHO.map((w) => <span key={w} className="chip badge-gold">{w}</span>)}
            </div>
            <ul className="mt-7 space-y-2.5">
              {[
                "Qualified inquiries, not junk leads",
                "Premium presentation with benchmark context",
                "Tricity-focused, high-intent buyer base",
                "Curation protects your brand alongside ours",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-sm font-medium text-slate">
                  <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140}>
            <div className="card p-6">
              <h2 className="font-display text-lg font-black">Start the conversation</h2>
              <p className="mt-1 text-xs text-graphite">Tell us who you are and what you hold. The curation desk replies within 2 working days.</p>
              <div className="mt-4">
                <LeadForm
                  fields={[
                    { name: "name", label: "Name", required: true },
                    { name: "company", label: "Company / firm" },
                    { name: "phone", label: "Phone", type: "tel", required: true },
                    { name: "role", label: "You are a", type: "select", options: WHO, required: true },
                    { name: "inventory", label: "Inventory brief", type: "textarea", placeholder: "Location, asset type, sizes, pricing…" },
                  ]}
                  cta="Apply to Partner"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-14">
        <SectionHead
          eyebrow="How curation works"
          title="We Don't List Everything — That's the Point"
          sub="Every submission is reviewed against our six-factor method. Roughly one in four makes it live. The ones that do get real attention."
        />
      </section>
    </>
  );
}
