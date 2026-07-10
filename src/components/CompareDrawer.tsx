"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSaved } from "@/context/SavedContext";
import { getDeal } from "@/lib/data";
import { inr } from "@/lib/format";

export default function CompareDrawer() {
  const { compare, toggleCompare, clearCompare } = useSaved();
  const pathname = usePathname();
  if (compare.length === 0 || pathname === "/saved") return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-line bg-white/90 p-3 shadow-[0_20px_50px_-20px_rgba(17,17,17,0.4)] backdrop-blur-xl">
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {compare.map((slug) => {
            const d = getDeal(slug);
            if (!d) return null;
            return (
              <div key={slug} className="flex shrink-0 items-center gap-2 rounded-xl bg-paper px-3 py-1.5">
                <div>
                  <p className="max-w-[130px] truncate text-xs font-bold">{d.title}</p>
                  <p className="text-[10px] text-graphite">{inr(d.price)}</p>
                </div>
                <button onClick={() => toggleCompare(slug)} className="text-graphite hover:text-ink" aria-label="Remove">
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <button onClick={clearCompare} className="hidden text-xs font-semibold text-graphite hover:text-ink sm:block">
          Clear
        </button>
        <Link href="/saved#compare" className="btn-gold !py-2 !text-[13px]">
          Compare {compare.length}
        </Link>
      </div>
    </div>
  );
}
