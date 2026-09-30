/**
 * Foundation.tsx
 * ---------------
 * STEPWELLS RENOVATER FOUNDATION — 3-Column Vertical Editorial Pillar System.
 *
 * Architecture:
 *   DATA (initiatives array)
 *     → COMPONENT (FoundationColumn)
 *       → VISUAL (InitiativeVisual: water | growth | community)
 *
 * Target Composition:
 *   Three vertical columns separated by thin editorial rules:
 *
 *        │                   │
 *   01   │     02            │      03
 *        │                   │
 * visual │    visual         │    visual
 *        │                   │
 * title  │    title          │    title
 *        │                   │
 * text   │    text           │    text
 *        │                   │
 * status │    status         │    status
 *
 * NO card containers. NO rounded rectangles. NO card shadows. NO emojis.
 * The page itself is the canvas.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { InitiativeVisual } from "@/components/ui/InitiativeVisual";
import type { InitiativeVisualType } from "@/components/ui/InitiativeVisual";

// ─── Data model ───────────────────────────────────────────────────────────

type Initiative = {
  id: string;
  number: string;        // "01", "02", "03"
  category: string;      // "WATER ARCHITECTURE", etc.
  title: string;
  description: string;
  status: string;        // "ACTIVE IN JAWAI"
  visualType: InitiativeVisualType;
  visualLabel: string;   // accessible label for SVG
};

const INITIATIVES: Initiative[] = [
  {
    id: "initiative-water",
    number: "01",
    category: "WATER ARCHITECTURE",
    title: "Stepwell & Baori Regeneration",
    description:
      "Reviving Rajasthan's historic sub-surface water architecture. By desilting ancient stepwells and stone catchment basins, we ensure perennial water pans for leopards, ungulates, and pastoral herds in the dry summer months.",
    status: "ACTIVE IN JAWAI",
    visualType: "water",
    visualLabel: "Stepwell geometry and water contour lines — water restoration motif",
  },
  {
    id: "initiative-growth",
    number: "02",
    category: "AFFORESTATION / GROWTH",
    title: "Native Nursery & Seed Broadcasting",
    description:
      "Building decentralized village nurseries that cultivate indigenous desert species. Through Jawai Runners, over 100,000 saplings and seed balls are introduced directly into degraded forest tracts and ridge corridors.",
    status: "ACTIVE IN JAWAI",
    visualType: "growth",
    visualLabel: "Seed and branching root system — native plant growth motif",
  },
  {
    id: "initiative-community",
    number: "03",
    category: "COMMUNITY STEWARDSHIP",
    title: "Rabari Cultural & Livelihood Alliances",
    description:
      "Working alongside the indigenous Rabari pastoralists — the traditional guardians of the leopards. We provide eco-tourism guide training, trail marshal roles, and compensation support for livestock coexistence.",
    status: "ACTIVE IN JAWAI",
    visualType: "community",
    visualLabel: "Interconnected path and node network — community alliance motif",
  },
];

// ─── Vertical Column Pillar Component ─────────────────────────────────────

interface FoundationColumnProps {
  initiative: Initiative;
  index: number;
}

function FoundationColumn({ initiative, index }: FoundationColumnProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.14 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        "group relative flex flex-col justify-between shrink-0 w-[85vw] snap-center lg:w-auto",
        "px-6 sm:px-8 lg:px-10 xl:px-12 py-10 lg:py-14",
        "transition-colors duration-400 cursor-default",
        isHovered ? "bg-[#1F3026]/[0.025]" : "bg-transparent",
      ].join(" ")}
      aria-label={`Initiative ${initiative.number}: ${initiative.title}`}
    >
      <div>
        {/* Top: Large editorial printed number + category tag + subtle hover arrow */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span
              className={[
                "font-serif italic leading-none select-none block",
                "text-[60px] sm:text-[72px] lg:text-[80px]",
                "transition-colors duration-300",
                isHovered ? "text-[#304B38]" : "text-[#304B38]/20",
              ].join(" ")}
              aria-hidden="true"
            >
              {initiative.number}
            </span>
            <span
              className={[
                "text-[9.5px] font-bold tracking-[0.22em] uppercase block mt-3",
                "transition-colors duration-300",
                isHovered ? "text-[#C69A3A]" : "text-[#8C6A43]",
              ].join(" ")}
            >
              {initiative.category}
            </span>
          </div>

          {/* Directional arrow that smoothly transitions on hover */}
          <div
            className={[
              "w-7 h-7 flex items-center justify-center pt-2",
              "transition-all duration-300",
              isHovered
                ? "opacity-100 text-[#304B38] translate-x-0.5 -translate-y-0.5"
                : "opacity-0 text-[#304B38]/30",
            ].join(" ")}
            aria-hidden="true"
          >
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Dedicated Visual Space — upper-middle portion of the column */}
        <div className="w-full h-[96px] lg:h-[110px] flex items-center justify-start my-6">
          <div className="w-[110px] h-[88px]">
            <InitiativeVisual
              type={initiative.visualType}
              isHovered={isHovered}
              label={initiative.visualLabel}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Title */}
        <h3
          className={[
            "font-bold leading-[1.2] tracking-tight mb-4",
            "text-[21px] sm:text-[23px] lg:text-[24px] xl:text-[26px]",
            "transition-colors duration-300",
            isHovered ? "text-[#1F3026]" : "text-[#171717]",
          ].join(" ")}
        >
          {initiative.title}
        </h3>

        {/* Description */}
        <p className="text-[14px] lg:text-[14.5px] leading-[1.7] text-[#171717]/70 font-light">
          {initiative.description}
        </p>
      </div>

      {/* Bottom: Active status indicator — small green/gold dot with pulse, uppercase typography */}
      <div className="pt-10 mt-6 flex items-center gap-2.5">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#629A13] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#629A13]" />
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#304B38]">
          {initiative.status}
        </span>
      </div>
    </motion.article>
  );
}

// ─── Foundation Section ───────────────────────────────────────────────────

export function Foundation() {
  return (
    <section
      id="foundation"
      aria-labelledby="foundation-heading"
      className="relative w-full bg-[#FAF8F5] py-24 lg:py-36 overflow-hidden border-b border-[#304B38]/10"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">

        {/* ── Section header ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16 lg:mb-24">

          {/* Left: Statement */}
          <div className="lg:col-span-7 xl:col-span-6">

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[10px] font-bold tracking-[0.22em] text-[#8C6A43] uppercase mb-6"
            >
              THE ORGANIZING BODY
            </motion.p>

            <motion.h2
              id="foundation-heading"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-[38px] sm:text-[50px] md:text-[60px] font-medium leading-[1.03] tracking-tight text-[#171717] mb-7"
            >
              STEPWELLS RENOVATER{" "}
              <br className="hidden sm:block" />
              <span className="text-[#304B38] italic font-serif">FOUNDATION.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-[16px] md:text-[18px] text-[#171717]/65 font-light leading-relaxed max-w-[520px]"
            >
              Stepwells Renovater Foundation is dedicated to the ecological and
              architectural renaissance of Rajasthan's arid frontiers. In Jawai,
              we bridge ancestral water engineering with contemporary athletic
              conservation.
            </motion.p>

            {/* Thin rule + tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex items-center gap-4 mt-9"
            >
              <div className="w-12 h-px bg-[#C69A3A]" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8C6A43]">
                Three Active Initiatives · Jawai, Rajasthan
              </span>
            </motion.div>
          </div>

          {/* Right: Editorial pull-quote */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 xl:col-span-6 relative"
          >
            {/* Quote panel — photo fragment + text overlay */}
            <div
              className="relative overflow-hidden rounded-[4px] bg-[#1F3026]"
              style={{ minHeight: "340px" }}
            >
              {/* Background photo — muted */}
              <div className="absolute inset-0">
                <Image
                  src="/Jawai/IMG20260305072014.jpg"
                  alt="Granite vistas of Jawai"
                  fill
                  className="object-cover opacity-30 mix-blend-luminosity"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                {/* Left gradient so text is always readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1F3026] via-[#1F3026]/80 to-[#1F3026]/40" />
              </div>

              <div className="relative z-10 p-8 lg:p-10 flex flex-col justify-between h-full" style={{ minHeight: "340px" }}>
                {/* Category eyebrow */}
                <span className="text-[9px] font-mono tracking-[0.22em] text-[#C69A3A] uppercase">
                  FOUNDATION COMMITMENT
                </span>

                {/* Pull quote */}
                <div className="my-auto py-8">
                  <div
                    className="text-[80px] leading-none text-[#C69A3A]/20 font-serif select-none mb-2"
                    aria-hidden="true"
                  >
                    "
                  </div>
                  <p className="text-[17px] lg:text-[19px] font-medium text-white/95 leading-[1.65] tracking-wide">
                    A living landscape requires water at its roots, native canopy
                    above, and people who run together to protect it.
                  </p>
                </div>

                {/* Attribution */}
                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <div
                    className="w-9 h-9 rounded-full bg-[#C69A3A] flex items-center justify-center font-bold text-black text-[11px] tracking-wider flex-shrink-0"
                    aria-hidden="true"
                  >
                    SRF
                  </div>
                  <div>
                    <span className="block text-[12px] font-bold text-white leading-tight">
                      Stepwells Renovater Foundation
                    </span>
                    <span className="text-[10px] text-[#C69A3A] tracking-[0.1em] uppercase">
                      Rajasthan Water & Habitat Initiative
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Chapter sub-header bar ───────────────────────────── */}
        <div className="w-full border-t border-[#304B38]/15 pt-5 pb-5 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.22em] text-[#8C6A43] uppercase">
            FOUNDATION PILLARS · 01 — 03
          </span>
          <span className="text-[10px] font-mono tracking-[0.16em] text-[#171717]/40 uppercase hidden sm:inline">
            ACTIVE CONSERVATION SYSTEMS
          </span>
        </div>

        {/* ── 3-Column Vertical Editorial Pillar System ─────────── */}
        {/*
          Desktop: 3 vertical columns with thin vertical separators (divide-x).
          Mobile: stacked vertical sequence with subtle horizontal dividers (divide-y).
          NO card containers, NO rounded boxes, NO shadows.
        */}
        <div className="flex flex-row overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 border-t border-b border-[#304B38]/15 divide-x-0 lg:divide-x divide-[#304B38]/15 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {INITIATIVES.map((initiative, i) => (
            <FoundationColumn
              key={initiative.id}
              initiative={initiative}
              index={i}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
