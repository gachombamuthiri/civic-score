"use client";

import { useState, type FormEvent } from "react";
import { Gift, CheckCircle2 } from "lucide-react";
import {
  REWARD_CATEGORIES,
  handleAddReward,
  type RewardCategory,
  type RewardType,
} from "@/lib/rewards";

export default function AdminRewardForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<RewardCategory>("Wellness");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [points, setPoints] = useState("");
  const [type, setType] = useState<RewardType>("discount");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setTitle("");
    setCategory("Wellness");
    setDescription("");
    setImage("");
    setPoints("");
    setType("discount");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    await handleAddReward({
      title,
      category,
      description,
      image,
      points: Number(points) || 0,
      type,
    });

    setSubmitting(false);
    setSuccess(true);
    resetForm();
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Gift className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-black text-lg text-green-800">
              Add New Reward
            </h2>
            <p className="text-xs text-gray-500">
              Publish a reward to the redemption catalog.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold rounded-xl px-4 py-3">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Reward published successfully.
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="reward-title"
              className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2"
            >
              Reward Title
            </label>
            <input
              id="reward-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Elite Gym Pass"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-700 text-sm"
            />
          </div>

          {/* Category + Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="reward-category"
                className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2"
              >
                Category
              </label>
              <select
                id="reward-category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as RewardCategory)
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-700 text-sm"
              >
                {REWARD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="reward-points"
                className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2"
              >
                Point Cost
              </label>
              <input
                id="reward-points"
                type="number"
                min="0"
                required
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="450"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-700 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="reward-description"
              className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2"
            >
              Description
            </label>
            <textarea
              id="reward-description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the reward and how to use it."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-700 text-sm resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="reward-image"
              className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2"
            >
              Image URL
            </label>
            <input
              id="reward-image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://... or /local-image.png"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-700 text-sm"
            />
          </div>

          {/* Reward Type */}
          <div>
            <span className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
              Reward Type
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { value: "discount", label: "Discount Code" },
                  { value: "voucher", label: "Physical / Service Voucher" },
                ] as { value: RewardType; label: string }[]
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                    type === opt.value
                      ? "border-green-700 bg-green-50"
                      : "border-gray-200 bg-gray-50 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reward-type"
                    value={opt.value}
                    checked={type === opt.value}
                    onChange={() => setType(opt.value)}
                    className="accent-green-700"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-700 text-white py-3.5 rounded-xl font-black hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Publishing..." : "Publish Reward"}
          </button>
        </form>
      </div>
    </div>
  );
}
