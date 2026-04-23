"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LandingFooter from "@/components/LandingFooter";
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/lib/firestore";

const BIG_FIVE_AVATARS = [
  { id: "lion", name: "Lion", emoji: "🦁", description: "King of the Savannah" },
  { id: "elephant", name: "Elephant", emoji: "🐘", description: "Gentle Giant" },
  { id: "rhino", name: "Rhino", emoji: "🦏", description: "Armored Warrior" },
  { id: "buffalo", name: "Buffalo", emoji: "🦬", description: "Cape Buffalo" },
  { id: "leopard", name: "Leopard", emoji: "🐆", description: "Spotted Hunter" },
];

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [customImage, setCustomImage] = useState<string>("");
  const [useCustomImage, setUseCustomImage] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        let userProfile = await getUserProfile(user.id);

        // If no profile exists, redirect to role-select
        if (!userProfile) {
          router.push('/role-select');
          return;
        }

        setProfile(userProfile);
        if (userProfile?.avatarType === "custom") {
          setUseCustomImage(true);
          setCustomImage(userProfile.avatarUrl || "");
        } else if (userProfile?.avatarType === "bigfive") {
          setSelectedAvatar(userProfile.avatarUrl || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) loadProfile();
  }, [user, isLoaded]);

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const avatarType = useCustomImage ? "custom" : "bigfive";
      const avatarUrl = useCustomImage ? customImage : selectedAvatar;

      await updateUserProfile(user.id, {
        avatarType,
        avatarUrl,
      });

      setProfile(prev => prev ? { ...prev, avatarType, avatarUrl } : null);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#087B90] to-[#0a8fa3] px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard" className="text-white/80 hover:text-white text-sm font-semibold">
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-black text-white">My Profile</h1>
          <p className="text-white/70 text-sm mt-1">Customize your CivicScore profile</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Profile Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-6">Profile Information</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profile?.fullName || user.fullName || ""}
                  disabled
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={profile?.email || user.primaryEmailAddress?.emailAddress || ""}
                  disabled
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Account Type</label>
                <input
                  type="text"
                  value={profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Citizen"}
                  disabled
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Total Points</label>
                <input
                  type="text"
                  value={profile?.totalPoints?.toLocaleString() || "0"}
                  disabled
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Avatar Selection */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-6">Choose Your Avatar</h2>

            {/* Avatar Type Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setUseCustomImage(false)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
                  !useCustomImage
                    ? "bg-[#087B90] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🦁 Big Five Animals
              </button>
              <button
                onClick={() => setUseCustomImage(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
                  useCustomImage
                    ? "bg-[#087B90] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                📷 Custom Photo
              </button>
            </div>

            {/* Big Five Avatars */}
            {!useCustomImage && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Choose from Kenya's Big Five animals:</p>
                <div className="grid grid-cols-1 gap-3">
                  {BIG_FIVE_AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        selectedAvatar === avatar.id
                          ? "border-[#087B90] bg-[#087B90]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-4xl">{avatar.emoji}</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">{avatar.name}</p>
                        <p className="text-xs text-gray-500">{avatar.description}</p>
                      </div>
                      {selectedAvatar === avatar.id && (
                        <span className="ml-auto text-[#087B90] font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Image Upload */}
            {useCustomImage && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Upload your own profile picture:</p>

                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {customImage ? (
                      <img
                        src={customImage}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-gray-400">👤</span>
                    )}
                  </div>

                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors">
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {customImage && (
                    <button
                      onClick={() => setCustomImage("")}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={saving || (useCustomImage ? !customImage : !selectedAvatar)}
              className="w-full mt-6 bg-[#087B90] text-white font-bold py-3 rounded-xl hover:bg-[#076870] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>

        </div>
      </div>
      <LandingFooter />
    </main>
  );
}