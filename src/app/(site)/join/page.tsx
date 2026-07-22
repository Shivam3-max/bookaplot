import { Suspense } from "react";
import type { Metadata } from "next";
import JoinHub from "./JoinHub";

export const metadata: Metadata = {
  title: "Join the Network — CP, Investor & Seller Onboarding",
  description:
    "Join BookAPlot's Tricity real estate network: channel partners get exclusive mandates and territory rights, investors get verified deals and the Give & Ask desk.",
};

export default function JoinPage() {
  return (
    <Suspense>
      <JoinHub />
    </Suspense>
  );
}
