"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Trees, ShieldCheck } from "lucide-react";
import { useCmsSection } from "@/lib/cms/use-cms";

function RunnerGlyph({ className = "w-5 h-5 text-[#294D3A]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="14" cy="4" r="2" />
      <path d="m7 21 3-4 2.5 1.5 2.5-3.5" />
      <path d="M12 11.5 15 8l3 3" />
      <path d="m6 13 4-2 3 3" />
    </svg>
  );
}

export function Movement() {
  const { content, isVisible } = useCmsSection("movement");

  if (!isVisible) return null;

  return (
    <section
      id="movement"
      aria-label={content.mainTitle}
      className="relative w-full bg-[#FAF8F5] text-[#171717] pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24 border-b border-[#304B38]/10 overflow-hidden"
    >
      <div id="three-runs" className="absolute -top-20 left-0" aria-hidden="true" />

      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        {/* SECTION 0: MOVEMENT MANIFESTO HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pb-14 sm:pb-16 lg:pb-20">
          <div className="lg:col-span-7 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[#EFECE3] border border-[#304B38]/12"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C69A3A]" aria-hidden="true" />
              <span className="text-[10.5px] sm:text-[11.5px] font-mono font-bold tracking-[0.2em] text-[#294D3A] uppercase">
                {content.eyebrow}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-[44px] sm:text-[54px] lg:text-[64px] font-serif font-medium text-[#171717] leading-[1.0] tracking-tight mb-1"
            >
              {content.mainTitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-[24px] sm:text-[30px] lg:text-[34px] font-serif italic text-[#1F3026] leading-tight mb-4"
            >
              {content.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="mb-5 px-3.5 py-2.5 rounded-xl bg-[#EFECE3] border-l-4 border-[#C69A3A] w-full"
            >
              <span className="text-[12px] sm:text-[13px] font-mono font-bold tracking-[0.16em] text-[#294D3A] uppercase block">
                {content.creed}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="space-y-3 text-[14.5px] sm:text-[15.5px] text-[#171717]/85 font-light leading-relaxed"
            >
              {content.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="mt-4 mb-5 pt-3 border-t border-[#304B38]/15 w-full"
            >
              <p className="text-[12.5px] sm:text-[13.5px] font-mono font-bold tracking-[0.18em] text-[#1F3026] uppercase">
                {content.manifestoQuote}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3"
            >
              <a
                href={content.primaryCtaUrl || "#the-experience"}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#1F3026] hover:bg-[#14221A] text-white font-bold text-[11px] sm:text-[11.5px] tracking-[0.14em] uppercase transition-all shadow-md group"
              >
                <span>{content.primaryCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D7B66A] group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={content.secondaryCtaUrl || "#registration"}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white hover:bg-[#EFECE3] border border-[#304B38]/20 text-[#1F3026] font-bold text-[11px] sm:text-[11.5px] tracking-[0.14em] uppercase transition-all shadow-xs"
              >
                <span>{content.secondaryCtaText}</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative w-full"
          >
            <div className="relative rounded-[24px] overflow-hidden bg-[#182B20] border border-[#C69A3A]/30 shadow-xl flex flex-col">
              <div className="relative h-[260px] sm:h-[300px] w-full overflow-hidden">
                <Image
                  src={content.featureCard.image}
                  alt={content.featureCard.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182B20] via-black/30 to-black/40" />

                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold tracking-[0.16em] text-white uppercase border border-white/20">
                    {content.featureCard.locationBadge}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C69A3A] text-[#14231A] text-[9.5px] font-mono font-bold tracking-wider uppercase">
                    {content.featureCard.yearBadge}
                  </span>
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#D7B66A] uppercase block mb-1">
                    {content.featureCard.subtitle}
                  </span>
                  <h4 className="text-[20px] font-serif font-bold text-white leading-tight">
                    {content.featureCard.title}
                  </h4>
                </div>
              </div>

              <div className="p-5 sm:p-6 bg-[#182B20] text-white flex flex-col justify-between">
                <p className="text-[13px] text-white/80 font-light leading-relaxed mb-4">
                  {content.featureCard.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                  {content.featureCard.tags.map((pill) => (
                    <span
                      key={pill}
                      className="px-2.5 py-1 rounded-md bg-white/10 text-white/90 text-[10px] font-mono font-bold tracking-wider uppercase border border-white/10"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-full h-[1px] bg-[#304B38]/15 mb-14 sm:mb-16 lg:mb-20" aria-hidden="true" />

        {/* SECTION 01: OUR VISION */}
        <div id="our-vision" className="pb-14 sm:pb-16 lg:pb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-8 lg:mb-10">
            <div className="max-w-xl">
              <span className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#C69A3A] uppercase block mb-1.5">
                {content.vision.label}
              </span>
              <h3 className="text-[32px] sm:text-[40px] lg:text-[44px] font-serif font-medium text-[#171717] leading-[1.04] tracking-tight">
                {content.vision.title} <br />
                <span className="italic font-serif text-[#1F3026]">
                  {content.vision.highlightedTitle}
                </span>
              </h3>
            </div>

            <div className="max-w-xl">
              <p className="text-[14px] sm:text-[15px] text-[#171717]/80 font-light leading-relaxed">
                {content.vision.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {content.vision.principles.map((pr, idx) => (
              <motion.div
                key={pr.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#304B38]/12 shadow-xs hover:border-[#304B38]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        pr.iconType === "restore"
                          ? "bg-[#C69A3A]/15 group-hover:bg-[#C69A3A]"
                          : "bg-[#294D3A]/10 group-hover:bg-[#294D3A]"
                      }`}
                    >
                      {pr.iconType === "run" && (
                        <RunnerGlyph className="w-5 h-5 text-[#294D3A] group-hover:text-white transition-colors" />
                      )}
                      {pr.iconType === "restore" && (
                        <Trees className="w-5 h-5 text-[#8C6A43] group-hover:text-[#14231A] transition-colors" />
                      )}
                      {pr.iconType === "rewild" && (
                        <ShieldCheck className="w-5 h-5 text-[#294D3A] group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#C69A3A] uppercase">
                      {pr.badge}
                    </span>
                  </div>
                  <h4 className="text-[20px] sm:text-[22px] font-serif font-bold text-[#171717] mb-2">
                    {pr.title}
                  </h4>
                  <p className="text-[13.5px] sm:text-[14px] text-[#171717]/80 font-light leading-relaxed">
                    {pr.description}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-[#304B38]/10 text-[10.5px] font-mono text-[#8C6A43] uppercase tracking-wider font-semibold">
                  {pr.footerTag}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#304B38]/15 mb-14 sm:mb-16 lg:mb-20" aria-hidden="true" />

        {/* SECTION 02: THE EXPERIENCE */}
        <div id="the-experience" className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-10">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#C69A3A] uppercase block mb-1.5">
                {content.experience.label}
              </span>
              <h3 className="text-[32px] sm:text-[40px] lg:text-[44px] font-serif font-medium text-[#171717] leading-[1.04] tracking-tight">
                {content.experience.title} <br />
                <span className="italic font-serif text-[#1F3026]">
                  {content.experience.highlightedTitle}
                </span>
              </h3>
            </div>

            <p className="text-[14px] sm:text-[15px] text-[#171717]/75 font-light max-w-md leading-relaxed">
              {content.experience.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {content.experience.pillars.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="group relative flex flex-col bg-white rounded-[20px] overflow-hidden border border-[#304B38]/12 hover:border-[#304B38]/30 shadow-xs hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-[200px] sm:h-[220px] w-full overflow-hidden bg-[#1F3026]">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9.5px] font-mono font-bold tracking-[0.14em] text-white uppercase border border-white/20">
                      {exp.badge}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="text-[11px] font-mono font-bold text-white/70">{exp.order}</span>
                  </div>

                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <span className="text-[9.5px] font-mono tracking-[0.2em] text-[#D7B66A] uppercase block">
                      {exp.subtitle}
                    </span>
                    <h4 className="text-[18px] sm:text-[20px] font-serif font-bold text-white leading-tight mt-0.5">
                      {exp.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                  <p className="text-[13px] sm:text-[13.5px] text-[#171717]/80 font-light leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <div className="pt-3 border-t border-[#304B38]/10 flex items-center justify-between text-[10.5px] font-mono font-bold text-[#294D3A]">
                    <span className="tracking-wider uppercase">
                      {content.experience.cardFooterLabel}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#C69A3A]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
