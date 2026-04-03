'use client';

import { CivicEvent } from '@/lib/firestore';

interface UpcomingNearYouProps {
  events: CivicEvent[];
}

const CATEGORY_EMOJI: Record<string, string> = {
  'Blood Donation': '🩸',
  'Environmental': '🌿',
  'Health': '🏥',
  'Volunteering': '🤝',
  'Community': '👥',
  'Education': '📚',
  'Governance': '🏛️',
  'Other': '📋',
};

export default function UpcomingNearYou({ events }: UpcomingNearYouProps) {
  // Show first 3 events
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="md:col-span-4 bg-gray-100 p-8 rounded-3xl">
      <h3 className="text-xl font-black text-green-700 mb-6">Upcoming Near You</h3>
      <div className="space-y-6">
        {upcomingEvents.map((event, index) => (
          <div
            key={event.id}
            className={`flex gap-4 items-start ${index < upcomingEvents.length - 1 ? 'pb-6 border-b-2 border-gray-200' : ''}`}
          >
            {/* Icon */}
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg">
              {CATEGORY_EMOJI[event.category] || '📋'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{event.title}</h4>
              <p className="text-xs text-gray-600 mb-2 line-clamp-1">{event.organizationName}</p>
              <span className="text-xs font-bold text-yellow-700 uppercase tracking-tight">+{event.points} Points</span>
            </div>
          </div>
        ))}
      </div>

      <a
        href="/activities"
        className="mt-8 text-green-700 font-bold text-sm flex items-center justify-center gap-2 hover:translate-x-1 transition-transform"
      >
        View Local Map <span>→</span>
      </a>
    </div>
  );
}
