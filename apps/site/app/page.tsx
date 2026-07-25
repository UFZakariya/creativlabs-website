import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WaveBackground from "@/components/WaveBackground";
import RotatingStatement from "@/components/RotatingStatement";
import ProofCards from "@/components/ProofCards";
import ComparisonTabs from "@/components/ComparisonTabs";
import StepsSection from "@/components/StepsSection";
import ControlSafety from "@/components/ControlSafety";
import FAQ from "@/components/FAQ";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      {/* the Safetyline wave ribbons — fixed behind every light section */}
      <WaveBackground />
      <Navbar />
      <Hero />

      {/* viktor-structure rotating positioning statement on the wave background */}
      <RotatingStatement />

      {/* why it feels like staff */}
      <ProofCards />

      {/* chatbot vs Sardauna, tabbed */}
      <ComparisonTabs />

      {/* three steps to onboard */}
      <StepsSection />

      {/* control & safety — tiered autonomy */}
      <ControlSafety />

      {/* FAQ split accordion */}
      <FAQ />

      {/* closing ask */}
      <CTABand />

      <Footer />
    </main>
  );
}
