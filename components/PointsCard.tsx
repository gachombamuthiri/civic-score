'use client';

export default function PointsCard() {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-700/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
      
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Total Civic Points</p>
      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-black text-green-700 tracking-tight">1,250</span>
        <span className="text-green-700 font-bold">PTS</span>
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-green-700 font-bold text-sm">
        <span>📈</span>
        <span>+120 from last week</span>
      </div>
    </div>
  );
}
