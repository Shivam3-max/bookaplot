import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SavedProvider } from "@/context/SavedContext";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BookAPlot — Undervalued Property Deals Across Tricity",
    template: "%s | BookAPlot",
  },
  description:
    "Curated undervalued plots, residential and commercial real estate opportunities across Chandigarh, Mohali, Panchkula, Zirakpur, New Chandigarh and Kharar.",
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
        <SavedProvider>{children}</SavedProvider>
      </body>
    </html>
  );
}
