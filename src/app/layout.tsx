import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, IBM_Plex_Mono } from "next/font/google";
import { ProductionInsights } from "@/components/analytics/ProductionInsights";
import { siteUrl } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteGraph } from "@/lib/structured-data";
import { FooterMark } from "@/components/site/FooterMark";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { MotionProvider } from "@/components/ui/MotionProvider";
import "./globals.css";

/** Production Vercel only. Preview, local, and the GitHub Pages export stay quiet. */
const productionInsights =
  process.env.VERCEL_ENV === "production" && process.env.NEXT_OUTPUT !== "export";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "800",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "BridgeWide", template: "%s · BridgeWide" },
  description:
    "BridgeWide places software engineers for companies across the USA, Canada, LATAM, Europe, and Asia.",
  applicationName: "BridgeWide",
  authors: [{ name: "BridgeWide", url: siteUrl }],
  creator: "BridgeWide",
  publisher: "BridgeWide",
  category: "Recruitment",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={siteGraph()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-cloud focus:no-underline"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="main" className="relative z-10 flex-1 bg-cloud">{children}</main>
          <SiteFooter />
          <FooterMark />
        </MotionProvider>
        {productionInsights ? <ProductionInsights /> : null}
      </body>
    </html>
  );
}
