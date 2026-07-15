import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/layout/LayoutClient";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AAJ TECH TRADING | Premium Industrial Solutions",
  description: "Global leaders in industrial components supply. We provide premium quality pumps, seals, and valves for heavy industries worldwide.",
  keywords: ["industrial pumps", "mechanical seals", "valves", "industrial trading", "aaj tech"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-white text-brand-dark min-h-screen flex flex-col">
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
