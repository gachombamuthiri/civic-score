'use client';

import DashboardHero from '@/components/DashboardHero';
import LandingFooter from '@/components/LandingFooter';
import PointsCard from '@/components/PointsCard';
import TierCard from '@/components/TierCard';
import RecentActivity from '@/components/RecentActivity';
import RewardsSection from '@/components/RewardsSection';

export default function CitizenDashboard() {
  return (
    <main className="pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Hero Header */}
      <DashboardHero />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Points & Tier Section */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Total Points Card */}
          <PointsCard />

          {/* Tier Badge Card */}
          <TierCard />
        </div>

        {/* Recent Activity Section */}
        <div className="md:col-span-4">
          <RecentActivity />
        </div>

        {/* Rewards Section */}
        <RewardsSection />
      </div>
      <LandingFooter />
    </main>
  );
}