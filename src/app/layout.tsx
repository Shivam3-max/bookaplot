import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SavedProvider } from "@/context/SavedContext";
import { SessionProvider } from "@/context/SessionContext";
import { getCurrentUser } from "@/lib/dal";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mondato — Tricity's CP & Investor-First Real Estate Network",
    template: "%s | Mondato",
  },
  description:
    "Exclusive verified mandates, territory rights and the Give & Ask desk — Tricity's channel-partner and investor network across Chandigarh, Mohali, Panchkula, Zirakpur, New Chandigarh and Kharar.",
  openGraph: {
    title: "Mondato — Tricity's CP & Investor-First Real Estate Network",
    description:
      "Exclusive verified mandates, territory rights and the Give & Ask desk across Chandigarh, Mohali, Panchkula, Zirakpur, New Chandigarh and Kharar.",
    siteName: "Mondato",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mondato — Tricity's CP & Investor-First Real Estate Network",
    description:
      "Exclusive verified mandates, territory rights and the Give & Ask desk across Tricity.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider user={user}>
          <SavedProvider>{children}</SavedProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
