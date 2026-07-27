"use client";

/* Three-rail case-study body: scroll-spy TOC left, content centre, meta card
   right. TOC highlights the section in view; rails go sticky on desktop and
   stack on mobile. */

import { useEffect, useState } from "react";
import type { CaseSection } from "@/lib/case-studies";
import Reveal from "./Reveal";

export default function CaseStudyLayout({
  sections,
  meta,
}: {
  sections: CaseSection[];
  meta: { k: string; v: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[190px_minmax(0,1fr)_240px]">
      {/* TOC rail */}
      <nav className="hidden self-start lg:sticky lg:top-28 lg:block" aria-label="On this page">
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-ink-soft)]/70">
          On this page
        </p>
        <ul className="flex flex-col gap-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`block border-l-2 py-1.5 pl-3 text-[13.5px] transition-colors ${
                  active === s.id
                    ? "border-[var(--color-blue)] font-semibold text-[var(--color-blue)]"
                    : "border-black/10 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                }`}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* content rail */}
      <article className="min-w-0">
        {sections.map((s) => (
          <Reveal key={s.id} className="mb-12 last:mb-0">
          <section id={s.id} className="scroll-mt-28">
            <h2 className="text-display-3">{s.title}</h2>
            {s.paras.map((p) => (
              <p key={p.slice(0, 32)} className="mt-4 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-4 flex flex-col gap-2.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[14.5px] leading-snug text-[var(--color-ink)]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="2.6"
                      className="mt-[3px] shrink-0"
                      aria-hidden
                    >
                      <path d="m4.5 12.5 5 5L19.5 7" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
          </Reveal>
        ))}
      </article>

      {/* meta rail */}
      <aside className="self-start lg:sticky lg:top-28">
        <div className="glass-ring rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(16,20,42,0.06)]">
          <dl className="flex flex-col gap-4">
            {meta.map((m) => (
              <div key={m.k}>
                <dt className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-[var(--color-ink-soft)]/70">
                  {m.k}
                </dt>
                <dd className="mt-0.5 text-[14px] font-semibold text-[var(--color-ink)]">{m.v}</dd>
              </div>
            ))}
          </dl>
          <a
            href="/contact"
            className="mt-6 block rounded-full bg-[var(--color-ink)] px-5 py-3 text-center text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start your own story
          </a>
        </div>
      </aside>
    </div>
  );
}
