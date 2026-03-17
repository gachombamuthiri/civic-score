export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-10">
      <div className="max-w-3xl text-center">
        {/* Project Title */}
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6">
          CivicScore
        </h1>
        
        {/* Project Tagline */}
        <p className="text-xl text-gray-600 mb-8">
          Promoting law-abiding behavior in Kenya through citizen compliance and rewards.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Get Started (Citizen)
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Organization Portal
          </button>
        </div>
      </div>
    </main>
  );
}