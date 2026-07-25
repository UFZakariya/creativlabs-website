import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WaveBackground from "@/components/WaveBackground";
import RotatingStatement from "@/components/RotatingStatement";

export default function Home() {
  return (
    <main>
      {/* the Safetyline wave ribbons — fixed behind every light section */}
      <WaveBackground />
      <Navbar />
      <Hero />

      {/* viktor-style rotating positioning statement on the wave background */}
      <RotatingStatement />

      {/* comparison band — working copy = brief §9 option A until owner picks */}
      <section className="mx-auto max-w-5xl px-5 pb-24 pt-4 text-center sm:pb-32">
        <h2 className="text-display-2">
          A reply is <span className="text-dawn-gradient">not a result.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
          A chatbot answers questions and waits for the next one. A house of
          agents takes the order, chases the invoice, books the delivery,
          resolves the complaint — and reports back with the receipts.
        </p>
      </section>
    </main>
  );
}
