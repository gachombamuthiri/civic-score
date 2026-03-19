"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  createEvent,
  getOrganizationEvents,
  getEventEnrollments,
  markAttendance,
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

type View = "events" | "create" | "attendance";

export default function OrganizationPortal() {
  const { user, isLoaded } = useUser();
  const [view, setView] = useState<View>("events");
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CivicEvent | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Blood Donation",
    location: "",
    date: "",
    points: 50,
  });

  // Load organization's events
  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const data = await getOrganizationEvents(user.id);
        setEvents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingEvents(false);
      }
    }
    if (isLoaded) load();
  }, [user, isLoaded]);

  // Load enrollments for selected event
  async function handleViewAttendance(event: CivicEvent) {
    setSelectedEvent(event);
    setView("attendance");
    setLoadingEnrollments(true);
    try {
      const data = await getEventEnrollments(event.id!);
      setEnrollments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEnrollments(false);
    }
  }

  // Create new event
  async function handleCreateEvent() {
    if (!user) return;
    if (!form.title || !form.location || !form.date) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      await createEvent({
        ...form,
        organizationId: user.id,
        organizationName: user.fullName ?? "Organization",
      });
      // Refresh events list
      const updated = await getOrganizationEvents(user.id);
      setEvents(updated);
      setForm({ title: "", description: "", category: "Blood Donation", location: "", date: "", points: 50 });
      setMessage({ type: "success", text: "Event created successfully! Citizens can now enroll." });
      setView("events");
    } catch (e) {
      setMessage({ type: "error", text: "Failed to create event. Please try again." });
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  // Mark citizen as attended
  async function handleMarkAttendance(enrollment: Enrollment) {
    if (!enrollment.id || enrollment.attended) return;
    setMarking(enrollment.id);
    try {
      await markAttendance(enrollment.id, enrollment.userId, enrollment.points);
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollment.id ? { ...e, attended: true } : e))
      );
      setMessage({ type: "success", text: `✅ ${enrollment.userName} marked as attended! +${enrollment.points} points added to their account.` });
    } catch (e) {
      setMessage({ type: "error", text: "Failed to mark attendance. Try again." });
      console.error(e);
    } finally {
      setMarking(null);
    }
  }

  if (!isLoaded || loadingEvents) {
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
          <h1 className="text-3xl font-black text-white">{user?.fullName ?? "Organization"}</h1>
          <p className="text-green-200 text-sm mt-1">Create events and manage citizen attendance</p>
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
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => { setView("events"); setSelectedEvent(null); setMessage(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              view === "events" || view === "attendance"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
            }`}
          >
            My Events ({events.length})
          </button>
          <button
            onClick={() => { setView("create"); setSelectedEvent(null); setMessage(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              view === "create"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
            }`}
          >
            + Create Event
          </button>
        </div>

        {/* ── CREATE EVENT FORM ── */}
        {view === "create" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl">
            <h2 className="font-black text-gray-900 text-xl mb-6">Create New Civic Event</h2>
            <div className="space-y-5">

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Blood Donation Drive at KNH"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what participants will do and why it matters..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                    Category *
                  </label>
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
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                    Points to Award *
                  </label>
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
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                  Location *
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Kenyatta National Hospital, Nairobi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <button
                onClick={handleCreateEvent}
                disabled={submitting}
                className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Event →"}
              </button>
            </div>
          </div>
        )}

        {/* ── EVENTS LIST ── */}
        {view === "events" && (
          <div>
            {events.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-lg font-bold text-gray-700">No events created yet</p>
                <p className="text-sm text-gray-400 mt-2 mb-6">
                  Create your first civic event for citizens to enroll in
                </p>
                <button
                  onClick={() => setView("create")}
                  className="bg-green-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-green-800"
                >
                  + Create First Event
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{event.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {event.date} &nbsp;·&nbsp; 📍 {event.location}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          {event.category}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                          +{event.points} pts
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewAttendance(event)}
                      className="bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-green-800 transition-colors whitespace-nowrap"
                    >
                      Mark Attendance →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ATTENDANCE PANEL ── */}
        {view === "attendance" && selectedEvent && (
          <div>
            {/* Back button */}
            <button
              onClick={() => { setView("events"); setSelectedEvent(null); setEnrollments([]); setMessage(null); }}
              className="text-sm text-green-700 font-bold mb-6 hover:underline flex items-center gap-1"
            >
              ← Back to Events
            </button>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Panel Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <h2 className="font-black text-gray-900 text-lg">{selectedEvent.title}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  📅 {selectedEvent.date} &nbsp;·&nbsp; 📍 {selectedEvent.location} &nbsp;·&nbsp; +{selectedEvent.points} pts per attendee
                </p>
                <p className="text-xs text-green-700 font-semibold mt-2">
                  {enrollments.length} citizen{enrollments.length !== 1 ? "s" : ""} enrolled
                </p>
              </div>

              {/* Enrollments */}
              {loadingEnrollments ? (
                <div className="px-6 py-10 text-center">
                  <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Loading enrollments...</p>
                </div>
              ) : enrollments.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-3xl mb-3">👥</p>
                  <p className="text-sm font-semibold text-gray-600">No citizens enrolled yet</p>
                  <p className="text-xs text-gray-400 mt-1">Citizens will appear here once they enroll</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {/* Table Header */}
                  <li className="px-6 py-3 bg-gray-50 grid grid-cols-4 gap-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">Name</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">ID Number</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Phone</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Attendance</span>
                  </li>
                  {enrollments.map((enrollment) => (
                    <li key={enrollment.id} className="px-6 py-4 grid grid-cols-4 gap-4 items-center hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{enrollment.userName}</p>
                        <p className="text-xs text-gray-400">{enrollment.userEmail}</p>
                      </div>
                      <p className="text-sm text-gray-600">{enrollment.idNumber}</p>
                      <p className="text-sm text-gray-600">{enrollment.phone}</p>
                      <div>
                        {enrollment.attended ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold">
                            ✅ Attended · +{enrollment.points} pts
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAttendance(enrollment)}
                            disabled={marking === enrollment.id}
                            className="text-xs font-bold px-4 py-1.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
                          >
                            {marking === enrollment.id ? "Saving..." : "✓ Mark Attended"}
                          </button>
                        )}
                      </div>
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
