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

import type { Metadata } from "next";

/* title/description/OG are inherited from the root layout; the home
   route only needs its own canonical so the domain root does not
   compete with any query-string or trailing-slash variant. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <>
      {/* the Safetyline wave ribbons — fixed behind every light section */}
      <WaveBackground />
      <Navbar />
      <main id="main" tabIndex={-1}>
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
    </>
  );
}
