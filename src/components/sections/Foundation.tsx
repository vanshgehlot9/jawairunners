"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Droplets,
  Trees,
  Landmark,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Layers,
} from "lucide-react";

type FoundationPillar = {
  id: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  impactTag: string;
  image: string;
  icon: React.ElementType;
};

const PILLARS: FoundationPillar[] = [
  {
    id: "heritage",
    number: "01",
    title: "Preservation of Natural & Cultural Heritage",
    category: "HISTORIC ARCHITECTURE",
    summary:
      "Reviving ancient stepwells (baoris), stone catchments, and traditional water monuments across Rajasthan, safeguarding living heritage for future generations.",
    impactTag: "CENTURIES OF ANCESTRAL WISDOM",
    image: "/Jawai/IMG20260305072014.jpg",
    icon: Landmark,
  },
  {
    id: "conservation",
    number: "02",
    title: "Environmental Conservation & Afforestation",
    category: "ARID ECOLOGY",
    summary:
      "Cultivating indigenous tree species (Dhok, Khejri, Kair, Ber) in village nurseries and restoring biodiversity corridors across the leopard wilderness.",
    impactTag: "HABITAT CORRIDOR PROTECTION",
    image: "/Jawai/IMG20260305062531.jpg",
    icon: Trees,
  },
  {
    id: "water",
    number: "03",
    title: "Water-Body Cleanliness & Hydrology",
    category: "WATER SANCTUARY",
    summary:
      "Desilting historic reservoirs, cleaning public lake peripheries, and establishing clean perennial water sources for wildlife and pastoral herds.",
    impactTag: "PERENNIAL SURFACE & SUB-SURFACE WATER",
    image: "/Jawai/Lake_Scene_1280x720.jpg",
    icon: Droplets,
  },
  {
    id: "community",
    number: "04",
    title: "Community Development & Indigenous Alliances",
    category: "RABARI STEWARDSHIP",
    summary:
      "Working closely alongside indigenous Rabari pastoralists, providing eco-tourism training, trail marshal opportunities, and coexistence support.",
    impactTag: "PASTORAL COEXISTENCE & LIVELIHOODS",
    image: "/Jawai/IMG20260304182849.jpg",
    icon: Users,
  },
  {
    id: "awareness",
    number: "05",
    title: "Public Awareness & Active Participation",
    category: "YOUTH & ADVOCACY",
    summary:
      "Transforming athletic endurance into direct conservation advocacy, inspiring participants and volunteers from diverse backgrounds into lifelong stewards.",
    impactTag: "TURNING ADVENTURE INTO ACTION",
    image: "/Jawai/IMG20260304183756.jpg",
    icon: Compass,
  },
];

export function Foundation() {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
  const activePillar = PILLARS[activePillarIndex];

  return (
    <section
      id="foundation"
      className="relative w-full bg-[#FAF8F5] py-24 lg:py-32 overflow-hidden border-b border-[#304B38]/10"
      aria-labelledby="foundation-main-heading"
    >
      {/* Background Topographic Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        {/* ── SECTION HEADER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 lg:mb-20 pb-10 border-b border-[#171717]/10">
          
          {/* Left Column: Main Title */}
          <div className="lg:col-span-7">

            <motion.h2
              id="foundation-main-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-[#171717] mb-6"
            >
              STEPWELLS RENOVATER <br />
              <span className="text-[#304B38] italic font-serif">FOUNDATION.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-lg sm:text-xl text-[#171717]/85 font-light leading-relaxed max-w-[620px]"
            >
              Stepwells Renovater Foundation works towards the preservation of natural and cultural heritage, environmental conservation, water-body cleanliness, community development, and public awareness.
            </motion.p>
          </div>

          {/* Right Column: Mission Context & Guiding Spirit Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col justify-between h-full space-y-6"
          >
            <div className="p-6 sm:p-7 rounded-[22px] bg-[#FFFFFF] border border-[#304B38]/15 shadow-xs">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8C6A43] block mb-2">
                PRACTICAL STEWARDSHIP
              </span>
              <p className="text-[14.5px] text-[#171717]/80 font-light leading-relaxed">
                Through its initiatives, the Foundation seeks to encourage practical participation in protecting the environment and preserving heritage for future generations.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-[22px] bg-[#1F3026] text-white border border-[#1F3026] shadow-sm">
              <div className="flex items-center gap-2 text-[#C69A3A] mb-2">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  SHARED VISION
                </span>
              </div>
              <p className="text-[14px] text-white/90 font-light leading-relaxed mb-3">
                The initiative invites people from different backgrounds to work towards a shared goal: a more sustainable relationship between people, communities, and nature.
              </p>
              <span className="text-[11px] font-bold tracking-[0.16em] text-[#8ec94a] uppercase">
                #JUNGLEPACHOLANAO · BRING THE JUNGLE BACK
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── DYNAMIC INTERACTIVE SHOWCASE (5 PILLARS + DYNAMIC PREVIEW) ── */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold tracking-[0.22em] text-[#8C6A43] uppercase block mb-1">
                FOUNDATION PILLARS & INITIATIVES
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#171717] font-semibold">
                Explore Core Operational Areas
              </h3>
            </div>

            <span className="text-[11px] font-mono tracking-[0.16em] text-[#171717]/50 uppercase hidden md:inline">
              SELECT TO PREVIEW DETAILS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left 5 Columns: Interactive List of Pillars */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                const isSelected = activePillarIndex === idx;

                return (
                  <motion.button
                    key={pillar.id}
                    onClick={() => setActivePillarIndex(idx)}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className={`relative text-left p-5 rounded-[18px] transition-all duration-300 border flex items-start gap-4 cursor-pointer w-full ${
                      isSelected
                        ? "bg-[#1F3026] text-white border-[#1F3026] shadow-md"
                        : "bg-[#FFFFFF] text-[#171717] border-[#304B38]/12 hover:border-[#304B38]/30 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    {/* Active Indicator Bar */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeFoundationIndicator"
                        className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#C69A3A] rounded-r-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-white/10 text-[#C69A3A]"
                          : "bg-[#FAF8F5] text-[#304B38] border border-[#304B38]/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 pr-2">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[9.5px] font-bold tracking-[0.18em] uppercase ${
                            isSelected ? "text-[#C69A3A]" : "text-[#8C6A43]"
                          }`}
                        >
                          {pillar.category}
                        </span>
                        <span
                          className={`font-serif italic text-sm ${
                            isSelected ? "text-white/60" : "text-[#171717]/40"
                          }`}
                        >
                          {pillar.number}
                        </span>
                      </div>

                      <h4
                        className={`text-[15px] font-bold leading-snug ${
                          isSelected ? "text-white" : "text-[#171717]"
                        }`}
                      >
                        {pillar.title}
                      </h4>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Right 7 Columns: Dynamic Animated Preview Card */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePillar.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="relative rounded-[26px] overflow-hidden bg-[#1F3026] text-white border border-[#304B38]/30 shadow-xl flex flex-col justify-between p-8 sm:p-10 lg:p-12 min-h-[460px] h-full"
                >
                  {/* Background Photo with Parallax / Zoom */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={activePillar.image}
                      alt={activePillar.title}
                      fill
                      className="object-cover opacity-35 mix-blend-luminosity scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a10] via-[#0a1a10]/80 to-[#0a1a10]/40" />
                  </div>

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C69A3A]/25 border border-[#C69A3A]/40 text-[#D7B66A] text-[10px] font-bold tracking-[0.2em] uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {activePillar.impactTag}
                    </span>
                    <span className="font-serif italic text-3xl font-semibold text-white/80">
                      {activePillar.number}
                    </span>
                  </div>

                  {/* Middle Animated Geometric Accent */}
                  <div className="relative z-10 my-8">
                    <span className="text-[11px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-2">
                      {activePillar.category}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-semibold leading-tight mb-4">
                      {activePillar.title}
                    </h3>
                    <p className="text-white/85 text-[15px] sm:text-[16px] font-light leading-relaxed max-w-xl">
                      {activePillar.summary}
                    </p>
                  </div>

                  {/* Bottom Strip */}
                  <div className="relative z-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="block text-[12px] font-bold text-white uppercase tracking-wider">
                        STEPWELLS RENOVATER FOUNDATION
                      </span>
                      <span className="text-[10px] text-[#C69A3A] tracking-[0.14em] uppercase">
                        RAJASTHAN CONSERVATION INITIATIVE
                      </span>
                    </div>

                    <Link
                      href="#registration"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#629A13] hover:bg-[#528210] text-white text-[12px] font-bold tracking-wide uppercase transition-colors"
                    >
                      <span>SUPPORT THIS WORK</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── GUIDING SPIRIT FEATURE BANNER (JAWAI TRIATHLON INTEGRATION) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[26px] bg-[#FFFFFF] border border-[#304B38]/18 p-8 sm:p-10 lg:p-12 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-[780px]">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#171717] font-semibold tracking-tight leading-snug mb-4">
              Jawai Triathlon reflects this commitment by bringing together adventure, public participation, and conservation under the guiding spirit of{" "}
              <span className="italic text-[#304B38]">Jungle Pacho Lanao — Bring the Jungle Back.</span>
            </h3>

            <p className="text-[15px] text-[#171717]/75 font-light leading-relaxed">
              The initiative invites people from different backgrounds to work towards a shared goal: a more sustainable relationship between people, communities, and nature.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="#registration"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#629A13] hover:bg-[#528210] text-white text-[13px] font-bold tracking-wide uppercase shadow-[0_4px_16px_rgba(98,154,19,0.35)] transition-all duration-200 text-center"
            >
              <span>JOIN THE TRIATHLON</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#experience"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-[#F2EFE8] border border-[#304B38]/20 text-[#304B38] text-[13px] font-bold tracking-wide uppercase transition-all duration-200 text-center"
            >
              <span>EXPLORE EXPERIENCES</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
