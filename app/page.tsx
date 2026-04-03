import LandingHero from "@/components/LandingHero";
import HowItWorksLanding from "@/components/HowItWorksLanding";
import FeaturedActivitiesLanding from "@/components/FeaturedActivitiesLanding";
import TiersSectionLanding from "@/components/TiersSectionLanding";
import LandingFooter from "@/components/LandingFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <LandingHero />
      <HowItWorksLanding />
      <FeaturedActivitiesLanding />
      <TiersSectionLanding />
      <LandingFooter />
    </main>
  );
}