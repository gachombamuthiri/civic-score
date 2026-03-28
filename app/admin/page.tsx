"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getAllUsers, getAllEvents, updateUserPoints, resetUserPoints, getTierFromPoints, type UserProfile, type CivicEvent } from "@/lib/firestore";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [newPoints, setNewPoints] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // Filter users based on search query
  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Point management functions
  const handleResetPoints = async (user: UserProfile) => {
    if (!confirm(`Are you sure you want to reset all points for ${user.fullName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await resetUserPoints(user.clerkId);
      setUsers((prev) =>
        prev.map((u) =>
          u.clerkId === user.clerkId
            ? { ...u, totalPoints: 0, redeemablePoints: 0, tier: "Bronze" }
            : u
        )
      );
      setMessage({ type: "success", text: `Points reset for ${user.fullName}` });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to reset points" });
      console.error(error);
    }
  };

  const handleUpdatePoints = async () => {
    if (!selectedUser || !newPoints) return;

    const points = parseInt(newPoints);
    if (isNaN(points) || points < 0) {
      setMessage({ type: "error", text: "Please enter a valid number of points" });
      return;
    }

    try {
      await updateUserPoints(selectedUser.clerkId, points);
      setUsers((prev) =>
        prev.map((u) =>
          u.clerkId === selectedUser.clerkId
            ? { ...u, totalPoints: points, redeemablePoints: points, tier: getTierFromPoints(points) }
            : u
        )
      );
      setMessage({ type: "success", text: `Points updated for ${selectedUser.fullName}` });
      setShowPointModal(false);
      setSelectedUser(null);
      setNewPoints("");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update points" });
      console.error(error);
    }
  };

  const openPointModal = (user: UserProfile) => {
    setSelectedUser(user);
    setNewPoints(user.totalPoints?.toString() || "0");
    setShowPointModal(true);
  };

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
                {filteredUsers.slice(0, 5).map((u) => (
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
          <div>
            {/* Message */}
            {message && (
              <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                <span>{message.type === "success" ? "✅" : "❌"} {message.text}</span>
                <button
                  onClick={() => setMessage(null)}
                  className="text-gray-400 hover:text-gray-600 ml-4"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-gray-900">All Users ({filteredUsers.length})</h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div className="px-6 py-3 bg-gray-50 grid grid-cols-6 gap-4">
                <span className="text-xs font-bold text-gray-500 uppercase col-span-2">User</span>
                <span className="text-xs font-bold text-gray-500 uppercase">Role</span>
                <span className="text-xs font-bold text-gray-500 uppercase">Tier</span>
                <span className="text-xs font-bold text-gray-500 uppercase">Points</span>
                <span className="text-xs font-bold text-gray-500 uppercase">Actions</span>
              </div>

              <ul className="divide-y divide-gray-50">
                {filteredUsers.map((u) => (
                  <li key={u.clerkId} className="px-6 py-4 grid grid-cols-6 gap-4 items-center hover:bg-gray-50">
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => openPointModal(u)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-bold hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleResetPoints(u)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold hover:bg-red-700"
                      >
                        Reset
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {filteredUsers.length === 0 && searchQuery && (
                <div className="px-6 py-10 text-center">
                  <p className="text-3xl mb-3">🔍</p>
                  <p className="text-sm font-semibold text-gray-600">No users found matching "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-green-700 font-semibold mt-2 hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            {/* Point Edit Modal */}
            {showPointModal && selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                  <h3 className="font-black text-gray-900 mb-4">Edit Points for {selectedUser.fullName}</h3>
                  <div className="mb-4">
                    <label className="text-sm font-bold text-gray-600 mb-2 block">New Total Points</label>
                    <input
                      type="number"
                      value={newPoints}
                      onChange={(e) => setNewPoints(e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter points"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdatePoints}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
                    >
                      Update Points
                    </button>
                    <button
                      onClick={() => {
                        setShowPointModal(false);
                        setSelectedUser(null);
                        setNewPoints("");
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
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