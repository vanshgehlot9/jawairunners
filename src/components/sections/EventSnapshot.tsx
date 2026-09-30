"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Trees, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

export function EventSnapshot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20% 0px -20% 0px" });
  const [activeCheckpoint, setActiveCheckpoint] = useState<number>(0);

  const checkpoints = [
    {
      id: "cp-1",
      number: "01",
      name: "RUN 1 — AWAKEN",
      date: "25 OCT 2026",
      tagline: "Launch of 100,000 Native Plants Campaign",
      location: "Granite Foothills Basecamp",
      distance: "21K / 10K / 5K",
      treesGoal: "10,000 Seed Balls Deployed"
    },
    {
      id: "cp-2",
      number: "02",
      name: "RUN 2 — RESTORE",
      date: "07 NOV 2026",
      tagline: "Progress Update & Restoration Sites",
      location: "Heritage Stepwell Oasis",
      distance: "21K / 10K / 5K",
      treesGoal: "35,000 Saplings Monitored"
    },
    {
      id: "cp-3",
      number: "03",
      name: "RUN 3 — CELEBRATE",
      date: "25 DEC 2026",
      tagline: "First Major Restoration Milestone",
      location: "Jawai Dam Reservoir Ridge",
      distance: "21K / 10K / 5K",
      treesGoal: "100,000 Milestone Celebration"
    }
  ];

  return (
    <section ref={containerRef} className="relative w-full bg-[#FAF8F5] pt-20 lg:pt-28 pb-20 lg:pb-28 overflow-hidden border-b border-[#304B38]/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Text Identity Left */}
          <div className="flex flex-col w-full lg:w-[38%] z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#C69A3A]">02</span>
              <div className="w-8 h-[1px] bg-[#C69A3A]" />
              <span className="text-[11px] font-bold tracking-[0.16em] text-[#8C6A43] uppercase">
                THE RESTORATION SERIES TRAIL
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[38px] sm:text-[46px] md:text-[54px] font-bold tracking-tight text-[#171A18] leading-[1.05] mb-6"
            >
              THREE RUNS. <br />
              <span className="text-[#304B38] font-serif italic">ONE LIVING TRAIL.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[15px] md:text-[16px] text-[#171A18]/75 leading-relaxed mb-8 font-light"
            >
              From October&apos;s seed broadcasting to December&apos;s winter milestone celebration, every kilometer connects Rajasthan&apos;s ancient granite outcrops with thriving native biodiversity.
            </motion.p>

            {/* Organiser Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="p-4 rounded-xl bg-white border border-[#304B38]/15 mb-8"
            >
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#8C6A43] uppercase block mb-1">
                Organised by
              </span>
              <span className="text-[14px] font-bold text-[#1F3026]">
                Stepwells Renovater Foundation
              </span>
              <p className="text-[12px] text-[#171717]/60 mt-0.5">
                Reviving ancient stepwells & native tree ecosystems across Jawai.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <Link 
                href="#registration" 
                className="group inline-flex items-center justify-center bg-[#294D3A] text-white rounded-[8px] transition-colors duration-300 hover:bg-[#18372B] h-[48px] px-8 font-bold text-[11px] tracking-[0.15em] uppercase shadow-md"
              >
                <span>REGISTER FOR SERIES</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 text-[#D7B66A] group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Interactive SVG Trail Right */}
          <div className="flex flex-col w-full lg:w-[62%] bg-white rounded-[24px] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-lg border border-[#304B38]/12">
            
            {/* Abstract Topo Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50,100 Q150,250 350,100 T850,200" stroke="#18372B" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M-50,200 Q200,400 450,200 T850,350" stroke="#18372B" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M-50,300 Q250,550 550,300 T850,500" stroke="#18372B" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>

            {/* Title Bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#171717]/10 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C69A3A]" />
                <span className="text-[12px] font-bold tracking-[0.14em] text-[#1F3026] uppercase">
                  SERIES TIMELINE & MILESTONE PATH
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#8C6A43] font-bold">
                100,000 NATIVE SAPLINGS
              </span>
            </div>

            {/* Checkpoint selector buttons */}
            <div className="grid grid-cols-3 gap-3 mb-8 relative z-10">
              {checkpoints.map((cp, idx) => (
                <button
                  key={cp.id}
                  onClick={() => setActiveCheckpoint(idx)}
                  className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    activeCheckpoint === idx
                      ? "bg-[#1F3026] text-white border-[#1F3026] shadow-md"
                      : "bg-[#FAF8F5] text-[#171717] border-[#304B38]/15 hover:border-[#304B38]/30"
                  }`}
                >
                  <span className={`block text-[10px] font-mono font-bold tracking-wider mb-1 ${
                    activeCheckpoint === idx ? "text-[#C69A3A]" : "text-[#8C6A43]"
                  }`}>
                    {cp.number} · {cp.date}
                  </span>
                  <span className="block text-[13px] sm:text-[15px] font-bold leading-tight">
                    {cp.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Interactive SVG Trail Animation */}
            <div className="relative w-full h-[180px] sm:h-[220px] flex items-center justify-center bg-[#FAF8F5] rounded-2xl p-4 overflow-hidden border border-[#304B38]/10 mb-6">
              <svg className="w-full h-full max-w-[580px] overflow-visible" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Dash Track */}
                <path
                  d="M 50,150 C 150,150 150,50 250,50 C 350,50 380,140 480,140 C 520,140 550,60 580,60"
                  stroke="#304B38"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />

                {/* Animated Dynamic Path */}
                <motion.path 
                  d="M 50,150 C 150,150 150,50 250,50 C 350,50 380,140 480,140 C 520,140 550,60 580,60" 
                  stroke="#D7B66A" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />

                {/* Checkpoint 1 - Awaken */}
                <g transform="translate(50, 150)">
                  <circle r="10" fill={activeCheckpoint === 0 ? "#1F3026" : "#FFFFFF"} stroke="#294D3A" strokeWidth="3" />
                  {activeCheckpoint === 0 && <circle r="4" fill="#C69A3A" />}
                  <text x="0" y="28" textAnchor="middle" fill="#171A18" fontSize="12" fontWeight="bold">25 OCT</text>
                  <text x="0" y="42" textAnchor="middle" fill="#8C6A43" fontSize="9" fontWeight="bold">RUN 1</text>
                </g>

                {/* Checkpoint 2 - Restore */}
                <g transform="translate(250, 50)">
                  <circle r="10" fill={activeCheckpoint === 1 ? "#1F3026" : "#FFFFFF"} stroke="#294D3A" strokeWidth="3" />
                  {activeCheckpoint === 1 && <circle r="4" fill="#C69A3A" />}
                  <text x="0" y="-22" textAnchor="middle" fill="#171A18" fontSize="12" fontWeight="bold">7 NOV</text>
                  <text x="0" y="-10" textAnchor="middle" fill="#8C6A43" fontSize="9" fontWeight="bold">RUN 2</text>
                </g>

                {/* Checkpoint 3 - Celebrate */}
                <g transform="translate(480, 140)">
                  <circle r="10" fill={activeCheckpoint === 2 ? "#1F3026" : "#FFFFFF"} stroke="#294D3A" strokeWidth="3" />
                  {activeCheckpoint === 2 && <circle r="4" fill="#C69A3A" />}
                  <text x="0" y="28" textAnchor="middle" fill="#171A18" fontSize="12" fontWeight="bold">25 DEC</text>
                  <text x="0" y="42" textAnchor="middle" fill="#8C6A43" fontSize="9" fontWeight="bold">RUN 3</text>
                </g>
              </svg>
            </div>

            {/* Active Checkpoint Detail Box */}
            <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#304B38]/12 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#C69A3A] uppercase block">
                  SELECTED MILESTONE DETAIL
                </span>
                <span className="text-[16px] font-bold text-[#171717] block">
                  {checkpoints[activeCheckpoint].name} — {checkpoints[activeCheckpoint].date}
                </span>
                <p className="text-[13px] text-[#171717]/70 font-light mt-0.5">
                  {checkpoints[activeCheckpoint].tagline} · {checkpoints[activeCheckpoint].treesGoal}
                </p>
              </div>

              <Link
                href="#three-runs"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#304B38] uppercase hover:text-[#C69A3A] transition-colors flex-shrink-0"
              >
                <span>Full Run Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
          </div>
          
        </div>

      </div>
    </section>
  );
}
