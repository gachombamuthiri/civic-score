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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Types ──────────────────────────────────────────────

export type UserProfile = {
  clerkId: string;
  fullName: string;
  email: string;
  totalPoints: number;
  redeemablePoints: number;
  tier: string;
  createdAt: unknown;
};

export type Activity = {
  id?: string;
  userId: string;
  action: string;
  points: number;
  verified: boolean;
  date: unknown;
  category: string;
};

// ── User Functions ──────────────────────────────────────

// Get a user profile from Firestore
export async function getUserProfile(clerkId: string): Promise<UserProfile | null> {
  const ref = doc(db, "users", clerkId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}

// Create a new user profile in Firestore (called after sign-up)
export async function createUserProfile(
  clerkId: string,
  fullName: string,
  email: string
): Promise<void> {
  const ref = doc(db, "users", clerkId);
  await setDoc(ref, {
    clerkId,
    fullName,
    email,
    totalPoints: 0,
    redeemablePoints: 0,
    tier: "Bronze",
    createdAt: serverTimestamp(),
  });
}

// ── Activity Functions ──────────────────────────────────

// Get all activities for a user
export async function getUserActivities(userId: string): Promise<Activity[]> {
  const ref = collection(db, "activities");
  const q = query(
    ref,
    where("userId", "==", userId),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Activity));
}

// Add a new activity (submitted by citizen, pending verification)
export async function submitActivity(
  userId: string,
  action: string,
  category: string,
  points: number
): Promise<void> {
  await addDoc(collection(db, "activities"), {
    userId,
    action,
    category,
    points,
    verified: false,
    date: serverTimestamp(),
  });
}

// ── Tier Helper ─────────────────────────────────────────

export function getTierFromPoints(points: number): string {
  if (points >= 2000) return "Elite";
  if (points >= 1000) return "Gold";
  if (points >= 500) return "Silver";
  return "Bronze";
}