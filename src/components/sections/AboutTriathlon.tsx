"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Shield, Trees, Footprints, Bike } from "lucide-react";

export function AboutTriathlon() {
  const disciplines = [
    {
      title: "Trail Running",
      subtitle: "ENDURANCE ON ANCIENT GRANITE",
      description: "Navigate natural granite trails and wilderness paths across the leopard country.",
      icon: Footprints,
      tag: "RUNNING",
    },
    {
      title: "Wilderness Cycling",
      subtitle: "CORRIDORS & SCRUB TRACKS",
      description: "Traverse rugged gravel corridors and open savannah expanses with zero carbon footprint.",
      icon: Bike,
      tag: "CYCLING",
    },
    {
      title: "Heritage Equestrian",
      subtitle: "MARWAR TRADITION & LANDSCAPE",
      description: "Connect with Rajasthan's timeless equestrian heritage across iconic ridge horizons.",
      icon: Compass,
      tag: "HORSE RIDING",
    },
  ];

  return (
    <section id="about" className="relative w-full bg-[#FAF8F5] py-20 lg:py-28 overflow-hidden border-b border-[#304B38]/10">
      {/* Background Topographic Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        {/* Eyebrow & Main Title Header */}
        <div className="max-w-[840px] mb-12 lg:mb-16">

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#171717] font-semibold tracking-tight leading-[1.15] mb-6"
          >
            Where Every Step <br />
            <span className="italic text-[#304B38] font-normal">Brings Nature Back.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-[#171717]/85 font-light leading-relaxed"
          >
            Welcome to Jawai Triathlon — a conservation-driven outdoor experience in the heart of Jawai, Rajasthan. Discover the rugged beauty of Jawai through running, cycling, and horse riding. Experience its distinctive landscapes, connect with local communities, and become part of a movement dedicated to protecting nature and restoring our natural heritage.
          </motion.p>
        </div>

        {/* 2-Column Split: Image / Mission Card & Three Disciplines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-12 lg:mb-16">
          
          {/* Left Column: Visual feature with editorial badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-5 relative rounded-[24px] overflow-hidden border border-[#304B38]/15 bg-[#1F3026] text-white flex flex-col justify-between p-8 sm:p-10 shadow-lg min-h-[360px]"
          >
            {/* Background Image with Dark Vignette */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/Jawai/Lake_Scene_1280x720.jpg"
                alt="Jawai Natural Landscape"
                fill
                className="object-cover opacity-45 mix-blend-luminosity hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a10] via-[#0a1a10]/70 to-[#0a1a10]/40" />
            </div>

            {/* Top pill badge */}
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C69A3A]/20 border border-[#C69A3A]/40 text-[#D7B66A] text-[10px] font-bold tracking-[0.16em] uppercase">
                SHARED VISION
              </span>
            </div>

            {/* Bottom Content Quote */}
            <div className="relative z-10 mt-16">
              <h3 className="font-serif italic text-2xl sm:text-3xl text-white mb-3 leading-snug">
                “Jungle Pacho Lanao — Bring the Jungle Back.”
              </h3>
              <p className="text-white/80 text-[14px] leading-relaxed font-light">
                Jawai Triathlon brings together adventure, endurance, and environmental responsibility under one shared vision. This is more than a sporting event — it is an opportunity to turn your passion for adventure into meaningful action for nature.
              </p>
            </div>
          </motion.div>

          {/* Right Column: 3 Disciplines (Running, Cycling, Horse Riding) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {disciplines.map((d, index) => {
              const Icon = d.icon;
              return (
                <motion.div
                  key={d.tag}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 * index }}
                  className="p-6 sm:p-7 rounded-[20px] bg-[#FFFFFF] border border-[#304B38]/15 hover:border-[#304B38]/35 transition-all duration-300 shadow-xs flex items-start gap-5 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#304B38]/15 flex items-center justify-center text-[#304B38] group-hover:bg-[#304B38] group-hover:text-white transition-colors duration-300 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-lg font-bold text-[#171717] group-hover:text-[#304B38] transition-colors">
                        {d.title}
                      </h4>
                      <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#C69A3A] bg-[#C69A3A]/10 px-2.5 py-0.5 rounded-full">
                        {d.tag}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#8C6A43] mb-1.5">
                      {d.subtitle}
                    </p>
                    <p className="text-[14px] text-[#171717]/75 font-light leading-relaxed">
                      {d.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action & Manifesto Callout Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 sm:p-8 rounded-[20px] bg-[#1F3026] text-white flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-11 h-11 rounded-full bg-[#629A13]/25 border border-[#629A13]/40 flex items-center justify-center text-[#8ec94a] shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif italic text-lg text-white mb-0.5">
                Participate for the experience. Contribute to the cause. Become part of the movement.
              </p>
              <p className="text-[12px] font-bold tracking-[0.14em] text-[#C69A3A] uppercase">
                #JUNGLEPACHOLANAO · BRING THE JUNGLE BACK
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              href="#registration"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#629A13] hover:bg-[#528210] text-white text-[13px] font-bold tracking-wide uppercase shadow-[0_4px_16px_rgba(98,154,19,0.35)] transition-all duration-200 w-full sm:w-auto"
            >
              <span>JOIN THE RUN</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#experience"
              className="flex items-center justify-center px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[13px] font-bold tracking-wide uppercase transition-all duration-200 w-full sm:w-auto"
            >
              <span>EXPLORE EXPERIENCES</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
