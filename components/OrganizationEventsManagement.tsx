'use client';

import { useState } from 'react';
import { CivicEvent } from '@/lib/firestore';

interface OrganizationEventsManagementProps {
  events: CivicEvent[];
  onEdit?: (event: CivicEvent) => void;
  onDelete?: (eventId: string) => Promise<void>;
  onCreateNew?: () => void;
}

export default function OrganizationEventsManagement({
  events,
  onEdit,
  onDelete,
  onCreateNew,
}: OrganizationEventsManagementProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (event: CivicEvent) => {
    if (!event.id || !onDelete) return;

    if (!confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(event.id);
    try {
      await onDelete(event.id);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-zinc-900">📅 Events Management</h2>
          <p className="text-sm text-zinc-500 mt-1">View and manage all events created by your organization</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-emerald-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-800 transition-colors"
        >
          ➕ Create New Event
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-bold text-zinc-700">No events created yet</p>
          <p className="text-sm text-zinc-500 mt-2">Create your first civic event to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-zinc-600 mb-3">{event.description}</p>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      📍 {event.location}
                    </span>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      📅 {event.date}
                    </span>
                    <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full">
                      ⭐ +{event.points} pts
                    </span>
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                      🏷️ {event.category}
                    </span>
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                      👥 {event.enrollmentCount || 0} enrolled
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(event)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-200 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event)}
                    disabled={deleting === event.id}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    {deleting === event.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
