import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import ContactWizard from "@/components/ContactWizard";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact — Start with a free readiness audit | Safetyline",
  description:
    "Three quick steps and your enquiry lands in our own lead pipeline — the same one Sardauna runs. Start with the free AI readiness audit: one conversation with Biba or Bari, no card, no obligation.",
};

export default function ContactPage() {
  return (
    <>
      <WaveBackground />
      <Navbar onLight />
      <main id="main" tabIndex={-1}>

      {/* light hero on the waves */}
      <section className="px-5 pb-12 pt-36 text-center sm:pt-44">
        <Reveal immediate className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Contact
          </p>
          <h1 className="text-display-1 mx-auto max-w-3xl text-[var(--color-ink)]">
            Three steps to <span className="text-dawn-gradient">your audit.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Tell us who you are and what&apos;s eating your week. The free readiness
            audit is one conversation with Biba or Bari — no card, no
            obligation, and you keep the report either way.
          </p>
        </Reveal>
      </section>

      {/* the wizard */}
      <section className="px-5 pb-16 sm:pb-20">
        <Reveal immediate>
          <ContactWizard />
        </Reveal>
        <p className="mx-auto mt-6 max-w-md text-center text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]/80">
          Prefer to just talk? Message us directly on{" "}
          <a
            href="https://wa.me/2348102354786"
            target="_blank"
            rel="noopener"
            className="font-semibold text-[var(--color-blue)]"
          >
            WhatsApp
          </a>{" "}
          or call{" "}
          <a href="tel:+2348102354786" className="font-semibold text-[var(--color-blue)]">
            +234 810 235 4786
          </a>
          .
        </p>
      </section>

      <Footer />
    </main>
    </>
  );
}
