import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased font-[family-name:var(--font-body)]`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
