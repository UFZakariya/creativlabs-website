import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import Footer from "@/components/Footer";
import { og } from "@/lib/og";

/* The site collects names, phone numbers and emails (contact wizard, chat
   lead card) and stores chat transcripts — with no privacy statement anywhere.
   This page states, factually, what is collected and why. Every claim below
   describes what the system ACTUALLY does; nothing is aspirational. */

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  openGraph: og("/privacy"),
  title: "Privacy policy | Safetyline",
  description:
    "What Safetyline collects on safetyline.com.ng, why, and how to reach us about your data.",
};

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "What we collect",
    body: (
      <>
        When you contact us — through the contact form, the chat assistant, or
        the in-chat lead card — we collect what you give us: your name, your
        WhatsApp number and/or email, your company name if you share it, and
        what you tell us about your business. Conversations with the chat
        assistant are stored so the assistant can pick up where you left off,
        and so a real person can follow up on serious enquiries. If you take
        the readiness quiz, your score travels with your enquiry.
      </>
    ),
  },
  {
    h: "Analytics",
    body: (
      <>
        We run first-party analytics only: page views, clicks on our own
        buttons, and chat funnel events, collected by our own backend. We do
        not run third-party advertising trackers, and we do not use your data
        for ad targeting. Our infrastructure sits behind Cloudflare, which
        processes requests to serve the site.
      </>
    ),
  },
  {
    h: "What we use it for",
    body: (
      <>
        To answer you, to prepare for the free consultation you asked for, and
        to run our own lead pipeline — enquiries are scored and summarised for
        the owner&apos;s daily digest. That is the whole list. We do not sell
        your data, rent it, or share it with anyone outside Safetyline except
        the infrastructure that runs the service.
      </>
    ),
  },
  {
    h: "Where it lives and how long",
    body: (
      <>
        Enquiries and chat records are stored on our own servers. Your browser
        also keeps a short-lived copy of your chat locally so a page reload
        does not lose the conversation; it expires by itself within days. We
        keep enquiry records for as long as they are commercially relevant,
        and we delete them on request.
      </>
    ),
  },
  {
    h: "Your choices",
    body: (
      <>
        Ask us what we hold about you, ask us to correct it, or ask us to
        delete it — message us on{" "}
        <a
          href="https://wa.me/2348102354786"
          className="font-semibold text-[var(--color-blue)]"
          target="_blank"
          rel="noopener"
        >
          WhatsApp
        </a>{" "}
        or call{" "}
        <a href="tel:+2348102354786" className="font-semibold text-[var(--color-blue)]">
          +234 810 235 4786
        </a>
        , and we will act on it. We aim to operate in line with the Nigeria
        Data Protection Act 2023.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <WaveBackground />
      <Navbar onLight />
      <main id="main" tabIndex={-1}>
        <section className="px-5 pb-20 pt-36 sm:pt-44">
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
              Privacy
            </p>
            <h1 className="text-display-2 text-[var(--color-ink)]">
              Your data, <span className="text-dawn-gradient">plainly.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
              Safetyline Communications Ltd (RC 432180) runs safetyline.com.ng.
              This page says what we collect, why, and how to reach us about
              it — in plain language, because that is how we would want it
              said to us. Last updated July 2026.
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
