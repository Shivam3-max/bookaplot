import type { Metadata } from "next";
import LegalShell from "../legal-layout";

export const metadata: Metadata = { title: "Terms of Use" };

export default function Terms() {
  return (
    <LegalShell title="Terms of Use" updated="July 2026">
      <p>BookAPlot is a discovery and information platform. We present curated real estate opportunities across Tricity along with informational tools such as calculators, maps, and market notes.</p>
      <p>BookAPlot is not a party to any transaction between buyers and sellers. Listing on the platform does not constitute an endorsement, valuation, or guarantee of any property, project, developer, or price.</p>
      <p>Property pricing, availability, project details, approvals, and timelines may change without notice. All information should be independently verified before any commitment.</p>
      <p>Calculator outputs are indicative estimates and do not constitute financial, legal, tax, or investment advice.</p>
      <p>By using the platform you agree to use its content for personal evaluation purposes and not to scrape, republish, or misrepresent platform data.</p>
    </LegalShell>
  );
}
