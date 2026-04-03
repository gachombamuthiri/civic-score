'use client';

import CivicScoreLogo from './CivicScoreLogo';

export default function AuthHeader() {
  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-8 py-5 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <CivicScoreLogo href="/" />
      <div className="flex items-center gap-4">
        <span className="text-yellow-600 font-bold text-xs uppercase tracking-widest letter-spacing-wide">Authentication</span>
      </div>
    </header>
  );
}
