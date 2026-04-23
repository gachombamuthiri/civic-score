'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CivicScoreLogoProps {
  href?: string;
  showLabel?: boolean;
  dark?: boolean;
  height?: number;
}

export default function CivicScoreLogo({ href = '/', showLabel = false, dark = false, height = 50 }: CivicScoreLogoProps) {
  const content = (
    <div className="flex items-center gap-2">
      <Image
        src="/civic-score-logo.jpg.png"
        alt="CivicScore Logo"
        width={height}
        height={height}
        className="h-auto"
        priority
      />
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
