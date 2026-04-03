'use client';

import { useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';
import AuthHeader from '@/components/AuthHeader';
import AuthBrandingPanel from '@/components/AuthBrandingPanel';
import AuthFooter from '@/components/AuthFooter';
import Link from 'next/link';

export default function OrganizationSignUpPage() {
  useEffect(() => {
    // Store the role in localStorage so role-select can access it
    localStorage.setItem('selectedRole', 'organization');
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <AuthHeader />
      
      <div className="flex-1">
        <div className="grid grid-cols-12 min-h-[calc(100vh-80px)]">
          {/* Left Branding Panel */}
          <AuthBrandingPanel />
          
          {/* Right Sign Up Form */}
          <div className="lg:col-span-7 p-8 md:p-16 flex flex-col bg-white overflow-y-auto">
            {/* Back Button */}
            <Link 
              href="/sign-up" 
              className="text-green-700 font-bold mb-6 hover:underline flex items-center gap-1"
            >
              ← Change Role
            </Link>

            {/* Role Indicator */}
            <div className="inline-flex items-center gap-2 mb-6 bg-yellow-50 px-4 py-2 rounded-lg w-fit">
              <span className="text-xl">🏛️</span>
              <span className="text-yellow-700 font-bold text-sm">Creating organization account</span>
            </div>

            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 bg-transparent p-0",
                }
              }}
            />
          </div>
        </div>
      </div>

      <AuthFooter />
    </main>
  );
}