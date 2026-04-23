"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ActivitiesHero from "@/components/ActivitiesHero";
import CategoryFilters from "@/components/CategoryFilters";
import FeaturedActivityCard from "@/components/FeaturedActivityCard";
import UpcomingNearYou from "@/components/UpcomingNearYou";
import ActivityCard from "@/components/ActivityCard";
import LoadMore from "@/components/LoadMore";
import SuggestActivityFAB from "@/components/SuggestActivityFAB";
import LandingFooter from "@/components/LandingFooter";
import {
  getAllEvents,
  enrollInEvent,
  getUserEnrollments,
  getUserProfile,
  type CivicEvent,
  type Enrollment,
  type UserProfile,
} from "@/lib/firestore";

export default function ActivitiesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
        const [allEvents, userEnrollments, profile] = await Promise.all([
          getAllEvents(),
          user ? getUserEnrollments(user.id) : Promise.resolve([]),
          user ? getUserProfile(user.id) : Promise.resolve(null),
        ]);
        setEvents(allEvents);
        setEnrollments(userEnrollments);
        
        // If no profile exists, user hasn't completed role selection - redirect
        if (user && !profile) {
          router.push('/role-select');
          return;
        } else {
          setUserProfile(profile);
        }
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
      <main className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading activities...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-28 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <ActivitiesHero />

        {/* User Points Card */}
        {user && (
          <div className="bg-gradient-to-r from-yellow-300 to-yellow-100 border-2 border-yellow-400 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div>
              <p className="text-yellow-700 font-bold uppercase tracking-widest text-xs mb-1">Your Civic Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-yellow-900">{userProfile?.totalPoints ?? 0}</span>
                <span className="text-yellow-700 font-bold">PTS</span>
              </div>
            </div>
            <div className="text-6xl">⭐</div>
          </div>
        )}

        {/* Category Filters */}
        <CategoryFilters />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
          {/* Featured Card - Takes 8 cols */}
          {events.length > 0 && (
            <FeaturedActivityCard
              event={events[0]}
              onEnroll={(event) => {
                setEnrollingEvent(event);
                setMessage(null);
              }}
            />
          )}

          {/* Upcoming Near You - Takes 4 cols */}
          {events.length > 0 && (
            <UpcomingNearYou events={events} />
          )}

          {/* Activity Cards Grid - Direct children of 12-col grid */}
          {events.slice(1, 7).map((event) => (
            <div key={event.id} className="md:col-span-4">
              <ActivityCard
                event={event}
                enrolled={isEnrolled(event.id!)}
                onEnroll={(evt) => {
                  setEnrollingEvent(evt);
                  setMessage(null);
                }}
              />
            </div>
          ))}
        </div>

        {/* Load More Section */}
        {events.length > 0 && (
          <LoadMore 
            totalCount={events.length} 
            displayedCount={Math.min(7, events.length)}
          />
        )}

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg font-bold text-gray-700">No activities available yet</p>
            <p className="text-sm text-gray-400 mt-2">Check back soon — organizations are adding new activities!</p>
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
                  onClick={() => {
                    setEnrollingEvent(null);
                    setForm({ idNumber: "", phone: "" });
                    setMessage(null);
                  }}
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

        {message?.type === "success" && (
          <div className="fixed top-28 left-4 right-4 bg-green-100 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl shadow-lg">
            ✅ {message.text}
          </div>
        )}
      </div>

      <SuggestActivityFAB />
      <LandingFooter />
    </main>
  );
}
