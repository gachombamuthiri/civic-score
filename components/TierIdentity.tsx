"use client";

export default function TierIdentity() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto silk-green-gradient rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12" style={{ background: "linear-gradient(135deg, #004b24 0%, #006633 100%)" }}>
        {/* Left Content */}
        <div className="relative z-10 flex-1">
          <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-on-primary mb-6 leading-tight">
            Rise Through the <br />
            Tiers of Influence.
          </h2>
          <p className="text-primary-fixed text-lg mb-10 max-w-md">
            From Buffalo to Lion, your civic consistency unlocks exclusive voting rights and heritage rewards.
          </p>

          <div className="flex items-center gap-4">
            <div className="bg-secondary-container p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-on-secondary-container font-black">⭐</span>
                <span className="font-headline font-bold text-on-secondary-container">Lion Tier</span>
              </div>
              <p className="text-[10px] uppercase tracking-tighter text-on-secondary-container font-black">Top 1% Citizen</p>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative z-10 flex-1 flex justify-center">
          <div className="w-full max-w-sm aspect-square bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 flex items-center justify-center relative">
            <div className="w-3/4 h-3/4 bg-white/10 rounded-full animate-pulse"></div>
            <span className="text-white text-8xl absolute">🛡️</span>
          </div>
        </div>

        {/* Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-[100px]"></div>
      </div>
    </section>
  );
}
