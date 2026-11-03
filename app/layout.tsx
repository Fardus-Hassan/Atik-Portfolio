import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Instrument_Serif, Outfit } from "next/font/google";
import { CustomCursor } from "@/components/custom-cursor";
import { baseMetadata, structuredData } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";
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

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata(await getSiteContent());
}

export const viewport: Viewport = {
  themeColor: "#090908",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const content = await getSiteContent();
  const jsonLd = JSON.stringify(structuredData(content)).replace(/</g, "\\u003c");

  return (
    <html lang="en" className={`${outfit.variable} ${instrument.variable} antialiased`}>
      <body className="bg-ink font-sans text-paper">
        <noscript>
          <style>{`.preloader{display:none !important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        {children}
        <CustomCursor
          viewLabel={content.ui.cursorView}
          readLabel={content.ui.cursorRead}
          dragLabel={content.ui.cursorDrag}
        />
      </body>
    </html>
  );
}
