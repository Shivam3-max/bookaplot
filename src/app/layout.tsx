import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SavedProvider } from "@/context/SavedContext";
import { NetworkProvider } from "@/context/NetworkContext";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BookAPlot — Tricity's CP & Investor-First Real Estate Network",
    template: "%s | BookAPlot",
  },
  description:
    "Exclusive verified mandates, territory rights and the Give & Ask desk — Tricity's channel-partner and investor network across Chandigarh, Mohali, Panchkula, Zirakpur, New Chandigarh and Kharar.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NetworkProvider>
          <SavedProvider>{children}</SavedProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}
