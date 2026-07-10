"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SavedState {
  saved: string[];
  compare: string[];
  viewed: string[];
  toggleSaved: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  markViewed: (slug: string) => void;
}

const Ctx = createContext<SavedState | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // merge with any state set by child effects that ran before hydration (e.g. markViewed)
    try {
      const read = (k: string) => JSON.parse(localStorage.getItem(k) || "[]") as string[];
      setSaved((v) => [...new Set([...v, ...read("bap:saved")])]);
      setCompare((v) => [...new Set([...v, ...read("bap:compare")])].slice(0, 4));
      setViewed((v) => [...new Set([...v, ...read("bap:viewed")])].slice(0, 8));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("bap:saved", JSON.stringify(saved));
    localStorage.setItem("bap:compare", JSON.stringify(compare));
    localStorage.setItem("bap:viewed", JSON.stringify(viewed));
  }, [saved, compare, viewed, hydrated]);

  const toggleSaved = (slug: string) =>
    setSaved((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  const toggleCompare = (slug: string) =>
    setCompare((c) =>
      c.includes(slug) ? c.filter((x) => x !== slug) : c.length >= 4 ? c : [...c, slug]
    );

  const markViewed = (slug: string) =>
    setViewed((v) => [slug, ...v.filter((x) => x !== slug)].slice(0, 8));

  return (
    <Ctx.Provider
      value={{ saved, compare, viewed, toggleSaved, toggleCompare, clearCompare: () => setCompare([]), markViewed }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSaved outside provider");
  return ctx;
}
