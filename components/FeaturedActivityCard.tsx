'use client';

import Image from 'next/image';
import { CivicEvent } from '@/lib/firestore';

interface FeaturedActivityCardProps {
  event: CivicEvent;
  onEnroll?: (event: CivicEvent) => void;
}

export default function FeaturedActivityCard({ event, onEnroll }: FeaturedActivityCardProps) {
  return (
    <div className="md:col-span-8 bg-white rounded-3xl overflow-hidden shadow-lg group relative">
      {/* Image Section */}
      <div className="h-96 w-full relative overflow-hidden bg-gradient-to-br from-green-100 to-green-50">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 text-8xl">
            🌱
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Category Badges */}
        <div className="absolute top-6 left-6 flex gap-3">
          <span className="bg-yellow-300 text-yellow-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Lion Tier Reward
          </span>
          <span className="bg-green-700 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            {event.category}
          </span>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex justify-between items-end">
            <div className="text-white max-w-md">
              <span className="text-green-300 font-bold text-sm mb-2 block">{event.organizationName}</span>
              <h2 className="text-3xl font-black mb-4">{event.title}</h2>
              <div className="flex items-center gap-6 text-sm text-gray-200">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  {event.date}
                </div>
                <div className="flex items-center gap-2 font-bold text-yellow-300">
                  <span>⭐</span>
                  +{event.points} Points
                </div>
              </div>
            </div>
            <button
              onClick={() => onEnroll?.(event)}
              className="bg-yellow-300 text-yellow-900 px-10 py-4 rounded-full font-black hover:bg-yellow-400 transition-colors shadow-lg active:scale-95 whitespace-nowrap"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
