'use client';

import { useState } from 'react';

interface Attendee {
  id: string;
  name: string;
  civicScore: number;
  status: 'checked_in' | 'pending' | 'verified';
  verified?: boolean;
}

interface AttendancePanelProps {
  attendees?: Attendee[];
  onVerify?: (attendeeId: string) => void;
}

export default function AttendancePanel({ attendees, onVerify }: AttendancePanelProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const defaultAttendees: Attendee[] = [
    {
      id: '1',
      name: 'Amara Njeri',
      civicScore: 1240,
      status: 'pending',
    },
    {
      id: '2',
      name: 'Jomo Otieno',
      civicScore: 890,
      status: 'verified',
    },
    {
      id: '3',
      name: 'Zainab Hassan',
      civicScore: 2150,
      status: 'checked_in',
    },
  ];

  const displayAttendees = attendees || defaultAttendees;

  const handleVerify = (id: string) => {
    const newChecked = new Set(checked);
    newChecked.has(id) ? newChecked.delete(id) : newChecked.add(id);
    setChecked(newChecked);
    onVerify?.(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold">
            ✅ Verified
          </span>
        );
      case 'checked_in':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
            📍 Checked In
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">
            ⏳ Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
      <div className="mb-6">
        <h4 className="font-bold text-zinc-900 mb-2">Attendance Panel</h4>
        <p className="text-xs text-zinc-500">
          Verify citizen presence and award civic points
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by citizen name..."
          className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900"
        />
        <button className="px-3 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors text-sm">
          🔽 Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="text-left py-3 px-4 font-semibold text-zinc-700">Citizen</th>
              <th className="text-left py-3 px-4 font-semibold text-zinc-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-zinc-700">Civic Score</th>
              <th className="text-center py-3 px-4 font-semibold text-zinc-700">Verify Presence</th>
            </tr>
          </thead>
          <tbody>
            {displayAttendees.map((attendee, idx) => (
              <tr
                key={attendee.id}
                className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                      {attendee.name.charAt(0)}
                    </div>
                    <span className="font-medium text-zinc-900">{attendee.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(attendee.status)}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-emerald-900">{attendee.civicScore} pts</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleVerify(attendee.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      checked.has(attendee.id)
                        ? 'bg-emerald-900 border-emerald-900'
                        : 'border-zinc-300 hover:border-emerald-900'
                    }`}
                  >
                    {checked.has(attendee.id) && <span className="text-white text-xs">✓</span>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-200">
        <p className="text-xs text-zinc-500">
          Showing {displayAttendees.length} of 45 enrolled citizens
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
