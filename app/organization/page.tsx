"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  createEvent,
  getOrganizationEvents,
  getEventEnrollments,
  markAttendance,
  getUserProfile,
  createUserProfile,
  deleteEvent,
  type CivicEvent,
  type Enrollment,
} from "@/lib/firestore";

const CATEGORIES = [
  "Blood Donation",
  "Environmental",
  "Volunteering",
  "Community",
  "Health",
  "Traffic",
  "Other",
];

export default function OrganizationPortal() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CivicEvent | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"events" | "create">("events");
  const [marking, setMarking] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "mark">("mark");

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Blood Donation",
    location: "",
    date: "",
    points: 50,
  });

  // Check user role access and create profile if needed
  useEffect(() => {
    async function checkAccess() {
      if (!user || !isLoaded) return;

      try {
        let profile = await getUserProfile(user.id);

        // If no profile exists, create one for organization
        if (!profile) {
          await createUserProfile(
            user.id,
            user.fullName ?? "Organization",
            user.primaryEmailAddress?.emailAddress ?? "",
            "organization"
          );
          profile = await getUserProfile(user.id);
        }
      } catch (error) {
        console.error("Access check failed:", error);
      }
    }

    checkAccess();
  }, [user, isLoaded, router]);

  useEffect(() => {
    async function loadEvents() {
      if (!user) return;
      try {
        const orgEvents = await getOrganizationEvents(user.id);
        
        // Load enrollment counts for each event
        const eventsWithCounts = await Promise.all(
          orgEvents.map(async (event) => {
            if (!event.id) return { ...event, enrollmentCount: 0 };
            try {
              const enrollments = await getEventEnrollments(event.id);
              return { ...event, enrollmentCount: enrollments.length };
            } catch (error) {
              console.error(`Error loading enrollments for event ${event.id}:`, error);
              return { ...event, enrollmentCount: 0 };
            }
          })
        );
        
        setEvents(eventsWithCounts);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) loadEvents();
  }, [user, isLoaded]);

  async function loadEnrollments(event: CivicEvent) {
    setSelectedEvent(event);
    if (!event.id) return;
    try {
      const data = await getEventEnrollments(event.id);
      setEnrollments(data);
    } catch (error) {
      console.error("Error loading enrollments:", error);
    }
  }

  async function viewEnrollments(event: CivicEvent) {
    setViewMode("view");
    await loadEnrollments(event);
  }

  async function markAttendanceMode(event: CivicEvent) {
    setViewMode("mark");
    await loadEnrollments(event);
  }

  async function handleCreateEvent() {
    if (!user) return;
    if (!form.title || !form.location || !form.date) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }
    try {
      await createEvent({
        ...form,
        organizationId: user.id,
        organizationName: user.fullName ?? "Organization",
      });
      setMessage({ type: "success", text: "Event created successfully!" });
      setForm({ title: "", description: "", category: "Blood Donation", location: "", date: "", points: 50 });
      setActiveTab("events");
      
      // Reload events with updated enrollment counts
      const orgEvents = await getOrganizationEvents(user.id);
      const eventsWithCounts = await Promise.all(
        orgEvents.map(async (event) => {
          if (!event.id) return { ...event, enrollmentCount: 0 };
          try {
            const enrollments = await getEventEnrollments(event.id);
            return { ...event, enrollmentCount: enrollments.length };
          } catch (error) {
            return { ...event, enrollmentCount: 0 };
          }
        })
      );
      setEvents(eventsWithCounts);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create event. Try again." });
      console.error(error);
    }
  }

  async function handleMarkAttendance(enrollment: Enrollment) {
    if (!enrollment.id || enrollment.attended) return;
    setMarking(enrollment.id);
    try {
      await markAttendance(enrollment.id, enrollment.userId, enrollment.points);
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollment.id ? { ...e, attended: true } : e))
      );
      setMessage({ type: "success", text: `Marked ${enrollment.userName} as attended! +${enrollment.points} points added.` });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to mark attendance." });
      console.error(error);
    } finally {
      setMarking(null);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setMessage({ type: "success", text: "Event deleted successfully!" });
      
      // If the deleted event was selected, clear the selection
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
        setEnrollments([]);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete event. Try again." });
      console.error(error);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading portal...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-green-300 text-sm font-semibold mb-1">Organization Portal</p>
          <h1 className="text-3xl font-black text-white">
            {user?.fullName ?? "Organization"} Dashboard
          </h1>
          <p className="text-green-200 text-sm mt-1">
            Create civic events and mark citizen attendance
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Message */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {message.type === "success" ? "✅" : "❌"} {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => { setActiveTab("events"); setSelectedEvent(null); setEnrollments([]); setViewMode("mark"); setMessage(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              activeTab === "events"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
            }`}
          >
            My Events
          </button>
          <button
            onClick={() => { setActiveTab("create"); setSelectedEvent(null); setEnrollments([]); setViewMode("mark"); setMessage(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              activeTab === "create"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
            }`}
          >
            + Create Event
          </button>
        </div>

        {/* Create Event Form */}
        {activeTab === "create" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="font-black text-gray-900 text-xl mb-6">Create New Civic Event</h2>
            <div className="space-y-5">

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Event Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Nairobi River Clean-up Drive"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the activity and what participants will do..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Points Awarded *</label>
                  <input
                    type="number"
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                    min={10}
                    max={500}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Kenyatta National Hospital, Nairobi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <button
                onClick={handleCreateEvent}
                className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors"
              >
                Create Event →
              </button>
            </div>
          </div>
        )}

        {/* My Events List */}
        {activeTab === "events" && !selectedEvent && (
          <div>
            {events.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-lg font-bold text-gray-700">No events created yet</p>
                <p className="text-sm text-gray-400 mt-2 mb-6">Create your first civic event to get started</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="bg-green-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-green-800"
                >
                  + Create Event
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-black text-gray-900">{event.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">📅 {event.date} · 📍 {event.location}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{event.category}</span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">+{event.points} pts</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">👥 {event.enrollmentCount || 0} enrolled</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => viewEnrollments(event)}
                          className="bg-blue-600 text-white text-sm font-bold px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          👁️ View ({event.enrollmentCount || 0})
                        </button>
                        <button
                          onClick={() => markAttendanceMode(event)}
                          className="bg-green-700 text-white text-sm font-bold px-3 py-2 rounded-xl hover:bg-green-800 transition-colors"
                        >
                          ✓ Mark
                        </button>
                        <button
                          onClick={() => event.id && handleDeleteEvent(event.id)}
                          className="bg-red-600 text-white text-sm font-bold px-3 py-2 rounded-xl hover:bg-red-700 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Attendance/Enrollments Panel */}
        {activeTab === "events" && selectedEvent && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => { setSelectedEvent(null); setEnrollments([]); }}
                className="text-sm text-green-700 font-bold hover:underline"
              >
                ← Back to Events
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("view")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    viewMode === "view"
                      ? "bg-blue-700 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                  }`}
                >
                  👁️ View Enrollments
                </button>
                <button
                  onClick={() => setViewMode("mark")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    viewMode === "mark"
                      ? "bg-green-700 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                  }`}
                >
                  ✓ Mark Attendance
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-black text-gray-900">{selectedEvent.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {enrollments.length} enrolled citizens
                  {viewMode === "mark" && " · Check off citizens who attended"}
                </p>
              </div>

              {enrollments.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-3xl mb-3">👥</p>
                  <p className="text-sm font-semibold text-gray-600">No citizens enrolled yet</p>
                  {viewMode === "view" && (
                    <p className="text-xs text-gray-400 mt-2">Citizens can enroll through the activities page</p>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {enrollments.map((enrollment) => (
                    <li key={enrollment.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{enrollment.userName}</p>
                        <p className="text-xs text-gray-400">{enrollment.userEmail}</p>
                        <p className="text-xs text-gray-500 mt-1">📱 {enrollment.phone} · 🆔 {enrollment.idNumber}</p>
                      </div>
                      {viewMode === "mark" ? (
                        enrollment.attended ? (
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold">
                            ✅ Attended · +{enrollment.points} pts awarded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAttendance(enrollment)}
                            disabled={marking === enrollment.id}
                            className="bg-green-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
                          >
                            {marking === enrollment.id ? "Saving..." : "✓ Mark Attended"}
                          </button>
                        )
                      ) : (
                        <span className={`text-xs px-3 py-1.5 rounded-lg font-bold ${
                          enrollment.attended
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {enrollment.attended ? "✅ Attended" : "⏳ Pending"}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
