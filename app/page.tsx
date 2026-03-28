import Link from "next/link";


export default function Home() {
  return (
    <>
      
      <main className="min-h-screen bg-white">

        {/* ── Hero Section ── */}
        <section
          className="relative pt-32 pb-24 px-6 overflow-hidden"
          style={{
            background: `linear-gradient(to bottom right, rgb(20 83 45), rgb(21 128 61), rgb(22 163 74)), url('/nairobi-bg.jpg.jpg')`,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-100 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Kenya&apos;s First Civic Reward Platform
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
              Good Citizenship
              <br />
              <span className="text-yellow-400">Deserves Recognition.</span>
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto mb-10 leading-relaxed">
              CivicScore tracks and rewards positive civic actions — from volunteering and
              blood donation to regulatory compliance — building a transparent record of
              your contribution to Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="bg-yellow-400 text-green-950 font-bold px-8 py-4 rounded-xl text-base hover:bg-yellow-300 transition-all hover:scale-105 shadow-lg shadow-yellow-400/20"
              >
                Start Earning Points →
              </Link>
              <Link
                href="/organization"
                className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Organization Portal
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section className="bg-yellow-400 py-6 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
            {[
              { value: "10,000+", label: "Registered Citizens" },
              { value: "250+", label: "Partner Businesses" },
              { value: "4.2M", label: "Points Awarded" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-green-950">{stat.value}</p>
                <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-green-700 font-bold text-sm uppercase tracking-widest mb-3">How It Works</p>
              <h2 className="text-4xl font-black text-gray-900">Three simple steps</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Do Good", desc: "Participate in civic activities: volunteer, donate blood, comply with regulations, attend community programs.", color: "bg-green-700" },
                { step: "02", title: "Get Verified", desc: "Authorized government institutions and organizations verify your participation and log it to your profile.", color: "bg-yellow-500" },
                { step: "03", title: "Earn Rewards", desc: "Accumulate Civic Points and redeem discounts, vouchers, and exclusive offers from partner businesses.", color: "bg-green-900" },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`${item.color} text-white text-xs font-black px-3 py-1 rounded-full inline-block mb-6`}>
                    STEP {item.step}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Civic Activities ── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-green-700 font-bold text-sm uppercase tracking-widest mb-3">What Earns Points</p>
              <h2 className="text-4xl font-black text-gray-900">Every good action counts</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { emoji: "🩸", label: "Blood Donation", pts: "+100 pts" },
                { emoji: "🌿", label: "Environmental Clean-up", pts: "+50 pts" },
                { emoji: "🤝", label: "Volunteering", pts: "+75 pts" },
                { emoji: "🚦", label: "Traffic Compliance", pts: "+30 pts" },
                { emoji: "🏥", label: "Public Health Programs", pts: "+60 pts" },
                { emoji: "📋", label: "Business Permit Renewal", pts: "+50 pts" },
                { emoji: "🗳️", label: "Voter Registration", pts: "+40 pts" },
                { emoji: "🏘️", label: "Community Programs", pts: "+45 pts" },
              ].map((activity) => (
                <div key={activity.label} className="p-5 rounded-xl border border-gray-100 bg-gray-50 hover:border-green-200 hover:bg-green-50 transition-all text-center">
                  <div className="text-3xl mb-3">{activity.emoji}</div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">{activity.label}</p>
                  <p className="text-xs font-black text-green-700">{activity.pts}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6 bg-green-950 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-white mb-4">Ready to build your Civic Score?</h2>
            <p className="text-green-300 mb-8">
              Join thousands of Kenyans already earning rewards for doing right by their communities.
            </p>
            <Link
              href="/sign-up"
              className="bg-yellow-400 text-green-950 font-bold px-10 py-4 rounded-xl text-base hover:bg-yellow-300 transition-all inline-block hover:scale-105"
            >
              Create Free Account →
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-gray-900 text-gray-500 py-8 px-6 text-center text-sm">
          <p>© 2026 CivicScore · Technical University of Kenya · Agnes Muthiri Gachomba</p>
        </footer>

      </main>
    </>
  );
}