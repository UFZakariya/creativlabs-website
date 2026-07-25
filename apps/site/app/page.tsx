import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* comparison band — working copy = brief §9 option A until owner picks */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:py-32">
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
