'use client';

export default function AuthFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 px-8 py-6 md:py-8 text-center text-xs md:text-sm text-gray-600">
      <p className="mb-3">
        <span className="font-black text-green-700">THE MODERN HERITAGE</span>
      </p>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mb-4">
        <a href="/privacy" className="text-green-700 hover:underline font-medium">
          Privacy Policy
        </a>
        <span className="hidden md:inline text-gray-300">•</span>
        <a href="/terms" className="text-green-700 hover:underline font-medium">
          Terms of Service
        </a>
        <span className="hidden md:inline text-gray-300">•</span>
        <a href="/contact" className="text-green-700 hover:underline font-medium">
          Contact Us
        </a>
      </div>
      <p className="text-gray-500">
        © 2024 CivicScore Kenya. Empowering community growth through civic participation.
      </p>
    </footer>
  );
}
