"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getAllEvents,
  enrollInEvent,
  getUserEnrollments,
  type CivicEvent,
  type Enrollment,
} from "@/lib/firestore";

const CATEGORY_ICONS: Record<string, string> = {
  "Blood Donation": "🩸",
  "Environmental": "🌿",
  "Volunteering": "🤝",
  "Community": "🏘️",
  "Health": "🏥",
  "Traffic": "🚦",
  "Other": "📋",
};

export default function ActivitiesPage() {
  const { user, isLoaded } = useUser();
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingEvent, setEnrollingEvent] = useState<CivicEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Enrollment form
  const [form, setForm] = useState({
    idNumber: "",
    phone: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [allEvents, userEnrollments] = await Promise.all([
          getAllEvents(),
          user ? getUserEnrollments(user.id) : Promise.resolve([]),
        ]);
        setEvents(allEvents);
        setEnrollments(userEnrollments);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) loadData();
  }, [user, isLoaded]);

  const isEnrolled = (eventId: string) =>
    enrollments.some((e) => e.eventId === eventId);

  async function handleEnroll() {
    if (!user || !enrollingEvent?.id) return;

    if (!form.idNumber || !form.phone) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await enrollInEvent(
        enrollingEvent.id,
        enrollingEvent.title,
        user.id,
        user.fullName ?? "Citizen",
        user.primaryEmailAddress?.emailAddress ?? "",
        enrollingEvent.points,
        form.idNumber,
        form.phone
      );
      setEnrollments((prev) => [
        ...prev,
        {
          eventId: enrollingEvent.id!,
          eventTitle: enrollingEvent.title,
          userId: user.id,
          userName: user.fullName ?? "Citizen",
          userEmail: user.primaryEmailAddress?.emailAddress ?? "",
          idNumber: form.idNumber,
          phone: form.phone,
          points: enrollingEvent.points,
          attended: false,
          enrolledAt: new Date(),
        },
      ]);
      setMessage({ type: "success", text: `Successfully enrolled in "${enrollingEvent.title}"! Show up and earn ${enrollingEvent.points} points.` });
      setEnrollingEvent(null);
      setForm({ idNumber: "", phone: "" });
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading activities...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-green-300 text-sm font-semibold mb-1">Earn Points</p>
          <h1 className="text-3xl font-black text-white">Civic Activities</h1>
          <p className="text-green-200 text-sm mt-1">
            Browse and enroll in upcoming civic activities to earn points
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

        {/* Enrollment Modal */}
        {enrollingEvent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <h2 className="text-xl font-black text-gray-900 mb-1">Enroll in Activity</h2>
              <p className="text-sm text-gray-500 mb-6">{enrollingEvent.title}</p>

              {/* Auto-filled fields */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={user?.fullName ?? ""}
                    disabled
                    className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Email</label>
                  <input
                    type="text"
                    value={user?.primaryEmailAddress?.emailAddress ?? ""}
                    disabled
                    className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">National ID Number *</label>
                  <input
                    type="text"
                    value={form.idNumber}
                    onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                    placeholder="e.g. 12345678"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 0712345678"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              {/* Points info */}
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
                <p className="text-sm text-green-700 font-semibold">Points you will earn</p>
                <p className="text-lg font-black text-green-700">+{enrollingEvent.points} pts</p>
              </div>

              {message?.type === "error" && (
                <p className="text-xs text-red-600 font-semibold mb-4">❌ {message.text}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setEnrollingEvent(null); setForm({ idNumber: "", phone: "" }); setMessage(null); }}
                  className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnroll}
                  disabled={submitting}
                  className="flex-1 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors text-sm disabled:opacity-50"
                >
                  {submitting ? "Enrolling..." : "Confirm Enrollment →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg font-bold text-gray-700">No activities available yet</p>
            <p className="text-sm text-gray-400 mt-2">Check back soon — organizations are adding new activities!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => {
              const enrolled = isEnrolled(event.id!);
              const icon = CATEGORY_ICONS[event.category] ?? "📋";
              return (
                <div
                  key={event.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                    enrolled ? "border-green-200" : "border-gray-100"
                  }`}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-green-800 to-green-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icon}</span>
                      <span className="text-xs font-bold text-green-200 uppercase tracking-widest">{event.category}</span>
                    </div>
                    <div className="bg-yellow-400 text-green-950 text-xs font-black px-3 py-1 rounded-full">
                      +{event.points} pts
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 py-5">
                    <h3 className="text-lg font-black text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{event.description}</p>
                    <div className="space-y-1.5 mb-5">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>📍</span><span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>📅</span><span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>🏛️</span><span>{event.organizationName}</span>
                      </div>
                    </div>

                    {enrolled ? (
                      <div className="w-full bg-green-50 border border-green-200 text-green-700 text-sm font-bold py-2.5 rounded-xl text-center">
                        ✅ Enrolled — Show up to earn {event.points} points!
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEnrollingEvent(event); setMessage(null); }}
                        className="w-full bg-green-700 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-green-800 transition-colors"
                      >
                        Enroll Now →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
