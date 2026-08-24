import type { Metadata } from "next";
import Checklist from "./Checklist";

export const metadata: Metadata = {
  title: "Property Document Checklist — Buy, Sell or Rent in India",
  description:
    "Every document to verify before buying, selling or renting a property in India, why each one matters, and which are critical.",
};

export default function ChecklistPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <Checklist />
    </div>
  );
}
