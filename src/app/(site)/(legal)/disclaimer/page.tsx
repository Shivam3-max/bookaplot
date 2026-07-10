import type { Metadata } from "next";
import LegalShell from "../legal-layout";

export const metadata: Metadata = { title: "Disclaimer" };

export default function Disclaimer() {
  return (
    <LegalShell title="Disclaimer" updated="July 2026">
      <p>BookAPlot provides curated real estate opportunities and informational tools for discovery and evaluation. Property pricing, appreciation expectations, project details, legal status, and availability may change over time.</p>
      <p>Terms such as “undervalued”, “deal score”, “benchmark”, and “growth corridor” reflect our internal research framework and opinion, not certified valuations or assured outcomes.</p>
      <p>Real estate involves risk. Past price behaviour in any micro-market is not a guarantee of future performance. Users should independently verify all details, approvals, and documents — and assess financial suitability — before making any purchase decision.</p>
      <p>Calculator outputs are indicative estimates only and should not be treated as financial, legal, tax, or investment advice.</p>
    </LegalShell>
  );
}
