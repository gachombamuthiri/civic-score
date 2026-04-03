'use client';

export default function ActivitiesHero() {
  return (
    <header className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Left Section */}
        <div className="max-w-2xl">
          <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-2 block">Civic Engagement</span>
          <h1 className="text-5xl font-extrabold text-green-700 tracking-tight mb-4 leading-tight">
            The Modern Heritage: Activities Feed
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Shape the future of Kenya through active participation. Every activity earns you points toward prestigious civic tiers.
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-yellow-300 px-6 py-4 rounded-xl shadow-lg border-b-4 border-yellow-400 flex-shrink-0">
          <span className="block text-yellow-900 font-bold text-xs uppercase tracking-wider mb-2">Your Score</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-yellow-900">1,420</span>
            <span className="text-2xl">⭐</span>
          </div>
        </div>
      </div>
    </header>
  );
}
