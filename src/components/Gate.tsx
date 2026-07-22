"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useNetwork } from "@/context/NetworkContext";

/** Blurs children for the public; network members (CP / investor) see through. */
export default function Gate({
  children,
  label = "Full details are reserved for network members",
  compact = false,
}: {
  children: ReactNode;
  label?: string;
  compact?: boolean;
}) {
  const { account } = useNetwork();
  if (account) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none blur-[7px]" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-white/45 p-4 text-center backdrop-blur-[1px]">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </span>
        {!compact && <p className="max-w-xs text-[13px] font-bold leading-snug">{label}</p>}
        <Link href="/join" className="btn-gold !px-4 !py-2 !text-xs">
          Join the Network to Unlock
        </Link>
      </div>
    </div>
  );
}
