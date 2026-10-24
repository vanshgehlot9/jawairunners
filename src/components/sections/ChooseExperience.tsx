"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Footprints, Bike, Compass, ArrowRight, Info, ShieldCheck } from "lucide-react";

export function ChooseExperience() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const experiences = [
    {
      id: "jawai-runner",
      number: "01",
      title: "JAWAI RUNNER",
      category: "ON FOOT / ENDURANCE",
      tag: "TRAIL RUNNING",
      description:
        "Challenge yourself on foot and experience the landscape at your own pace. Whether you are a beginner or an experienced runner, join a community united by a love for nature and a commitment to conservation.",
      icon: Footprints,
      image: "/images/hero.jpg",
      focusPoint: "Natural granite trails & pacing amid wilderness",
    },
    {
      id: "jawai-cyclist",
      number: "02",
      title: "JAWAI CYCLIST",
      category: "PEDAL / EXPEDITION",
      tag: "CYCLING",
      description:
        "Explore Jawai through a cycling experience that combines physical endurance, scenic surroundings, and environmental awareness. Ride responsibly and become part of a movement that supports the restoration of nature.",
      icon: Bike,
      image: "/Jawai/Lake_Scene_1280x720.jpg",
      focusPoint: "Scenic gravel corridors & scrub trails",
    },
    {
      id: "jawai-horse-rider",
      number: "03",
      title: "JAWAI HORSE RIDER",
      category: "EQUESTRIAN / HERITAGE",
      tag: "HORSE RIDING",
      description:
        "Experience the countryside through a guided horse-riding activity that celebrates local landscapes and outdoor adventure. Horse riding will be organised with appropriate safety measures, trained handlers, and consideration for animal welfare.",
      icon: Compass,
      image: "/Jawai/IMG20260305072014.jpg",
      focusPoint: "Guided countryside routes & animal welfare priority",
    },
  ];

  return (
    <section
      id="experience"
      className="relative w-full bg-[#FAF8F5] py-20 lg:py-28 overflow-hidden border-b border-[#304B38]/10"
      aria-labelledby="experience-heading"
    >
      {/* Background Topographic Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 lg:mb-20 pb-8 border-b border-[#171717]/10">
          <div className="max-w-[760px]">

            <motion.h2
              id="experience-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#171717] font-semibold tracking-tight leading-[1.12]"
            >
              Choose Your{" "}
              <span className="italic text-[#304B38] font-normal">Experience.</span>
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
              Three distinct disciplines uniting adventure, endurance, and conservation stewardship across the rugged landscapes of Jawai.
            </p>
          </motion.div>
        </div>

        {/* 3 Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            const isHovered = hoveredCard === index;

            return (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative flex flex-col justify-between rounded-[24px] bg-[#FFFFFF] border border-[#304B38]/15 hover:border-[#304B38]/40 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-400"
              >
                {/* Visual Header with Image */}
                <div className="relative w-full h-[220px] overflow-hidden bg-[#1F3026]">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F3026] via-[#1F3026]/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[#C69A3A] text-[10px] font-bold tracking-[0.16em] uppercase">
                      {exp.tag}
                    </span>
                    <span className="font-serif italic text-white/90 text-2xl font-semibold">
                      {exp.number}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Text */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-1">
                      {exp.category}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold leading-tight">
                      {exp.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[15px] text-[#171717]/80 font-light leading-relaxed mb-6">
                      {exp.description}
                    </p>

                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#304B38]/10 mb-6">
                      <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8C6A43] block mb-1">
                        DISCIPLINE FOCUS
                      </span>
                      <p className="text-[13px] text-[#171717]/85 font-medium leading-snug">
                        {exp.focusPoint}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-4 border-t border-[#304B38]/10 flex items-center justify-between">
                    <Link
                      href="#registration"
                      className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.12em] uppercase text-[#304B38] group-hover:text-[#629A13] transition-colors"
                    >
                      <span>REGISTER THIS ACTIVITY</span>
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

        {/* Notice & Registration Condition Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 sm:p-7 rounded-[20px] bg-[#FFFFFF] border border-[#304B38]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#304B38]/10 border border-[#304B38]/20 flex items-center justify-center text-[#304B38] shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-[#304B38]" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#8C6A43] uppercase block mb-1">
                IMPORTANT PARTICIPATION NOTE
              </span>
              <p className="text-[14px] text-[#171717]/80 font-light leading-relaxed max-w-3xl">
                Participants will select their preferred activity during registration. Final participation options and route arrangements will depend on the event plan, safety requirements, and permissions.
              </p>
            </div>
          </div>

          <Link
            href="#registration"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#629A13] hover:bg-[#528210] text-white text-[12.5px] font-bold tracking-wide uppercase shadow-[0_4px_16px_rgba(98,154,19,0.3)] transition-all duration-200 shrink-0 w-full md:w-auto"
          >
            <span>JOIN REGISTRATION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
