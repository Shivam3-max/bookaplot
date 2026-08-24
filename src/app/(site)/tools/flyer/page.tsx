import type { Metadata } from "next";
import FlyerMaker from "./FlyerMaker";

export const metadata: Metadata = {
  title: "Property Flyer Maker — Branded WhatsApp & Instagram Flyers",
  description:
    "Turn any property photo into a branded flyer with your company name, phone number and address. Runs entirely in your browser — nothing is uploaded.",
};

export default function FlyerPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <FlyerMaker />
    </div>
  );
}
