'use client';

import Link from 'next/link';
import CivicScoreLogo from './CivicScoreLogo';

interface AuthRoleSelectorProps {
  variant: 'signin' | 'signup';
}

export default function AuthRoleSelector({ variant }: AuthRoleSelectorProps) {
  const signinOrUp = variant === 'signin' ? 'Sign In' : 'Sign Up';
  const baseRoute = variant === 'signin' ? '/sign-in' : '/sign-up';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 z-50 flex items-center justify-between">
        <CivicScoreLogo href="/" />
        <span className="text-yellow-600 font-bold text-xs uppercase tracking-widest">Authentication</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <h1 className="text-green-700 font-black text-4xl mb-3">Choose Your Role</h1>
            <p className="text-gray-600">Select how you want to {signinOrUp.toLowerCase()}</p>
          </div>

          <div className="space-y-4">
            {/* Citizen Option */}
            <Link
              href={`${baseRoute}/citizen`}
              className="block group bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-700 p-8 rounded-2xl transition-all hover:shadow-lg hover:scale-105"
            >
              <div className="text-5xl mb-3">🧑</div>
              <h2 className="text-green-700 font-black text-xl mb-2">I am a Citizen</h2>
              <p className="text-green-600 text-sm mb-4">
                Earn points for civic activities, access the leaderboard, and redeem rewards.
              </p>
              <div className="text-green-700 font-bold group-hover:translate-x-2 transition-transform">
                Continue →
              </div>
            </Link>

            {/* Organization Option */}
            <Link
              href={`${baseRoute}/organization`}
              className="block group bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 hover:border-yellow-600 p-8 rounded-2xl transition-all hover:shadow-lg hover:scale-105"
            >
              <div className="text-5xl mb-3">🏛️</div>
              <h2 className="text-yellow-700 font-black text-xl mb-2">I represent an Organization</h2>
              <p className="text-yellow-600 text-sm mb-4">
                Create and manage civic activities, verify participant contributions, and build community impact.
              </p>
              <div className="text-yellow-700 font-bold group-hover:translate-x-2 transition-transform">
                Continue →
              </div>
            </Link>
          </div>

          {/* Footer Link */}
          <div className="text-center pt-8 border-t border-gray-200 mt-8">
            <p className="text-gray-600 text-sm">
              {variant === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <Link href="/sign-up" className="text-yellow-600 font-bold hover:underline">
                    Sign up here
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link href="/sign-in" className="text-yellow-600 font-bold hover:underline">
                    Sign in here
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-8 py-6 text-center text-xs text-gray-600">
        <p className="mb-2">
          <span className="font-black text-green-700">THE MODERN HERITAGE</span>
        </p>
        <p>© 2024 CivicScore Kenya. Empowering community growth through civic participation.</p>
      </footer>
    </div>
  );
}
