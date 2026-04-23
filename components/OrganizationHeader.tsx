'use client';

interface OrganizationHeaderProps {
  title?: string;
  activeSection?: 'dashboard' | 'activities' | 'rewards' | 'attendance';
}

export default function OrganizationHeader({
  title = 'Attendance',
  activeSection = 'activities',
}: OrganizationHeaderProps) {
  const sections = [
    { id: 'dashboard', label: 'Home' },
    { id: 'activities', label: 'Dashboard' },
    { id: 'rewards', label: 'Activities' },
    { id: 'attendance', label: 'Rewards' },
  ];

  return (
    <header className="sticky top-0 w-full flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md z-30 shadow-sm border-b border-zinc-200">
      <div className="flex items-center space-x-8">
        <h2 className="text-2xl font-black text-emerald-900">{title}</h2>
        <div className="hidden md:flex space-x-6">
          {sections.map((section) => (
            <a
              key={section.id}
              href="#"
              className={`text-sm font-medium tracking-tight transition-colors ${
                activeSection === section.id
                  ? 'text-emerald-900 font-bold border-b-2 border-emerald-900 pb-1'
                  : 'text-zinc-600 hover:text-emerald-800'
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative group">
          <button className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-all">
            🔔
          </button>
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
        </div>

        {/* Admin Profile */}
        <div className="flex items-center space-x-3 bg-zinc-100 px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-all cursor-pointer">
          <span className="text-lg">👤</span>
          <span className="text-sm font-bold text-emerald-900">Admin</span>
        </div>
      </div>
    </header>
  );
}
