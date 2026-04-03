'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedActivities() {
  const activities = [
    {
      image: '/blood-donation.png',
      category: 'HEALTH',
      title: 'National Blood Drive',
      points: 500,
    },
    {
      image: '/coastal-image.png',
      category: 'ENVIRONMENT',
      title: 'Coastal Clean-up',
      points: 350,
    },
    {
      image: '/cityhall.png',
      category: 'GOVERNANCE',
      title: 'Town Hall Meeting',
      points: 200,
    },
  ];

  return (
    <section className="bg-white px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
            <span className="inline-block w-1 h-12 bg-green-700 rounded"></span>
            Featured Civic Activities
          </h2>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {activities.map((activity, index) => (
            <div key={index} className="group">
              {/* Activity Card Image */}
              <div className="relative h-60 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {activity.category}
                </div>
              </div>

              {/* Activity Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-lg font-bold text-green-700">+ {activity.points} pts</p>
                </div>

                {/* Enroll Button */}
                <Link href="/activities">
                  <button className="w-full py-3 border-2 border-gray-400 text-gray-700 font-semibold rounded-lg hover:border-green-700 hover:text-green-700 transition-all">
                    Enroll Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link href="/activities">
            <span className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 transition gap-2">
              View All Activities
              <span>→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
