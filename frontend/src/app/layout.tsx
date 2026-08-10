import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/layout/LayoutClient";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AAJ Tech Trading Corporation",
  description: "Global leaders in industrial components supply. We provide premium quality pumps, seals, and valves for heavy industries worldwide.",
  keywords: ["industrial pumps", "mechanical seals", "valves", "industrial trading", "aaj tech"],
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" }
    ]
  },
  openGraph: {
    title: "AAJ Tech Trading Corporation",
    description: "Global leaders in industrial components supply. We provide premium quality pumps, seals, and valves for heavy industries worldwide.",
    url: "https://aajtechtrading.in",
    siteName: "AAJ TECH TRADING CORPORATION",
    images: [
      {
        url: "https://aajtechtrading.in/logo.png",
        width: 1200,
        height: 630,
        alt: "AAJ Tech Trading Corporation Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AAJ Tech Trading Corporation",
    description: "Global leaders in industrial components supply. We provide premium quality pumps, seals, and valves for heavy industries worldwide.",
    images: ["https://aajtechtrading.in/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-white dark:bg-brand-dark text-brand-dark dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-300">
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
