'use client';

import { useState } from 'react';
import { CivicEvent, Enrollment } from '@/lib/firestore';

interface OrganizationAttendanceProps {
  events: CivicEvent[];
  enrollments: Enrollment[];
  selectedEventId?: string;
  onSelectEvent?: (eventId: string) => void;
  onMarkAttendance?: (enrollmentId: string) => Promise<void>;
  onMarkAllNoShow?: (existingEnrollments: Enrollment[]) => Promise<void>;
}

export default function OrganizationAttendance({
  events,
  enrollments,
  selectedEventId,
  onSelectEvent,
  onMarkAttendance,
  onMarkAllNoShow,
}: OrganizationAttendanceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [marking, setMarking] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [checkedBoxes, setCheckedBoxes] = useState<Set<string>>(new Set());

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const eventEnrollments = selectedEventId
    ? enrollments.filter(e => e.eventId === selectedEventId)
    : [];

  const filteredEnrollments = eventEnrollments.filter(e =>
    e.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckbox = (enrollmentId: string) => {
    const newSet = new Set(checkedBoxes);
    if (newSet.has(enrollmentId)) {
      newSet.delete(enrollmentId);
    } else {
      newSet.add(enrollmentId);
    }
    setCheckedBoxes(newSet);
  };

  const handleMarkAttendance = async (enrollmentId: string) => {
    if (!onMarkAttendance) return;
    setMarking(enrollmentId);
    try {
      await onMarkAttendance(enrollmentId);
      handleCheckbox(enrollmentId);
    } finally {
      setMarking(null);
    }
  };

  const handleMarkAllNoShow = async () => {
    if (!onMarkAllNoShow) return;
    try {
      await onMarkAllNoShow(eventEnrollments);
      setShowConfirmModal(false);
      setCheckedBoxes(new Set());
    } catch (error) {
      console.error('Error marking no-shows:', error);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-zinc-900">✅ Attendance Management</h2>
        <p className="text-sm text-zinc-500 mt-1">Mark attendance and award civic points to participants</p>
      </div>

      {/* Event Selector */}
      {events.length > 0 ? (
        <div className="mb-6">
          <label className="block text-sm font-bold text-zinc-700 mb-2">Select Event</label>
          <select
            value={selectedEventId || ''}
            onChange={(e) => {
              onSelectEvent?.(e.target.value);
              setSearchTerm('');
              setCheckedBoxes(new Set());
            }}
            className="w-full border border-zinc-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-900"
          >
            <option value="">-- Choose an event --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title} ({event.enrollmentCount || 0} enrolled)
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-700 font-semibold">No events created yet</p>
        </div>
      )}

      {/* Attendance Management */}
      {selectedEvent && (
        <>
          {/* Event Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-blue-900 mb-2">{selectedEvent.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-700 font-semibold">📍 Location</p>
                <p className="text-blue-600">{selectedEvent.location}</p>
              </div>
              <div>
                <p className="text-blue-700 font-semibold">📅 Date</p>
                <p className="text-blue-600">{selectedEvent.date}</p>
              </div>
              <div>
                <p className="text-blue-700 font-semibold">⭐ Points</p>
                <p className="text-blue-600">+{selectedEvent.points} pts</p>
              </div>
              <div>
                <p className="text-blue-700 font-semibold">👥 Enrolled</p>
                <p className="text-blue-600">{eventEnrollments.length}</p>
              </div>
            </div>
          </div>

          {/* Search & Bulk Actions */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search attendee by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-zinc-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-900"
            />
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-colors"
            >
              ❌ Mark All No-Show
            </button>
          </div>

          {/* Attendance Table */}
          {filteredEnrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-100 border border-zinc-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-zinc-700">Attendee</th>
                    <th className="px-4 py-3 text-left font-bold text-zinc-700">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-zinc-700">Phone</th>
                    <th className="px-4 py-3 text-center font-bold text-zinc-700">Status</th>
                    <th className="px-4 py-3 text-center font-bold text-zinc-700">Verify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 font-semibold text-zinc-900">{enrollment.userName}</td>
                      <td className="px-4 py-3 text-zinc-600">{enrollment.userEmail}</td>
                      <td className="px-4 py-3 text-zinc-600">{enrollment.phone}</td>
                      <td className="px-4 py-3 text-center">
                        {enrollment.attended ? (
                          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                            ✅ Verified
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                            ⏳ Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!enrollment.attended ? (
                          <button
                            onClick={() => handleMarkAttendance(enrollment.id!)}
                            disabled={marking === enrollment.id}
                            className="px-3 py-1 bg-emerald-900 text-white text-xs font-bold rounded hover:bg-emerald-800 transition-colors disabled:opacity-50"
                          >
                            {marking === enrollment.id ? '...' : '✓'}
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-xs">+{enrollment.points} pts ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-8 text-center">
              <p className="text-zinc-500 font-semibold">
                {searchTerm ? 'No attendees match your search' : 'No enrolled attendees yet'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Mark All as Did Not Attend?</h3>
            <p className="text-sm text-zinc-600 mb-6">
              This will mark all {eventEnrollments.length} attendees as no-shows. They will NOT receive any points. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAllNoShow}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                I'm Sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
