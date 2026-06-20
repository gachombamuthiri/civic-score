"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Coins, X, CheckCircle2, Copy, MapPin } from "lucide-react";
import RewardCard from "@/components/RewardCard";
import {
  REWARDS,
  MOCK_BALANCE,
  handleRedeem,
  type Reward,
  type RedeemResult,
} from "@/lib/rewards";

type ModalState = "confirm" | "loading" | "success";

export default function RewardsRedemption() {
  // Mock current balance — replace with Firestore value later.
  const [balance] = useState(MOCK_BALANCE);
  const [activeReward, setActiveReward] = useState<Reward | null>(null);
  const [modalState, setModalState] = useState<ModalState>("confirm");
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [copied, setCopied] = useState(false);

  const openConfirm = (reward: Reward) => {
    setActiveReward(reward);
    setResult(null);
    setModalState("confirm");
  };

  const closeModal = () => {
    setActiveReward(null);
    setResult(null);
    setCopied(false);
    setModalState("confirm");
  };

  const confirmRedeem = async () => {
    if (!activeReward) return;
    setModalState("loading");
    const res = await handleRedeem(activeReward);
    setResult(res);
    setModalState("success");
  };

  const copyCode = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — ignore.
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 mb-3"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-green-800 tracking-tight text-balance">
              Rewards Redemption
            </h1>
            <p className="text-gray-600 mt-1">
              Spend the points you earned through civic commitment.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-yellow-200 px-5 py-3 rounded-2xl border border-yellow-300 self-start">
            <Coins className="h-5 w-5 text-yellow-800" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-800">
                Your Balance
              </p>
              <p className="text-xl font-black text-yellow-900">
                {balance} PTS
              </p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REWARDS.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              balance={balance}
              onRedeem={openConfirm}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeReward && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Confirm view */}
            {modalState === "confirm" && (
              <>
                <h2 className="font-black text-2xl text-green-800 mb-3 pr-6 text-balance">
                  Confirm Redemption
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Are you sure you want to redeem{" "}
                  <span className="font-bold text-gray-900">
                    {activeReward.title}
                  </span>{" "}
                  for{" "}
                  <span className="font-bold text-yellow-800">
                    {activeReward.points} points
                  </span>
                  ?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={confirmRedeem}
                    className="flex-1 bg-green-700 text-white py-3 rounded-xl font-black hover:bg-green-800 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-black hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Loading view */}
            {modalState === "loading" && (
              <div className="py-10 text-center">
                <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-semibold">
                  Processing your redemption...
                </p>
              </div>
            )}

            {/* Success view */}
            {modalState === "success" && result && (
              <div className="text-center">
                <CheckCircle2
                  className="h-14 w-14 text-green-700 mx-auto mb-3"
                  aria-hidden="true"
                />
                <h2 className="font-black text-2xl text-green-800 mb-1">
                  Redemption Successful!
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  You redeemed{" "}
                  <span className="font-bold text-gray-900">
                    {activeReward.title}
                  </span>
                  .
                </p>

                {result.type === "discount" ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-green-800 mb-2">
                      Your Discount Code
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="text-2xl font-black text-green-800 tracking-wider">
                        {result.code}
                      </code>
                      <button
                        type="button"
                        onClick={copyCode}
                        className="text-green-700 hover:text-green-900"
                        aria-label="Copy code"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-green-700 mt-3">
                      Apply this code at checkout with our partner store.
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-5 mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-yellow-800 mb-2">
                      Digital Voucher Claim ID
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="text-2xl font-black text-yellow-900 tracking-wider">
                        {result.code}
                      </code>
                      <button
                        type="button"
                        onClick={copyCode}
                        className="text-yellow-800 hover:text-yellow-900"
                        aria-label="Copy claim ID"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-yellow-800 mt-3 flex items-center justify-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      Present this ID at the partnering facility to claim.
                    </p>
                  </div>
                )}

                {copied && (
                  <p className="text-xs text-green-700 font-semibold mt-2">
                    Copied to clipboard!
                  </p>
                )}

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-6 w-full bg-green-700 text-white py-3 rounded-xl font-black hover:bg-green-800 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
