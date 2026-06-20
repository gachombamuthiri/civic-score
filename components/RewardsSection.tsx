"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift, Coins, ArrowRight } from "lucide-react";
import { REWARDS, categoryStyles } from "@/lib/rewards";

export default function RewardsSection() {
  // Show only the first 3 rewards as a dashboard teaser.
  const teaser = REWARDS.slice(0, 3);

  return (
    <div className="md:col-span-12">
      <div className="flex items-center justify-between mb-8 mt-4">
        <div>
          <h2 className="text-3xl font-black text-green-800 tracking-tight">
            Your Rewards
          </h2>
          <p className="text-gray-600">
            Exclusive benefits unlocked by your civic commitment.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-yellow-200 px-4 py-2 rounded-full border border-yellow-300">
          <Gift className="h-5 w-5 text-yellow-800" aria-hidden="true" />
          <span className="text-yellow-800 font-bold text-sm tracking-tight">
            3 Available Vouchers
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teaser.map((reward) => (
          <div
            key={reward.id}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border-b-4 border-green-900/10 group"
          >
            {/* Image */}
            <div className="relative h-48 mb-6 rounded-2xl overflow-hidden">
              <Image
                src={reward.image || "/placeholder.svg"}
                alt={reward.title}
                fill
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className={`absolute top-4 left-4 ${categoryStyles(
                  reward.category
                )} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest`}
              >
                {reward.category}
              </div>
            </div>

            {/* Content */}
            <h4 className="font-bold text-xl text-green-800 mb-1">
              {reward.title}
            </h4>
            <p className="text-gray-600 text-sm mb-4">{reward.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-yellow-800 font-bold">
                <Coins className="h-4 w-4" aria-hidden="true" />
                <span>{reward.points} PTS</span>
              </div>
              <Link
                href="/rewards"
                className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-700 hover:text-white transition-colors"
              >
                Redeem
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="flex justify-center mt-8">
        <Link
          href="/rewards"
          className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors"
        >
          View More Rewards
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
