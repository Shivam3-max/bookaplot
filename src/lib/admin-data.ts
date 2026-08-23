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

// No demo leads - this is real production data. Real Territory Leads
// capture (a Lead DB model + a real user action that creates one) is not
// built yet; this stays empty rather than showing placeholder people.
export const LEADS: Lead[] = [];

