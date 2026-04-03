import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClass = "font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2";

  const sizeClass = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }[size];

  const variantClass = {
    primary: "bg-[#087B90] text-white hover:bg-[#076870] disabled:opacity-50",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
  }[variant];

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseClass} ${sizeClass} ${variantClass} ${props.className || ""}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
