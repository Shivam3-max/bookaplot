"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Deal } from "@/lib/types";
import { useSaved } from "@/context/SavedContext";

export default function DealActions({ deal }: { deal: Deal }) {
  const { saved, compare, toggleSaved, toggleCompare, markViewed } = useSaved();
  const isSaved = saved.includes(deal.slug);
  const inCompare = compare.includes(deal.slug);

  useEffect(() => markViewed(deal.slug), [deal.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-5 flex flex-wrap gap-2.5">
      <Link href={`/book-visit?deal=${deal.slug}`} className="btn-gold flex-1 justify-center sm:flex-none">
        Book Site Visit
      </Link>
      <Link href="/contact" className="btn-primary flex-1 justify-center sm:flex-none">
        Request Callback
      </Link>
      <button onClick={() => toggleSaved(deal.slug)} className={`btn-ghost ${isSaved ? "!border-gold !bg-gold-soft" : ""}`}>
        {isSaved ? "★ Saved" : "☆ Save Deal"}
      </button>
      <button onClick={() => toggleCompare(deal.slug)} className={`btn-ghost ${inCompare ? "!border-green !bg-green-soft" : ""}`}>
        {inCompare ? "✓ In Compare" : "+ Compare"}
      </button>
    </div>
  );
}
