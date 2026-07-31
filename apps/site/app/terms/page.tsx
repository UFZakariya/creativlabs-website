import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import Footer from "@/components/Footer";
import { og } from "@/lib/og";
import { PRICING } from "@/lib/pricing";

/* A pricing page that names monthly fees needs SOMETHING a customer can hold
   us to. These terms are deliberately minimal and conservative: they state
   the billing cadence, the cancellation rule, and the Lite commission, and
   they promise nothing the business has not already promised in visible copy.
   Figures come from lib/pricing.ts so they cannot drift from the page.

   OWNER REVIEW REQUIRED before leaning on these commercially — in particular
   the cancellation and refund positions, which are stated at their most
   customer-conservative here. */

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  openGraph: og("/terms"),
  title: "Terms of service | Safetyline",
  description:
    "The short version of doing business with Safetyline: monthly billing in naira, cancel any time effective end of cycle, Premier scoped and quoted before work starts.",
};

const plus = PRICING.find((t) => t.key === "plus")!;
const elite = PRICING.find((t) => t.key === "elite")!;

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "The service",
    body: (
      <>
        Sardauna is an AI business assistant operated by Safetyline
        Communications Ltd (RC 432180). What each tier includes is listed on
        the <a href="/pricing" className="font-semibold text-[var(--color-blue)]">pricing page</a>,
        which is part of these terms. Features marked as add-ons or as offered
        integrations are scoped with you before they are switched on.
      </>
    ),
  },
  {
    h: "Billing",
    body: (
      <>
        Paid tiers are billed monthly, in naira, in advance — {plus.name} at{" "}
        {plus.display} and {elite.name} at {elite.display} per month.{" "}
        Sardauna Lite has no monthly fee; instead, Safetyline earns 2.5% of
        the remote sales made through the platform we operate for you, as
        recorded by that platform and itemised in your daily brief. Sardauna
        Premier is custom work: scoped, quoted and agreed in writing before
        any work starts, and billed as that quote states.
      </>
    ),
  },
  {
    h: "Cancelling",
    body: (
      <>
        Cancel a monthly tier at any time by telling us on WhatsApp or by
        phone. Cancellation takes effect at the end of the billing period you
        have already paid for; we do not bill you again after that. Your data
        remains yours — ask and we will export what we hold and then delete it,
        as the <a href="/privacy" className="font-semibold text-[var(--color-blue)]">privacy policy</a> describes.
      </>
    ),
  },
  {
    h: "Fair limits",
    body: (
      <>
        We work to keep the service available and honest — the same watchdogs
        and audit trails we sell are the ones we run. But no software is
        perfect: to the extent the law allows, our total liability for any
        claim connected to the service is limited to the fees you paid us in
        the three months before the claim arose. Nothing in these terms limits
        liability that Nigerian law does not allow us to limit.
      </>
    ),
  },
  {
    h: "Questions and disputes",
    body: (
      <>
        Talk to us first —{" "}
        <a
          href="https://wa.me/2348102354786"
          className="font-semibold text-[var(--color-blue)]"
          target="_blank"
          rel="noopener"
        >
          WhatsApp
        </a>{" "}
        or <a href="tel:+2348102354786" className="font-semibold text-[var(--color-blue)]">+234 810 235 4786</a> —
        and we will put a real person on it. These terms are governed by the
        laws of the Federal Republic of Nigeria.
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <WaveBackground />
      <Navbar onLight />
      <main id="main" tabIndex={-1}>
        <section className="px-5 pb-20 pt-36 sm:pt-44">
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
              Terms
            </p>
            <h1 className="text-display-2 text-[var(--color-ink)]">
              The short version, <span className="text-dawn-gradient">in writing.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
              Five sections, no legal maze. These are the terms for using
              Sardauna and safetyline.com.ng. Effective July 2026.
            </p>

            <div className="mt-10 flex flex-col gap-8">
              {SECTIONS.map((s) => (
                <div key={s.h}>
                  <h2 className="text-[19px] font-bold tracking-tight text-[var(--color-ink)]">
                    {s.h}
                  </h2>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
