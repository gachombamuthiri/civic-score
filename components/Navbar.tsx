"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "My Dashboard" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">CS</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">
            Civic<span className="text-green-700">Score</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? "text-green-700 border-b-2 border-green-700 pb-0.5"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </nav>
  );
}
