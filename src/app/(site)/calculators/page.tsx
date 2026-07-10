import type { Metadata } from "next";
import Calculators from "./Calculators";

export const metadata: Metadata = {
  title: "Calculators Hub — Real Estate Calculators for Smarter Buying",
  description:
    "EMI, stamp duty, ROI, rental yield, buy vs rent, and total plot investment calculators built for Tricity property decisions.",
};

export default function CalculatorsPage() {
  return <Calculators />;
}
