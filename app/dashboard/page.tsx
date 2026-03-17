export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-4">Citizen Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold uppercase">Total Civic Points</p>
            <p className="text-4xl font-black text-blue-800">1,250</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-semibold uppercase">Status</p>
            <p className="text-4xl font-black text-green-800">Elite</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            <li className="flex justify-between p-3 bg-gray-50 rounded border">
              <span>Renewed Business Permit on time</span>
              <span className="text-green-600 font-bold">+50 pts</span>
            </li>
            <li className="flex justify-between p-3 bg-gray-50 rounded border">
              <span>Waste Disposal Compliance</span>
              <span className="text-green-600 font-bold">+20 pts</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}