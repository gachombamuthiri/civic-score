import Link from "next/link";


function getTier(points: number): { label: string; color: string; bg: string; next: number } {
  if (points >= 2000) return { label: "🏆 Elite", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", next: 0 };
  if (points >= 1000) return { label: "🥇 Gold", color: "text-orange-600", bg: "bg-orange-50 border-orange-200", next: 2000 };
  if (points >= 500)  return { label: "🥈 Silver", color: "text-gray-600", bg: "bg-gray-50 border-gray-200", next: 1000 };
  return { label: "🥉 Bronze", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", next: 500 };
}

const SAMPLE_ACTIVITIES = [
  { id: 1, action: "Blood Donation — Kenyatta National Hospital", date: "14 Mar 2026", points: 100, verified: true },
  { id: 2, action: "Community Clean-up — Nairobi River", date: "08 Mar 2026", points: 50, verified: true },
  { id: 3, action: "Business Permit Renewal (on time)", date: "01 Mar 2026", points: 50, verified: true },
  { id: 4, action: "Volunteer — Kibra Youth Program", date: "22 Feb 2026", points: 75, verified: true },
  { id: 5, action: "Waste Disposal Compliance", date: "15 Feb 2026", points: 20, verified: false },
];

const SAMPLE_REWARDS = [
  { id: 1, business: "Naivas Supermarket", offer: "5% off groceries", required: 500, logo: "🛒" },
  { id: 2, business: "Java House", offer: "Free coffee with meal", required: 800, logo: "☕" },
  { id: 3, business: "Uber Kenya", offer: "KSh 200 ride credit", required: 1000, logo: "🚗" },
];

export default function Dashboard() {
  const totalPoints = 1250;
  const tier = getTier(totalPoints);
  const progressPct = tier.next > 0 ? Math.round((totalPoints / tier.next) * 100) : 100;

  return (
    <>
      
      <main className="min-h-screen bg-gray-50 pt-20">

        {/* ── Header Banner ── */}
        <div className="bg-gradient-to-r from-green-900 to-green-700 px-6 py-10">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-green-300 text-sm font-semibold mb-1">Welcome back 👋</p>
              <h1 className="text-3xl font-black text-white">Agnes Muthiri</h1>
              <p className="text-green-200 text-sm mt-1">REG: SCCF/02319/2023 · Citizen Account</p>
            </div>
            <div className={`${tier.bg} border px-6 py-3 rounded-2xl text-center`}>
              <p className={`text-2xl font-black ${tier.color}`}>{tier.label}</p>
              <p className="text-xs text-gray-500 font-semibold">Current Tier</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

          {/* ── Score Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Total Civic Points</p>
              <p className="text-5xl font-black text-gray-900">1,250</p>
              <p className="text-xs text-gray-400 mt-2">All-time earned</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2">This Month</p>
              <p className="text-5xl font-black text-gray-900">295</p>
              <p className="text-xs text-gray-400 mt-2">+18% vs last month</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">Redeemable</p>
              <p className="text-5xl font-black text-gray-900">850</p>
              <p className="text-xs text-gray-400 mt-2">Available to redeem</p>
            </div>
          </div>

          {/* ── Progress to Next Tier ── */}
          {tier.next > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-gray-700">Progress to next tier</p>
                <p className="text-sm font-bold text-green-700">{totalPoints} / {tier.next} pts</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{tier.next - totalPoints} more points to reach the next tier</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">

            {/* ── Recent Activity ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-black text-gray-900">Recent Activity</h2>
                <span className="text-xs text-green-700 font-semibold cursor-pointer">View All →</span>
              </div>
              <ul className="divide-y divide-gray-50">
                {SAMPLE_ACTIVITIES.map((activity) => (
                  <li key={activity.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-400">{activity.date}</p>
                        {activity.verified ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">⏳ Pending</span>
                        )}
                      </div>
                    </div>
                    <span className="text-green-700 font-black text-sm ml-4">+{activity.points}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Available Rewards ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-black text-gray-900">Available Rewards</h2>
                <span className="text-xs text-green-700 font-semibold cursor-pointer">Browse All →</span>
              </div>
              <ul className="divide-y divide-gray-50">
                {SAMPLE_REWARDS.map((reward) => {
                  const canRedeem = totalPoints >= reward.required;
                  return (
                    <li key={reward.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="text-3xl">{reward.logo}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{reward.business}</p>
                        <p className="text-xs text-gray-500">{reward.offer}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{reward.required} pts required</p>
                      </div>
                      <button
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          canRedeem
                            ? "bg-green-700 text-white hover:bg-green-800"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!canRedeem}
                      >
                        {canRedeem ? "Redeem" : "Locked"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-5">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Submit Activity", emoji: "📝", href: "/submit" },
                { label: "View Leaderboard", emoji: "🏆", href: "/leaderboard" },
                { label: "Find Rewards", emoji: "🎁", href: "/rewards" },
                { label: "My Profile", emoji: "👤", href: "/profile" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all text-center"
                >
                  <span className="text-2xl">{action.emoji}</span>
                  <span className="text-xs font-semibold text-gray-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
