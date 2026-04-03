'use client';

import { useState } from 'react';
import RoleSelection from './RoleSelection';

interface SignUpFormPanelProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

export default function SignUpFormPanel({ onSubmit, isLoading = false }: SignUpFormPanelProps) {
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'organization' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nationalId: '',
    phone: '',
    organizationName: '',
    registrationNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ ...formData, role: selectedRole });
  };

  return (
    <div className="lg:col-span-7 p-8 md:p-16 flex flex-col bg-white">
      {/* Step Header */}
      <div className="mb-12">
        <h2 className="text-green-700 font-black text-3xl tracking-tight mb-2">Create an Account</h2>
        <p className="text-gray-600">Select your journey to begin contributing to the tapestry of Kenya.</p>
      </div>

      {/* Role Selection */}
      <RoleSelection selectedRole={selectedRole || undefined} onRoleSelect={setSelectedRole} />

      {/* Divider */}
      {selectedRole && (
        <>
          <div className="relative py-6 my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-500 bg-white px-4">
              Registration Form
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {selectedRole === 'citizen' ? (
              // Citizen Fields
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Juma Kenyatta"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="juma@example.ke"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">National ID</label>
                  <input
                    type="text"
                    placeholder="8-digit ID Number"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254 7..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-700 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-green-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                    {!isLoading && <span>→</span>}
                  </button>
                </div>
              </div>
            ) : (
              // Organization Fields
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Organization Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Kenya Red Cross"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Registration Number</label>
                  <input
                    type="text"
                    placeholder="NGO/Company Registration #"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Contact Email</label>
                  <input
                    type="email"
                    placeholder="contact@organization.ke"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+254 7..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-b-2 border-transparent focus:border-green-700 focus:outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-400 text-yellow-900 font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                    {!isLoading && <span>→</span>}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-6 border-t border-gray-200 mt-6">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <a href="/sign-in/citizen" className="text-yellow-600 font-bold hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
