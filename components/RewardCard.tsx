"use client";

import Image from "next/image";
import { Coins } from "lucide-react";
import { categoryStyles, type Reward } from "@/lib/rewards";

interface RewardCardProps {
  reward: Reward;
  balance: number;
  onRedeem: (reward: Reward) => void;
}

export default function RewardCard({
  reward,
  balance,
  onRedeem,
}: RewardCardProps) {
  const canAfford = balance >= reward.points;

  return (
    <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 border-b-4 border-b-green-900/10 group">
      {/* Image thumbnail */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={reward.image || "/placeholder.svg"}
          alt={reward.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <span
          className={`absolute top-3 left-3 ${categoryStyles(
            reward.category
          )} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest`}
        >
          {reward.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-lg text-green-800 mb-1 text-balance">
          {reward.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1 text-pretty">
          {reward.description}
        </p>

        {/* Footer: cost left, redeem right */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-yellow-800 font-bold">
            <Coins className="h-4 w-4" aria-hidden="true" />
            <span>{reward.points} PTS</span>
          </div>

          <button
            type="button"
            onClick={() => onRedeem(reward)}
            disabled={!canAfford}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              canAfford
                ? "bg-green-700 text-white hover:bg-green-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {canAfford ? "Redeem" : "Insufficient Points"}
          </button>
        </div>
      </div>
    </div>
  );
}
