import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Types ──────────────────────────────────────────────

export type UserRole = "citizen" | "organization";

export type UserProfile = {
  clerkId: string;
  fullName: string;
  email: string;
  role: UserRole;
  totalPoints: number;
  redeemablePoints: number;
  tier: string;
  avatarType?: "custom" | "bigfive";
  avatarUrl?: string;
  createdAt: unknown;
};

export type OrganizationProfile = {
  clerkId: string;
  organizationName: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  defaultPointsPerEvent?: number;
  eventDuration?: number;
  maxParticipants?: number;
  createdAt: unknown;
};

export type CivicEvent = {
  id?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  points: number;
  organizationId: string;
  organizationName: string;
  image?: string;
  enrollmentCount?: number;
  createdAt: unknown;
};

export type Enrollment = {
  id?: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  idNumber: string;
  phone: string;
  points: number;
  attended: boolean;
  enrolledAt: unknown;
};

// ── Tier Helper ─────────────────────────────────────────

export function getTierFromPoints(points: number): string {
  if (points >= 2000) return "Lion";
  if (points >= 1000) return "Elephant";
  if (points >= 500) return "Rhino";
  return "Buffalo";
}

// ── User Functions ──────────────────────────────────────

export async function getUserProfile(clerkId: string): Promise<UserProfile | null> {
  try {
    const ref = doc(db, "users", clerkId);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data() as UserProfile;
    return null;
  } catch (error) {
    console.error("getUserProfile error:", error);
    return null;
  }
}

export async function createUserProfile(
  clerkId: string,
  fullName: string,
  email: string,
  role: UserRole
): Promise<void> {
  try {
    const ref = doc(db, "users", clerkId);
    await setDoc(ref, {
      clerkId,
      fullName,
      email,
      role,
      totalPoints: 0,
      redeemablePoints: 0,
      tier: "Buffalo",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("createUserProfile error:", error);
    throw error;
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const ref = collection(db, "users");
    const snap = await getDocs(ref);
    return snap.docs.map((d) => d.data() as UserProfile);
  } catch (error) {
    console.error("getAllUsers error:", error);
    return [];
  }
}

// ── Event Functions ─────────────────────────────────────

export async function getAllEvents(): Promise<CivicEvent[]> {
  try {
    const ref = collection(db, "events");
    const q = query(ref, orderBy("date", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CivicEvent));
  } catch (error) {
    console.error("getAllEvents error:", error);
    return [];
  }
}

export async function createEvent(
  event: Omit<CivicEvent, "id" | "createdAt">
): Promise<void> {
  try {
    await addDoc(collection(db, "events"), {
      ...event,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("createEvent error:", error);
    throw error;
  }
}

export async function getOrganizationEvents(
  organizationId: string
): Promise<CivicEvent[]> {
  try {
    const ref = collection(db, "events");
    const q = query(ref, where("organizationId", "==", organizationId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CivicEvent));
  } catch (error) {
    console.error("getOrganizationEvents error:", error);
    return [];
  }
}

// ── Enrollment Functions ────────────────────────────────

export async function enrollInEvent(
  eventId: string,
  eventTitle: string,
  userId: string,
  userName: string,
  userEmail: string,
  points: number,
  idNumber: string,
  phone: string
): Promise<void> {
  try {
    // Check if already enrolled
    const existing = await getUserEnrollments(userId);
    const alreadyEnrolled = existing.some((e) => e.eventId === eventId);
    if (alreadyEnrolled) throw new Error("You are already enrolled in this activity!");

    await addDoc(collection(db, "enrollments"), {
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
  } catch (error) {
    console.error("enrollInEvent error:", error);
    throw error;
  }
}

export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  try {
    const ref = collection(db, "enrollments");
    const q = query(ref, where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enrollment));
  } catch (error) {
    console.error("getUserEnrollments error:", error);
    return [];
  }
}

export async function getEventEnrollments(eventId: string): Promise<Enrollment[]> {
  try {
    const ref = collection(db, "enrollments");
    const q = query(ref, where("eventId", "==", eventId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enrollment));
  } catch (error) {
    console.error("getEventEnrollments error:", error);
    return [];
  }
}

export async function markAttendance(
  enrollmentId: string,
  userId: string,
  points: number
): Promise<void> {
  try {
    // 1. Mark enrollment as attended
    const enrollmentRef = doc(db, "enrollments", enrollmentId);
    await updateDoc(enrollmentRef, { attended: true });

    // 2. Add points to citizen automatically
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const currentPoints = userSnap.data()?.totalPoints ?? 0;
    const newPoints = currentPoints + points;

    await updateDoc(userRef, {
      totalPoints: increment(points),
      redeemablePoints: increment(points),
      tier: getTierFromPoints(newPoints),
    });
  } catch (error) {
    console.error("markAttendance error:", error);
    throw error;
  }
}

// ── Admin Functions ────────────────────────────────────

export async function updateUserPoints(
  userId: string,
  points: number
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const currentPoints = userSnap.data()?.totalPoints ?? 0;
    const newPoints = Math.max(0, currentPoints + points);

    await updateDoc(userRef, {
      totalPoints: newPoints,
      redeemablePoints: increment(points),
      tier: getTierFromPoints(newPoints),
    });
  } catch (error) {
    console.error("updateUserPoints error:", error);
    throw error;
  }
}

export async function resetUserPoints(userId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      totalPoints: 0,
      redeemablePoints: 0,
      tier: "Buffalo",
    });
  } catch (error) {
    console.error("resetUserPoints error:", error);
    throw error;
  }
}

export async function updateUserProfile(
  clerkId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, "users", clerkId);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("updateUserProfile error:", error);
    throw error;
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  try {
    // Delete the event
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      deleted: true,
    });
  } catch (error) {
    console.error("deleteEvent error:", error);
    throw error;
  }
}

export async function getAllEventEnrollments(eventIds: string[]): Promise<Enrollment[]> {
  try {
    if (eventIds.length === 0) return [];
    
    const ref = collection(db, "enrollments");
    const q = query(ref, where("eventId", "in", eventIds));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enrollment));
  } catch (error) {
    console.error("getAllEventEnrollments error:", error);
    return [];
  }
}