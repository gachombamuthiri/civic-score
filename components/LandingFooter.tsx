'use client';

import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 mb-8">
          {/* Logo and Tagline */}
          <div>
            <div className="text-3xl font-bold text-gray-900">CivicScore</div>
            <div className="text-xs font-semibold text-gray-500 tracking-widest mt-1">THE MODERN HERITAGE</div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-700">
            <Link href="/legal/privacy">
              <span className="hover:text-green-700 transition font-medium text-sm">Privacy Policy</span>
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/legal/terms">
              <span className="hover:text-green-700 transition font-medium text-sm">Terms of Service</span>
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact">
              <span className="hover:text-green-700 transition font-medium text-sm">Contact Support</span>
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-gray-600 text-xs">
            © 2024 <span className="font-semibold">CivicScore Kenya</span>. Empowering community growth through civic participation.
          </p>
        </div>
      </div>
    </footer>
  );
}
