'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

export default function LandingHero() {
  const { user, isLoaded } = useUser();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Featured Insight Badge */}
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                ★ FEATURED INSIGHT
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Your Civic Action,
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-yellow-600">Rewarding</span>
                <span className="text-gray-900"> History.</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
              Join the movement of purposeful Kenyans. Build your civic reputation, earn exclusive rewards, and shape the future of our communities through verified participation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {!isLoaded ? (
                <>
                  <button className="px-8 py-3 bg-green-700 text-white font-semibold rounded hover:bg-green-800 transition">
                    Join us!
                  </button>
                  <button className="px-8 py-3 border-2 border-gray-400 text-gray-700 font-semibold rounded hover:border-gray-500 transition">
                    Explore Activities
                  </button>
                </>
              ) : user ? (
                <>
                  <Link href="/dashboard">
                    <button className="px-8 py-3 bg-green-700 text-white font-semibold rounded hover:bg-green-800 transition">
                      Join Us!
                    </button>
                  </Link>
                  <Link href="/activities">
                    <button className="px-8 py-3 border-2 border-gray-400 text-gray-700 font-semibold rounded hover:border-gray-500 transition">
                      Explore Activities
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-up">
                    <button className="px-8 py-3 bg-green-700 text-white font-semibold rounded hover:bg-green-800 transition">
                      Join us!
                    </button>
                  </Link>
                  <Link href="/activities">
                    <button className="px-8 py-3 border-2 border-gray-400 text-gray-700 font-semibold rounded hover:border-gray-500 transition">
                      Explore Activities
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-8 border-t border-gray-300">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white" />
              </div>
              <p className="text-gray-700 font-medium">
                Joined by <span className="font-bold text-gray-900">12,000+</span> active citizens <span className="text-gray-500">this month</span>
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative h-96 md:h-full min-h-96 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/karura.png"
                alt="Civic Action Community"
                fill
                className="object-cover"
                priority
              />
              
              {/* Activity Card Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4 shadow-lg">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">LATEST MILESTONE</p>
                  <h3 className="font-bold text-gray-900">Karura Forest Restoration</h3>
                  <p className="text-sm text-green-700 font-semibold">+ 250 Points</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
