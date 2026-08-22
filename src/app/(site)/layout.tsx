import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareDrawer from "@/components/CompareDrawer";
import { listDeals } from "@/lib/content-queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const deals = await listDeals();
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <CompareDrawer deals={deals} />
    </>
  );
}
