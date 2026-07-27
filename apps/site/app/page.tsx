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
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      {/* the Safetyline wave ribbons — fixed behind every light section */}
      <WaveBackground />
      <Navbar />
      <Hero />

      {/* viktor-structure rotating positioning statement on the wave background */}
      <Reveal>
        <RotatingStatement />
      </Reveal>

      {/* why it feels like staff */}
      <ProofCards />

      {/* chatbot vs Sardauna, tabbed */}
      <Reveal>
        <ComparisonTabs />
      </Reveal>

      {/* three steps to onboard */}
      <Reveal>
        <StepsSection />
      </Reveal>

      {/* control & safety — tiered autonomy */}
      <Reveal>
        <ControlSafety />
      </Reveal>

      {/* FAQ split accordion */}
      <Reveal>
        <FAQ />
      </Reveal>

      {/* closing ask */}
      <Reveal>
        <CTABand />
      </Reveal>

      <Footer />
    </main>
  );
}
