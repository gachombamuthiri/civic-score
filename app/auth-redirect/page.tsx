'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function AuthRedirectPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Get the selected role from metadata or localStorage
    const roleFromMetadata = user.publicMetadata?.role as string | undefined;
    const roleFromStorage = typeof window !== 'undefined' ? localStorage.getItem('selectedRole') : null;
    const role = roleFromMetadata || roleFromStorage;

    if (role === 'organization') {
      router.push('/organization');
    } else if (role === 'citizen') {
      router.push('/dashboard');
    } else {
      // If no role is set, go to role select
      router.push('/role-select');
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-green-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white font-bold">Redirecting you to your dashboard...</p>
      </div>
    </div>
  );
}
