import BackgroundCanvas from "@/components/BackgroundCanvas";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Silkscreen } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-krona-one",
});

export const metadata: Metadata = {
  title: "Hackto Night 2025",
  description: "@Todo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.className} antialiased`}
      >
        <BackgroundCanvas />
        <main className="fixed top-0 left-0 w-screen h-screen z-10 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
