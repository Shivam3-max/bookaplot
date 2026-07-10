import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareDrawer from "@/components/CompareDrawer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <CompareDrawer />
    </>
  );
}
