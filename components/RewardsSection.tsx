'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function RewardsSection() {
  const rewards = [
    {
      title: 'Elite Gym Pass',
      description: 'One month unlimited access to any partnering civic-wellness facility.',
      category: 'Wellness',
      points: 450,
      image: '/gym-pic.png',
      categoryColor: 'bg-green-700',
      categoryTextColor: 'text-white',
    },
    {
      title: 'Eco-Heritage Tour',
      description: 'Guided weekend tour of the Great Rift Valley eco-conservation sites.',
      category: 'Travel',
      points: 800,
      image: '/greenland.png',
      categoryColor: 'bg-yellow-300',
      categoryTextColor: 'text-yellow-900',
    },
    {
      title: 'Citizen Tech Voucher',
      description: '20% discount on sustainable tech products from authorized partners.',
      category: 'Tech',
      points: 200,
      image: '/tech-products.png',
      categoryColor: 'bg-green-700',
      categoryTextColor: 'text-white',
    },
  ];

  return (
    <div className="md:col-span-12">
      <div className="flex items-center justify-between mb-8 mt-4">
        <div>
          <h2 className="text-3xl font-black text-green-700 tracking-tight">Your Rewards</h2>
          <p className="text-gray-600">Exclusive benefits unlocked by your civic commitment.</p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-300">
          <span className="text-2xl">🎁</span>
          <span className="text-yellow-900 font-bold text-sm tracking-tight">3 Available Vouchers</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border-b-4 border-green-900/10 group"
          >
            {/* Image */}
            <div className="relative h-48 mb-6 rounded-2xl overflow-hidden">
              <Image
                src={reward.image}
                alt={reward.title}
                fill
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Category Badge */}
              <div className={`absolute top-4 left-4 ${reward.categoryColor} ${reward.categoryTextColor} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest`}>
                {reward.category}
              </div>
            </div>
            
            {/* Content */}
            <h4 className="font-bold text-xl text-green-700 mb-1">{reward.title}</h4>
            <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
            
            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-yellow-600 font-bold">
                <span>💰</span>
                <span>{reward.points} PTS</span>
              </div>
              <button className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-700 hover:text-white transition-colors">
                Redeem
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
