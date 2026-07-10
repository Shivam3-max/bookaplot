export type LeadStage =
  | "New" | "Contacted" | "Follow-up" | "Visit Scheduled" | "Hot" | "Negotiation" | "Closed Won" | "Closed Lost";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  deal?: string;
  budget: string;
  purpose: string;
  stage: LeadStage;
  score: number;
  assignee: string;
  created: string;
  note?: string;
}

export const LEADS: Lead[] = [
  { id: "L-1042", name: "Harpreet Singh", phone: "+91 9871x xx210", source: "Deal page — New Chandigarh plot", deal: "Premium Residential Plot Opportunity", budget: "₹90 L – 1.2 Cr", purpose: "Self-use", stage: "Hot", score: 88, assignee: "Karan", created: "2026-07-09", note: "Wants corner plot, visiting Saturday" },
  { id: "L-1041", name: "Meera Kapoor", phone: "+91 9810x xx884", source: "Homepage hero search", budget: "₹40 – 60 L", purpose: "Investment", stage: "New", score: 61, assignee: "—", created: "2026-07-09" },
  { id: "L-1040", name: "Gurdeep Bajwa (NRI)", phone: "+1 604 xxx 118", source: "NRI page consultation", deal: "Early-Stage Township Entry", budget: "₹1 – 1.5 Cr", purpose: "Investment", stage: "Follow-up", score: 79, assignee: "Simran", created: "2026-07-08", note: "Vancouver timezone, call after 8:30 PM IST" },
  { id: "L-1039", name: "Rajesh Verma", phone: "+91 9779x xx402", source: "Calculator → EMI", budget: "₹35 – 45 L", purpose: "First plot", stage: "Contacted", score: 55, assignee: "Karan", created: "2026-07-08" },
  { id: "L-1038", name: "Anita Sharma", phone: "+91 98155 xx119", source: "Zirakpur commercial deal page", deal: "Commercial Pocket Deal", budget: "₹1.5 Cr+", purpose: "Commercial", stage: "Visit Scheduled", score: 84, assignee: "Simran", created: "2026-07-07", note: "Evening visit to observe footfall" },
  { id: "L-1037", name: "Vikas Malhotra", phone: "+91 99889 xx236", source: "Compare page CTA", deal: "Growth-Corridor Plot Cluster", budget: "₹30 – 40 L", purpose: "Investment", stage: "Negotiation", score: 90, assignee: "Karan", created: "2026-07-05", note: "Asking 5% below list; developer open" },
  { id: "L-1036", name: "Pooja & Nitin Arora", phone: "+91 98760 xx773", source: "Book Site Visit page", deal: "Premium Sector Plot", budget: "₹1.8 – 2 Cr", purpose: "Self-use", stage: "Closed Won", score: 95, assignee: "Simran", created: "2026-06-28", note: "Registry completed 6 Jul" },
  { id: "L-1035", name: "Sandeep Gill", phone: "+91 97800 xx551", source: "WhatsApp CTA", budget: "₹25 – 30 L", purpose: "Investment", stage: "Closed Lost", score: 40, assignee: "Karan", created: "2026-06-25", note: "Chose unapproved colony elsewhere" },
];

export interface Visit {
  id: string;
  customer: string;
  phone: string;
  deals: string[];
  date: string;
  status: "Requested" | "Confirmed" | "Completed" | "Cancelled";
  coordinator: string;
  feedback?: string;
}

export const VISITS: Visit[] = [
  { id: "V-311", customer: "Harpreet Singh", phone: "+91 9871x xx210", deals: ["Premium Residential Plot Opportunity"], date: "2026-07-12", status: "Confirmed", coordinator: "Aman" },
  { id: "V-310", customer: "Anita Sharma", phone: "+91 98155 xx119", deals: ["Commercial Pocket Deal", "High-Street Retail Booth"], date: "2026-07-11", status: "Confirmed", coordinator: "Aman" },
  { id: "V-309", customer: "Deepak Chawla", phone: "+91 98030 xx647", deals: ["Growth-Corridor Plot Cluster"], date: "2026-07-10", status: "Requested", coordinator: "—" },
  { id: "V-308", customer: "Pooja & Nitin Arora", phone: "+91 98760 xx773", deals: ["Premium Sector Plot"], date: "2026-07-02", status: "Completed", coordinator: "Ritu", feedback: "Loved park-facing aspect. Converted." },
  { id: "V-307", customer: "Manish Jindal", phone: "+91 98559 xx921", deals: ["Early-Stage Township Entry"], date: "2026-06-29", status: "Completed", coordinator: "Aman", feedback: "Wants to wait for RERA number." },
];

export interface Submission {
  id: string;
  owner: string;
  type: string;
  location: string;
  size: string;
  expected: string;
  tag: "Owner" | "Broker" | "Developer";
  status: "Pending Review" | "Needs Details" | "Approved" | "Rejected";
  received: string;
}

export const SUBMISSIONS: Submission[] = [
  { id: "S-88", owner: "R.K. Estates", type: "SCO plot", location: "Zirakpur, Patiala Rd", size: "1,135 sq ft", expected: "₹1.6 Cr", tag: "Broker", status: "Pending Review", received: "2026-07-09" },
  { id: "S-87", owner: "Jasbir Sandhu", type: "Residential plot", location: "Kharar, Sec 124", size: "150 sq yd", expected: "₹38 L", tag: "Owner", status: "Needs Details", received: "2026-07-07" },
  { id: "S-86", owner: "GreenAcre Developers", type: "Township phase", location: "New Chandigarh", size: "48 plots", expected: "₹55–70 L each", tag: "Developer", status: "Approved", received: "2026-07-04" },
  { id: "S-85", owner: "Suresh Bansal", type: "Agricultural land", location: "Derabassi belt", size: "2 acres", expected: "₹1.4 Cr", tag: "Owner", status: "Pending Review", received: "2026-07-03" },
  { id: "S-84", owner: "CityCorner Realty", type: "Booth", location: "Mohali, Ph 7", size: "460 sq ft", expected: "₹72 L", tag: "Broker", status: "Rejected", received: "2026-06-30" },
];

export const TEAM = [
  { name: "Shivam", role: "Super Admin", access: "Everything" },
  { name: "Karan", role: "Sales Manager", access: "Leads, visits, deal status" },
  { name: "Simran", role: "Sales Executive", access: "Leads, visits" },
  { name: "Ritu", role: "Content Manager", access: "Blog, homepage blocks, media" },
  { name: "Aman", role: "Visit Coordinator", access: "Site visits" },
  { name: "Neha", role: "Analyst", access: "Market notes (no publish)" },
];

export const NOTIFICATIONS = [
  { t: "New lead", d: "Meera Kapoor via homepage search", time: "12 min ago", kind: "lead" },
  { t: "Site visit request", d: "Deepak Chawla — Kharar cluster, 10 Jul", time: "1 hr ago", kind: "visit" },
  { t: "New property submission", d: "R.K. Estates — SCO, Zirakpur", time: "3 hrs ago", kind: "submission" },
  { t: "Deal incomplete", d: "Airport-Belt Land Parcel missing brochure PDF", time: "Yesterday", kind: "warning" },
  { t: "Price update pending", d: "Boutique Floor-Plot — developer revised sheet", time: "Yesterday", kind: "warning" },
];
