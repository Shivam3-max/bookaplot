"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Ask, Partner, SEED_ASKS, SEED_PARTNERS } from "@/lib/network-data";

export interface Account {
  role: "cp" | "investor";
  name: string;
  phone: string;
  firm?: string;
  territory?: string;
  budget?: string;
  interest?: string;
}

interface NetworkState {
  account: Account | null;
  login: (a: Account) => void;
  logout: () => void;
  asks: Ask[];
  addAsk: (a: Omit<Ask, "id" | "created" | "status" | "replies">) => void;
  replyAsk: (id: string, text: string, status?: Ask["status"]) => void;
  partners: Partner[];
  addPartner: (p: Omit<Partner, "id" | "joined" | "status">) => void;
  setPartnerStatus: (id: string, status: Partner["status"], territory?: string) => void;
  creativeRequests: string[];
  requestCreative: (title: string) => void;
}

const Ctx = createContext<NetworkState | null>(null);
const today = () => new Date().toISOString().slice(0, 10);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [asks, setAsks] = useState<Ask[]>(SEED_ASKS);
  const [partners, setPartners] = useState<Partner[]>(SEED_PARTNERS);
  const [creativeRequests, setCreativeRequests] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAccount(load<Account | null>("bap:account", null));
    setAsks(load<Ask[]>("bap:asks", SEED_ASKS));
    setPartners(load<Partner[]>("bap:partners", SEED_PARTNERS));
    setCreativeRequests(load<string[]>("bap:creative-reqs", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("bap:account", JSON.stringify(account));
    localStorage.setItem("bap:asks", JSON.stringify(asks));
    localStorage.setItem("bap:partners", JSON.stringify(partners));
    localStorage.setItem("bap:creative-reqs", JSON.stringify(creativeRequests));
  }, [account, asks, partners, creativeRequests, hydrated]);

  const addAsk: NetworkState["addAsk"] = (a) =>
    setAsks((xs) => [
      {
        ...a,
        id: `ASK-${105 + xs.length}`,
        created: today(),
        status: "Open",
        replies: [
          {
            by: "Platform",
            text: "Received by the Give & Ask desk. The team is matching your requirement against live mandates and off-market inventory — expect a revert within 24 hours.",
            date: today(),
          },
        ],
      },
      ...xs,
    ]);

  const replyAsk: NetworkState["replyAsk"] = (id, text, status = "Platform Reverted") =>
    setAsks((xs) =>
      xs.map((x) =>
        x.id === id ? { ...x, status, replies: [...x.replies, { by: "Platform", text, date: today() }] } : x
      )
    );

  const addPartner: NetworkState["addPartner"] = (p) =>
    setPartners((xs) => [
      { ...p, id: `${p.role === "cp" ? "CP" : "INV"}-${32 + xs.length}`, joined: today(), status: "Pending" },
      ...xs,
    ]);

  const setPartnerStatus: NetworkState["setPartnerStatus"] = (id, status, territory) =>
    setPartners((xs) => xs.map((x) => (x.id === id ? { ...x, status, territory: territory ?? x.territory } : x)));

  return (
    <Ctx.Provider
      value={{
        account,
        login: (a) => setAccount(a),
        logout: () => setAccount(null),
        asks,
        addAsk,
        replyAsk,
        partners,
        addPartner,
        setPartnerStatus,
        creativeRequests,
        requestCreative: (t) => setCreativeRequests((r) => [t, ...r]),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNetwork outside provider");
  return ctx;
}
