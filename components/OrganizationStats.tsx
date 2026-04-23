'use client';

interface StatsCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  variant?: 'primary' | 'default';
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
    label: string;
  };
}

interface OrganizationStatsProps {
  stats?: StatsCard[];
}

export default function OrganizationStats({ stats }: OrganizationStatsProps) {
  const defaultStats: StatsCard[] = [
    {
      title: 'Total Impact',
      value: '14,208',
      subtitle: 'Verified Civic Points awarded',
      icon: '🌱',
      variant: 'primary',
    },
    {
      title: 'Active Events',
      value: '24',
      trend: { direction: 'up', percentage: 12, label: 'increase this month' },
      variant: 'default',
    },
    {
      title: 'Pending Approval',
      value: '156',
      subtitle: 'Citizens awaiting verification',
      variant: 'default',
    },
  ];

  const displayStats = stats || defaultStats;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {displayStats.map((stat, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl relative overflow-hidden ${
            stat.variant === 'primary'
              ? 'bg-emerald-900 text-white'
              : 'bg-white border border-zinc-200 shadow-sm'
          }`}
        >
          <div className="relative z-10">
            <p
              className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                stat.variant === 'primary' ? 'text-emerald-200' : 'text-zinc-500'
              }`}
            >
              {stat.title}
            </p>
            <h3 className={`text-3xl font-black ${stat.variant === 'primary' ? 'text-white' : 'text-zinc-900'}`}>
              {stat.value}
            </h3>
            {stat.subtitle && (
              <p
                className={`text-sm mt-4 ${
                  stat.variant === 'primary' ? 'text-emerald-300' : 'text-zinc-500'
                }`}
              >
                {stat.subtitle}
              </p>
            )}
            {stat.trend && (
              <div className={`flex items-center mt-4 text-sm font-bold`}>
                <span className={stat.trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'}>
                  {stat.trend.direction === 'up' ? '📈' : '📉'} {stat.trend.percentage}% {stat.trend.label}
                </span>
              </div>
            )}
          </div>

          {/* Background Icon */}
          {stat.icon && (
            <div className="absolute -right-4 -bottom-4 opacity-10 text-9xl">
              {stat.icon}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
