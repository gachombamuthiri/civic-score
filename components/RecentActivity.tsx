'use client';

export default function RecentActivity() {
  const activities = [
    {
      icon: '🌱',
      title: 'Park Cleanup Drive',
      date: 'May 12, 2024 • Nairobi City',
      points: 50,
    },
    {
      icon: '👥',
      title: 'Town Hall Meeting',
      date: 'April 28, 2024 • Kisumu',
      points: 30,
    },
    {
      icon: '🌳',
      title: 'Tree Planting Day',
      date: 'April 15, 2024 • Eldoret',
      points: 100,
      opacity: true,
    },
  ];

  return (
    <div className="bg-gray-50 rounded-3xl p-8 shadow-inner">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-green-700 text-xl tracking-tight">Recent Activity</h3>
        <span className="text-2xl">⏰</span>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className={`bg-white p-4 rounded-xl flex items-center gap-4 transition-transform hover:translate-x-1 ${
              activity.opacity ? 'opacity-60' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-xl">
              {activity.icon}
            </div>
            
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.date}</p>
            </div>
            
            <span className="text-green-700 font-bold text-sm">+{activity.points}</span>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2 text-green-700 font-bold text-sm hover:underline">
        View All History
      </button>
    </div>
  );
}
