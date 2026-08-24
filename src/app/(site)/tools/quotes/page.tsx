import type { Metadata } from "next";
import Quotes from "./Quotes";

export const metadata: Metadata = {
  title: "Real Estate Quotes — Shareable Wisdom on Land & Wealth",
  description: "Public-domain quotes on land, property and wealth, ready to copy or share with clients.",
};

export default function QuotesPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <Quotes />
    </div>
  );
}
