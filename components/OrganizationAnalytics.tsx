'use client';

import { CivicEvent, Enrollment } from '@/lib/firestore';

interface OrganizationAnalyticsProps {
  events: CivicEvent[];
  enrollments: Enrollment[];
}

export default function OrganizationAnalytics({
  events,
  enrollments,
}: OrganizationAnalyticsProps) {
  // Calculate real-time analytics
  const totalEvents = events.length;
  const activeEvents = events.filter(e => new Date(e.date) >= new Date()).length;
  const totalEnrolled = enrollments.length;
  const totalVerified = enrollments.filter(e => e.attended).length;
  const pendingApproval = enrollments.filter(e => !e.attended).length;
  const totalImpact = enrollments.reduce((sum, e) => (e.attended ? sum + e.points : sum), 0);

  const stats = [
    {
      title: 'Total Impact',
      value: totalImpact.toLocaleString(),
      unit: 'PTS',
      icon: '📈',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Active Events',
      value: activeEvents,
      unit: 'Events',
      icon: '📅',
      color: 'from-blue-600 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Pending Approval',
      value: pendingApproval,
      unit: 'Citizens',
      icon: '⏳',
      color: 'from-yellow-600 to-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-zinc-900">📊 Analytics Dashboard</h2>
        <p className="text-sm text-zinc-500 mt-1">Real-time performance metrics for your organization</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.bgColor} border-2 border-transparent rounded-xl p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`${stat.textColor} font-bold uppercase tracking-widest text-xs mb-2`}>
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`${stat.textColor} text-5xl font-black`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </span>
                  <span className={`${stat.textColor} font-bold text-sm`}>{stat.unit}</span>
                </div>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Summary */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-4">📋 Event Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
              <span className="text-zinc-700 font-semibold">Total Events Created</span>
              <span className="text-2xl font-black text-emerald-900">{totalEvents}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
              <span className="text-zinc-700 font-semibold">Active Events</span>
              <span className="text-2xl font-black text-blue-900">{activeEvents}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
              <span className="text-zinc-700 font-semibold">Completed Events</span>
              <span className="text-2xl font-black text-gray-900">{totalEvents - activeEvents}</span>
            </div>
          </div>
        </div>

        {/* Participation Summary */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-4">👥 Participation Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
              <span className="text-zinc-700 font-semibold">Total Enrolled</span>
              <span className="text-2xl font-black text-purple-900">{totalEnrolled}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
              <span className="text-zinc-700 font-semibold">Verified Attendees</span>
              <span className="text-2xl font-black text-emerald-900">{totalVerified}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
              <span className="text-zinc-700 font-semibold">Pending Review</span>
              <span className="text-2xl font-black text-yellow-900">{pendingApproval}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Rate */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-bold text-emerald-900 mb-4">📊 Engagement Rate</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-700 mb-2">Attendance Verification Rate</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-900">
                {totalEnrolled > 0 ? Math.round((totalVerified / totalEnrolled) * 100) : 0}%
              </span>
              <span className="text-emerald-700 font-bold">({totalVerified}/{totalEnrolled})</span>
            </div>
          </div>
          <div className="w-32 h-32 rounded-full flex items-center justify-center bg-emerald-100">
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>
    </div>
  );
}
