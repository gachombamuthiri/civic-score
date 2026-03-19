"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllUsers, type UserProfile } from "@/lib/firestore";

function getTierBadge(points: number) {
  if (points >= 2000) return { label: "🏆 Elite", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" };
  if (points >= 1000) return { label: "🥇 Gold", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" };
  if (points >= 500)  return { label: "🥈 Silver", color: "text-gray-600", bg: "bg-gray-100 border-gray-200" };
  return { label: "🥉 Bronze", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" };
}

function getRankMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default function LeaderboardPage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allUsers = await getAllUsers();
        // Sort by totalPoints descending
        const sorted = allUsers.sort((a, b) => b.totalPoints - a.totalPoints);
        setUsers(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) load();
  }, [isLoaded]);

  // Find current user's rank
  const myRank = users.findIndex((u) => u.clerkId === user?.id) + 1;
  const myProfile = users.find((u) => u.clerkId === user?.id);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading leaderboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 px-6 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-green-300 text-sm font-semibold mb-1">Top Citizens</p>
          <h1 className="text-3xl font-black text-white">🏆 CivicScore Leaderboard</h1>
          <p className="text-green-200 text-sm mt-1">
            Kenyans ranked by civic contribution and positive impact
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* My Rank Card */}
        {myProfile && (
          <div className="bg-green-700 text-white rounded-2xl p-5 mb-8 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-green-200 text-xs font-semibold mb-1">Your Position</p>
              <p className="text-2xl font-black">{getRankMedal(myRank)} {myRank > 3 ? "" : ""} Rank #{myRank}</p>
              <p className="text-green-200 text-sm mt-1">{myProfile.fullName}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black">{myProfile.totalPoints.toLocaleString()}</p>
              <p className="text-green-200 text-xs font-semibold">Total Points</p>
              <p className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block bg-white/20`}>
                {getTierBadge(myProfile.totalPoints).label}
              </p>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        {users.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-lg font-bold text-gray-700">No citizens yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Be the first to earn civic points and top the leaderboard!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-0 border-b border-gray-100">
              {users.slice(0, 3).map((u, i) => {
                const tier = getTierBadge(u.totalPoints);
                const isMe = u.clerkId === user?.id;
                const medals = ["🥇", "🥈", "🥉"];
                const bgColors = ["bg-yellow-50", "bg-gray-50", "bg-orange-50"];
                return (
                  <div
                    key={u.clerkId}
                    className={`${bgColors[i]} ${isMe ? "ring-2 ring-green-500 ring-inset" : ""} p-6 text-center border-r border-gray-100 last:border-r-0`}
                  >
                    <p className="text-3xl mb-2">{medals[i]}</p>
                    <p className="text-sm font-black text-gray-900 truncate">{u.fullName}</p>
                    <p className={`text-xs font-bold ${tier.color} mt-1`}>{tier.label}</p>
                    <p className="text-xl font-black text-gray-900 mt-2">{u.totalPoints.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">points</p>
                    {isMe && <p className="text-xs text-green-600 font-bold mt-1">← You</p>}
                  </div>
                );
              })}
            </div>

            {/* Rest of leaderboard */}
            {users.length > 3 && (
              <ul className="divide-y divide-gray-50">
                {users.slice(3).map((u, i) => {
                  const rank = i + 4;
                  const tier = getTierBadge(u.totalPoints);
                  const isMe = u.clerkId === user?.id;
                  return (
                    <li
                      key={u.clerkId}
                      className={`px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                        isMe ? "bg-green-50 border-l-4 border-green-500" : ""
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-8 text-center">
                        <span className="text-sm font-black text-gray-400">#{rank}</span>
                      </div>

                      {/* Avatar */}
                      <div className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-black text-sm">
                          {u.fullName?.charAt(0).toUpperCase() ?? "?"}
                        </span>
                      </div>

                      {/* Name & Tier */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {u.fullName} {isMe && <span className="text-green-600 text-xs">(You)</span>}
                        </p>
                        <span className={`text-xs font-semibold ${tier.color}`}>{tier.label}</span>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900">{u.totalPoints.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
