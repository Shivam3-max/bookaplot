export type Role = "CP" | "INVESTOR" | "ADMIN";
export type PartnerStatus = "PENDING" | "VERIFIED" | "TERRITORY_LOCKED";
export type AskStatus = "OPEN" | "PLATFORM_REVERTED" | "MATCHED";
export type SubmissionStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";

export interface PublicUser {
  id: number;
  role: Role;
  name: string;
  phone: string;
  email: string | null;
  firm: string | null;
  territory: string | null;
  budget: string | null;
  interest: string | null;
  status: PartnerStatus;
  createdAt: Date;
}

export interface AuthUser {
  id: number;
  role: Role;
  phone: string;
  passwordHash: string;
}

export interface AskReplyRecord {
  id: number;
  askId: number;
  authorId: number | null;
  text: string;
  createdAt: Date;
}

export interface AskRecord {
  id: number;
  investorId: number;
  budget: string;
  type: string;
  locations: string;
  urgency: string;
  note: string;
  status: AskStatus;
  createdAt: Date;
}

export interface AskWithRelations extends AskRecord {
  investor: { name: string };
  replies: AskReplyRecord[];
}

export interface SellerSubmissionRecord {
  id: number;
  name: string;
  phone: string;
  propertyDetail: string;
  expectedPrice: string | null;
  status: SubmissionStatus;
  createdAt: Date;
}
