'use client';

export default function TiersSection() {
  return (
    <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 px-6 md:px-12 lg:px-20 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-700 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-700 rounded-full opacity-20 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Rise Through the Tiers of Influence.
            </h2>

            <p className="text-lg text-green-100 leading-relaxed max-w-lg">
              From Buffalo to Lion, your civic consistency unlocks exclusive voting rights and heritage rewards.
            </p>

            {/* Tier Badge */}
            <div className="inline-block">
              <span className="inline-flex items-center px-6 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-full text-lg">
                ⭐ Lion Tier
              </span>
              <p className="text-green-100 text-sm mt-3">5,000+ Civicpoints</p>
            </div>
          </div>

          {/* Right Icon */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-72 h-72 rounded-3xl bg-green-700 bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
              <div className="relative">
                {/* Animated pulse effect */}
                <div className="absolute inset-0 bg-green-500 rounded-full opacity-25 animate-pulse" style={{ animation: 'pulse 3s infinite' }} />
                <div className="text-9xl">🛡️</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.25;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}
