'use client';

import Link from 'next/link';

interface CivicScoreLogoProps {
  href?: string;
  showLabel?: boolean;
  dark?: boolean;
}

export default function CivicScoreLogo({ href = '/', showLabel = true, dark = false }: CivicScoreLogoProps) {
  const content = (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow ${
        dark 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' 
          : 'bg-gradient-to-br from-green-700 to-green-800'
      }`}>
        <span className={`text-lg font-black ${dark ? 'text-green-950' : 'text-white'}`}>CS</span>
      </div>
      {showLabel && (
        <div className="flex flex-col leading-tight">
          <span className={`text-xl font-black ${dark ? 'text-white' : 'text-green-700'}`}>Civic</span>
          <span className={`text-xs font-bold ${dark ? 'text-yellow-300' : 'text-yellow-600'}`}>SCORE</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
