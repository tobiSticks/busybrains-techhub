import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

// One typeface (Inter, varying weight) throughout — matches the reference
// site, which uses Inter everywhere instead of separate display/mono fonts.
// next/font requires each call's options to be literal (no shared constant).
const interDisplay = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const interMono = Inter({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BusyBrains Tech-Hub Corporate Services",
  description:
    "One consultancy, ten disciplines — cybersecurity, AI & automation, software, government contracts, solar, and more. Every engagement opens a tracked case.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "BusyBrains Tech-Hub Corporate Services",
    description:
      "One consultancy, ten disciplines — cybersecurity, AI & automation, software, government contracts, solar, and more. Every engagement opens a tracked case.",
    images: ["/busybrains-icon-white-bg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interDisplay.variable} ${inter.variable} ${interMono.variable} antialiased font-[family-name:var(--font-body)]`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
