'use client';

export default function AuthBrandingPanel() {
  return (
    <div className="lg:col-span-5 relative hidden lg:flex overflow-hidden bg-green-700 min-h-[600px] flex-col justify-end p-12 space-y-6">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-700 to-transparent opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Tagline */}
        <div className="space-y-3">
          <span className="text-yellow-300 font-bold text-sm uppercase tracking-[0.2em] block">The Modern Heritage</span>
          <h1 className="text-white font-black text-5xl leading-tight">
            Empowering Kenyan Civic Action.
          </h1>
        </div>

        {/* Description */}
        <p className="text-green-100 text-lg font-light leading-relaxed max-w-sm">
          Join the premier platform for community engagement and administrative excellence. Track your impact, earn rewards, and build the nation.
        </p>

        {/* Stats */}
        <div className="flex gap-4 pt-4">
          <div className="flex flex-col">
            <span className="text-white font-black text-2xl">47</span>
            <span className="text-green-100 text-xs uppercase tracking-tight">Counties Active</span>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-white font-black text-2xl">12k+</span>
            <span className="text-green-100 text-xs uppercase tracking-tight">Verified Events</span>
          </div>
        </div>
      </div>
    </div>
  );
}
