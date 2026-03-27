"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getAllUsers, getAllEvents, type UserProfile, type CivicEvent } from "@/lib/firestore";

// ⚠️ Only this Clerk ID can access the admin panel
const ADMIN_ID = "user_3BB7zaNahq3K5B0GLT7uaNTS9HK";

type Tab = "overview" | "users" | "events";

export default function AdminPanel() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;

      // Block non-admins
      if (user.id !== ADMIN_ID) {
        router.push("/dashboard");
        return;
      }

      try {
        const [allUsers, allEvents] = await Promise.all([
          getAllUsers(),
          getAllEvents(),
        ]);
        setUsers(allUsers);
        setEvents(allEvents);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) load();
  }, [user, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading admin panel...</p>
        </div>
      </main>
    );
  }

  // Stats
  const totalCitizens = users.filter((u) => u.role === "citizen").length;
  const totalOrganizations = users.filter((u) => u.role === "organization").length;
  const totalPointsAwarded = users.reduce((sum, u) => sum + (u.totalPoints ?? 0), 0);
  const totalEvents = events.length;

  return (
    <main className="min-h-screen bg-gray-50 pt-20">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full">
              ADMIN
            </span>
            <p className="text-gray-300 text-sm font-semibold">Restricted Access</p>
          </div>
          <h1 className="text-3xl font-black text-white">CivicScore Admin Panel</h1>
          <p className="text-gray-300 text-sm mt-1">Full system overview and management</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["overview", "users", "events"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-colors ${
                tab === t
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {t === "overview" ? "📊 Overview" : t === "users" ? "👥 Users" : "📋 Events"}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-8">

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: "Total Citizens", value: totalCitizens, emoji: "🧑", color: "text-green-700" },
                { label: "Organizations", value: totalOrganizations, emoji: "🏛️", color: "text-blue-700" },
                { label: "Total Events", value: totalEvents, emoji: "📋", color: "text-yellow-700" },
                { label: "Points Awarded", value: totalPointsAwarded.toLocaleString(), emoji: "⭐", color: "text-orange-700" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <p className="text-2xl mb-2">{stat.emoji}</p>
                  <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-400 font-semibold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-black text-gray-900">Recent Users</h2>
                <button onClick={() => setTab("users")} className="text-xs text-green-700 font-semibold">View All →</button>
              </div>
              <ul className="divide-y divide-gray-50">
                {users.slice(0, 5).map((u) => (
                  <li key={u.clerkId} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-black text-xs">{u.fullName?.charAt(0) ?? "?"}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{u.fullName}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        u.role === "organization"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {u.role === "organization" ? "🏛️ Org" : "🧑 Citizen"}
                      </span>
                      <span className="text-sm font-black text-gray-700">{u.totalPoints} pts</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-black text-gray-900">Recent Events</h2>
                <button onClick={() => setTab("events")} className="text-xs text-green-700 font-semibold">View All →</button>
              </div>
              <ul className="divide-y divide-gray-50">
                {events.slice(0, 5).map((e) => (
                  <li key={e.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{e.title}</p>
                      <p className="text-xs text-gray-400">{e.organizationName} · {e.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{e.category}</span>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">+{e.points} pts</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── ALL USERS ── */}
        {tab === "users" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">All Users ({users.length})</h2>
            </div>
            {/* Table Header */}
            <div className="px-6 py-3 bg-gray-50 grid grid-cols-5 gap-4">
              <span className="text-xs font-bold text-gray-500 uppercase col-span-2">User</span>
              <span className="text-xs font-bold text-gray-500 uppercase">Role</span>
              <span className="text-xs font-bold text-gray-500 uppercase">Tier</span>
              <span className="text-xs font-bold text-gray-500 uppercase">Points</span>
            </div>
            <ul className="divide-y divide-gray-50">
              {users.map((u) => (
                <li key={u.clerkId} className="px-6 py-4 grid grid-cols-5 gap-4 items-center hover:bg-gray-50">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-black text-xs">{u.fullName?.charAt(0) ?? "?"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{u.fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${
                    u.role === "organization"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {u.role === "organization" ? "🏛️ Org" : "🧑 Citizen"}
                  </span>
                  <span className="text-xs font-bold text-gray-600">{u.tier ?? "Bronze"}</span>
                  <span className="text-sm font-black text-gray-900">{(u.totalPoints ?? 0).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── ALL EVENTS ── */}
        {tab === "events" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">All Events ({events.length})</h2>
            </div>
            {events.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-sm font-semibold text-gray-600">No events created yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {events.map((e) => (
                  <li key={e.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-gray-900">{e.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{e.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{e.category}</span>
                          <span className="text-xs text-gray-400">📅 {e.date}</span>
                          <span className="text-xs text-gray-400">📍 {e.location}</span>
                        </div>
                        <p className="text-xs text-blue-600 font-semibold mt-1">🏛️ {e.organizationName}</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-black whitespace-nowrap">
                        +{e.points} pts
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </main>
  );
}