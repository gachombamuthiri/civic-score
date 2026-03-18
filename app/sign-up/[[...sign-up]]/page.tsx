import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <span className="text-green-950 font-black text-sm">CS</span>
            </div>
            <span className="text-2xl font-black text-white">
              Civic<span className="text-yellow-400">Score</span>
            </span>
          </div>
          <p className="text-green-200 text-sm">Create your account and start earning civic points</p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-2xl rounded-2xl border-0",
                headerTitle: "text-gray-900 font-black",
                headerSubtitle: "text-gray-500",
                formButtonPrimary:
                  "bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl",
                footerActionLink: "text-green-700 font-semibold hover:text-green-800",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
