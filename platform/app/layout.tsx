import BackgroundCanvas from "@/components/common/BackgroundCanvas";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { ContestProvider } from "@/contexts/ContestContext";
import { TeamProvider } from "@/contexts/TeamContext";
import type { Metadata } from "next";
import { Silkscreen } from "next/font/google";
import "./globals.css";

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
  // Set up contest dates and duration
  
  // For development - set dates that make testing easier
  // Uncomment one of these blocks to test different states
  
  // 1. Contest not started (Registration not open)
  // const registrationStartDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days in future
  // const contestStartDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days in future
  
  // 2. Registration open, contest not started
  // const registrationStartDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
  // const contestStartDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days in future
  
  // 3. Contest started
  const registrationStartDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
  const contestStartDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
  
  const contestDurationHours = 48; // 48-hour contest

  return (
    <html lang="en">
      <body
        className={`${silkscreen.className} antialiased`}
      >
        <TeamProvider>
          <ContestProvider 
            initialStartDate={contestStartDate}
            initialRegistrationDate={registrationStartDate}
            initialDuration={contestDurationHours}
          >
            <BackgroundCanvas />
            <main className="fixed top-0 left-0 w-dvw h-dvh z-10 flex flex-col">
                <div id="page" className="snap-y snap-mandatory overflow-y-auto font-sans scroll-smooth">
                    <Header />
                    {children}
                    <Footer />
                </div>
            </main>
          </ContestProvider>
        </TeamProvider>
      </body>
    </html>
  );
}
