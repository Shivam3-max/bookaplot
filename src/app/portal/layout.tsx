import { requirePartner } from "@/lib/dal";
import PortalShell from "./PortalShell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePartner();
  return <PortalShell user={user}>{children}</PortalShell>;
}
