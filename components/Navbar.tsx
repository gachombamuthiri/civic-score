'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, UserButton, useUser, useOrganization } from "@clerk/nextjs";
import CivicScoreLogo from "./CivicScoreLogo";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { UserRole } from "@/lib/firestore";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function loadUserRole() {
      if (!user) { 
        setLoading(false); 
        return; 
      }
      try {
        // Priority 1: Check if user is in an active Clerk organization
        if (organization) { 
          setUserRole("organization"); 
          setLoading(false); 
          return; 
        }

        // Priority 2: Check Firestore for the user's role
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) { 
          setUserRole(userSnap.data().role as UserRole); 
        }
      } catch (error) { 
        console.error("Error loading user role:", error); 
      } finally { 
        setLoading(false); 
      }
    }

    if (isSignedIn && user) { 
      loadUserRole(); 
    } else { 
      setLoading(false); 
    }
  }, [user, isSignedIn, organization]);

  // Determine the correct dashboard link based on role
  const dashboardHref = userRole === "organization" ? "/organization" : "/dashboard";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/activities", label: "Activities" },
    // Show the dynamic dashboard link only if signed in
    ...(isSignedIn ? [{ href: dashboardHref, label: userRole === "organization" ? "Organization Portal" : "My Dashboard" }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-white border-gray-100 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <CivicScoreLogo href="/" />
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`text-sm font-semibold ${pathname === link.href ? "text-green-700 border-b-2 border-green-700" : "text-gray-500 hover:text-gray-900"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {!isSignedIn ? (
            <Link href="/sign-up" className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              Get Started
            </Link>
          ) : (
            <UserButton />
          )}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold ${pathname === link.href ? "text-green-700" : "text-gray-500"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
  

