'use client';

interface RoleSelectionProps {
  selectedRole?: string;
  onRoleSelect?: (role: 'citizen' | 'organization') => void;
}

export default function RoleSelection({ selectedRole, onRoleSelect }: RoleSelectionProps) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Citizen Role Card */}
        <button
          onClick={() => onRoleSelect?.('citizen')}
          className={`group relative flex flex-col items-start p-6 text-left transition-all duration-300 rounded-2xl border-2 ${
            selectedRole === 'citizen'
              ? 'border-yellow-400 bg-white shadow-lg'
              : 'border-transparent bg-gray-100 hover:border-yellow-400 hover:bg-white'
          }`}
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
            selectedRole === 'citizen' ? 'bg-green-700 text-white' : 'bg-green-700 text-white'
          }`}>
            🧑
          </div>
          <span className="font-bold text-green-700 text-lg">I am a Citizen</span>
          <p className="text-sm text-gray-600 mt-1">Participate in events, earn rewards, and track your civic score.</p>
          <div className="mt-4 flex items-center text-yellow-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Select Role <span className="ml-1">→</span>
          </div>
        </button>

        {/* Organization Role Card */}
        <button
          onClick={() => onRoleSelect?.('organization')}
          className={`group relative flex flex-col items-start p-6 text-left transition-all duration-300 rounded-2xl border-2 ${
            selectedRole === 'organization'
              ? 'border-yellow-400 bg-white shadow-lg'
              : 'border-transparent bg-gray-100 hover:border-yellow-400 hover:bg-white'
          }`}
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
            selectedRole === 'organization' ? 'bg-yellow-300 text-green-900' : 'bg-yellow-300 text-green-900'
          }`}>
            🏛️
          </div>
          <span className="font-bold text-green-700 text-lg">I am an Organization</span>
          <p className="text-sm text-gray-600 mt-1">Host events, manage attendance, and verify community impact.</p>
          <div className="mt-4 flex items-center text-yellow-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Select Role <span className="ml-1">→</span>
          </div>
        </button>
      </div>
    </section>
  );
}
