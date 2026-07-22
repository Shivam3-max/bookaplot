// Network layer: mandates, territories, creatives, asks — the CP/investor-first model.

export interface MandateInfo {
  commission: string; // CP payout
  mandateType: "Exclusive Mandate" | "Verified Mandate" | "Sole Selling";
  validity: string;
  investorNote: string; // investor-side angle
  urgent?: boolean; // desperate-deal flag
  kit: string[]; // marketing kit contents
}

export const MANDATES: Record<string, MandateInfo> = {
  "premium-residential-plot-new-chandigarh": {
    commission: "2.5% + ₹50K milestone bonus",
    mandateType: "Exclusive Mandate",
    validity: "Till 30 Sep 2026",
    investorNote: "Direct developer allocation — no broker chain, registry-ready.",
    kit: ["Brochure PDF", "Price sheet", "Walkthrough video", "WhatsApp creatives ×6"],
  },
  "growth-corridor-plot-cluster-kharar": {
    commission: "3% flat",
    mandateType: "Verified Mandate",
    validity: "Till 31 Aug 2026",
    investorNote: "Developer carrying unsold stock — negotiation headroom for bulk buys.",
    urgent: true,
    kit: ["Brochure PDF", "Layout plan", "Reel pack ×4", "Hindi + Punjabi creatives"],
  },
  "commercial-pocket-deal-zirakpur": {
    commission: "2% + leasing referral",
    mandateType: "Sole Selling",
    validity: "Till 15 Oct 2026",
    investorNote: "Tenanted-yield option available; rent sheet on request.",
    kit: ["Frontage video", "Footfall report", "Price sheet", "Banner set"],
  },
  "early-stage-township-entry-mohali": {
    commission: "3.5% pre-launch slab",
    mandateType: "Exclusive Mandate",
    validity: "Launch window — 45 days",
    investorNote: "Pre-launch allocation reserved for network investors before public release.",
    kit: ["Master plan", "EOI form", "Launch teaser video", "Creatives ×8"],
  },
  "premium-sector-plot-panchkula": {
    commission: "1.5% (resale)",
    mandateType: "Verified Mandate",
    validity: "Open",
    investorNote: "Motivated seller — decision window short, docs pre-verified.",
    urgent: true,
    kit: ["Title summary", "Site photos", "Price note"],
  },
  "it-city-adjacent-commercial-plot-mohali": {
    commission: "2%",
    mandateType: "Verified Mandate",
    validity: "Till 30 Nov 2026",
    investorNote: "Thin-supply commercial belt; suits build-to-lease strategy.",
    kit: ["Zoning note", "FAR summary", "Price sheet"],
  },
  "airport-belt-land-parcel-derabassi": {
    commission: "2% + aggregation bonus",
    mandateType: "Exclusive Mandate",
    validity: "Till 31 Dec 2026",
    investorNote: "Contiguous acreage for land-banking syndicates; 1-acre minimum.",
    kit: ["Parcel map", "Corridor report", "Drone footage"],
  },
  "high-street-retail-booth-zirakpur": {
    commission: "2.5%",
    mandateType: "Verified Mandate",
    validity: "Open",
    investorNote: "Tenanted day-one yield; lowest-ticket commercial on the network.",
    urgent: true,
    kit: ["Rent sheet", "Tenancy summary", "Photos"],
  },
  "boutique-floor-plots-chandigarh-periphery": {
    commission: "2%",
    mandateType: "Verified Mandate",
    validity: "Till 30 Sep 2026",
    investorNote: "OC-received ready stock — leasing or self-use immediately.",
    kit: ["Brochure", "Floor plan", "Creatives ×4"],
  },
};

export const TERRITORIES = [
  "New Chandigarh", "Mohali Sectors 76–91", "Mohali Sectors 92–116 + Airport Belt",
  "Zirakpur — VIP Road", "Zirakpur — Patiala Road", "Kharar–Kurali Corridor",
  "Panchkula", "Chandigarh Periphery", "Derabassi Belt",
];

export interface Creative {
  id: string;
  title: string;
  type: "Reel / Video" | "Brochure" | "WhatsApp Creative" | "Walkthrough" | "Banner Set";
  deal: string;
  status: "Ready" | "In Production";
  hue: number;
}

export const CREATIVES: Creative[] = [
  { id: "CR-21", title: "Pre-Launch Teaser — Mohali Township", type: "Reel / Video", deal: "Early-Stage Township Entry", status: "Ready", hue: 96 },
  { id: "CR-20", title: "New Chandigarh Plots — Investor Cut", type: "Walkthrough", deal: "Premium Residential Plot Opportunity", status: "Ready", hue: 152 },
  { id: "CR-19", title: "Kharar Cluster — WhatsApp Pack (6)", type: "WhatsApp Creative", deal: "Growth-Corridor Plot Cluster", status: "Ready", hue: 38 },
  { id: "CR-18", title: "Zirakpur SCO — Footfall Reel", type: "Reel / Video", deal: "Commercial Pocket Deal", status: "Ready", hue: 210 },
  { id: "CR-17", title: "Airport Belt Acreage — Drone Film", type: "Walkthrough", deal: "Airport-Belt Land Parcel", status: "In Production", hue: 200 },
  { id: "CR-16", title: "Panchkula Park-Facing — Brochure", type: "Brochure", deal: "Premium Sector Plot", status: "Ready", hue: 268 },
];

export interface Ask {
  id: string;
  investor: string;
  budget: string;
  type: string;
  locations: string;
  urgency: "Exploring" | "Ready in 30 days" | "Urgent — desperate deal wanted";
  note: string;
  created: string;
  status: "Open" | "Platform Reverted" | "Matched";
  replies: { by: "Platform" | "You"; text: string; date: string }[];
}

export const SEED_ASKS: Ask[] = [
  {
    id: "ASK-104",
    investor: "Investor · Delhi NCR",
    budget: "₹1.5 – 2 Cr",
    type: "Commercial frontage / SCO",
    locations: "Zirakpur, Mohali airport road",
    urgency: "Ready in 30 days",
    note: "Want tenanted or lease-ready frontage. Yield above 5% net preferred.",
    created: "2026-07-06",
    status: "Platform Reverted",
    replies: [
      { by: "Platform", text: "Two sole-selling frontage assets match — Patiala Road SCO (tenant-ready) and a VIP Road booth with running tenancy at ~5.6% net. Sharing sheets on WhatsApp; site visit slots open this weekend.", date: "2026-07-07" },
    ],
  },
  {
    id: "ASK-103",
    investor: "NRI Investor · Vancouver",
    budget: "₹80 L – 1.2 Cr",
    type: "Residential plot, planned zone",
    locations: "New Chandigarh preferred",
    urgency: "Exploring",
    note: "Long-horizon hold, clear title only, PoA purchase.",
    created: "2026-07-02",
    status: "Matched",
    replies: [
      { by: "Platform", text: "Matched with the Eco City Extension exclusive mandate — 200 sq yd, GMADA-approved, ~11% under benchmark. Documentation pack + video walkthrough sent; PoA checklist attached.", date: "2026-07-03" },
    ],
  },
  {
    id: "ASK-102",
    investor: "Investor Group · Ludhiana",
    budget: "₹3 – 5 Cr",
    type: "Land parcel / distress buy",
    locations: "Anywhere in Tricity influence zone",
    urgency: "Urgent — desperate deal wanted",
    note: "Cash-ready syndicate. Looking for distress or urgent-exit pricing, any asset class.",
    created: "2026-06-28",
    status: "Platform Reverted",
    replies: [
      { by: "Platform", text: "Flagged to the desperate-deals desk. Current fits: Derabassi 4-acre contiguous at ~20% under zone benchmark (seller consolidating), and a Panchkula park-facing resale with a short decision window. Both sheets shared.", date: "2026-06-29" },
    ],
  },
];

export interface Partner {
  id: string;
  name: string;
  firm: string;
  phone: string;
  role: "cp" | "investor";
  territory?: string;
  budget?: string;
  status: "Pending" | "Verified" | "Territory Locked";
  joined: string;
}

export const SEED_PARTNERS: Partner[] = [
  { id: "CP-31", name: "Harjit Dhillon", firm: "Dhillon Realty", phone: "+91 98761 xx310", role: "cp", territory: "Kharar–Kurali Corridor", status: "Territory Locked", joined: "2026-05-14" },
  { id: "CP-30", name: "Neeraj Khanna", firm: "Khanna Estates", phone: "+91 98140 xx554", role: "cp", territory: "Zirakpur — VIP Road", status: "Territory Locked", joined: "2026-05-20" },
  { id: "CP-29", name: "Simran Walia", firm: "Walia Associates", phone: "+91 99150 xx208", role: "cp", territory: "New Chandigarh", status: "Verified", joined: "2026-06-11" },
  { id: "CP-28", name: "Rohit Bansal", firm: "RB Propmart", phone: "+91 98550 xx871", role: "cp", status: "Pending", joined: "2026-07-08" },
  { id: "INV-45", name: "Gurdeep Bajwa", firm: "—", phone: "+1 604 xxx 118", role: "investor", budget: "₹1 – 1.5 Cr", status: "Verified", joined: "2026-06-25" },
  { id: "INV-44", name: "Ludhiana Syndicate", firm: "4-member group", phone: "+91 98720 xx990", role: "investor", budget: "₹3 – 5 Cr", status: "Verified", joined: "2026-06-20" },
];

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
