import { Suspense } from "react";
import type { Metadata } from "next";
import Marketplace from "./Marketplace";

export const metadata: Metadata = {
  title: "Deals Marketplace — Curated Undervalued Deals Across Tricity",
  description:
    "Browse curated undervalued plots, residential projects, commercial assets, pre-launch entries and growth-corridor land across Tricity.",
};

export default function DealsPage() {
  return (
    <Suspense>
      <Marketplace />
    </Suspense>
  );
}
