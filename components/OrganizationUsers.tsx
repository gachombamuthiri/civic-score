'use client';

import { Enrollment, UserProfile } from '@/lib/firestore';
import { useState, useMemo } from 'react';

interface OrganizationUsersProps {
  enrollments: Enrollment[];
  userProfiles: Map<string, UserProfile>;
  organizationEventIds: string[];
}

export default function OrganizationUsers({
  enrollments,
  userProfiles,
  organizationEventIds,
}: OrganizationUsersProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter enrollments to only those for this organization's events
  const orgEnrollments = enrollments.filter(e => organizationEventIds.includes(e.eventId));

  // Get unique users and calculate their stats
  const userStats = useMemo(() => {
    const stats = new Map<string, {
      userId: string;
      name: string;
      email: string;
      totalEnrollments: number;
      attendedCount: number;
      noShowCount: number;
      totalPointsEarned: number;
    }>();

    orgEnrollments.forEach(enrollment => {
      if (!stats.has(enrollment.userId)) {
        const userProfile = userProfiles.get(enrollment.userId);
        stats.set(enrollment.userId, {
          userId: enrollment.userId,
          name: userProfile?.fullName || 'Unknown User',
          email: userProfile?.email || 'No email',
          totalEnrollments: 0,
          attendedCount: 0,
          noShowCount: 0,
          totalPointsEarned: 0,
        });
      }

      const userStat = stats.get(enrollment.userId)!;
      userStat.totalEnrollments += 1;
      if (enrollment.attended) {
        userStat.attendedCount += 1;
        userStat.totalPointsEarned += enrollment.points;
      } else {
        userStat.noShowCount += 1;
      }
    });

    return Array.from(stats.values());
  }, [enrollments, userProfiles, organizationEventIds]);

  // Filter by search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return userStats;
    const query = searchQuery.toLowerCase();
    return userStats.filter(user => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
  }, [userStats, searchQuery]);

  // Calculate overall metrics
  const totalCitizens = new Set(orgEnrollments.map(e => e.userId)).size;
  const avgAttendanceRate =
    userStats.length > 0 ? Math.round((userStats.reduce((sum, u) => sum + (u.attendedCount / u.totalEnrollments), 0) / userStats.length) * 100) : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-zinc-900">👥 Enrolled Citizens</h2>
        <p className="text-sm text-zinc-500 mt-1">View and manage all citizens enrolled in your events</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-700 font-bold uppercase tracking-widest text-xs mb-2">Total Citizens</p>
              <p className="text-4xl font-black text-blue-900">{totalCitizens}</p>
            </div>
            <div className="text-3xl">👤</div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-700 font-bold uppercase tracking-widest text-xs mb-2">Total Enrollments</p>
              <p className="text-4xl font-black text-purple-900">{orgEnrollments.length}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-700 font-bold uppercase tracking-widest text-xs mb-2">Avg Attendance Rate</p>
              <p className="text-4xl font-black text-green-900">{avgAttendanceRate}%</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent"
        />
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-200">
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-zinc-700 uppercase tracking-widest">Enrollments</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-zinc-700 uppercase tracking-widest">Attended</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-zinc-700 uppercase tracking-widest">No-Show</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-zinc-700 uppercase tracking-widest">Points Earned</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-zinc-700 uppercase tracking-widest">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredUsers.map((user, idx) => {
                  const attendanceRate = Math.round((user.attendedCount / user.totalEnrollments) * 100);
                  return (
                    <tr key={idx} className="hover:bg-zinc-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-zinc-900">{user.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-zinc-600">{user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-bold text-sm">
                          {user.totalEnrollments}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-green-100 text-green-900 px-3 py-1 rounded-full font-bold text-sm">
                          ✅ {user.attendedCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-red-100 text-red-900 px-3 py-1 rounded-full font-bold text-sm">
                          ❌ {user.noShowCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full font-bold text-sm">
                          {user.totalPointsEarned} PTS
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-2 bg-zinc-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                              style={{ width: `${attendanceRate}%` }}
                            />
                          </div>
                          <span className="font-bold text-zinc-900 min-w-fit">{attendanceRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-3xl mb-2">👥</p>
          <p className="text-zinc-600 font-bold">No enrolled citizens found</p>
          <p className="text-sm text-zinc-500 mt-1">
            {searchQuery ? 'Try adjusting your search criteria' : 'Citizens will appear here when they enroll in your events'}
          </p>
        </div>
      )}
    </div>
  );
}
