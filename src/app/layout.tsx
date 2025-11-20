import type { Metadata } from "next";
import { Space_Grotesk, Oxanium, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider"; // Import the new AuthProvider

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-serif",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "StreamFinder - Your Streaming Guide",
  description: "Find where to watch movies and TV shows online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${oxanium.variable} ${sourceCodePro.variable} font-sans bg-main text-foreground antialiased selection:bg-accent-soft/40 selection:text-accent-strong`}
      >
        <AuthProvider>
          <div className="relative isolate min-h-screen overflow-x-hidden">
            <Navbar />
            <main className="relative w-full">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
