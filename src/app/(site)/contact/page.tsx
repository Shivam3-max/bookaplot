import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Contact — Talk to the BookAPlot Team",
  description: "Book a consultation, schedule a site visit, or get help shortlisting Tricity opportunities.",
};

const CHANNELS = [
  { t: "Phone", v: "+91 98XXX XXXXX", d: "Mon–Sat, 9:30 AM – 7 PM IST" },
  { t: "WhatsApp", v: "Chat with the team", d: "Fastest for deal-specific questions" },
  { t: "Email", v: "hello@bookaplot.com", d: "Replies within one working day" },
  { t: "Office", v: "Sector 82, Mohali, Punjab", d: "Visits by appointment" },
];

export default function ContactPage() {
  return (
    <>
      <section className="grid-bg border-b border-line py-16">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Contact / consultation</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Talk to the BookAPlot Team
            </h1>
            <p className="mt-4 max-w-xl text-graphite">
              Looking for the right opportunity, want to schedule a site visit, or need help
              shortlisting options? Reach out and our team will assist you.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid content-start gap-4 sm:grid-cols-2">
          {CHANNELS.map((c, i) => (
            <Reveal key={c.t} delay={i * 70}>
              <div className="card card-hover h-full p-5">
                <p className="eyebrow">{c.t}</p>
                <p className="mt-2 font-display font-bold">{c.v}</p>
                <p className="mt-1 text-xs text-graphite">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={140}>
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-black">Send a message</h2>
            <div className="mt-5">
              <LeadForm
                fields={[
                  { name: "name", label: "Name", required: true },
                  { name: "phone", label: "Phone", type: "tel", required: true },
                  { name: "email", label: "Email", type: "email" },
                  { name: "intent", label: "I want to", type: "select", required: true, options: ["Buy a property", "Invest", "List a property", "Book a site visit", "Get a consultation"] },
                  { name: "message", label: "Message", type: "textarea", placeholder: "Budget, locations of interest, timeline…" },
                ]}
                cta="Send Message"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
