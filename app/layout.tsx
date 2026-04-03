import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/ToastProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
          <ErrorBoundary>
            <ToastProvider>
              <Navbar />
              {children}
            </ToastProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
