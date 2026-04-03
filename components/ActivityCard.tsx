'use client';

import Image from 'next/image';
import { CivicEvent } from '@/lib/firestore';

interface ActivityCardProps {
  event: CivicEvent;
  enrolled?: boolean;
  onEnroll?: (event: CivicEvent) => void;
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

const PLACEHOLDER_IMAGES: Record<string, string> = {
  'Blood Donation': 'medical-staff',
  'Environmental': 'tree-planting',
  'Health': 'health-checkup',
  'Volunteering': 'volunteering',
  'Community': 'community-gathering',
  'Education': 'literacy-program',
  'Governance': 'town-hall',
  'Other': 'civic-activity',
};

export default function ActivityCard({ event, enrolled = false, onEnroll }: ActivityCardProps) {
  const emoji = CATEGORY_EMOJI[event.category] || '📋';
  
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-gray-200 group">
      {/* Image */}
      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden mb-6 relative bg-gradient-to-br from-green-100 to-green-50">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-green-50 to-green-100">
            {emoji}
          </div>
        )}
      </div>

      {/* Category Badge & Points */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-black text-yellow-700 tracking-widest uppercase bg-yellow-100 px-3 py-1 rounded-lg">
          {event.category}
        </span>
        <div className="flex items-center gap-1 font-bold text-green-700">
          <span className="text-sm">⭐</span>
          {event.points}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-extrabold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">{event.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Date</span>
          <span className="text-sm font-bold text-gray-900">{event.date}</span>
        </div>
        {enrolled ? (
          <div className="bg-green-100 text-green-700 px-6 py-2.5 rounded-full font-bold text-sm">
            ✓ Enrolled
          </div>
        ) : (
          <button
            onClick={() => onEnroll?.(event)}
            className="bg-green-700 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-800 transition-all active:scale-95"
          >
            Enroll
          </button>
        )}
      </div>
    </div>
  );
}
