'use client';

interface TierCardProps {
  tier?: string;
  points?: number;
}

const TIER_TIERS = [
  { name: 'Buffalo', minPoints: 0, maxPoints: 499, emoji: '🦬', color: 'from-gray-700 to-gray-600' },
  { name: 'Rhino', minPoints: 500, maxPoints: 999, emoji: '🦏', color: 'from-blue-700 to-blue-600' },
  { name: 'Elephant', minPoints: 1000, maxPoints: 1999, emoji: '🐘', color: 'from-purple-700 to-purple-600' },
  { name: 'Lion', minPoints: 2000, maxPoints: Infinity, emoji: '🦁', color: 'from-yellow-700 to-yellow-600' },
];

export default function TierCard({ tier = 'Buffalo', points = 0 }: TierCardProps) {
  const currentTierObj = TIER_TIERS.find(t => t.name === tier) || TIER_TIERS[0];
  const nextTierObj = TIER_TIERS[TIER_TIERS.indexOf(currentTierObj) + 1] || currentTierObj;
  
  const pointsInCurrentTier = points - currentTierObj.minPoints;
  const pointsNeededForNextTier = nextTierObj.minPoints - currentTierObj.minPoints;
  const progressPercentage = Math.min(100, (pointsInCurrentTier / pointsNeededForNextTier) * 100);
  const pointsToNext = Math.max(0, nextTierObj.minPoints - points);

  return (
    <div className="bg-gray-100 overflow-hidden rounded-3xl shadow-lg relative flex items-center p-8 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTierObj.color} opacity-10`}></div>
      
      <div className="relative z-10 flex items-center gap-6 w-full">
        <div className={`w-20 h-20 bg-gradient-to-br ${currentTierObj.color} rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform flex-shrink-0`}>
          <span className="text-3xl">{currentTierObj.emoji}</span>
        </div>
        
        <div className="flex-1">
          <p className="text-yellow-600 font-bold uppercase tracking-tight text-sm mb-1">Tier Achievement</p>
          <h3 className="text-3xl font-black text-green-700">{currentTierObj.name}</h3>
          
          <div className="h-2 w-full bg-white/50 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-yellow-300 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          
          <p className="text-xs font-medium text-gray-600 mt-2">
            {pointsToNext === 0 && nextTierObj.name !== currentTierObj.name ? '🎉 Ready to advance!' : `${pointsToNext} pts to ${nextTierObj.name}`}
          </p>
        </div>
      </div>
    </div>
  );
}
