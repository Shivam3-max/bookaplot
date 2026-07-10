import type { Metadata } from "next";
import MapExperience from "./MapExperience";

export const metadata: Metadata = {
  title: "Tricity Map — 3D Real Estate Opportunity Map",
  description:
    "Explore Tricity through an interactive opportunity map: deal pins, growth corridors, price heat, and zone intelligence across Chandigarh, Mohali, Panchkula and beyond.",
};

export default function MapPage() {
  return <MapExperience />;
}
