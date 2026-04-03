import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormInput({ label, error, className = "", ...props }: FormInputProps) {
  return (
    <div>
      {label && (
        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#087B90] transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        } ${className}`}
        aria-label={label}
        aria-describedby={error ? `${props.name}-error` : undefined}
      />
      {error && (
        <p id={`${props.name}-error`} className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
