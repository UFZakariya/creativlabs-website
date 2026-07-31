import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    alternates: { canonical: `/customers/${slug}` },
    title: `${cs.name} — Customer story | Safetyline`,
    description: cs.intro,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <>
      <WaveBackground />
      <Navbar />
      <main id="main" tabIndex={-1}>

      {/* dark billboard hero */}
      <section className="bg-azure-dawn rounded-b-[var(--radius-band)] px-5 pb-16 pt-36 text-center sm:pb-20 sm:pt-44">
        <div className="mx-auto max-w-4xl">
          <a
            href="/customers"
            className="mb-6 inline-block rounded-full border border-white/25 bg-[#0a1d7a] px-3.5 py-1 text-[13px] font-semibold text-[var(--color-cyan)] transition-opacity hover:opacity-80"
          >
            ← All customers
          </a>
          <h1 className="text-display-1 mx-auto max-w-3xl text-white">
            {cs.statSentence[0]}{" "}
            <span className="text-dawn-gradient-bright">{cs.statSentence[1]}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            {cs.intro}
          </p>
        </div>
      </section>

      {/* three-rail body */}
      <CaseStudyLayout sections={cs.sections} meta={cs.meta} />

      <CTABand />
    </main>
      <Footer />
    </>
  );
}
