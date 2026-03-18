"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  getUserProfile,
  getUserActivities,
  createUserProfile,
  type UserProfile,
  type Activity,
} from "@/lib/firestore";

function getTier(points: number) {
  if (points >= 2000) return { label: "🏆 Elite", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", next: 0 };
  if (points >= 1000) return { label: "🥇 Gold", color: "text-orange-600", bg: "bg-orange-50 border-orange-200", next: 2000 };
  if (points >= 500)  return { label: "🥈 Silver", color: "text-gray-600", bg: "bg-gray-50 border-gray-200", next: 1000 };
  return { label: "🥉 Bronze", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", next: 500 };
}

const SAMPLE_REWARDS = [
  { id: 1, business: "Naivas Supermarket", offer: "5% off groceries", required: 500, logo: "🛒" },
  { id: 2, business: "Java House", offer: "Free coffee with meal", required: 800, logo: "☕" },
  { id: 3, business: "Uber Kenya", offer: "KSh 200 ride credit", required: 1000, logo: "🚗" },
];

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        let userProfile = await getUserProfile(user.id);
        if (!userProfile) {
          await createUserProfile(
            user.id,
            user.fullName ?? "Citizen",
            user.primaryEmailAddress?.emailAddress ?? ""
          );
          userProfile = await getUserProfile(user.id);
        }
        setProfile(userProfile);
        const userActivities = await getUserActivities(user.id);
        setActivities(userActivities);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) loadData();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  const totalPoints = profile?.totalPoints ?? 0;
  const redeemablePoints = profile?.redeemablePoints ?? 0;
  const tier = getTier(totalPoints);
  const progressPct = tier.next > 0 ? Math.min(Math.round((totalPoints / tier.next) * 100), 100) : 100;

  const thisMonth = activities
    .filter((a) => {
      if (!a.date) return false;
      const date = (a.date as { toDate?: () => Date }).toDate?.() ?? new Date(a.date as string);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, a) => sum + (a.verified ? a.points : 0), 0);

  return (
    <main className="min-h-screen bg-gray-50 pt-20">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-green-300 text-sm font-semibold mb-1">Welcome back 👋</p>
            <h1 className="text-3xl font-black text-white">{profile?.fullName ?? user?.fullName ?? "Citizen"}</h1>
            <p className="text-green-200 text-sm mt-1">{profile?.email ?? user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div className={`${tier.bg} border px-6 py-3 rounded-2xl text-center`}>
            <p className={`text-2xl font-black ${tier.color}`}>{tier.label}</p>
            <p className="text-xs text-gray-500 font-semibold">Current Tier</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Total Civic Points</p>
            <p className="text-5xl font-black text-gray-900">{totalPoints.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">All-time earned</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2">This Month</p>
            <p className="text-5xl font-black text-gray-900">{thisMonth.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">Verified this month</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">Redeemable</p>
            <p className="text-5xl font-black text-gray-900">{redeemablePoints.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">Available to redeem</p>
          </div>
        </div>

        {/* Progress Bar */}
        {tier.next > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold text-gray-700">Progress to next tier</p>
              <p className="text-sm font-bold text-green-700">{totalPoints} / {tier.next} pts</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">{tier.next - totalPoints} more points to reach next tier</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-black text-gray-900">Recent Activity</h2>
              <span className="text-xs text-green-700 font-semibold">View All →</span>
            </div>
            {activities.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-3xl mb-3">📝</p>
                <p className="text-sm font-semibold text-gray-600">No activities yet</p>
                <p className="text-xs text-gray-400 mt-1">Submit your first civic activity to earn points!</p>
                <Link href="/submit" className="inline-block mt-4 bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-800">
                  Submit Activity
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {activities.slice(0, 5).map((activity) => (
                  <li key={activity.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {activity.verified ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">⏳ Pending</span>
                        )}
                      </div>
                    </div>
                    <span className="text-green-700 font-black text-sm ml-4">+{activity.points}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rewards */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-black text-gray-900">Available Rewards</h2>
              <span className="text-xs text-green-700 font-semibold">Browse All →</span>
            </div>
            <ul className="divide-y divide-gray-50">
              {SAMPLE_REWARDS.map((reward) => {
                const canRedeem = redeemablePoints >= reward.required;
                return (
                  <li key={reward.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="text-3xl">{reward.logo}</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{reward.business}</p>
                      <p className="text-xs text-gray-500">{reward.offer}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{reward.required} pts required</p>
                    </div>
                    <button
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg ${canRedeem ? "bg-green-700 text-white hover:bg-green-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                      disabled={!canRedeem}
                    >
                      {canRedeem ? "Redeem" : "Locked"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Submit Activity", emoji: "📝", href: "/submit" },
              { label: "View Leaderboard", emoji: "🏆", href: "/leaderboard" },
              { label: "Find Rewards", emoji: "🎁", href: "/rewards" },
              { label: "My Profile", emoji: "👤", href: "/profile" },
            ].map((action) => (
              <Link key={action.label} href={action.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all text-center">
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-xs font-semibold text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
