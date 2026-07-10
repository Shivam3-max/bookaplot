"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOCATIONS } from "@/lib/data";

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const go = () => {
    const q = new URLSearchParams();
    if (city) q.set("city", city);
    if (type) q.set("type", type);
    if (budget) q.set("budget", budget);
    router.push(`/deals?${q.toString()}`);
  };

  return (
    <div className="card mt-8 flex max-w-xl flex-col gap-2 p-2 sm:flex-row">
      <select value={city} onChange={(e) => setCity(e.target.value)} className="input !border-0 !bg-paper flex-1" aria-label="Location">
        <option value="">All locations</option>
        {LOCATIONS.map((l) => (
          <option key={l.slug} value={l.slug}>{l.name}</option>
        ))}
      </select>
      <select value={type} onChange={(e) => setType(e.target.value)} className="input !border-0 !bg-paper flex-1" aria-label="Property type">
        <option value="">Any type</option>
        <option>Residential Plot</option>
        <option>Commercial Plot</option>
        <option>SCO / Booth</option>
        <option>Township Plot</option>
        <option>Land Parcel</option>
      </select>
      <select value={budget} onChange={(e) => setBudget(e.target.value)} className="input !border-0 !bg-paper flex-1" aria-label="Budget">
        <option value="">Any budget</option>
        <option value="0-5000000">Under ₹50 L</option>
        <option value="5000000-15000000">₹50 L – ₹1.5 Cr</option>
        <option value="15000000-999999999">Above ₹1.5 Cr</option>
      </select>
      <button onClick={go} className="btn-primary shrink-0 !px-5">
        Find Opportunities
      </button>
    </div>
  );
}
