// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isOrgRoute = createRouteMatcher(["/organization(.*)"]);
const isCitizenRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  
  // 1. Protect all private routes
  if (isOrgRoute(req) || isCitizenRoute(req)) {
    await auth.protect();
  }

  // 2. Role-Based Access Control (RBAC)
const role = (sessionClaims?.metadata as { role?: string })?.role;


  if (isOrgRoute(req) && role !== "organization") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isCitizenRoute(req) && role !== "citizen") {
    return NextResponse.redirect(new URL("/organization", req.url));
  }
});