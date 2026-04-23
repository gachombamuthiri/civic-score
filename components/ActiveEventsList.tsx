'use client';

interface ActiveEvent {
  id: string;
  title: string;
  date: string;
  enrolledCount: number;
  totalSlots: number;
  status: 'active' | 'upcoming' | 'completed';
}

interface ActiveEventsListProps {
  events?: ActiveEvent[];
}

export default function ActiveEventsList({ events }: ActiveEventsListProps) {
  const defaultEvents: ActiveEvent[] = [
    {
      id: '1',
      title: 'Nairobi Reforestation Drive',
      date: 'MAY 12',
      enrolledCount: 45,
      totalSlots: 100,
      status: 'active',
    },
    {
      id: '2',
      title: 'Coastal Cleanup Kwale',
      date: 'JUN 05',
      enrolledCount: 0,
      totalSlots: 100,
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'Tech Literacy Workshop',
      date: 'JUN 18',
      enrolledCount: 32,
      totalSlots: 100,
      status: 'upcoming',
    },
  ];

  const displayEvents = events || defaultEvents;

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-zinc-900 flex items-center gap-2">
        Active Events
        <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold">
          LIVE
        </span>
      </h4>
      <div className="space-y-3">
        {displayEvents.map((event) => (
          <div
            key={event.id}
            className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
              event.status === 'active'
                ? 'bg-white border-emerald-900'
                : 'bg-white opacity-60 grayscale hover:grayscale-0 border-zinc-200'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-bold text-sm">{event.title}</h5>
              <span className="text-[10px] font-bold text-zinc-400">{event.date}</span>
            </div>
            <div className="flex items-center space-x-3">
              {event.status === 'active' && (
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-zinc-400 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                    +{event.enrolledCount - 2}
                  </div>
                </div>
              )}
              <span className="text-xs text-zinc-500">
                {event.enrolledCount > 0
                  ? `${event.enrolledCount}/${event.totalSlots} enrolled`
                  : 'Registration open'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
