'use client';

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardHero from '@/components/DashboardHero';
import LandingFooter from '@/components/LandingFooter';
import PointsCard from '@/components/PointsCard';
import TierCard from '@/components/TierCard';
import RecentActivity from '@/components/RecentActivity';
import RewardsSection from '@/components/RewardsSection';
import { getUserProfile, type UserProfile } from '@/lib/firestore';

export default function CitizenDashboard() {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const profile = await getUserProfile(user.id);
        
        // Guard 1: If no profile exists, redirect to role-select
        if (!profile) {
          router.push('/role-select');
          return;
        }

        // Guard 2: If user is an Organization, redirect to organization portal
        if (profile.role === 'organization') {
          router.push('/organization');
          return;
        }

        // Only set profile if they are a citizen
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/sign-in');
        return;
      }
      loadProfile();
    }
  }, [user, isSignedIn, isLoaded]);

  // Ensure the redirect doesn't fire before the Firestore data arrives
  if (!isLoaded || loading) {
    return (
      <main className="pt-28 pb-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 font-semibold">Verifying access...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Hero Header */}
      <DashboardHero userProfile={userProfile} />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Points & Tier Section */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Total Points Card */}
          <PointsCard points={userProfile?.totalPoints ?? 0} />

          {/* Tier Badge Card */}
          <TierCard tier={userProfile?.tier ?? 'Buffalo'} points={userProfile?.totalPoints ?? 0} />
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
