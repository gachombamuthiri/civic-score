// Shared types, mock data, and placeholder handlers for the Rewards & Redemption feature.
// Wire these placeholder functions to Firebase (Firestore) + Clerk later.

export type RewardType = "discount" | "voucher";

export type RewardCategory =
  | "Wellness"
  | "Tech"
  | "Travel"
  | "Transport"
  | "Food";

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: RewardCategory;
  points: number;
  image: string;
  type: RewardType;
}

// Mock current balance for the signed-in citizen.
// Replace with the real value from Firestore (e.g. userProfile.redeemablePoints).
export const MOCK_BALANCE = 600;

export const REWARDS: Reward[] = [
  {
    id: "elite-gym-pass",
    title: "Elite Gym Pass",
    description:
      "One month unlimited access to any partnering civic-wellness facility.",
    category: "Wellness",
    points: 450,
    image: "/gym-pic.png",
    type: "voucher",
  },
  {
    id: "eco-heritage-tour",
    title: "Eco-Heritage Tour",
    description:
      "Guided weekend tour of the Great Rift Valley eco-conservation sites.",
    category: "Travel",
    points: 800,
    image: "/greenland.png",
    type: "voucher",
  },
  {
    id: "citizen-tech-voucher",
    title: "Citizen Tech Voucher",
    description:
      "20% discount on sustainable tech products from authorized partners.",
    category: "Tech",
    points: 200,
    image: "/tech-products.png",
    type: "discount",
  },
  {
    id: "coastal-getaway",
    title: "Coastal Getaway Discount",
    description:
      "15% off eco-friendly stays along the Kenyan coast with our travel partners.",
    category: "Travel",
    points: 550,
    image: "/coastal-image.png",
    type: "discount",
  },
  {
    id: "green-commute-pass",
    title: "Green Commute Pass",
    description:
      "Free week of electric matatu and shuttle rides on partnering routes.",
    category: "Transport",
    points: 300,
    image: "/cityhall.png",
    type: "voucher",
  },
  {
    id: "urban-forest-day",
    title: "Urban Forest Day",
    description:
      "Complimentary family pass to Karura Forest guided nature walks.",
    category: "Wellness",
    points: 150,
    image: "/karura.png",
    type: "voucher",
  },
];

export const REWARD_CATEGORIES: RewardCategory[] = [
  "Wellness",
  "Tech",
  "Travel",
  "Transport",
  "Food",
];

// Returns Tailwind classes for a category tag, alternating green / yellow accents.
export function categoryStyles(category: RewardCategory): string {
  switch (category) {
    case "Tech":
    case "Transport":
      return "bg-yellow-200 text-yellow-800";
    default:
      return "bg-green-100 text-green-800";
  }
}

// ── Placeholder backend handlers ──────────────────────────────────────────
// Replace these with real Firestore writes + Clerk user context.

export interface RedeemResult {
  type: RewardType;
  // Discount code for discount-type rewards, claim ID for voucher-type rewards.
  code: string;
}

export async function handleRedeem(reward: Reward): Promise<RedeemResult> {
  // TODO: deduct points in Firestore, record the redemption against the Clerk user,
  // and generate / fetch a real code from your backend.
  console.log("[v0] handleRedeem called for reward:", reward.id);

  if (reward.type === "discount") {
    const slug = reward.category.toUpperCase().slice(0, 4);
    return { type: "discount", code: `CIVIC-${slug}-20` };
  }

  const claim = Math.floor(1000 + Math.random() * 9000);
  return { type: "voucher", code: `VOUCHER-${claim}` };
}

export async function handleAddReward(
  reward: Omit<Reward, "id">
): Promise<Reward> {
  // TODO: write the new reward document to Firestore.
  console.log("[v0] handleAddReward called with:", reward);
  return { ...reward, id: `${Date.now()}` };
}
