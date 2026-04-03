'use client';

export default function TierCard() {
  return (
    <div className="bg-gray-100 overflow-hidden rounded-3xl shadow-lg relative flex items-center p-8 group">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 opacity-10"></div>
      
      <div className="relative z-10 flex items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-green-700 to-green-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
          <span className="text-3xl">⭐</span>
        </div>
        
        <div>
          <p className="text-yellow-600 font-bold uppercase tracking-tight text-sm mb-1">Tier Achievement</p>
          <h3 className="text-3xl font-black text-green-700">Elephant Gold</h3>
          
          <div className="h-1.5 w-32 bg-white/50 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-yellow-300 w-[75%] rounded-full"></div>
          </div>
          
          <p className="text-xs font-medium text-gray-600 mt-2">250 pts to Lion Elite</p>
        </div>
      </div>
    </div>
  );
}
