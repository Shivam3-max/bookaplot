import type { Metadata } from "next";
import CarpetArea from "./CarpetArea";

export const metadata: Metadata = {
  title: "Carpet Area Checker — Loading %, Built-up & Real Rate",
  description:
    "Work out the carpet area behind any super built-up quote, judge whether the loading is reasonable, and see the effective rate per sq ft of usable carpet.",
};

export default function CarpetAreaPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <CarpetArea />
    </div>
  );
}
