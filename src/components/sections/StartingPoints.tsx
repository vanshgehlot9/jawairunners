"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Mountain, Users, ShieldCheck } from "lucide-react";

export function StartingPoints() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const startingPoints = [
    {
      id: "jawai-bandh",
      number: "01",
      badge: "GRANITE HILLS & WILDERNESS",
      title: "JAWAI BANDH START",
      description:
        "Begin amid the distinctive granite hills and natural surroundings of Jawai. Celebrate the connection between adventure, wilderness, and landscape.",
      tag: "WILDERNESS TRAIL",
      icon: Mountain,
      image: "/Jawai/IMG20260304183756.jpg",
      highlight: "Granite hills, vast water horizons, and rugged open terrain.",
    },
    {
      id: "bera-start",
      number: "02",
      badge: "RURAL HERITAGE & COEXISTENCE",
      title: "BERA START",
      description:
        "Experience the rural character, cultural heritage, and natural beauty of the Bera region, where communities and wildlife share the landscape.",
      tag: "CULTURAL CORRIDOR",
      icon: Users,
      image: "/Jawai/IMG20260305062531.jpg",
      highlight: "Ancient Rabari settlements, pasturelands, and pastoral harmony.",
    },
    {
      id: "conservation-start",
      number: "03",
      badge: "ACTIVE RESTORATION SITE",
      title: "CONSERVATION START",
      description:
        "Begin at a designated community or restoration site and connect the sporting event directly with Jawai's conservation mission.",
      tag: "ECOLOGICAL IMPACT",
      icon: ShieldCheck,
      image: "/Jawai/IMG20260305063812.jpg",
      highlight: "Stepwell revival zones, native nurseries, and habitat reforestation.",
    },
  ];

  return (
    <section
      id="starting-points"
      className="relative w-full bg-[#FFFFFF] py-20 lg:py-28 overflow-hidden border-b border-[#304B38]/10"
      aria-labelledby="starting-points-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 lg:mb-20 pb-8 border-b border-[#171717]/10">
          <div className="max-w-[760px]">

            <motion.h2
              id="starting-points-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#171717] font-semibold tracking-tight leading-[1.12]"
            >
              Choose Your{" "}
              <span className="italic text-[#304B38] font-normal">Starting Point.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="lg:max-w-[420px]"
          >
            <p className="text-[15px] sm:text-[16px] text-[#171717]/70 font-light leading-relaxed">
              Three starting points. One conservation mission. Each gateway offers an authentic perspective on Jawai’s wild living landscape and community stewardship.
            </p>
          </motion.div>
        </div>

        {/* 3 Starting Points Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {startingPoints.map((point, index) => {
            const Icon = point.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.article
                key={point.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative flex flex-col justify-between rounded-[24px] bg-[#FAF8F5] border border-[#304B38]/15 hover:border-[#304B38]/40 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-400"
              >
                {/* Photo Header */}
                <div className="relative w-full h-[220px] overflow-hidden bg-[#1F3026]">
                  <Image
                    src={point.image}
                    alt={point.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F3026] via-[#1F3026]/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#C69A3A] text-[10px] font-bold tracking-[0.16em] uppercase">
                      <MapPin className="w-3 h-3 text-[#C69A3A]" />
                      {point.tag}
                    </span>
                    <span className="font-serif italic text-white/90 text-2xl font-semibold">
                      {point.number}
                    </span>
                  </div>

                  {/* Bottom Image Sub-label */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-1">
                      {point.badge}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold leading-tight">
                      {point.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[15px] text-[#171717]/80 font-light leading-relaxed mb-6">
                      {point.description}
                    </p>

                    <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#304B38]/10 mb-6">
                      <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8C6A43] block mb-1">
                        KEY HIGHLIGHT
                      </span>
                      <p className="text-[13px] text-[#171717]/85 font-medium leading-snug">
                        {point.highlight}
                      </p>
                    </div>
                  </div>

                  {/* CTA Footer */}
                  <div className="pt-4 border-t border-[#304B38]/10 flex items-center justify-between">
                    <Link
                      href="#registration"
                      className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.12em] uppercase text-[#304B38] group-hover:text-[#629A13] transition-colors"
                    >
                      <span>SELECT THIS START</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="w-8 h-8 rounded-full bg-[#304B38]/5 group-hover:bg-[#304B38] group-hover:text-white flex items-center justify-center text-[#304B38] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
