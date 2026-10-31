import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Instrument_Serif, Outfit } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const content = getSiteContent();

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090908",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${instrument.variable} antialiased`}>
      <body className="bg-ink font-sans text-paper">
        <noscript>
          <style>{`.preloader{display:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
