import type { Metadata } from "next";
import { listDeals } from "@/lib/content-queries";
import SavedDashboard from "./SavedDashboard";

export const metadata: Metadata = {
  title: "Saved & Compare — Your Shortlist",
  description: "Your saved Tricity deals, side-by-side comparison, and recently viewed opportunities.",
};

export default async function SavedPage() {
  const deals = await listDeals();
  return <SavedDashboard deals={deals} />;
}
