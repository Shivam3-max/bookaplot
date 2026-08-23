// Network layer: mandates, territories, creatives, asks — the CP/investor-first model.

export interface MandateInfo {
  commission: string; // CP payout
  mandateType: "Exclusive Mandate" | "Verified Mandate" | "Sole Selling";
  validity: string;
  investorNote: string; // investor-side angle
  urgent?: boolean; // desperate-deal flag
  kit: string[]; // marketing kit contents
}

// MANDATES used to be hardcoded here, keyed by deal slug. It's now a real `Mandate`
// table (1:1 with `Deal`) - see src/lib/content-queries.ts's listMandates().

export const TERRITORIES = [
  "New Chandigarh", "Mohali Sectors 76–91", "Mohali Sectors 92–116 + Airport Belt",
  "Zirakpur — VIP Road", "Zirakpur — Patiala Road", "Kharar–Kurali Corridor",
  "Panchkula", "Chandigarh Periphery", "Derabassi Belt",
];

export interface Creative {
  title: string;
  type: "Reel / Video" | "Brochure" | "WhatsApp Creative" | "Walkthrough" | "Banner Set";
  deal: string;
  status: "Ready" | "In Production";
  hue: number;
}

// CREATIVES used to be hardcoded here too - now a real `Creative` table, see
// src/lib/content-queries.ts's listCreatives().

export const CP_BENEFITS = [
  { t: "Exclusive Verified Mandate Deals", d: "Sole-selling and exclusive mandates you won't find on any portal — verified papers, verified pricing, ready kits." },
  { t: "Exclusive Territory Rights", d: "Lock your micro-market. One CP per territory means your zone's mandates and leads are yours alone." },
  { t: "Territory Leads, Delivered", d: "Buyer and investor leads from your locked territory routed straight to your dashboard." },
  { t: "Customized Creatives & Videos", d: "Reels, brochures and WhatsApp packs customized with your name and number — ready to forward." },
];

export const INVESTOR_BENEFITS = [
  { t: "Verified Mandate Access", d: "Full pricing, papers and benchmarks on every network deal — before the public sees a teaser." },
  { t: "Give & Ask Desk", d: "Post your exact requirement; the platform reverts with matched inventory — you never hunt." },
  { t: "Desperate-Deal Feed", d: "Urgent-exit and distress-priced opportunities flagged to ready investors first." },
  { t: "Investment Creatives", d: "Deal videos and analysis cuts made for investors, not homebuyers." },
];
