import React from "react";

interface BadgeProps {
  label: string;
  icon?: string;
  color?: "gold" | "silver" | "bronze" | "teal";
  className?: string;
}

export function Badge({ label, icon, color = "teal", className = "" }: BadgeProps) {
  const colorClass = {
    gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
    silver: "bg-gray-100 text-gray-800 border-gray-200",
    bronze: "bg-amber-100 text-amber-800 border-amber-200",
    teal: "bg-teal-100 text-teal-800 border-teal-200",
  }[color];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${colorClass} ${className}`}>
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </div>
  );
}
