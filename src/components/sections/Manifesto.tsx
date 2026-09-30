"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { TreePine, Droplets, Mountain, ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";

export function Manifesto() {
  const pillars = [
    {
      id: "plants",
      icon: TreePine,
      badge: "TARGET: 100,000 TREES",
      title: "100,000 NATIVE PLANTS",
      subtitle: "RESTORING ARID FOREST CANOPIES",
      description:
        "Every kilometre run powers the planting of native desert flora — Dhok, Kair, Ber, and Khejri. These indigenous species bind arid soil, revive groundwater tables, and re-establish critical cover for leopards and migratory avifauna.",
      tag: "AFFORESTATION",
      color: "#294D3A",
      accent: "#C69A3A",
      image: "/Jawai/IMG20260305062531.jpg",
      stat: "100,000",
      statLabel: "Saplings Pledged"
    },
    {
      id: "plastic",
      icon: Droplets,
      badge: "100% PACK-IN, PACK-OUT",
      title: "ZERO SINGLE-USE PLASTIC",
      subtitle: "CLEAN TRAILS, PURE WATERS",
      description:
        "Jawai is a pristine sanctuary. We enforce a strict zero single-use plastic mandate. Runners carry their reusable hydration systems, while our solar refill hubs use local terracotta and stainless-steel chillers. No paper cups, no plastic wrappers, zero trace.",
      tag: "CIRCULAR TRAIL",
      color: "#1F3026",
      accent: "#56C19B",
      image: "/Jawai/Lake_Scene_1280x720.jpg",
      stat: "0.00 kg",
      statLabel: "Plastic Allowed"
    },
    {
      id: "landscape",
      icon: Mountain,
      badge: "HERITAGE COEXISTENCE",
      title: "ONE LIVING LANDSCAPE",
      subtitle: "GRANITE HILLS & PASTORAL HARMONY",
      description:
        "A rare ecological tapestry where wild leopards, migratory flamingoes, and the pastoral Rabari community have coexisted for centuries. Jawai Runners connects runners directly with local custodians, funding continuous ecological restoration and stepwell revival.",
      tag: "HABITAT PROTECTION",
      color: "#232F27",
      accent: "#D7B66A",
      image: "/images/leopard.jpg",
      stat: "400+ km²",
      statLabel: "Corridor Protected"
    }
  ];

  return (
    <section id="mission" className="relative w-full bg-[#FAF8F5] py-24 lg:py-36 overflow-hidden border-b border-[#304B38]/10">
      {/* Background Topographic Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16 lg:mb-24 pb-8 border-b border-[#171717]/10">
          <div className="max-w-[760px]">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#304B38]/10 border border-[#304B38]/20 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C69A3A]" />
              <span className="text-[11px] font-bold tracking-[0.18em] text-[#304B38] uppercase">
                THE CONSERVATION MANIFESTO
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[36px] sm:text-[48px] md:text-[60px] lg:text-[70px] font-medium leading-[1.02] tracking-tight text-[#171717]"
            >
              RUN • RESTORE • <span className="text-[#C69A3A] italic font-serif">REWILD.</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[17px] md:text-[20px] text-[#171717]/80 leading-relaxed font-light mt-6"
            >
              You are invited to join <strong className="text-[#1F3026] font-semibold">JAWAI RUNNERS</strong> — a conservation movement that brings together runners, communities, volunteers and conservation partners to restore the living landscape of Jawai.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-start lg:items-end p-6 rounded-2xl bg-white border border-[#304B38]/15 shadow-sm max-w-[340px]"
          >
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#8C6A43] uppercase mb-1">
              Organised by
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-[#1F3026]">
              Stepwells Renovater Foundation
            </span>
            <p className="text-[12px] text-[#171717]/60 mt-2 leading-relaxed">
              Reviving ancestral water architecture & rewilding the arid Aravali fringe.
            </p>
          </motion.div>
        </div>

        {/* Central Manifesto Banner Quote */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[24px] bg-[#1F3026] text-[#FAF8F5] p-8 md:p-12 mb-16 shadow-xl"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
            <Image 
              src="/Jawai/IMG20260304184258.jpg" 
              alt="Jawai Ridge" 
              fill 
              className="object-cover"
            />
          </div>

          <div className="relative z-10 max-w-[850px]">
            <span className="text-[11px] font-mono tracking-[0.2em] text-[#C69A3A] uppercase block mb-3">
              MOVEMENT CREED
            </span>
            <blockquote className="text-[22px] sm:text-[28px] md:text-[34px] font-normal leading-[1.25] text-white">
              “Every kilometre becomes a symbol of support for native plants, water, grasslands and wildlife habitat.”
            </blockquote>
            <p className="mt-4 text-[14px] md:text-[15px] text-white/70 tracking-wide font-light">
              Your presence can become part of Jawai&apos;s restoration story.
            </p>
          </div>
        </motion.div>

        {/* The 3 Core Impact Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group relative flex flex-col bg-white rounded-[22px] overflow-hidden border border-[#304B38]/12 hover:border-[#304B38]/30 transition-all duration-300 hover:shadow-xl"
              >
                {/* Visual Imagery */}
                <div className="relative h-[220px] w-full overflow-hidden bg-[#1F3026]/10">
                  <Image 
                    src={pillar.image} 
                    alt={pillar.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-[0.14em] text-white uppercase border border-white/20">
                      <Icon className="w-3 h-3 text-[#C69A3A]" />
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Impact Stat */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                    <div>
                      <span className="block text-[28px] font-bold text-white leading-none">
                        {pillar.stat}
                      </span>
                      <span className="text-[10px] font-medium tracking-[0.12em] text-[#D7B66A] uppercase">
                        {pillar.statLabel}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-white/70 uppercase">
                      {pillar.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col p-6 sm:p-7 flex-1 justify-between">
                  <div>
                    <h3 className="text-[20px] font-bold text-[#171717] tracking-tight group-hover:text-[#294D3A] transition-colors mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] font-bold tracking-[0.15em] text-[#C69A3A] uppercase mb-4">
                      {pillar.subtitle}
                    </p>
                    <p className="text-[14px] text-[#171717]/75 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#171717]/10 flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider text-[#304B38] uppercase">
                      Pillar 0{idx + 1}
                    </span>
                    <Link 
                      href="#registration" 
                      className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#C69A3A] group-hover:translate-x-1 transition-transform uppercase"
                    >
                      Pledge with your run <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
