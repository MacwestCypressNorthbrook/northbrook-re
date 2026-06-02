import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/heroFrameCache";
import GSAPProvider from "@/components/providers/GSAPProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/nav/Navbar";
import Preloader from "@/components/ui/Preloader";
import Footer from "@/components/sections/Footer";
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "North-Brook Limited | Precision in Oil & Gas Logistics",
  description: "Established in 2014, North-Brook Limited is a leading Ghanaian company specialising in total onshore and offshore logistics solutions including Sea Freight, Bunkering, Ship Agency, Customs Clearance, and Crew Management across West Africa.",
  keywords: ["Logistics", "Ghana", "Oil and Gas", "Freight Forwarding", "Ship Agency", "West Africa", "Bunkering", "Customs Clearance", "Offshore Logistics"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://northbrook.com.gh",
    siteName: "North-Brook Limited",
    title: "North-Brook Limited | Precision in Oil & Gas Logistics",
    description: "West Africa's premier onshore and offshore logistics partner. Ship agency, bunkering, freight, warehousing and customs clearance since 2014.",
    images: [
      {
        url: "https://northbrook.com.gh/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "North-Brook Limited — Precision in Oil & Gas Logistics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "North-Brook Limited | Precision in Oil & Gas Logistics",
    description: "West Africa's premier onshore and offshore logistics partner since 2014.",
    images: ["https://northbrook.com.gh/images/og-default.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GH"
      suppressHydrationWarning
      className={`${inter.variable} ${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
    >
      <body className="bg-background text-foreground selection:bg-accent selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": ["Organization", "LocalBusiness"],
                "@id": "https://northbrook.com.gh/#organization",
                name: "North-Brook Limited",
                url: "https://northbrook.com.gh",
                logo: "https://northbrook.com.gh/images/logo.png",
                image: "https://northbrook.com.gh/images/og-default.jpg",
                description: "West Africa's premier onshore and offshore logistics partner. Ship agency, bunkering, sea freight, warehousing, customs clearance, and crew management since 2014.",
                foundingDate: "2014",
                areaServed: { "@type": "Place", name: "West Africa" },
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "No 12 Joseph Richard Asiedu St",
                  addressLocality: "Accra",
                  addressCountry: "GH",
                },
                telephone: "+233244270797",
                email: "info@northbrook.com.gh",
                sameAs: [
                  "https://linkedin.com/company/northbrook-limited",
                  "https://facebook.com/northbrooklimited",
                  "https://instagram.com/northbrooklimited",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://northbrook.com.gh/#website",
                url: "https://northbrook.com.gh",
                name: "North-Brook Limited",
                publisher: { "@id": "https://northbrook.com.gh/#organization" },
              },
            ]),
          }}
        />
        <Preloader />
        <GSAPProvider>
          <Navbar />
          <ScrollProgress />
          <CustomCursor />
          <main>{children}</main>

          <Footer />
          <Analytics />

        </GSAPProvider>
      </body>
    </html>
  );
}
