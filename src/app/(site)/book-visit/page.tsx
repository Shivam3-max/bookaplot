import { Suspense } from "react";
import type { Metadata } from "next";
import { listDeals } from "@/lib/content-queries";
import BookVisit from "./BookVisit";

export const metadata: Metadata = {
  title: "Book a Site Visit — Shortlist Online, Visit with Clarity",
  description: "Book an assisted site visit for one or multiple shortlisted Tricity opportunities.",
};

export default async function BookVisitPage() {
  const deals = await listDeals();
  return (
    <Suspense>
      <BookVisit deals={deals} />
    </Suspense>
  );
}
