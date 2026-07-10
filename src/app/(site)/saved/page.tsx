import type { Metadata } from "next";
import SavedDashboard from "./SavedDashboard";

export const metadata: Metadata = {
  title: "Saved & Compare — Your Shortlist",
  description: "Your saved Tricity deals, side-by-side comparison, and recently viewed opportunities.",
};

export default function SavedPage() {
  return <SavedDashboard />;
}
