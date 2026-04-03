"use client";

const steps = [
  {
    icon: "person_add",
    title: "Sign up",
    description: "Create your verified digital ID. Link your community interests to receive personalized activity invites."
  },
  {
    icon: "event_note",
    title: "Enroll",
    description: "Browse the curated activity feed. Join clean-ups, blood drives, or town hall sessions that matter to you."
  },
  {
    icon: "qr_code_scanner",
    title: "Attend",
    description: "Show up and check-in via QR or geolocation. Your physical presence is the key to authenticity."
  },
  {
    icon: "workspace_premium",
    title: "Earn",
    description: "Receive CivicPoints. Unlock Tier badges like the Lion Gold and redeem for exclusive partner rewards."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-8 bg-surface-container">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-sm font-bold text-secondary tracking-[0.2em] uppercase mb-4 block">The Process</span>
            <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight">How it Works</h2>
          </div>
          <p className="text-on-surface-variant max-w-sm leading-relaxed">
            A seamless journey from registration to earning tangible rewards for your community service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-surface-container-lowest p-8 rounded-2xl hover:bg-primary transition-colors duration-500 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                <span className="text-primary group-hover:text-white text-2xl font-bold">●</span>
              </div>
              <h3 className="font-headline font-bold text-xl mb-4 text-on-surface group-hover:text-white transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed group-hover:text-white/80 transition-colors">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
