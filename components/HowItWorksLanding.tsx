'use client';

import Image from 'next/image';

export default function HowItWorks() {
  const steps = [
    {
      icon: '�',      imageSrc: '/icons8-add-user-male-64.png',      title: 'Sign up',
      description: 'Create your verified digital ID. Link your community interests to receive personalized activity recommendations.',
      highlighted: false,
    },
    {
      icon: '📋',
      title: 'Enroll',
      description: 'Browse the curated activism feed. Join clean-ups, blood drives, or town hall sessions that matter to you.',
      highlighted: false,
    },
    {
      icon: '🎯',
      title: 'Attend',
      description: 'Show up and complete in-situ QR-code authentication. Your physical presence is key to authenticity.',
      highlighted: false,
    },
    {
      icon: '🏆',
      title: 'Earn',
      description: 'Receive Civicpoints, Unlock Tier badges like Lion Gold and redeem for exclusive partner rewards.',
      highlighted: false,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-1">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">THE PROCESS</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">How it Works</h2>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              A seamless journey from registration to earning tangible rewards for your community service.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 transition-all ${
                step.highlighted
                  ? 'bg-green-800 text-white'
                  : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="mb-4">
                {step.imageSrc ? (
                  <Image
                    src={step.imageSrc}
                    alt={step.title}
                    width={64}
                    height={64}
                    className="w-16 h-16"
                  />
                ) : (
                  <div className="text-5xl">{step.icon}</div>
                )}
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${step.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {step.title}
              </h3>
              <p className={`text-base leading-relaxed ${step.highlighted ? 'text-gray-100' : 'text-gray-700'}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
