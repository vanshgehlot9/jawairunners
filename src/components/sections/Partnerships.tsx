"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Award,
  Droplets,
  Trees,
  GraduationCap,
  Package,
  HeartHandshake,
  ArrowRight,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function Partnerships() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const partnershipOpportunities = [
    {
      id: "event-sponsorship",
      number: "01",
      title: "Event Sponsorship & In-Kind Support",
      tag: "BRAND ALIGNMENT",
      description:
        "Direct partnership alignment, operational backing, and co-branded environmental advocacy throughout the triathlon series.",
      icon: Award,
    },
    {
      id: "cleaning-drives",
      number: "02",
      title: "Cleaning Drive Sponsorship",
      tag: "WATER & SANCTUARY",
      description:
        "Underwriting lake and water body cleanliness, trail cleanups, and local zero single-use plastic infrastructure.",
      icon: Droplets,
    },
    {
      id: "plantation-support",
      number: "03",
      title: "Plantation & Restoration Support",
      tag: "NATIVE AFFORESTATION",
      description:
        "Funding indigenous nurseries, seed broadcasting drives, and multi-season sapling aftercare in degraded corridors.",
      icon: Trees,
    },
    {
      id: "volunteer-engagement",
      number: "04",
      title: "Volunteer & Student Engagement",
      tag: "YOUTH STEWARDSHIP",
      description:
        "Empowering schools, universities, and corporate volunteer groups to actively participate on the ground.",
      icon: GraduationCap,
    },
    {
      id: "equipment-logistics",
      number: "05",
      title: "Sports Equipment, Hydration & Logistics",
      tag: "OPERATIONAL EXCELLENCE",
      description:
        "Supporting reusable hydration systems, medical aid stations, cycling mechanical support, and trail logistics.",
      icon: Package,
    },
    {
      id: "community-programmes",
      number: "06",
      title: "Environmental Awareness & Community Programmes",
      tag: "COMMUNITY ALLIANCES",
      description:
        "Sponsoring indigenous Rabari community training, guide livelihood development, and wildlife coexistence workshops.",
      icon: HeartHandshake,
    },
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
          el.scrollBy({ left: 360, behavior: "smooth" });
        }
      }
    }, 4500);

    return () => {
      clearInterval(interval);
      el.removeEventListener("scroll", checkScroll);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="partnerships"
      className="relative w-full bg-[#FFFFFF] py-20 lg:py-28 overflow-hidden border-b border-[#304B38]/10"
      aria-labelledby="partnerships-heading"
    >
      {/* Background Topographic Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 lg:mb-14 pb-8 border-b border-[#171717]/10">
          <div className="max-w-[760px]">
            <motion.h2
              id="partnerships-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#171717] font-semibold tracking-tight leading-[1.12]"
            >
              Partner with a{" "}
              <span className="italic text-[#304B38] font-normal">Purpose.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="lg:max-w-[480px]"
          >
            <p className="text-[15px] sm:text-[16px] text-[#171717]/75 font-light leading-relaxed">
              Jawai Triathlon invites responsible businesses, organisations, educational institutions, tourism partners, and individuals to support a shared vision for environmental conservation.
            </p>
          </motion.div>
        </div>

        {/* Horizontal Navigation Control Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8C6A43] uppercase">
              PARTNERSHIP OPPORTUNITIES
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
              aria-label="Previous opportunity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#304B38]/20 hover:border-[#304B38] disabled:opacity-35 disabled:hover:border-[#304B38]/20 text-[#304B38] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next opportunity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── SINGLE ROW HORIZONTAL AUTO-SCROLLING OPPORTUNITIES TRACK ── */}
        <div
          ref={scrollRef}
          className="flex flex-row overflow-x-auto gap-5 mb-14 scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {partnershipOpportunities.map((opp) => {
            const Icon = opp.icon;

            return (
              <div
                key={opp.id}
                className="w-[290px] sm:w-[340px] shrink-0 snap-start p-6 sm:p-7 rounded-[22px] bg-[#FAF8F5] border border-[#304B38]/15 hover:border-[#304B38]/40 transition-all duration-300 shadow-xs flex flex-col justify-between group cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase bg-[#C69A3A]/10 px-2.5 py-1 rounded-full">
                      {opp.tag}
                    </span>
                    <span className="font-serif italic text-[#304B38]/40 text-xl">
                      {opp.number}
                    </span>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-[#FFFFFF] border border-[#304B38]/15 flex items-center justify-center text-[#304B38] group-hover:bg-[#304B38] group-hover:text-white transition-colors mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-[#171717] mb-2 group-hover:text-[#304B38] transition-colors leading-snug">
                    {opp.title}
                  </h3>

                  <p className="text-[13.5px] text-[#171717]/75 font-light leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#304B38]/10 flex items-center text-[12px] font-bold tracking-[0.14em] text-[#304B38] uppercase group-hover:text-[#629A13] transition-colors">
                  <span>OPPORTUNITY DETAILS</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate & Institutional Impact Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 lg:p-12 rounded-[26px] bg-[#1F3026] text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-xl"
        >
          <div className="max-w-[760px]">
            <span className="text-[11px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-3">
              COLLECTIVE CONSERVATION IMPACT
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif text-white font-semibold tracking-tight mb-4 leading-snug">
              “Let's create an impact that goes beyond the event.”
            </h3>

            <p className="text-white/85 text-[15px] sm:text-[16px] font-light leading-relaxed mb-6">
              By partnering with Jawai Triathlon, organisations can support meaningful local initiatives while encouraging employees, customers, and communities to participate in environmental action.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-bold tracking-[0.14em] text-[#C69A3A] uppercase">
              <span>• CSR ELIGIBILITY</span>
              <span>• STEPWELLS RENOVATER FOUNDATION</span>
              <span>• MEASURABLE RESTORATION METRICS</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="#registration"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#629A13] hover:bg-[#528210] text-white text-[13px] font-bold tracking-wide uppercase shadow-[0_4px_16px_rgba(98,154,19,0.35)] transition-all duration-200 text-center"
            >
              <span>PARTNER WITH US</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="mailto:support@stepwellsrenovaterfoundation.org?subject=Partnership%20Inquiry%20-%20Jawai%20Triathlon"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-[13px] font-bold tracking-wide uppercase transition-all duration-200 text-center"
            >
              <Mail className="w-4 h-4" />
              <span>EMAIL PROPOSAL</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
