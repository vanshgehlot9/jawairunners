"use client";

import Link from "next/link";
import { Trees, Droplets, Mountain, ArrowUpRight, HeartHandshake, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <>
      {/* =========================================
          DESKTOP FOOTER (Locked, Do not modify)
          ========================================= */}
      <footer className="hidden md:block bg-[#141B16] text-[#FAF8F5] pt-16 pb-12 border-t border-white/10 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col">
          
          {/* Top Banner with 3 Runs Summary */}
          <div className="p-8 rounded-[20px] bg-white/5 border border-white/10 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-1">
                  RUN 1 · 25 OCTOBER
                </span>
                <span className="text-[17px] font-bold text-white block">RUN 1 — AWAKEN</span>
                <p className="text-[12px] text-white/60 mt-1">Launch of the 100,000 Native Plants Campaign</p>
              </div>

              <div className="border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-1">
                  RUN 2 · 07 NOVEMBER
                </span>
                <span className="text-[17px] font-bold text-white block">RUN 2 — RESTORE</span>
                <p className="text-[12px] text-white/60 mt-1">Progress Update & Restoration Sites</p>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-1">
                  RUN 3 · 25 DECEMBER
                </span>
                <span className="text-[17px] font-bold text-white block">RUN 3 — CELEBRATE</span>
                <p className="text-[12px] text-white/60 mt-1">Celebrating First Major Restoration Milestone</p>
              </div>
            </div>
          </div>

          {/* Main Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
            
            {/* Brand & Organiser Info */}
            <div className="md:col-span-5 flex flex-col">
              <span className="text-[22px] font-bold tracking-widest uppercase text-white mb-1">
                JAWAI RUNNERS
              </span>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase mb-4">
                RUN TO SAVE JAWAI
              </span>
              <p className="text-[14px] text-white/70 font-light leading-relaxed max-w-[400px] mb-6">
                A conservation movement bringing runners, communities, volunteers, and conservation partners together to restore the living landscape of Jawai.
              </p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-[380px]">
                <span className="text-[9px] font-bold tracking-[0.18em] text-[#8C6A43] uppercase block mb-1">
                  Organised by:
                </span>
                <span className="text-[14px] font-bold text-white block">
                  Stepwells Renovater Foundation
                </span>
                <span className="text-[11px] text-white/60">
                  Heritage water revival & native flora afforestation in Rajasthan.
                </span>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-3 flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase mb-5">
                THE CONSERVATION MOVEMENT
              </span>
              <div className="flex flex-col space-y-3 text-[13px] text-white/80">
                <Link href="#three-runs" className="hover:text-white transition-colors">Three Runs Series</Link>
                <Link href="#foundation" className="hover:text-white transition-colors">Stepwells Renovater Foundation</Link>
                <Link href="#registration" className="hover:text-white transition-colors">Registration & Eco-Pass</Link>
                <Link href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link>
              </div>
            </div>

            {/* Principles & Ethos */}
            <div className="md:col-span-4 flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase mb-5">
                THE RUNNER&apos;S CODE
              </span>
              <ul className="space-y-2 text-[13px] text-white/70 font-light mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-[#C69A3A] font-bold">✓</span> Come with your reusable bottle.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C69A3A] font-bold">✓</span> Run responsibly.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C69A3A] font-bold">✓</span> Leave no waste.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C69A3A] font-bold">✓</span> Help restore Jawai.
                </li>
              </ul>

              <div className="text-[11px] font-mono text-[#D7B66A]">
                Every kilometre becomes a symbol of support for native plants, water, grasslands and wildlife habitat.
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50 font-mono">
            <p>
              © {new Date().getFullYear()} JAWAI RUNNERS · ORGANISED BY STEPWELLS RENOVATER FOUNDATION.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[#C69A3A] font-bold">#junglepachholanohai</span>
              <span>JAWAI · RAJASTHAN · 25.08° N, 73.16° E</span>
            </div>
          </div>

        </div>
      </footer>

      {/* =========================================
          MOBILE FOOTER (Dedicated Editorial Layout)
          ========================================= */}
      <footer className="md:hidden block bg-[#141B16] text-[#FAF8F5] pt-14 pb-8 px-6 border-t border-white/10 relative z-10">
        
        {/* 1. Brand Area */}
        <div className="mb-12">
          {/* Subtle Custom Visual */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#C69A3A] mb-5">
            <path d="M2 17L8 11L12 15L20 7L22 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 21C5 21 6.5 19.5 9.5 19.5C12.5 19.5 14 21 17 21C20 21 21.5 19.5 22 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          </svg>

          <h2 className="text-[28px] font-bold tracking-widest uppercase text-white mb-1 leading-none">
            JAWAI RUNNERS
          </h2>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-4">
            RUN TO SAVE JAWAI
          </span>
          <p className="text-[15px] text-white/70 font-light leading-[1.65] max-w-[320px]">
            A conservation movement bringing runners, communities, volunteers, and conservation partners together to restore the living landscape of Jawai.
          </p>
        </div>

        {/* 2. Organiser */}
        <div className="border-t border-white/10 pt-10 mb-10">
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#8C6A43] uppercase block mb-2">
            ORGANISED BY
          </span>
          <span className="text-[16px] font-bold text-white block mb-1">
            Stepwells Renovater Foundation
          </span>
          <p className="text-[14px] text-white/60 font-light leading-relaxed max-w-[300px]">
            Heritage water revival & native flora afforestation in Rajasthan.
          </p>
        </div>

        {/* 3. Conservation Movement Navigation */}
        <div className="border-t border-white/10 pt-10 mb-12">
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-4">
            THE CONSERVATION MOVEMENT
          </span>
          <nav aria-label="Footer mobile navigation" className="flex flex-col">
            <Link 
              href="#three-runs" 
              className="flex items-center justify-between py-[14px] border-b border-white/10 group active:bg-white/5 transition-colors focus-visible:bg-white/5 outline-none"
            >
              <span className="text-[15px] text-white/90 font-medium">Three Runs Series</span>
              <ArrowRight className="w-4 h-4 text-[#C69A3A]/70 group-active:translate-x-1 group-focus-visible:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link 
              href="#foundation" 
              className="flex items-center justify-between py-[14px] border-b border-white/10 group active:bg-white/5 transition-colors focus-visible:bg-white/5 outline-none"
            >
              <span className="text-[15px] text-white/90 font-medium">Stepwells Renovater Foundation</span>
              <ArrowRight className="w-4 h-4 text-[#C69A3A]/70 group-active:translate-x-1 group-focus-visible:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link 
              href="#registration" 
              className="flex items-center justify-between py-[14px] border-b border-white/10 group active:bg-white/5 transition-colors focus-visible:bg-white/5 outline-none"
            >
              <span className="text-[15px] text-white/90 font-medium">Registration & Eco-Pass</span>
              <ArrowRight className="w-4 h-4 text-[#C69A3A]/70 group-active:translate-x-1 group-focus-visible:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link 
              href="#faq" 
              className="flex items-center justify-between py-[14px] border-b border-white/10 group active:bg-white/5 transition-colors focus-visible:bg-white/5 outline-none"
            >
              <span className="text-[15px] text-white/90 font-medium">Frequently Asked Questions</span>
              <ArrowRight className="w-4 h-4 text-[#C69A3A]/70 group-active:translate-x-1 group-focus-visible:translate-x-1 transition-transform duration-200" />
            </Link>
          </nav>
        </div>

        {/* 4. Runner's Code */}
        <div className="mb-14">
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-5">
            THE RUNNER&apos;S CODE
          </span>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#C69A3A] flex-shrink-0 mt-1.5" aria-hidden="true">
                <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[15px] text-white/80 font-light leading-snug">Come with your reusable bottle.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#C69A3A] flex-shrink-0 mt-1.5" aria-hidden="true">
                <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[15px] text-white/80 font-light leading-snug">Run responsibly.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#C69A3A] flex-shrink-0 mt-1.5" aria-hidden="true">
                <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[15px] text-white/80 font-light leading-snug">Leave no waste.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#C69A3A] flex-shrink-0 mt-1.5" aria-hidden="true">
                <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[15px] text-white/80 font-light leading-snug">Help restore Jawai.</span>
            </li>
          </ul>
        </div>

        {/* 5. Closing Statement */}
        <div className="mb-12">
          <p className="text-[26px] font-medium leading-[1.35] tracking-tight text-white/95 font-serif italic mb-6 max-w-[320px]">
            Every kilometer becomes a symbol of support for native plants, water, grasslands and wildlife habitat.
          </p>
          
          {/* 6. Campaign Metadata */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase">
              #JUNGLEPACHLONAHOI
            </span>
            <span className="text-[11px] font-mono tracking-[0.1em] text-white/50 uppercase">
              JAWAI · RAJASTHAN
            </span>
            <span className="text-[11px] font-mono tracking-[0.1em] text-white/50 uppercase">
              25.08° N, 73.16° E
            </span>
          </div>
        </div>

        {/* 7. Copyright Final Lockup */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-[10px] font-mono tracking-[0.05em] text-white/40 leading-[1.6]">
            © {new Date().getFullYear()} JAWAI RUNNERS
            <br />
            · ORGANISED BY STEPWELLS RENOVATER FOUNDATION.
          </p>
        </div>

      </footer>
    </>
  );
}
