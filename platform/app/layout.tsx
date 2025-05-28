import type { Metadata } from "next";

import "./globals.css";
import { Silkscreen } from "next/font/google";

import BackgroundCanvas from "@/components/common/BackgroundCanvas";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { ContestProvider } from "@/components/contexts/ContestContext";
import { AuthProvider } from "@/components/contexts/AuthContext";

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
      <body className={`${silkscreen.className} antialiased`}>
        <AuthProvider>
          <ContestProvider>
            <main className="fixed top-0 left-0 w-dvw h-dvh z-10 flex flex-col">
              <div id="page" className="snap-y snap-mandatory overflow-y-auto font-sans scroll-smooth">
                <Header />
                {children}
                <Footer />
              </div>
            </main>
            <BackgroundCanvas />
          </ContestProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
