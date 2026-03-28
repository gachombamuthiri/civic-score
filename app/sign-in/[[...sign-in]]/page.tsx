import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <span className="text-green-950 font-black text-sm">CS</span>
            </div>
            <span className="text-2xl font-black text-white">
              Civic<span className="text-yellow-400">Score</span>
            </span>
          </div>
          <p className="text-green-200 text-sm">Choose your role to sign in</p>
        </div>

        {/* Role Selection */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4 text-center">I am a...</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/sign-in/citizen"
              className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all hover:scale-105"
            >
              👤 Citizen
              <p className="text-xs text-green-200 mt-1">Access my civic dashboard</p>
            </Link>
            <Link
              href="/sign-in/organization"
              className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all hover:scale-105"
            >
              🏢 Organization
              <p className="text-xs text-green-200 mt-1">Manage civic programs</p>
            </Link>
          </div>
        </div>

        {/* Alternative */}
        <div className="text-center">
          <p className="text-green-200 text-sm">
            New to CivicScore?{" "}
            <Link href="/sign-up" className="text-yellow-400 font-semibold hover:text-yellow-300">
              Sign up here
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
