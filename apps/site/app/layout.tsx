import type { Metadata } from "next";
import { Geist, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import HermesDock from "@/components/HermesDock";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://safetyline.com.ng"),
  title: {
    default: "Safetyline — Sardauna, your house of agents",
    template: "%s",
  },
  description:
    "Sardauna is Safetyline's house of agents: a chief of staff running departments of specialist AI agents for your business — on WhatsApp first.",
  openGraph: {
    type: "website",
    siteName: "Safetyline",
    locale: "en_NG",
    images: [{ url: "/share-card.png", width: 1200, height: 630, alt: "Sardauna by Safetyline — a house of agents for your business" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/share-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${robotoMono.variable}`}>
      <body>
        <div className="page-bg" aria-hidden />
        {children}
        <Analytics />
        <HermesDock />
      </body>
    </html>
  );
}
