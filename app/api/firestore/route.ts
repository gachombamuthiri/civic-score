import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated with Clerk
    const session = await auth();
    if (!session?.userId) {
      console.error("Auth failed: No session or userId");
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    // Create user profile
    if (action === "createUserProfile") {
      const { clerkId, fullName, email, role } = data;
      console.log("Creating user profile:", { clerkId, sessionUserId: session.userId });
      
      if (clerkId !== session.userId) {
        console.error("User mismatch:", { clerkId, sessionUserId: session.userId });
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }

      const ref = doc(db, "users", clerkId);
      await setDoc(ref, {
        clerkId,
        fullName,
        email,
        role,
        totalPoints: 0,
        redeemablePoints: 0,
        tier: "Bronze",
        createdAt: serverTimestamp(),
      });
      console.log("User profile created successfully for:", clerkId);

      return NextResponse.json({ success: true });
    }

    // Create event
    if (action === "createEvent") {
      const { title, description, category, location, date, points, organizationId, organizationName, image } = data;
      
      const eventRef = doc(db, "events", `${Date.now()}`);
      await setDoc(eventRef, {
        title,
        description,
        category,
        location,
        date,
        points,
        organizationId,
        organizationName,
        image,
        createdAt: serverTimestamp(),
        enrollmentCount: 0,
      });

      return NextResponse.json({ success: true, eventId: eventRef.id });
    }

    // Create enrollment
    if (action === "createEnrollment") {
      const { eventId, eventTitle, userId, userName, userEmail, idNumber, phone, points } = data;
      
      if (userId !== session.userId) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }

      const enrollmentRef = doc(db, "enrollments", `${eventId}_${userId}_${Date.now()}`);
      await setDoc(enrollmentRef, {
        eventId,
        eventTitle,
        userId,
        userName,
        userEmail,
        idNumber,
        phone,
        points,
        attended: false,
        enrolledAt: serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
