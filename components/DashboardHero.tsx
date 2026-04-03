'use client';

import { useUser } from '@clerk/nextjs';

export default function DashboardHero() {
  const { user } = useUser();
  const userName = user?.firstName || 'Citizen';

  return (
    <header className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-2">Citizen Portal</p>
          <h1 className="text-5xl font-black text-green-700 tracking-tight">Welcome back, {userName}</h1>
          <p className="text-gray-600 mt-2 max-w-xl">Your contribution to the community this month has increased by 15%. Keep up the civic spirit!</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-green-700 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:bg-green-800 transition-all">
            Find Events
          </button>
          <button className="bg-yellow-300 text-yellow-900 px-6 py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:bg-yellow-400 transition-all">
            Redeem Points
          </button>
        </div>
      </div>
    </header>
  );
}
