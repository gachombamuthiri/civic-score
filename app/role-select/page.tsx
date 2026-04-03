"use client";

import { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import LandingFooter from "@/components/LandingFooter";
import CivicScoreLogo from "@/components/CivicScoreLogo";
import { createUserProfile } from "@/lib/firestore";
import type { UserRole } from "@/lib/firestore";

function RoleSelectContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if role is pre-selected from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("selectedRole");
    if (storedRole === 'citizen' || storedRole === 'organization') {
      setSelected(storedRole);
      // Clear the stored role after using it
      localStorage.removeItem("selectedRole");
    }
  }, []);

  async function handleContinue() {
    if (!user || !selected) return;
    setLoading(true);
    try {
      await createUserProfile(
        user.id,
        user.fullName ?? "User",
        user.primaryEmailAddress?.emailAddress ?? "",
        selected
      );
      // Redirect based on role
      if (selected === "citizen") {
        router.push("/dashboard");
      } else {
        router.push("/organization");
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  // Auto-continue if role is pre-selected
  useEffect(() => {
    if (selected && user && isLoaded) {
      handleContinue();
    }
  }, [selected, user, isLoaded]);

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <CivicScoreLogo href="/" dark={true} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Welcome, {user?.firstName ?? "there"}! 👋
          </h1>
          <p className="text-green-200 text-sm">
            How will you be using CivicScore? Choose your account type to get started.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">

          {/* Citizen Card */}
          <button
            onClick={() => setSelected("citizen")}
            className={`text-left p-8 rounded-2xl border-2 transition-all ${
              selected === "citizen"
                ? "border-yellow-400 bg-white/10 scale-105 shadow-xl shadow-black/20"
                : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
            }`}
          >
            <div className="text-5xl mb-4">🧑</div>
            <h2 className="text-xl font-black text-white mb-2">Citizen</h2>
            <p className="text-green-200 text-sm leading-relaxed mb-4">
              Participate in civic activities, earn points, and redeem rewards from partner businesses.
            </p>
            <ul className="space-y-2">
              {[
                "Browse & enroll in activities",
                "Earn civic points",
                "Redeem rewards & discounts",
                "Track your civic score",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-green-100">
                  <span className="text-yellow-400">✓</span> {item}
                </li>
              ))}
            </ul>
            {selected === "citizen" && (
              <div className="mt-4 bg-yellow-400 text-green-950 text-xs font-black px-3 py-1.5 rounded-full inline-block">
                ✓ Selected
              </div>
            )}
          </button>

          {/* Organization Card */}
          <button
            onClick={() => setSelected("organization")}
            className={`text-left p-8 rounded-2xl border-2 transition-all ${
              selected === "organization"
                ? "border-yellow-400 bg-white/10 scale-105 shadow-xl shadow-black/20"
                : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
            }`}
          >
            <div className="text-5xl mb-4">🏛️</div>
            <h2 className="text-xl font-black text-white mb-2">Organization</h2>
            <p className="text-green-200 text-sm leading-relaxed mb-4">
              Create civic events, manage citizen enrollment, and mark attendance to award points.
            </p>
            <ul className="space-y-2">
              {[
                "Create civic activities",
                "Manage citizen enrollments",
                "Mark attendance & award points",
                "Track participation stats",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-green-100">
                  <span className="text-yellow-400">✓</span> {item}
                </li>
              ))}
            </ul>
            {selected === "organization" && (
              <div className="mt-4 bg-yellow-400 text-green-950 text-xs font-black px-3 py-1.5 rounded-full inline-block">
                ✓ Selected
              </div>
            )}
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full bg-yellow-400 text-green-950 font-black py-4 rounded-xl text-base hover:bg-yellow-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading
            ? "Setting up your account..."
            : selected
            ? `Continue as ${selected === "citizen" ? "Citizen 🧑" : "Organization 🏛️"} →`
            : "Select an account type to continue"}
        </button>

      </div>
      <LandingFooter />
    </main>
  );
}

export default function RoleSelectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <RoleSelectContent />
    </Suspense>
  );
}