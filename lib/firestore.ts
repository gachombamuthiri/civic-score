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
  if (points >= 2000) return "Elite";
  if (points >= 1000) return "Gold";
  if (points >= 500) return "Silver";
  return "Bronze";
}

// ── User Functions ──────────────────────────────────────

export async function getUserProfile(clerkId: string): Promise<UserProfile | null> {
  const ref = doc(db, "users", clerkId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as UserProfile;
  return null;
}

export async function createUserProfile(
  clerkId: string,
  fullName: string,
  email: string,
  role: UserRole
): Promise<void> {
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
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const ref = collection(db, "users");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as UserProfile);
}

// ── Event Functions ─────────────────────────────────────

export async function getAllEvents(): Promise<CivicEvent[]> {
  const ref = collection(db, "events");
  const q = query(ref, orderBy("date", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CivicEvent));
}

export async function createEvent(event: Omit<CivicEvent, "id" | "createdAt">): Promise<void> {
  await addDoc(collection(db, "events"), {
    ...event,
    createdAt: serverTimestamp(),
  });
}

export async function getOrganizationEvents(organizationId: string): Promise<CivicEvent[]> {
  const ref = collection(db, "events");
  const q = query(ref, where("organizationId", "==", organizationId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CivicEvent));
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
}

export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  const ref = collection(db, "enrollments");
  const q = query(ref, where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enrollment));
}

export async function getEventEnrollments(eventId: string): Promise<Enrollment[]> {
  const ref = collection(db, "enrollments");
  const q = query(ref, where("eventId", "==", eventId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enrollment));
}

export async function markAttendance(
  enrollmentId: string,
  userId: string,
  points: number
): Promise<void> {
  const enrollmentRef = doc(db, "enrollments", enrollmentId);
  await updateDoc(enrollmentRef, { attended: true });

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const currentPoints = userSnap.data()?.totalPoints ?? 0;
  const newPoints = currentPoints + points;

  await updateDoc(userRef, {
    totalPoints: increment(points),
    redeemablePoints: increment(points),
    tier: getTierFromPoints(newPoints),
  });
}