'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // Added this import

interface OrganizationSidebarProps {
  activeTab?: 'events' | 'analytics' | 'attendance' | 'users' | 'settings';
}

export default function OrganizationSidebar({ activeTab: propActiveTab }: OrganizationSidebarProps) {
  const searchParams = useSearchParams();
  
  // This line ensures the sidebar knows which tab is REALLY active from the URL
  const activeTab = searchParams.get('tab') || propActiveTab || 'events';

  const navItems = [
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'attendance', label: 'Attendance', icon: '✅' },
    { id: 'users', label: 'Users', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-zinc-50 flex flex-col p-4 space-y-2 z-40 border-r border-zinc-200">
      {/* Logo Section */}
      <div className="mb-8 px-4 py-2">
        <h1 className="text-xl font-black text-emerald-900">CivicScore</h1>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Admin Console</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={`/organization?tab=${item.id}`}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-emerald-50 text-emerald-900 translate-x-1'
                : 'text-zinc-500 hover:bg-emerald-50/50 hover:translate-x-1'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-semibold text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Create Event Button - Added Link to make it functional */}
      <div className="mt-auto pt-6 border-t border-zinc-200">
        <Link 
          href="/organization?tab=events"
          className="w-full bg-emerald-900 text-white rounded-lg py-3 px-4 font-bold text-sm flex items-center justify-center space-x-2 hover:bg-emerald-800 transition-all"
        >
          <span>➕</span>
          <span>Create Event</span>
        </Link>
      </div>
    </aside>
  );
}
