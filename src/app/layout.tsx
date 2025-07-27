import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import the new Navbar

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* Add the Navbar here */}
        <main>{children}</main>
      </body>
    </html>
  );
}
