"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import LandingFooter from "@/components/LandingFooter";
import OrganizationSidebar from "@/components/OrganizationSidebar";
import OrganizationHeader from "@/components/OrganizationHeader";
import OrganizationEventsManagement from "@/components/OrganizationEventsManagement";
import OrganizationAttendance from "@/components/OrganizationAttendance";
import OrganizationAnalytics from "@/components/OrganizationAnalytics";
import OrganizationUsers from "@/components/OrganizationUsers";
import OrganizationSettings from "@/components/OrganizationSettings";
import {
  getOrganizationEvents,
  getEventEnrollments,
  getAllEventEnrollments,
  markAttendance,
  getUserProfile,
  createUserProfile,
  deleteEvent,
  type CivicEvent,
  type Enrollment,
  type UserProfile,
  type OrganizationProfile,
} from "@/lib/firestore";

export default function OrganizationPortalContent() {
  const { user, isLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') || 'events';
  const [activeTab, setActiveTab] = useState<'events' | 'analytics' | 'attendance' | 'users' | 'settings'>(
    (tabParam as any) || 'events'
  );

  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CivicEvent | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [organizationProfile, setOrganizationProfile] = useState<OrganizationProfile>();
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());

  // Update activeTab when URL changes
  useEffect(() => {
    const newTab = searchParams.get('tab') as any || 'events';
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [searchParams, activeTab]);

  // Check user role access and redirect if not in organization
  useEffect(() => {
    // Wait until both user and org data are fully loaded
    if (!isLoaded || !orgLoaded) return;
    
    // If loaded and no organization, they're not an org user
    if (!organization) {
      router.push("/role-select");
    }
  }, [organization, orgLoaded, isLoaded, router]);

  useEffect(() => {
    async function loadEvents() {
      if (!organization?.id) return;
      try {
        const orgEvents = await getOrganizationEvents(organization.id);
        
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

        // Load all enrollments for analytics and users
        const allEnrollmentsData = await getAllEventEnrollments(orgEvents.map(e => e.id).filter(Boolean) as string[]);
        setAllEnrollments(allEnrollmentsData);

      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    }
    if (orgLoaded && organization?.id) loadEvents();
  }, [organization?.id, orgLoaded]);

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

  async function handleMarkAttendance(enrollment: Enrollment) {
    if (!enrollment.id || enrollment.attended) return;
    setMarking(enrollment.id);
    try {
      await markAttendance(enrollment.id, enrollment.userId, enrollment.points);
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollment.id ? { ...e, attended: true } : e))
      );
      setAllEnrollments((prev) =>
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

  if (loading || !orgLoaded || !organization) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 font-semibold">Loading portal...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <OrganizationSidebar activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <OrganizationHeader />

        {/* Content Container */}
        <div className="p-8 max-w-7xl">
          {/* Success Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? "✅" : "❌"}
              {message.text}
            </div>
          )}

          {/* Render Active Tab */}
          {activeTab === 'events' && (
            <div>
              <OrganizationEventsManagement
                events={events}
                onEdit={(event) => {
                  // TODO: Implement event editing
                }}
                onDelete={handleDeleteEvent}
                onCreateNew={() => {
                  // TODO: Open create event modal
                }}
              />
            </div>
          )}

          {activeTab === 'attendance' && (
            <OrganizationAttendance
              events={events}
              enrollments={allEnrollments}
              selectedEventId={selectedEvent?.id}
              onSelectEvent={(eventId) => {
                const event = events.find(e => e.id === eventId);
                if (event) {
                  setSelectedEvent(event);
                  loadEnrollments(event);
                }
              }}
              onMarkAttendance={async (enrollmentId) => {
                const enrollment = allEnrollments.find(e => e.id === enrollmentId);
                if (enrollment) {
                  await handleMarkAttendance(enrollment);
                }
              }}
              onMarkAllNoShow={async (existingEnrollments) => {
                // TODO: Implement mark all no-show
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <OrganizationAnalytics
              events={events}
              enrollments={allEnrollments}
            />
          )}

          {activeTab === 'users' && (
            <OrganizationUsers
              enrollments={allEnrollments}
              userProfiles={userProfiles}
              organizationEventIds={events.map(e => e.id).filter(Boolean) as string[]}
            />
          )}

          {activeTab === 'settings' && (
            <OrganizationSettings
              organization={organizationProfile}
              onSave={async (updatedSettings) => {
                // TODO: Implement organization settings save
              }}
            />
          )}
        </div>

        {/* Footer */}
        <LandingFooter />
      </div>
    </div>
  );
}
