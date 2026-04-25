"use client";

import { useEffect, useState } from "react";
import { useUser, OrganizationSwitcher, CreateOrganization } from "@clerk/nextjs";
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
  deleteEvent,
  createEvent,
  updateEvent,
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

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CivicEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GOVERNANCE',
    location: '',
    date: '',
    points: 100,
    image: '',
  });
  const [processing, setProcessing] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    const newTab = searchParams.get('tab') as any || 'events';
    setActiveTab(newTab);
  }, [searchParams]);

  const loadEvents = async () => {
    if (!organization?.id) return;
    setLoading(true);
    try {
      const orgEvents = await getOrganizationEvents(organization.id);
      const eventsWithCounts = await Promise.all(
        orgEvents.map(async (event) => {
          if (!event.id) return { ...event, enrollmentCount: 0 };
          const data = await getEventEnrollments(event.id);
          return { ...event, enrollmentCount: data.length };
        })
      );
      setEvents(eventsWithCounts);
      const allEnrollmentsData = await getAllEventEnrollments(orgEvents.map(e => e.id).filter(Boolean) as string[]);
      setAllEnrollments(allEnrollmentsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgLoaded && organization?.id) { loadEvents(); }
    else if (orgLoaded && !organization) { setLoading(false); }
  }, [organization?.id, orgLoaded]);

  async function loadEnrollments(event: CivicEvent) {
    setSelectedEvent(event);
    if (!event.id) return;
    try {
      const data = await getEventEnrollments(event.id);
      setEnrollments(data);
    } catch (error) { console.error(error); }
  }

  async function handleMarkAttendance(enrollment: Enrollment) {
    if (!enrollment.id || enrollment.attended) return;
    setMarking(enrollment.id);
    try {
      await markAttendance(enrollment.id, enrollment.userId, enrollment.points);
      setAllEnrollments(prev => prev.map(e => e.id === enrollment.id ? { ...e, attended: true } : e));
      setMessage({ type: "success", text: `Marked ${enrollment.userName} as attended!` });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to mark attendance." });
    } finally { setMarking(null); }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id || !organization?.name) return;
    setProcessing(true);
    try {
      const defaultImages: Record<string, string> = {
        GOVERNANCE: '/cityhall.png', ENVIRONMENT: '/coastal-image.png',
        HEALTH: '/blood-donation.png', EDUCATION: '/mentorship.png', COMMUNITY: '/karura.png',
      };
      await createEvent({
        ...formData,
        organizationId: organization.id,
        organizationName: organization.name,
        points: Number(formData.points),
        image: formData.image || defaultImages[formData.category] || '/karura.png',
      });
      setMessage({ type: 'success', text: 'Event created successfully!' });
      setShowCreateModal(false);
      setFormData({ title: '', description: '', category: 'GOVERNANCE', location: '', date: '', points: 100, image: '' });
      await loadEvents();
    } catch (error) { setMessage({ type: 'error', text: 'Failed to create event.' }); } finally { setProcessing(false); }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.id) return;
    setProcessing(true);
    try {
      await updateEvent(editingEvent.id, { ...formData, points: Number(formData.points) });
      setMessage({ type: 'success', text: 'Event updated successfully!' });
      setShowEditModal(false);
      setEditingEvent(null);
      await loadEvents();
    } catch (error) { setMessage({ type: 'error', text: 'Failed to update event.' }); } finally { setProcessing(false); }
  };

  const openEditModal = (event: CivicEvent) => {
    setEditingEvent(event);
    setFormData({ title: event.title, description: event.description, category: event.category, location: event.location, date: event.date, points: event.points, image: event.image || '' });
    setShowEditModal(true);
  };

  if (!isLoaded || !orgLoaded || (loading && organization)) {
    return <div className="min-h-screen flex items-center justify-center">Loading portal...</div>;
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Setup Your Organization</h1>
        <CreateOrganization afterCreateOrganizationUrl="/organization" />
        <div className="my-4">or</div>
        <OrganizationSwitcher afterSelectOrganizationUrl="/organization" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <OrganizationSidebar activeTab={activeTab} />
      <div className="flex-1 ml-64">
        <OrganizationHeader title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
        <div className="p-8 max-w-7xl">
          {message && <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{message.text}</div>}
          
          {activeTab === 'events' && (
            <OrganizationEventsManagement
              events={events}
              onEdit={openEditModal}
              onDelete={async (id) => { if(confirm("Delete?")) { await deleteEvent(id); loadEvents(); } }}
              onCreateNew={() => { setFormData({ title: '', description: '', category: 'GOVERNANCE', location: '', date: '', points: 100, image: '' }); setShowCreateModal(true); }}
            />
          )}

          {activeTab === 'attendance' && (
            <OrganizationAttendance
              events={events}
              enrollments={allEnrollments}
              selectedEventId={selectedEvent?.id}
              onSelectEvent={(eventId) => {
                const event = events.find(e => e.id === eventId);
                if (event) { setSelectedEvent(event); loadEnrollments(event); }
              }}
              onMarkAttendance={async (id) => {
                const enrollment = allEnrollments.find(e => e.id === id);
                if (enrollment) await handleMarkAttendance(enrollment);
              }}
              onMarkAllNoShow={async () => {}}
            />
          )}

          {activeTab === 'analytics' && <OrganizationAnalytics events={events} enrollments={allEnrollments} />}
          {activeTab === 'users' && <OrganizationUsers enrollments={allEnrollments} userProfiles={userProfiles} organizationEventIds={events.map(e => e.id).filter(Boolean) as string[]} events={events} />}
          {activeTab === 'settings' && <OrganizationSettings organization={organizationProfile} onSave={async () => {}} />}
        </div>
        <LandingFooter />
      </div>

      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl p-8">
            <h2 className="text-xl font-black mb-6">{showEditModal ? 'Edit Event' : 'Create Event'}</h2>
            <form onSubmit={showEditModal ? handleUpdateEvent : handleCreateEvent} className="space-y-4">
              <input required placeholder="Title" className="w-full p-3 border rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              <select className="w-full p-3 border rounded-lg" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="GOVERNANCE">Governance</option><option value="ENVIRONMENT">Environment</option>
                <option value="HEALTH">Health</option><option value="EDUCATION">Education</option><option value="COMMUNITY">Community</option>
              </select>
              <input required placeholder="Location" className="w-full p-3 border rounded-lg" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              <input required type="date" className="w-full p-3 border rounded-lg" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              <input required type="number" placeholder="Points" className="w-full p-3 border rounded-lg" value={formData.points} onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })} />
              <input placeholder="Image URL (Optional)" className="w-full p-3 border rounded-lg" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
              <textarea required placeholder="Description" className="w-full p-3 border rounded-lg" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="flex-1 py-3 border rounded-xl">Cancel</button>
                <button type="submit" disabled={processing} className="flex-1 py-3 bg-emerald-900 text-white rounded-xl">{processing ? 'Processing...' : (showEditModal ? 'Update' : 'Create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
