"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RoleSelectPage() {
  const { user, isLoaded } = useUser();
  const { userMemberships, isLoaded: membershipsLoaded } = useOrganizationList();
  const router = useRouter();
  const [selected, setSelected] = useState<"citizen" | "organization" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect role on page load
  useEffect(() => {
    if (!isLoaded || !membershipsLoaded || !user) return;

    // Priority 1: Check if user has Clerk organization membership
    const hasMembership = userMemberships && (userMemberships as any).data?.length > 0;
    if (hasMembership) {
      console.log("User has Clerk organization membership - setting as organization");
      setSelected("organization");
      return;
    }

    // Priority 2: Check localStorage (from sign-up page)
    const storedRole = localStorage.getItem("selectedRole");
    if (storedRole === "citizen" || storedRole === "organization") {
      console.log("Found stored role in localStorage:", storedRole);
      setSelected(storedRole);
      localStorage.removeItem("selectedRole");
      return;
    }

    // Priority 3: Check existing Firestore profile
    const checkExistingProfile = async () => {
      try {
        const docRef = doc(db, "users", user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const role = docSnap.data().role;
          console.log("Found existing Firestore role:", role);
          setSelected(role as "citizen" | "organization");
          return;
        }
      } catch (err) {
        console.error("Error checking existing profile:", err);
      }
    };

    checkExistingProfile();
  }, [isLoaded, membershipsLoaded, user, userMemberships]);

  async function handleContinue() {
    if (!user || !selected) return;

    setLoading(true);
    setError(null);

    console.log("Saving role:", selected, "for user:", user.id);

    try {
      // Write to Firestore with the selected role
      const userRef = doc(db, "users", user.id);
      await setDoc(userRef, {
        clerkId: user.id,
        fullName: user.fullName ?? "User",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        role: selected,          // ← This MUST be the selected value
        totalPoints: 0,
        redeemablePoints: 0,
        tier: "Buffalo",
        createdAt: serverTimestamp(),
      }, { merge: true }); // Use merge to avoid overwriting other fields

      console.log("Profile saved successfully with role:", selected);

      // Redirect based on role - this is the critical redirect
      if (selected === "organization") {
        console.log("Redirecting to /organization");
        router.push("/organization");
      } else {
        console.log("Redirecting to /dashboard");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save your profile. Please try again.");
      setLoading(false);
    }
  }

  // Auto-continue if role was detected/selected
  useEffect(() => {
    if (selected && isLoaded && membershipsLoaded && !loading) {
      console.log("Auto-continuing with role:", selected);
      handleContinue();
    }
  }, [selected]); // Only trigger when selected changes

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <span className="text-green-950 font-black text-sm">CS</span>
            </div>
            <span className="text-2xl font-black text-white">
              Civic<span className="text-yellow-400">Score</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Welcome, {user?.firstName ?? "there"}! 🇰🇪
          </h1>
          <p className="text-green-200 text-sm">
            How will you be using CivicScore? Choose your account type.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">

          {/* Citizen */}
          <button
            onClick={() => setSelected("citizen")}
            className={`text-left p-8 rounded-2xl border-2 transition-all ${
              selected === "citizen"
                ? "border-yellow-400 bg-white/10 scale-105"
                : "border-white/20 bg-white/5 hover:border-white/40"
            }`}
          >
            <div className="text-5xl mb-4">🧑</div>
            <h2 className="text-xl font-black text-white mb-1">Citizen</h2>
            <p className="text-sm text-green-200 mb-4">
              Participate in civic activities, earn points, and redeem rewards.
            </p>
            <ul className="space-y-1">
              {["Browse & enroll in activities", "Earn civic points", "Redeem rewards"].map((item) => (
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

          {/* Organization */}
          <button
            onClick={() => setSelected("organization")}
            className={`text-left p-8 rounded-2xl border-2 transition-all ${
              selected === "organization"
                ? "border-yellow-400 bg-white/10 scale-105"
                : "border-white/20 bg-white/5 hover:border-white/40"
            }`}
          >
            <div className="text-5xl mb-4">🏛️</div>
            <h2 className="text-xl font-black text-white mb-1">Organization</h2>
            <p className="text-sm text-green-200 mb-4">
              Create civic events, manage enrollments, and mark attendance.
            </p>
            <ul className="space-y-1">
              {["Create civic activities", "Manage enrollments", "Mark attendance & award points"].map((item) => (
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

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-400 text-red-200 text-sm px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full font-black py-4 rounded-xl text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: selected ? "#fbbf24" : "rgba(255,255,255,0.1)",
            color: selected ? "#064e3b" : "rgba(255,255,255,0.3)",
          }}
        >
          {loading
            ? "Setting up your account..."
            : selected
            ? `Continue as ${selected === "citizen" ? "Citizen 🧑" : "Organization 🏛️"} →`
            : "Select an account type to continue"}
        </button>

        {/* Debug info - remove after testing */}
        {selected && (
          <p className="text-center text-green-300 text-xs mt-3">
            Selected: <strong>{selected}</strong>
          </p>
        )}

      </div>
    </main>
  );
}