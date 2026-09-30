"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <>
      {/* =========================================
          DESKTOP HERO (Locked, Do not modify)
          ========================================= */}
      <div className="hidden md:block">
        <section className={styles.hero} id="home">

          {/* Background video — fills the section */}
          <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/jawai-runner.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Gradient overlays — make text readable over the video */}
          <div className={styles.overlayLeft}  aria-hidden="true" />
          <div className={styles.overlayBottom} aria-hidden="true" />

          {/* Content — normal flow, z-index above overlays */}
          <div className={styles.container}>
            <div className="w-full max-w-[100%] lg:max-w-lg xl:max-w-2xl flex flex-col items-start py-12 lg:py-0">


              {/* Editorial Serif Headline — Title Case like Stepwells Renovater */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                className={styles.title}
              >
                Run to Save <br />
                <span className={styles.titleItalic}>Jawai.</span>
              </motion.h1>

              {/* Concise, impactful editorial tagline */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className={styles.tagline}
              >
                A conservation movement uniting runners, Rabari communities, and wildlife guardians to restore and protect the wild living landscape of Jawai.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.38 }}
                className="flex flex-col sm:flex-row items-center gap-[10px] sm:gap-3.5 w-full sm:w-auto"
              >
                <Link href="#registration" className={`${styles.primaryBtn} w-full sm:w-auto justify-center`}>
                  <span>JOIN THE RUN</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link href="#three-runs" className={`${styles.secondaryBtn} w-full sm:w-auto justify-center`}>
                  <span>EXPLORE THE 3 RUNS</span>
                </Link>
              </motion.div>

              {/* Meta line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className={styles.meta}
              >
                <span className={styles.metaTag}>#junglepachholanohai</span>
                <span aria-hidden="true" className="hidden sm:inline">•</span>
                <span>ORGANISED BY: STEPWELLS RENOVATER FOUNDATION</span>
              </motion.div>

            </div>
          </div>

        </section>
      </div>

      {/* =========================================
          MOBILE HERO (Dedicated Editorial Layout)
          ========================================= */}
      <div className="block md:hidden">
        <section 
          id="home-mobile" 
          className="relative w-full overflow-hidden bg-[#0a1a10] flex flex-col justify-end"
          style={{ height: '78svh', minHeight: '72svh', maxHeight: '760px' }}
        >
          {/* Mobile Video Background with specific focal crop */}
          <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-[center_center]"
            >
              <source src="/jawai-runner.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Layered Mobile Readability Treatment */}
          <div className="absolute inset-0 bg-[#0a1a10]/15 z-[1]" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a10] via-[#0a1a10]/70 to-transparent h-[65%] top-auto z-[2]" aria-hidden="true" />

          {/* Mobile Content Safe Area */}
          <div 
            className="relative z-10 w-full px-6 flex flex-col items-start"
            style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
          >
            <div className="w-full max-w-[340px]">
              
              {/* Subtle Campaign Trail Mark */}
              <motion.svg 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" 
                className="text-[#C69A3A] mb-4"
              >
                <path d="M2 17L8 11L12 15L20 7L22 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>

              {/* Anchor Headline (Strictly 2 lines) */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-[44px] sm:text-[48px] text-white font-serif font-semibold leading-[1.02] tracking-tight mb-4"
              >
                Run to Save <br />
                <span className="italic text-[#8ec94a] font-normal">Jawai.</span>
              </motion.h1>

              {/* Secondary Mission Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-[15px] sm:text-[16px] text-white/85 font-light leading-[1.5] mb-8"
              >
                A conservation movement uniting runners, Rabari communities, and wildlife guardians to restore and protect the wild landscape of Jawai.
              </motion.p>

              {/* Action Group */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col gap-2.5 w-full mb-10"
              >
                <Link 
                  href="#registration" 
                  className="flex items-center justify-center gap-2 w-full h-[50px] bg-[#629A13] text-white rounded-xl text-[13px] font-bold tracking-wide uppercase shadow-[0_4px_16px_rgba(98,154,19,0.3)] active:scale-[0.98] transition-transform"
                >
                  <span>JOIN THE RUN</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link 
                  href="#three-runs" 
                  className="flex items-center justify-center w-full h-[48px] bg-black/25 backdrop-blur-sm border border-white/30 text-white rounded-xl text-[12px] font-bold tracking-wide uppercase active:scale-[0.98] transition-transform active:bg-white/10"
                >
                  <span>EXPLORE THE 3 RUNS</span>
                </Link>
              </motion.div>

              {/* Quiet Editorial Metadata */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-col gap-1.5"
              >
                <span className="text-[11px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase">
                  #JUNGLEPACHLONAHOI
                </span>
                <span className="text-[9.5px] font-bold tracking-[0.12em] text-white/50 uppercase">
                  ORGANISED BY · STEPWELLS RENOVATER FOUNDATION
                </span>
              </motion.div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}
