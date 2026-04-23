'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { UserProfile } from '@/lib/firestore';

interface DashboardHeroProps {
  userProfile?: UserProfile | null;
}

export default function DashboardHero({ userProfile }: DashboardHeroProps) {
  const { user } = useUser();
  const displayName = userProfile?.fullName || user?.firstName || 'Citizen';

  return (
    <header className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-2">Citizen Portal</p>
          <h1 className="text-5xl font-black text-green-700 tracking-tight">Welcome back, {displayName}</h1>
          <p className="text-gray-600 mt-2 max-w-xl">Your total civic points: <span className="font-bold text-green-700">{userProfile?.totalPoints ?? 0}</span> • Current tier: <span className="font-bold text-emerald-700">{userProfile?.tier ?? 'Buffalo'}</span></p>
        </div>
        <div className="flex gap-4">
          <Link href="/activities" className="bg-green-700 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:bg-green-800 transition-all">
            Find Events
          </Link>
          <button className="bg-yellow-300 text-yellow-900 px-6 py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:bg-yellow-400 transition-all">
            Redeem Points
          </button>
        </div>
      </div>
    </header>
  );
}
