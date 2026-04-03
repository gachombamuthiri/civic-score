'use client';

import { useState } from 'react';

interface SignInFormPanelProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

export default function SignInFormPanel({ onSubmit, isLoading = false }: SignInFormPanelProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="lg:col-span-7 p-8 md:p-16 flex flex-col bg-white">
      {/* Step Header */}
      <div className="mb-12">
        <h2 className="text-green-700 font-black text-3xl tracking-tight mb-2">Welcome Back</h2>
        <p className="text-gray-600">Continue your civic journey with CivicScore Kenya.</p>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Email Address</label>
          <input
            type="email"
            placeholder="your@email.ke"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-green-700 rounded-md"
            />
            <span className="text-sm text-gray-700 font-medium">Remember me</span>
          </label>
          <a href="/forgot-password" className="text-sm text-yellow-600 font-bold hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-700 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-green-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
          {!isLoading && <span>→</span>}
        </button>
      </form>

      {/* Divider */}
      <div className="relative py-6 my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-500 bg-white px-4">
          or
        </div>
      </div>

      {/* OAuth Options */}
      <div className="space-y-3">
        <button
          className="w-full bg-white border-2 border-gray-200 text-gray-800 font-bold py-3 rounded-full shadow hover:shadow-md hover:border-green-700 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span className="text-xl">🔗</span>
          Continue with Phone Number
        </button>
        <button
          className="w-full bg-white border-2 border-gray-200 text-gray-800 font-bold py-3 rounded-full shadow hover:shadow-md hover:border-green-700 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span className="text-xl">🔐</span>
          Continue with Biometric
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-6 border-t border-gray-200 mt-6">
        <p className="text-gray-600 text-sm">
          Don't have an account yet?{' '}
          <a href="/sign-up" className="text-yellow-600 font-bold hover:underline">
            Create one
          </a>
        </p>
      </div>

      {/* Terms */}
      <p className="text-center text-xs text-gray-500 mt-6">
        By signing in, you agree to our{' '}
        <a href="/terms" className="text-green-700 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-green-700 hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
