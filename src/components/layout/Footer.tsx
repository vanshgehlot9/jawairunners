"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEventDates } from "@/lib/event-dates";
import { useCmsSection } from "@/lib/cms/use-cms";

export function Footer() {
  const eventDates = useEventDates();
  const { content, isVisible } = useCmsSection("footer");
  const { content: threeRuns } = useCmsSection("threeRuns");

  if (!isVisible) return null;

  const dateMap: Record<string, string> = {
    "run-1": eventDates.run1Date,
    "run-2": eventDates.run2Date,
    "run-3": eventDates.run3Date,
  };

  const runSummaries = threeRuns.runs.slice(0, 3);

  return (
    <>
      {/* =========================================
          DESKTOP FOOTER
          ========================================= */}
      <footer className="hidden md:block bg-[#141B16] text-[#FAF8F5] pt-16 pb-12 border-t border-white/10 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col">
          {/* Top Banner with 3 Runs Summary */}
          <div className="p-8 rounded-[20px] bg-white/5 border border-white/10 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {runSummaries.map((run, idx) => (
                <div
                  key={run.id}
                  className={
                    idx < 2
                      ? "border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4"
                      : ""
                  }
                >
                  <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-1">
                    {run.number.replace("0", "")} · {dateMap[run.id] || "REVEALING SOON"}
                  </span>
                  <span className="text-[17px] font-bold text-white block">
                    {run.number.replace("0", "")} — {run.name}
                  </span>
                  <p className="text-[12px] text-white/60 mt-1">{run.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
            {/* Brand & Organiser Info */}
            <div className="md:col-span-5 flex flex-col">
              <span className="text-[22px] font-bold tracking-widest uppercase text-white mb-1">
                {content.brandName}
              </span>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase mb-4">
                {content.brandTagline}
              </span>
              <p className="text-[14px] text-white/70 font-light leading-relaxed max-w-[400px] mb-6">
                {content.brandDescription}
              </p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-[380px]">
                <span className="text-[9px] font-bold tracking-[0.18em] text-[#8C6A43] uppercase block mb-1">
                  Organised by:
                </span>
                <span className="text-[14px] font-bold text-white block">
                  {content.organiserName}
                </span>
                <span className="text-[11px] text-white/60">{content.organiserTagline}</span>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-3 flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase mb-5">
                {content.navHeading}
              </span>
              <div className="flex flex-col space-y-3 text-[13px] text-white/80">
                {content.navLinks.map((lnk) => (
                  <Link key={lnk.id} href={lnk.href} className="hover:text-white transition-colors">
                    {lnk.label}
                  </Link>
                ))}
              </div>

              {(content.contactEmail || content.socialLinks.length > 0) && (
                <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-[12px] text-white/65">
                  {content.contactEmail && (
                    <a
                      href={`mailto:${content.contactEmail}`}
                      className="block hover:text-white transition-colors"
                    >
                      {content.contactEmail}
                    </a>
                  )}
                  {content.contactPhone && <span className="block">{content.contactPhone}</span>}
                  {content.socialLinks.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mr-3 text-[#C69A3A] hover:underline"
                    >
                      {soc.platform}: {soc.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Principles & Ethos */}
            <div className="md:col-span-4 flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase mb-5">
                {content.codeHeading}
              </span>
              <ul className="space-y-2 text-[13px] text-white/70 font-light mb-6">
                {content.runnersCode.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#C69A3A] font-bold">✓</span> {rule}
                  </li>
                ))}
              </ul>

              <div className="text-[11px] font-mono text-[#D7B66A]">{content.closingStatement}</div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50 font-mono">
            <p>
              © {new Date().getFullYear()} {content.copyrightText}
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[#C69A3A] font-bold">{content.hashtag}</span>
              <span>{content.locationCoords}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================
          MOBILE FOOTER
          ========================================= */}
      <footer className="md:hidden block bg-[#141B16] text-[#FAF8F5] pt-14 pb-8 px-6 border-t border-white/10 relative z-10">
        <div className="mb-12">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-[#C69A3A] mb-5"
          >
            <path
              d="M2 17L8 11L12 15L20 7L22 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 21C5 21 6.5 19.5 9.5 19.5C12.5 19.5 14 21 17 21C20 21 21.5 19.5 22 19.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </svg>

          <h2 className="text-[28px] font-bold tracking-widest uppercase text-white mb-1 leading-none">
            {content.brandName}
          </h2>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-4">
            {content.brandTagline}
          </span>
          <p className="text-[15px] text-white/70 font-light leading-[1.65] max-w-[320px]">
            {content.brandDescription}
          </p>
        </div>

        <div className="border-t border-white/10 pt-10 mb-10">
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#8C6A43] uppercase block mb-2">
            ORGANISED BY
          </span>
          <span className="text-[16px] font-bold text-white block mb-1">
            {content.organiserName}
          </span>
          <p className="text-[14px] text-white/60 font-light leading-relaxed max-w-[300px]">
            {content.organiserTagline}
          </p>
        </div>

        <div className="border-t border-white/10 pt-10 mb-12">
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-4">
            {content.navHeading}
          </span>
          <nav aria-label="Footer mobile navigation" className="flex flex-col">
            {content.navLinks.map((lnk) => (
              <Link
                key={lnk.id}
                href={lnk.href}
                className="flex items-center justify-between py-[14px] border-b border-white/10 group active:bg-white/5 transition-colors focus-visible:bg-white/5 outline-none"
              >
                <span className="text-[15px] text-white/90 font-medium">{lnk.label}</span>
                <ArrowRight className="w-4 h-4 text-[#C69A3A]/70 group-active:translate-x-1 group-focus-visible:translate-x-1 transition-transform duration-200" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="mb-14">
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-5">
            {content.codeHeading}
          </span>
          <ul className="space-y-3.5">
            {content.runnersCode.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="text-[#C69A3A] flex-shrink-0 mt-1.5"
                  aria-hidden="true"
                >
                  <path
                    d="M1.5 5.5L3.5 7.5L8.5 2.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[15px] text-white/80 font-light leading-snug">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-12">
          <p className="text-[26px] font-medium leading-[1.35] tracking-tight text-white/95 font-serif italic mb-6 max-w-[320px]">
            {content.closingStatement}
          </p>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase">
              {content.hashtag}
            </span>
            <span className="text-[11px] font-mono tracking-[0.1em] text-white/50 uppercase">
              {content.locationCoords}
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <p className="text-[10px] font-mono tracking-[0.05em] text-white/40 leading-[1.6]">
            © {new Date().getFullYear()} {content.copyrightText}
          </p>
        </div>
      </footer>
    </>
  );
}
