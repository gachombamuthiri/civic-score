"use client";

const activities = [
  {
    id: 1,
    title: "National Blood Drive",
    category: "High Impact",
    location: "Kenyatta National Hospital",
    points: 500
  },
  {
    id: 2,
    title: "Coastal Clean-up",
    category: "Environmental",
    location: "Nyali Beach, Mombasa",
    points: 350
  },
  {
    id: 3,
    title: "Town Hall Meeting",
    category: "Governance",
    location: "Nairobi City Hall",
    points: 200
  }
];

export default function FeaturedActivities() {
  return (
    <section className="py-24 px-8 overflow-hidden bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[2px] w-20 bg-primary"></div>
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Featured Civic Activities</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col bg-surface-container-low rounded-3xl overflow-hidden group"
            >
              {/* Image Area */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-700">🌍</div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-primary uppercase">
                  {activity.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline font-bold text-xl text-primary">
                    {activity.title}
                  </h3>
                  <span className="text-secondary font-bold">+{activity.points} pts</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-6">
                  <span>📍</span>
                  {activity.location}
                </div>

                <button className="w-full py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
