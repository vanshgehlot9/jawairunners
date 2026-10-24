"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Droplets,
  Trees,
  Eye,
  Users,
  Landmark,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function ConservationImpact() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const actionPillars = [
    {
      id: "cleaning",
      number: "01",
      title: "Cleaning Drives",
      tag: "WATER & SANCTUARY",
      description:
        "Supporting the cleanliness and protection of local water bodies, public spaces, and natural surroundings.",
      icon: Droplets,
    },
    {
      id: "plantation",
      number: "02",
      title: "Plantation Drives",
      tag: "NATIVE AFFORESTATION",
      description:
        "Planting suitable native species and promoting their long-term survival through responsible aftercare.",
      icon: Trees,
    },
    {
      id: "wildlife",
      number: "03",
      title: "Wildlife & Habitat Awareness",
      tag: "COEXISTENCE",
      description:
        "Encouraging responsible behaviour around wildlife and its natural habitat.",
      icon: Eye,
    },
    {
      id: "community",
      number: "04",
      title: "Community Participation",
      tag: "YOUTH & LOCAL STEWARDSHIP",
      description:
        "Creating opportunities for young people and local communities to participate in environmental stewardship.",
      icon: Users,
    },
    {
      id: "heritage",
      number: "05",
      title: "Heritage Conservation",
      tag: "CULTURE & MONUMENTS",
      description:
        "Supporting awareness and protection of the region's cultural and natural heritage.",
      icon: Landmark,
    },
  ];

  const allocations = [
    "Environmental conservation and habitat restoration",
    "Cleaning drives and protection of local water bodies",
    "Plantation, native vegetation, and aftercare initiatives",
    "Wildlife awareness and responsible coexistence",
    "Heritage preservation and community development",
    "Environmental education and youth participation",
  ];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 360;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // Smooth auto-scroll with pause on hover
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll);

    let isHovered = false;
    const onEnter = () => { isHovered = true; };
    const onLeave = () => { isHovered = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    const interval = setInterval(() => {
      if (!isHovered && el) {
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 20) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: 340, behavior: "smooth" });
        }
      }
    }, 4200);

    return () => {
      clearInterval(interval);
      el.removeEventListener("scroll", checkScroll);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="conservation-impact"
      className="relative w-full bg-[#FFFFFF] py-20 lg:py-28 overflow-hidden border-b border-[#304B38]/10"
      aria-labelledby="conservation-heading"
    >
      {/* Background Topographic Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        {/* ── CHAPTER 1: CONSERVATION IMPACT — MORE THAN A SPORTING EVENT ── */}
        <div className="max-w-[860px] mb-10 lg:mb-12">
          <motion.h2
            id="conservation-heading"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#171717] font-semibold tracking-tight leading-[1.12] mb-6"
          >
            Run for Nature. Ride for Change. <br />
            <span className="italic text-[#304B38] font-normal">Restore the Wilderness.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-lg lg:text-xl text-[#171717]/85 font-light leading-relaxed"
          >
            At Jawai Triathlon, the finish line is only the beginning. Our initiative connects outdoor adventure with practical environmental action. Alongside the sporting event, we aim to encourage participants, volunteers, local communities, and supporters to take an active role in protecting the region's natural and cultural heritage.
          </motion.p>
        </div>

        {/* Horizontal Navigation Control Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8C6A43] uppercase">
              ACTION INITIATIVES
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ec94a] animate-pulse" />
            <span className="text-[11px] text-[#171717]/50 hidden sm:inline">
              (Auto-scrolling stream)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#304B38]/20 hover:border-[#304B38] disabled:opacity-35 disabled:hover:border-[#304B38]/20 text-[#304B38] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#304B38]/20 hover:border-[#304B38] disabled:opacity-35 disabled:hover:border-[#304B38]/20 text-[#304B38] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── SINGLE ROW HORIZONTAL / AUTO-SCROLLING ACTION PILLARS TRACK ── */}
        <div
          ref={scrollRef}
          className="flex flex-row overflow-x-auto gap-5 mb-16 scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {actionPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="w-[280px] sm:w-[320px] shrink-0 snap-start p-6 rounded-[22px] bg-[#FAF8F5] border border-[#304B38]/15 hover:border-[#304B38]/40 transition-all duration-300 shadow-xs flex flex-col justify-between group cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9.5px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase bg-[#C69A3A]/10 px-2.5 py-0.5 rounded-full">
                      {pillar.tag}
                    </span>
                    <span className="font-serif italic text-[#304B38]/40 text-lg">
                      {pillar.number}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#304B38]/15 flex items-center justify-center text-[#304B38] group-hover:bg-[#304B38] group-hover:text-white transition-colors mb-3.5">
                    <Icon className="w-4 h-4" />
                  </div>

                  <h3 className="text-[17px] font-bold text-[#171717] mb-2 group-hover:text-[#304B38] transition-colors leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-[13.5px] text-[#171717]/75 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Core Conservation Philosophy Quote */}
          <div className="w-[300px] sm:w-[340px] shrink-0 snap-start p-6 rounded-[22px] bg-[#1F3026] text-white flex flex-col justify-between shadow-xs border border-[#1F3026]">
            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-3">
                CONTINUOUS STEWARDSHIP
              </span>
              <p className="font-serif italic text-lg sm:text-xl text-white/95 leading-snug mb-4">
                “We believe that conservation is not a one-day activity. It is a responsibility that continues long after the event ends.”
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10.5px] font-bold tracking-[0.14em] text-[#8ec94a] uppercase">
                #JUNGLEPACHOLANAO
              </span>
              <HeartHandshake className="w-4 h-4 text-[#C69A3A]" />
            </div>
          </div>
        </div>

        {/* ── CHAPTER 2: OUR MISSION — JUNGLE PACHO LANAO ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[28px] overflow-hidden bg-[#1F3026] text-white p-8 sm:p-12 lg:p-16 mb-16 shadow-xl"
        >
          {/* Subtle Background Landscape Fragment */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/Jawai/IMG20260304183756.jpg"
              alt="Jawai wilderness"
              fill
              className="object-cover opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a10] via-[#0a1a10]/85 to-[#0a1a10]/60" />
          </div>

          <div className="relative z-10 max-w-[820px]">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-3">
              OUR MISSION · JUNGLE PACHO LANAO
            </span>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-semibold tracking-tight leading-[1.12] mb-6">
              Bring the Jungle Back. <br />
              <span className="italic text-[#8ec94a] font-normal">Restore the Balance.</span>
            </h3>

            <div className="space-y-4 text-white/85 text-[15px] sm:text-[16px] font-light leading-relaxed mb-8">
              <p>
                Jungle Pacho Lanao is a call to reconnect with nature and take responsibility for the landscapes we share. Jawai is a unique landscape where wildlife, villages, rocky hills, and human livelihoods exist alongside one another. Protecting this landscape requires awareness, community participation, responsible tourism, and sustained conservation efforts.
              </p>
              <p>
                Through Jawai Triathlon, we aim to inspire people to move beyond awareness and take action. Every participant becomes an ambassador for responsible outdoor recreation, environmental protection, and a future in which people and nature can thrive together.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <p className="font-serif italic text-lg sm:text-xl text-white mb-1">
                “Our vision is simple: a healthier landscape, stronger communities, and a future where nature continues to flourish.”
              </p>
              <span className="text-[11px] font-bold tracking-[0.16em] text-[#C69A3A] uppercase">
                SHARED VISION · JAWAIRUNNERS & STEPWELLS RENOVATER FOUNDATION
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── CHAPTER 3: WHERE YOUR CONTRIBUTION GOES ── */}
        <div className="rounded-[28px] bg-[#FAF8F5] border border-[#304B38]/15 p-8 sm:p-12 lg:p-16">
          <div className="max-w-[820px] mb-10">
            <span className="text-[10px] font-bold tracking-[0.22em] text-[#8C6A43] uppercase block mb-3">
              TRANSPARENCY & ALLOCATION
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#171717] font-semibold tracking-tight leading-[1.18] mb-4">
              Where Your Contribution Goes — <br />
              <span className="italic text-[#304B38] font-normal">Your Participation Has a Purpose.</span>
            </h3>
            <p className="text-[15px] sm:text-[16px] text-[#171717]/80 font-light leading-relaxed">
              Jawai Triathlon is an initiative of Stepwells Renovater Foundation, established to bring people together around charitable, environmental, and community-focused objectives. Funds raised through event registrations, sponsorships, and voluntary contributions will be used to support the Foundation's eligible charitable objectives, in accordance with applicable laws and the Foundation's financial procedures.
            </p>
          </div>

          {/* Allocation Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {allocations.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] border border-[#304B38]/12 flex items-start gap-3.5 shadow-2xs"
              >
                <CheckCircle2 className="w-5 h-5 text-[#629A13] shrink-0 mt-0.5" />
                <span className="text-[14px] font-medium text-[#171717]/90 leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Governance & Accountability Strip */}
          <div className="p-6 sm:p-8 rounded-[20px] bg-[#FFFFFF] border border-[#304B38]/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#304B38]/10 border border-[#304B38]/20 flex items-center justify-center text-[#304B38] shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-[#304B38]" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-1">
                  AN INITIATIVE BY STEPWELLS RENOVATER FOUNDATION · TRANSPARENCY & ACCOUNTABILITY
                </span>
                <p className="text-[13.5px] text-[#171717]/75 font-light leading-relaxed max-w-3xl">
                  We believe that responsible fundraising must be accompanied by transparency and accountability. Appropriate financial records will be maintained, and project updates will be shared as applicable. When you participate in Jawai Triathlon, you become part of a larger effort to create a positive and lasting impact.
                </p>
              </div>
            </div>

            <Link
              href="#registration"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#629A13] hover:bg-[#528210] text-white text-[12.5px] font-bold tracking-wide uppercase shadow-[0_4px_16px_rgba(98,154,19,0.3)] transition-all duration-200 shrink-0 w-full lg:w-auto"
            >
              <span>JOIN THE MOVEMENT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
