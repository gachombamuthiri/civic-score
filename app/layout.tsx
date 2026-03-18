import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CivicScore — Rewarding Good Citizenship in Kenya",
  description:
    "CivicScore is a web-based platform that tracks and rewards positive civic actions for Kenyan citizens.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
