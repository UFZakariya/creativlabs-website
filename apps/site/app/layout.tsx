import type { Metadata } from "next";
import { Geist, Roboto_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Safetyline — Sardauna, your house of agents",
  description:
    "Sardauna is Safetyline's house of agents: a chief of staff running departments of specialist AI agents for your business — on WhatsApp first.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
