"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ArrowUpRight, 
  Check, 
  Compass, 
  Sparkles, 
  Trees, 
  Recycle,
  HeartHandshake,
  ShieldCheck,
  Droplets,
  Users,
  Sprout
} from "lucide-react";

// ─── Custom Vector Glyphs ───────────────────────────────────────────────────

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

// ─── Experience Pillar Data ─────────────────────────────────────────────────

interface ExperiencePillar {
  id: string;
  order: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
}

const EXPERIENCES: ExperiencePillar[] = [
  {
    id: "exp-running",
    order: "01",
    title: "RUNNING",
    subtitle: "Trail & Wilderness Endurance",
    description: "Explore the breathtaking landscape of Jawai through running experiences designed for different fitness levels.",
    image: "/pastevent/reel-1-orig.jpg",
    badge: "Trail Exploration"
  },
  {
    id: "exp-cycling",
    order: "02",
    title: "CYCLING",
    subtitle: "Two-Wheeled Expedition",
    description: "Discover the rugged terrain, rural trails and scenic beauty of Jawai on two wheels.",
    image: "/Jawai/IMG20260305062543.jpg",
    badge: "Rural Corridors"
  },
  {
    id: "exp-horse-riding",
    order: "03",
    title: "HORSE RIDING",
    subtitle: "Heritage of Godwar",
    description: "Experience the traditional landscape and cultural heritage of Godwar through guided horse-riding experiences.",
    image: "/Jawai/IMG20260304174820.jpg",
    badge: "Godwar Heritage"
  },
  {
    id: "exp-cleaning",
    order: "04",
    title: "CLEANING DRIVES",
    subtitle: "Zero-Waste Trail Protection",
    description: "Participate in cleaning campaigns around water bodies, natural landscapes, villages and public spaces to promote responsible tourism and waste management.",
    image: "/pastevent/reel-3-orig.jpg",
    badge: "Habitat Cleanup"
  },
  {
    id: "exp-plantation",
    order: "05",
    title: "PLANTATION DRIVES",
    subtitle: "Native Flora Restoration",
    description: "Contribute to ecological restoration through plantation of native and locally suitable tree species.",
    image: "/pastevent/reel-2-orig.jpg",
    badge: "Native Afforestation"
  },
  {
    id: "exp-wildlife",
    order: "06",
    title: "WILDLIFE & NATURE CONSERVATION",
    subtitle: "Coexistence & Biodiversity",
    description: "Build awareness about wildlife, natural habitats, biodiversity and the importance of living in harmony with nature.",
    image: "/images/leopard.jpg",
    badge: "Leopard Corridors"
  }
];

// ─── Conservation Commitments Data ──────────────────────────────────────────

const COMMITMENTS = [
  {
    id: "water",
    order: "01",
    title: "Water Bodies Revival",
    description: "Restoration and cleanliness of local water bodies and ancient stepwells.",
    icon: Droplets
  },
  {
    id: "plantation",
    order: "02",
    title: "Native Plantation",
    description: "Native tree plantation and ecological habitat restoration.",
    icon: Trees
  },
  {
    id: "waste",
    order: "03",
    title: "Zero-Waste Logistics",
    description: "Responsible waste management and complete single-use plastic reduction.",
    icon: Recycle
  },
  {
    id: "wildlife",
    order: "04",
    title: "Wildlife Coexistence",
    description: "Wildlife awareness and corridor coexistence initiatives.",
    icon: ShieldCheck
  },
  {
    id: "community",
    order: "05",
    title: "Community Education",
    description: "Community engagement and participatory environmental education.",
    icon: HeartHandshake
  },
  {
    id: "tourism",
    order: "06",
    title: "Sustainable Tourism",
    description: "Encouraging low-impact, sustainable and responsible eco-tourism.",
    icon: Compass
  },
  {
    id: "youth",
    order: "07",
    title: "Youth Mobilisation",
    description: "Involving village youth in conservation and trail stewardship.",
    icon: Users
  },
  {
    id: "collective",
    order: "08",
    title: "Collective Impact",
    description: "Every adventure directly contributes to nature and habitat revival.",
    icon: Sprout
  }
];

// ─── Main Component ────────────────────────────────────────────────────────

export function Movement() {
  return (
    <section 
      id="movement" 
      aria-label="Jawai Runner Movement"
      className="relative w-full bg-[#FAF8F5] text-[#171717] pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24 border-b border-[#304B38]/10 overflow-hidden"
    >
      {/* Anchor alias for backwards compatibility */}
      <div id="three-runs" className="absolute -top-20 left-0" aria-hidden="true" />

      {/* Subtle Topographic Radial Backdrop */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">

        {/* ===================================================================
            SECTION 0: MOVEMENT MANIFESTO HERO HEADER (Compact & Impactful)
            =================================================================== */}
        <div className="flex flex-col items-start max-w-4xl pb-12 sm:pb-14 lg:pb-16">
          
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="text-[11px] sm:text-[12px] font-mono font-bold tracking-[0.22em] text-[#C69A3A] uppercase">
              AN INITIATIVE BY STEPWELLS RENOVATER FOUNDATION
            </span>
          </motion.div>

          {/* Grand Title: JAWAI RUNNER */}
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-[44px] sm:text-[56px] lg:text-[68px] font-serif font-medium text-[#171717] leading-[0.98] tracking-tight mb-2"
          >
            Jawai Runner
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-[26px] sm:text-[32px] lg:text-[38px] font-serif italic text-[#1F3026] leading-tight mb-4"
          >
            Run. Ride. Restore.
          </motion.p>

          {/* Creed Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mb-6 p-3 sm:p-3.5 rounded-xl bg-[#EFECE3] border-l-4 border-[#C69A3A] w-full max-w-2xl"
          >
            <span className="text-[12px] sm:text-[14px] font-mono font-bold tracking-[0.16em] text-[#294D3A] uppercase block">
              JUNGLE PACHO LANAO — BRING THE JUNGLE BACK.
            </span>
          </motion.div>

          {/* Narrative paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="space-y-3 text-[15px] sm:text-[16px] text-[#171717]/85 font-light leading-relaxed max-w-3xl"
          >
            <p>
              Jawai Runner is more than a sporting event. It is a movement that brings together adventure, fitness, nature, wildlife conservation and community participation to protect and restore the natural heritage of Jawai, Rajasthan.
            </p>
            <p>
              Through running, cycling, horse riding, cleanliness campaigns, plantation drives and community-led conservation activities, we invite people to experience Jawai while contributing to its ecological restoration.
            </p>
          </motion.div>

          {/* Bold Editorial Quote */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-5 mb-6 pt-3.5 border-t border-[#304B38]/15"
          >
            <p className="text-[13px] sm:text-[14.5px] font-mono font-bold tracking-[0.18em] text-[#1F3026] uppercase">
              RUN FOR NATURE. RIDE FOR THE WILD. RESTORE FOR THE FUTURE.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#the-experience"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#1F3026] hover:bg-[#14221A] text-white font-bold text-[11px] sm:text-[11.5px] tracking-[0.14em] uppercase transition-all shadow-md group"
            >
              <span>EXPLORE THE EXPERIENCE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D7B66A] group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#registration"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white hover:bg-[#EFECE3] border border-[#304B38]/20 text-[#1F3026] font-bold text-[11px] sm:text-[11.5px] tracking-[0.14em] uppercase transition-all shadow-xs"
            >
              <span>JOIN THE MOVEMENT</span>
            </a>
          </motion.div>

        </div>

        {/* ── Section Divider ── */}
        <div className="w-full h-[1px] bg-[#304B38]/15 mb-14 sm:mb-16 lg:mb-20" aria-hidden="true" />

        {/* ===================================================================
            SECTION 01: OUR VISION (Unified Single Block - No Wasted Space)
            =================================================================== */}
        <div id="our-vision" className="pb-14 sm:pb-16 lg:pb-20">
          
          {/* Header Row: Title & Intro side-by-side in one cohesive line */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-8 lg:mb-10">
            <div className="max-w-xl">
              <span className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#C69A3A] uppercase block mb-1.5">
                01. OUR VISION
              </span>
              <h3 className="text-[32px] sm:text-[40px] lg:text-[44px] font-serif font-medium text-[#171717] leading-[1.04] tracking-tight">
                Beyond Sports. <br />
                <span className="italic font-serif text-[#1F3026]">Towards Conservation.</span>
              </h3>
            </div>

            <div className="max-w-xl">
              <p className="text-[14px] sm:text-[15px] text-[#171717]/80 font-light leading-relaxed">
                Jawai is a remarkable landscape of granite hills, grasslands, water bodies and extraordinary wildlife. Our vision is to create a platform where outdoor adventure becomes a meaningful instrument for habitat revival, community support and biodiversity protection.
              </p>
            </div>
          </div>

          {/* 3 Principles in One Row: RUN, RESTORE, REWILD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Principle 01: RUN */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#304B38]/12 shadow-xs hover:border-[#304B38]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#294D3A]/10 flex items-center justify-center group-hover:bg-[#294D3A] transition-colors">
                    <RunnerGlyph className="w-5 h-5 text-[#294D3A] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#C69A3A] uppercase">
                    PRINCIPLE 01
                  </span>
                </div>
                <h4 className="text-[20px] sm:text-[22px] font-serif font-bold text-[#171717] mb-2">
                  RUN
                </h4>
                <p className="text-[13.5px] sm:text-[14px] text-[#171717]/80 font-light leading-relaxed">
                  Encourage fitness, adventure and a deeper connection with nature across Jawai&apos;s ancient landscape.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-[#304B38]/10 text-[10.5px] font-mono text-[#8C6A43] uppercase tracking-wider font-semibold">
                Fitness &amp; Trail Adventure
              </div>
            </motion.div>

            {/* Principle 02: RESTORE */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#304B38]/12 shadow-xs hover:border-[#304B38]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C69A3A]/15 flex items-center justify-center group-hover:bg-[#C69A3A] transition-colors">
                    <Trees className="w-5 h-5 text-[#8C6A43] group-hover:text-[#14231A] transition-colors" />
                  </div>
                  <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#C69A3A] uppercase">
                    PRINCIPLE 02
                  </span>
                </div>
                <h4 className="text-[20px] sm:text-[22px] font-serif font-bold text-[#171717] mb-2">
                  RESTORE
                </h4>
                <p className="text-[13.5px] sm:text-[14px] text-[#171717]/80 font-light leading-relaxed">
                  Actively participate in environmental restoration through native plantations and water structure revivals.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-[#304B38]/10 text-[10.5px] font-mono text-[#8C6A43] uppercase tracking-wider font-semibold">
                Habitat &amp; Flora Revival
              </div>
            </motion.div>

            {/* Principle 03: REWILD */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#304B38]/12 shadow-xs hover:border-[#304B38]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#294D3A]/10 flex items-center justify-center group-hover:bg-[#294D3A] transition-colors">
                    <ShieldCheck className="w-5 h-5 text-[#294D3A] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#C69A3A] uppercase">
                    PRINCIPLE 03
                  </span>
                </div>
                <h4 className="text-[20px] sm:text-[22px] font-serif font-bold text-[#171717] mb-2">
                  REWILD
                </h4>
                <p className="text-[13.5px] sm:text-[14px] text-[#171717]/80 font-light leading-relaxed">
                  Support biodiversity, wildlife corridors, and the peaceful coexistence of leopards, pastoralists and nature.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-[#304B38]/10 text-[10.5px] font-mono text-[#8C6A43] uppercase tracking-wider font-semibold">
                Ecosystem Coexistence
              </div>
            </motion.div>

          </div>
        </div>

        {/* ── Section Divider ── */}
        <div className="w-full h-[1px] bg-[#304B38]/15 mb-14 sm:mb-16 lg:mb-20" aria-hidden="true" />

        {/* ===================================================================
            SECTION 02: THE EXPERIENCE (Crisp 6 Cards Grid)
            =================================================================== */}
        <div id="the-experience" className="flex flex-col pb-14 sm:pb-16 lg:pb-20">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-10">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#C69A3A] uppercase block mb-1.5">
                02. THE EXPERIENCE
              </span>
              <h3 className="text-[32px] sm:text-[40px] lg:text-[44px] font-serif font-medium text-[#171717] leading-[1.04] tracking-tight">
                Discover Jawai. <br />
                <span className="italic font-serif text-[#1F3026]">Experience Nature.</span>
              </h3>
            </div>

            <p className="text-[14px] sm:text-[15px] text-[#171717]/75 font-light max-w-md leading-relaxed">
              Six curated ways to experience Jawai&apos;s ancient wilderness while actively building its ecological resilience.
            </p>
          </div>

          {/* 6 Experience Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {EXPERIENCES.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="group relative flex flex-col bg-white rounded-[20px] overflow-hidden border border-[#304B38]/12 hover:border-[#304B38]/30 shadow-xs hover:shadow-lg transition-all duration-300"
              >
                {/* Visual Imagery */}
                <div className="relative h-[200px] sm:h-[220px] w-full overflow-hidden bg-[#1F3026]">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9.5px] font-mono font-bold tracking-[0.14em] text-white uppercase border border-white/20">
                      {exp.badge}
                    </span>
                  </div>

                  {/* Pillar Number */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="text-[11px] font-mono font-bold text-white/70">
                      {exp.order}
                    </span>
                  </div>

                  {/* Title overlay at bottom of photo */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <span className="text-[9.5px] font-mono tracking-[0.2em] text-[#D7B66A] uppercase block">
                      {exp.subtitle}
                    </span>
                    <h4 className="text-[18px] sm:text-[20px] font-serif font-bold text-white leading-tight mt-0.5">
                      {exp.title}
                    </h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                  <p className="text-[13px] sm:text-[13.5px] text-[#171717]/80 font-light leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <div className="pt-3 border-t border-[#304B38]/10 flex items-center justify-between text-[10.5px] font-mono font-bold text-[#294D3A]">
                    <span className="tracking-wider uppercase">JAWAI RUNNER DISCOVERY</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#C69A3A]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* ── Section Divider ── */}
        <div className="w-full h-[1px] bg-[#304B38]/15 mb-14 sm:mb-16 lg:mb-20" aria-hidden="true" />

        {/* ===================================================================
            SECTION 03: OUR CONSERVATION MISSION (Professional 2-Column Compact Grid)
            =================================================================== */}
        <div id="conservation-mission" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Heading + Impact Manifesto Card */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#C69A3A] uppercase mb-1.5">
              03. OUR CONSERVATION MISSION
            </span>
            <h3 className="text-[32px] sm:text-[38px] lg:text-[42px] font-serif font-medium text-[#171717] leading-[1.06] tracking-tight mb-4">
              Every Step <br />
              <span className="italic font-serif text-[#1F3026]">Creates an Impact.</span>
            </h3>

            <p className="text-[14px] sm:text-[14.5px] text-[#171717]/80 font-light leading-relaxed mb-6">
              Jawai Runner believes that the future of conservation depends on collective action. Our initiatives extend beyond sporting activities to create measurable environmental and social impact across the living landscape.
            </p>

            {/* Impact Banner Box in Deep Forest Green */}
            <div className="relative rounded-[22px] overflow-hidden bg-[#182B20] text-white p-6 sm:p-7 border border-[#C69A3A]/30 shadow-md">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#C69A3A]/10 rounded-full blur-2xl pointer-events-none" />
              
              <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-[#C69A3A] uppercase block mb-2">
                OUR CORE GOAL
              </span>
              
              <p className="text-[16px] sm:text-[17px] font-serif italic text-white/95 leading-snug mb-4">
                “Our goal is simple: Make every adventure contribute to nature.”
              </p>
              
              <div className="h-[1px] w-full bg-white/15 my-3.5" />
              
              <span className="text-[11.5px] font-mono font-bold tracking-[0.16em] text-[#D7B66A] uppercase block">
                Jungle Pacho Lanao — Bring the Jungle Back.
              </span>

              <Link
                href="#registration"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C69A3A] hover:bg-[#d8ab43] text-[#14231A] font-bold text-[11px] tracking-wider uppercase transition-colors"
              >
                <span>Join Conservation Movement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: 8 Balanced Compact Commitment Cards (2x4 Grid) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#304B38]/12">
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#171717] uppercase">
                ON-GROUND CONSERVATION COMMITMENTS
              </span>
              <span className="text-[10px] font-mono font-bold text-[#C69A3A] uppercase tracking-wider">
                8 PILLARS
              </span>
            </div>

            {/* Compact 2-column grid: Replaces the 7 giant stretched bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMITMENTS.map((item, idx) => {
                const IconComponent = item.icon;
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
                        <span className="text-[9.5px] font-mono font-bold text-[#C69A3A]">{item.order}</span>
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
