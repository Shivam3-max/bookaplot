export type DealBadge =
  | "Undervalued"
  | "Investor Pick"
  | "Hot Zone"
  | "Growth Corridor"
  | "Premium Plot"
  | "Commercial Opportunity"
  | "Limited Inventory"
  | "New Listing"
  | "Pre-Launch"
  | "NRI Friendly"
  | "High Visibility"
  | "Early Entry";

export type PropertyType =
  | "Residential Plot"
  | "Commercial Plot"
  | "SCO / Booth"
  | "Township Plot"
  | "Land Parcel"
  | "Residential Unit";

export type CityKey =
  | "chandigarh"
  | "mohali"
  | "panchkula"
  | "zirakpur"
  | "new-chandigarh"
  | "kharar"
  | "derabassi";

export interface Deal {
  slug: string;
  title: string;
  subtitle: string;
  city: CityKey;
  cityLabel: string;
  microLocation: string;
  type: PropertyType;
  purpose: ("investment" | "self-use" | "commercial")[];
  status: "Ready" | "Pre-Launch" | "Resale" | "Fresh Inventory";
  badges: DealBadge[];
  price: number; // starting price in ₹
  priceMax?: number;
  pricePerUnit: number;
  unit: "sq yd" | "sq ft";
  benchmarkPerUnit: number; // nearby market benchmark
  sizes: string[]; // plot size options
  areaLabel: string;
  facing?: string;
  roadWidth?: string;
  possession: string;
  approval: string;
  score: number; // 0-100 deal score
  upsideNote: string;
  highlights: string[];
  whyStandsOut: string[];
  locationAdvantages: { label: string; value: string }[];
  demandDrivers: string[];
  suitsWho: string[];
  overview: string;
  bookingAmount?: number;
  featured?: boolean;
  hot?: boolean;
  investorPick?: boolean;
  newListing?: boolean;
  mapX: number; // % position on the Tricity SVG map
  mapY: number;
  hue: number; // visual placeholder tint
  faqs: { q: string; a: string }[];
}

export interface LocationZone {
  slug: CityKey;
  name: string;
  tagline: string;
  overview: string;
  maturity: "Mature" | "Growing" | "Emerging";
  growthScore: number;
  priceBand: string;
  avgPerSqYd: string;
  idealBuyer: string[];
  whyBuy: string[];
  connectivity: { label: string; value: string }[];
  trend: number[]; // indexed price trend for sparkline
  mapX: number;
  mapY: number;
  hue: number;
}

export interface Post {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readMins: number;
  body: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
}
