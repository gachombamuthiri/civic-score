"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Hero() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative pt-32 pb-20 px-8 overflow-hidden min-h-screen flex items-center" style={{ background: "linear-gradient(to bottom right, #004b24, #006633)" }}>
      {/* Dotted Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
      
      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Content */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container rounded-full mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-secondary-container">Kenya's Premier Civic Network</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] text-primary mb-8 tracking-tighter font-headline">
            Your Civic Action, <br />
            <span className="text-secondary italic">Rewarding</span> History.
          </h1>

          <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            Join the movement of purposeful Kenyans. Build your civic reputation, earn exclusive rewards, and shape the future of our communities through verified participation.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-[#0a9d52] text-white font-bold rounded-xl shadow-xl hover:translate-y-[-2px] transition-all duration-300">
              Join us!
            </button>
            <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl border-b-2 border-primary-fixed hover:bg-surface-container-low transition-all">
              Explore Activities
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%2384d999'/%3E%3C/svg%3E" alt="user" />
              <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%230f6d39'/%3E%3C/svg%3E" alt="user" />
              <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%236f7a6f'/%3E%3C/svg%3E" alt="user" />
            </div>
            <p className="text-sm font-medium text-on-surface-variant">
              Joined by <span className="text-primary font-bold">12,000+</span> active citizens this month
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:col-span-5 relative">
          <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 group">
            <img className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-700" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect fill='%23004b24' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='48' fill='white' font-weight='bold'%3ECivic Action%3C/text%3E%3C/svg%3E" alt="Civic volunteers" />
            
            {/* Bottom Card */}
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">Latest Milestone</span>
                <span className="text-xs font-bold text-emerald-700">+250 Points</span>
              </div>
              <p className="font-headline font-bold text-primary">Karura Forest Restoration</p>
            </div>
          </div>

          {/* Abstract decorations */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
