'use client';

export default function SuggestActivityFAB() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button className="bg-gradient-to-r from-green-800 to-green-700 text-white h-16 w-16 rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform active:scale-90">
        <span className="text-2xl font-black">+</span>
        <span className="absolute right-full mr-4 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Suggest Activity
        </span>
      </button>
    </div>
  );
}
