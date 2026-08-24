import type { Metadata } from "next";
import AreaConverter from "./AreaConverter";

export const metadata: Metadata = {
  title: "Area Unit Converter — Sq Ft, Gaj, Marla, Kanal, Acre",
  description:
    "Convert between square feet, square yard (gaj), marla, kanal, acre, hectare, guntha, cent and ground — the units used across Tricity and India.",
};

export default function AreaConverterPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <AreaConverter />
    </div>
  );
}
