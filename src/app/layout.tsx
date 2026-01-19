import type { Metadata } from "next";
import "./globals.css";
import { Navigation, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "TruGovAI Maturity Model | AI Governance Self-Assessment",
  description: "Transform your AI governance with the TruGovAI Maturity Model. Self-assess across 7 dimensions, track progress, and get tailored recommendations.",
  keywords: ["AI governance", "maturity model", "self-assessment", "compliance", "risk management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
