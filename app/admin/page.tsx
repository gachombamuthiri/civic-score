"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { 
  getAllUsers, 
  getAllEvents, 
  updateUserPoints, 
  resetUserPoints, 
  getTierFromPoints, 
  getAllOrganizations,
  updateOrganizationStatus,
  updateEventStatus,
  getSystemStats,
  type UserProfile, 
  type CivicEvent,
  type OrganizationProfile
} from "@/lib/firestore";

// ⚠️ Only this Clerk ID can access the admin panel
const ADMIN_ID = "user_3BB7zaNahq3K5B0GLT7uaNTS9HK";

type Tab = "overview" | "users" | "organizations" | "events" | "system";

export default function AdminPanel() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationProfile[]>([]);
  const [stats, setStats] = useState<any>(null);
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
        const [allUsers, allEvents, allOrgs, systemStats] = await Promise.all([
          getAllUsers(),
          getAllEvents(),
          getAllOrganizations(),
          getSystemStats()
        ]);
        setUsers(allUsers);
        setEvents(allEvents);
        setOrganizations(allOrgs);
        setStats(systemStats);
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
            ? { ...u, totalPoints: 0, redeemablePoints: 0, tier: "Buffalo" }
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

  const handleOrgStatus = async (orgId: string, status: "verified" | "suspended") => {
    try {
      await updateOrganizationStatus(orgId, status);
      setOrganizations(prev => prev.map(o => o.clerkId === orgId ? { ...o, status } : o));
      setMessage({ type: "success", text: `Organization status updated to ${status}` });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update organization status" });
    }
  };

  const handleEventStatus = async (eventId: string, status: "active" | "flagged" | "cancelled") => {
    try {
      await updateEventStatus(eventId, status);
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status } : e));
      setMessage({ type: "success", text: `Event status updated to ${status}` });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update event status" });
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
          <div className="w-12 h-12 border-4 border-[#087B90] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading admin panel...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#087B90] to-[#0a8fa3] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#303031] text-white text-xs font-black px-3 py-1 rounded-full">
              ADMIN AUTHORITY
            </span>
            <p className="text-white/80 text-sm font-semibold">System Governance</p>
          </div>
          <h1 className="text-3xl font-black text-white">CivicScore Command Center</h1>
          <p className="text-white/70 text-sm mt-1">Manage users, verify organizations, and moderate civic activities.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "users", "organizations", "events", "system"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-colors ${
                tab === t
                  ? "bg-[#303031] text-white"
                  : "bg-white text-[#303031] border border-gray-200 hover:border-[#087B90]"
              }`}
            >
              {t === "overview" ? "📊 Overview" : 
               t === "users" ? "👥 Users" : 
               t === "organizations" ? "🏛️ Organizations" : 
               t === "events" ? "📋 Events" : "⚙️ System"}
            </button>
          ))}
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
            message.type === "success" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            <span>{message.type === "success" ? "✅" : "❌"} {message.text}</span>
            <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600 ml-4">✕</button>
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: "Total Citizens", value: stats?.citizenCount || 0, emoji: "🧑", color: "text-green-700" },
                { label: "Verified Orgs", value: organizations.filter(o => o.status === 'verified').length, emoji: "🏛️", color: "text-blue-700" },
                { label: "Active Events", value: events.filter(e => e.status !== 'cancelled').length, emoji: "📋", color: "text-yellow-700" },
                { label: "Points Issued", value: (stats?.totalPointsAwarded || 0).toLocaleString(), emoji: "⭐", color: "text-orange-700" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <p className="text-2xl mb-2">{stat.emoji}</p>
                  <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-400 font-semibold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pending Organizations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="font-black text-gray-900">Pending Verification</h2>
                  <button onClick={() => setTab("organizations")} className="text-xs text-blue-700 font-semibold">View All</button>
                </div>
                <ul className="divide-y divide-gray-50">
                  {organizations.filter(o => !o.status || o.status === 'pending').slice(0, 3).map((o) => (
                    <li key={o.clerkId} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{o.organizationName}</p>
                        <p className="text-xs text-gray-400">{o.contactEmail}</p>
                      </div>
                      <button 
                        onClick={() => handleOrgStatus(o.clerkId, "verified")}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-green-700"
                      >
                        Verify
                      </button>
                    </li>
                  ))}
                  {organizations.filter(o => !o.status || o.status === 'pending').length === 0 && (
                    <li className="px-6 py-8 text-center text-gray-400 text-sm">No pending verifications</li>
                  )}
                </ul>
              </div>

              {/* Flagged Events */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="font-black text-gray-900">Flagged Activities</h2>
                  <button onClick={() => setTab("events")} className="text-xs text-red-700 font-semibold">Moderate</button>
                </div>
                <ul className="divide-y divide-gray-50">
                  {events.filter(e => e.status === 'flagged').slice(0, 3).map((e) => (
                    <li key={e.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{e.title}</p>
                        <p className="text-xs text-red-500 font-semibold">Reported for review</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEventStatus(e.id!, "active")}
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={() => handleEventStatus(e.id!, "cancelled")}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold"
                        >
                          Suspend
                        </button>
                      </div>
                    </li>
                  ))}
                  {events.filter(e => e.status === 'flagged').length === 0 && (
                    <li className="px-6 py-8 text-center text-gray-400 text-sm">No flagged activities</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-black text-gray-900">User Directory</h2>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#087B90] w-64"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Points</th>
                    <th className="px-6 py-4">Tier</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.clerkId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{u.fullName}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                          u.role === 'organization' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-sm">{u.totalPoints.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.tier}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openPointModal(u)} className="text-xs text-blue-600 font-bold hover:underline">Edit</button>
                          <button onClick={() => handleResetPoints(u)} className="text-xs text-red-600 font-bold hover:underline">Reset</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ORGANIZATIONS TAB ── */}
        {tab === "organizations" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">Organization Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {organizations.map((o) => (
                    <tr key={o.clerkId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{o.organizationName}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">{o.description}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{o.contactEmail}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                          o.status === 'verified' ? 'bg-green-100 text-green-700' : 
                          o.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {o.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          {o.status !== 'verified' && (
                            <button onClick={() => handleOrgStatus(o.clerkId, "verified")} className="text-xs text-green-600 font-bold hover:underline">Verify</button>
                          )}
                          {o.status !== 'suspended' && (
                            <button onClick={() => handleOrgStatus(o.clerkId, "suspended")} className="text-xs text-red-600 font-bold hover:underline">Suspend</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── EVENTS TAB ── */}
        {tab === "events" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">Activity Moderation</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{e.title}</p>
                        <p className="text-xs text-gray-400">{e.category} · {e.date}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{e.organizationName}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                          e.status === 'active' ? 'bg-green-100 text-green-700' : 
                          e.status === 'flagged' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {e.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button onClick={() => handleEventStatus(e.id!, "flagged")} className="text-xs text-orange-600 font-bold hover:underline">Flag</button>
                          <button onClick={() => handleEventStatus(e.id!, "cancelled")} className="text-xs text-red-600 font-bold hover:underline">Cancel</button>
                          <button onClick={() => handleEventStatus(e.id!, "active")} className="text-xs text-green-600 font-bold hover:underline">Approve</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SYSTEM TAB ── */}
        {tab === "system" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 className="font-black text-xl text-gray-900 mb-6">System Health & Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Database Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Records</span>
                      <span className="font-mono font-bold">{(stats?.totalUsers + stats?.totalEvents + stats?.totalEnrollments).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Citizen Participation Rate</span>
                      <span className="font-mono font-bold">{((stats?.totalEnrollments / stats?.citizenCount) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Admin Security</h3>
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                    <p className="text-xs text-yellow-800 font-semibold">
                      Current Admin ID: <code className="bg-white px-1 rounded">{ADMIN_ID}</code>
                    </p>
                    <p className="text-[10px] text-yellow-700 mt-2">
                      Hardcoded for security. To change, update the <code>ADMIN_ID</code> constant in the source code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Point Edit Modal */}
      {showPointModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="font-black text-2xl text-gray-900 mb-2">Adjust Points</h3>
            <p className="text-gray-500 text-sm mb-6">Updating points for <span className="font-bold text-gray-900">{selectedUser.fullName}</span></p>
            
            <div className="mb-6">
              <label className="text-xs font-black text-gray-400 uppercase mb-2 block">New Total Points</label>
              <input
                type="number"
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#087B90] font-bold text-lg"
                placeholder="0"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleUpdatePoints}
                className="flex-1 bg-[#087B90] text-white py-3 rounded-xl font-black hover:bg-[#0a8fa3] transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setShowPointModal(false);
                  setSelectedUser(null);
                  setNewPoints("");
                }}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-black hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
