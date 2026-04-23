"use client";

import { Suspense } from "react";
import OrganizationPortalContent from "./OrganizationPortalContent";

export default function OrganizationPortal() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 font-semibold">Loading portal...</p>
        </div>
      </main>
    }>
      <OrganizationPortalContent />
    </Suspense>
  );
}
