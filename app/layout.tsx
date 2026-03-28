import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
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
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen antialiased">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
