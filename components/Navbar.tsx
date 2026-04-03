'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import CivicScoreLogo from "./CivicScoreLogo";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("civicScoreTheme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved ? saved === "dark" : prefersDark;
    setIsDarkMode(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("civicScoreTheme", next ? "dark" : "light");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "My Dashboard" },
    { href: "/activities", label: "Activities" },
    { href: "/organization", label: "Organization Portal" },

  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <CivicScoreLogo href="/" />

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
        </button>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${active ? (isDarkMode ? "text-green-300 border-b-2 border-green-300 pb-0.5" : "text-green-700 border-b-2 border-green-700 pb-0.5") : (isDarkMode ? "text-slate-300 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className={`absolute top-full left-0 right-0 shadow-lg border-t md:hidden z-40 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
            <div className="flex flex-col px-6 py-4 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-semibold py-2 rounded-lg ${
                    pathname === link.href ? "text-green-700" : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 py-2 text-left"
              >
                {isDarkMode ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </div>
        )}

        {/* Auth + Theme */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
            aria-label="Toggle theme"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
          {!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </>
          )}
        </div>

      </div>
    </nav>
  );
}