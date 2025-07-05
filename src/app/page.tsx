import { BridgeSection } from "@/components/landing-page/bridging-section";
import Headers from "@/components/landing-page/headers";
import HeroSection from "@/components/landing-page/hero-section";
import LogosSection from "@/components/landing-page/logos-section";
import FeaturesSection from "@/components/landing-page/features-section";
import HowItWorksSection from "@/components/landing-page/how-it-works-section";
import CTASection from "@/components/landing-page/cta-section";
import Footer from "@/components/landing-page/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Headers />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Logos Section */}
        <LogosSection />

        {/* Bridge Section */}
        <BridgeSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
