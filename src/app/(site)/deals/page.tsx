import { Suspense } from "react";
import type { Metadata } from "next";
import { listDeals, listLocations } from "@/lib/content-queries";
import Marketplace from "./Marketplace";

export const metadata: Metadata = {
  title: "Deals Marketplace — Curated Undervalued Deals Across Tricity",
  description:
    "Browse curated undervalued plots, residential projects, commercial assets, pre-launch entries and growth-corridor land across Tricity.",
};

export default async function DealsPage() {
  const [deals, locations] = await Promise.all([listDeals(), listLocations()]);
  return (
    <Suspense>
      <Marketplace deals={deals} locations={locations} />
    </Suspense>
  );
}
