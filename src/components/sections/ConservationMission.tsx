"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Trees,
  Recycle,
  HeartHandshake,
  ShieldCheck,
  Droplets,
  Users,
  Sprout,
} from "lucide-react";
import { useCmsSection } from "@/lib/cms/use-cms";
import type { ConservationCommitmentItem } from "@/lib/cms/types";

const ICON_MAP: Record<
  ConservationCommitmentItem["iconName"],
  React.ComponentType<{ className?: string }>
> = {
  Droplets,
  Trees,
  Recycle,
  ShieldCheck,
  HeartHandshake,
  Compass,
  Users,
  Sprout,
};

export function ConservationMission() {
  const { content, isVisible } = useCmsSection("conservationMission");

  if (!isVisible) return null;

  return (
    <section
      id="conservation-mission"
      aria-label="Our Conservation Mission"
      className="relative w-full bg-[#FAF8F5] text-[#171717] py-16 sm:py-20 lg:py-24 border-b border-[#304B38]/10 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading + Impact Manifesto Card */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#C69A3A] uppercase mb-1.5">
              {content.label}
            </span>
            <h2 className="text-[32px] sm:text-[38px] lg:text-[42px] font-serif font-medium text-[#171717] leading-[1.06] tracking-tight mb-4">
              {content.heading} <br />
              <span className="italic font-serif text-[#1F3026]">{content.highlightedHeading}</span>
            </h2>

            <p className="text-[14px] sm:text-[14.5px] text-[#171717]/80 font-light leading-relaxed mb-6">
              {content.description}
            </p>

            {/* Impact Banner Box */}
            <div className="relative rounded-[22px] overflow-hidden bg-[#182B20] text-white p-6 sm:p-7 border border-[#C69A3A]/30 shadow-md">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#C69A3A]/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-[#C69A3A] uppercase block mb-2">
                {content.goalLabel}
              </span>

              <p className="text-[16px] sm:text-[17px] font-serif italic text-white/95 leading-snug mb-4">
                {content.goalQuote}
              </p>

              <div className="h-[1px] w-full bg-white/15 my-3.5" />

              <span className="text-[11.5px] font-mono font-bold tracking-[0.16em] text-[#D7B66A] uppercase block">
                {content.goalMotto}
              </span>

              <Link
                href={content.goalCtaUrl || "#registration"}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C69A3A] hover:bg-[#d8ab43] text-[#14231A] font-bold text-[11px] tracking-wider uppercase transition-colors"
              >
                <span>{content.goalCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Commitments Grid */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#304B38]/12">
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#171717] uppercase">
                {content.commitmentsTitle}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#C69A3A] uppercase tracking-wider">
                {content.commitmentsBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.commitments.map((item, idx) => {
                const IconComponent = ICON_MAP[item.iconName] || Sprout;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#304B38]/12 hover:border-[#304B38]/30 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#294D3A]/10 flex items-center justify-center shrink-0 group-hover:bg-[#294D3A] transition-colors mt-0.5">
                      <IconComponent className="w-4 h-4 text-[#294D3A] group-hover:text-white transition-colors" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9.5px] font-mono font-bold text-[#C69A3A]">
                          {item.order}
                        </span>
                        <span className="text-[13px] font-serif font-bold text-[#171717] truncate leading-tight group-hover:text-[#294D3A] transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#171717]/75 font-light leading-snug line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
