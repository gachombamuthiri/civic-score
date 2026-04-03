export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number; // minimum points
  color: "gold" | "silver" | "bronze" | "teal";
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_step",
    name: "First Step",
    description: "Enroll in your first activity",
    icon: "🎯",
    requirement: 0,
    color: "bronze",
  },
  {
    id: "civic_contributor",
    name: "Civic Contributor",
    description: "Earn your first 100 points",
    icon: "🌱",
    requirement: 100,
    color: "bronze",
  },
  {
    id: "dedicated_citizen",
    name: "Dedicated Citizen",
    description: "Reach 500 points in civic activities",
    icon: "⭐",
    requirement: 500,
    color: "silver",
  },
  {
    id: "community_champion",
    name: "Community Champion",
    description: "Earn 1000 points through active engagement",
    icon: "🏆",
    requirement: 1000,
    color: "gold",
  },
  {
    id: "civic_elite",
    name: "Civic Elite",
    description: "Achieve the Elite tier with 2000+ points",
    icon: "👑",
    requirement: 2000,
    color: "gold",
  },
];

export function getUnlockedAchievements(points: number): Achievement[] {
  return ACHIEVEMENTS.filter((a) => points >= a.requirement);
}

export function getNextAchievement(points: number): Achievement | null {
  const locked = ACHIEVEMENTS.find((a) => points < a.requirement);
  return locked || null;
}

export function getProgressToNextAchievement(points: number): { current: number; next: number; percentage: number } | null {
  const nextAchievement = getNextAchievement(points);
  if (!nextAchievement) {
    return null;
  }

  const previousRequirement = ACHIEVEMENTS[ACHIEVEMENTS.indexOf(nextAchievement) - 1]?.requirement || 0;
  const current = points - previousRequirement;
  const next = nextAchievement.requirement - previousRequirement;
  const percentage = Math.min(Math.round((current / next) * 100), 100);

  return { current, next, percentage };
}
