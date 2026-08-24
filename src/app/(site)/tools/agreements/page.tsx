import type { Metadata } from "next";
import AgreementAssistant from "./AgreementAssistant";

export const metadata: Metadata = {
  title: "Agreement Drafting Assistant — Rent, Sale & Brokerage Drafts",
  description:
    "Draft a Leave & Licence / Rent Agreement, an Agreement to Sell, or a Brokerage / Channel Partner Agreement in minutes. Free, runs entirely in your browser, nothing stored.",
};

export default function AgreementsPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <AgreementAssistant />
    </div>
  );
}
