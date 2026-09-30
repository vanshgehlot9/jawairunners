"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight } from "lucide-react";

type NavLink = {
  name: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { name: "THREE RUNS", href: "#three-runs" },
  { name: "FOUNDATION", href: "#foundation" },
  { name: "FAQ", href: "#faq" }
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FFFFFF]/95 backdrop-blur-md shadow-sm border-b border-[#304B38]/10"
            : "bg-[#FFFFFF] border-b border-[#304B38]/10"
        }`}
        role="banner"
      >
        {/* Top Accent Stripe */}
        <div className="w-full flex h-[2.5px]">
          <div className="flex-1 bg-[#304B38]" />
          <div className="w-[140px] bg-[#C69A3A]" />
          <div className="w-[80px] bg-[#8A6545]" />
        </div>

        <div
          className={`max-w-[1440px] mx-auto w-full px-5 md:px-8 lg:px-12 flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-[68px]" : "h-[74px] lg:h-[84px]"
          }`}
        >
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-9 h-9 lg:w-11 lg:h-11 rounded-lg overflow-hidden border border-[#304B38]/15 bg-[#FAF8F5] flex items-center justify-center shadow-xs">
              <Image
                src="/logo.jpg"
                alt="Jawai Runners"
                width={44}
                height={44}
                className="object-contain mix-blend-multiply w-7 h-7 lg:w-9 lg:h-9"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] lg:text-[14px] font-bold tracking-[0.14em] text-[#171717] leading-none mb-1">
                JAWAI RUNNERS
              </span>
              <span className="text-[9px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase leading-none">
                RUN TO SAVE JAWAI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[12px] font-bold tracking-[0.09em] text-[#171717]/80 hover:text-[#304B38] transition-colors uppercase relative py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="#registration"
              className="inline-flex items-center justify-center gap-2 bg-[#294D3A] text-white rounded-[8px] hover:bg-[#1C3628] transition-all h-[42px] px-5 font-bold text-[11px] tracking-[0.12em] uppercase shadow-sm group"
            >
              <span>JOIN THE RUN</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C69A3A] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            className="lg:hidden relative w-[38px] h-[38px] flex items-center justify-center rounded-[8px] bg-[#304B38] text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="w-[16px] h-[12px] relative flex flex-col justify-between items-center">
              <span className={`block h-[1.5px] w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block h-[1.5px] w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#FAF8F5] pt-[84px] px-6 pb-8 flex flex-col justify-between lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col space-y-4 pt-6">
              <div className="p-4 rounded-xl bg-[#294D3A]/10 border border-[#294D3A]/20 mb-4">
                <span className="text-[10px] font-bold tracking-[0.16em] text-[#C69A3A] uppercase block mb-1">
                  CONSERVATION CAMPAIGN
                </span>
                <span className="text-[14px] font-bold text-[#1F3026] block">
                  RUN TO SAVE JAWAI
                </span>
                <p className="text-[12px] text-[#171717]/70 mt-1">
                  100,000 Native Plants · Zero Single-Use Plastic · One Living Landscape
                </p>
              </div>

              {NAV_LINKS.map((link, idx) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[20px] font-bold text-[#171717] py-2 border-b border-[#171717]/10 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-[11px] font-mono text-[#8C6A43]">0{idx + 1}</span>
                </a>
              ))}
            </div>

            <div className="pt-6 space-y-4">
              <a
                href="#registration"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full h-[52px] bg-[#294D3A] text-white rounded-xl flex items-center justify-center font-bold text-[12px] tracking-[0.14em] uppercase"
              >
                REGISTER FOR 3-RUN SERIES →
              </a>
              <div className="text-center text-[10px] font-mono text-[#171717]/50 uppercase">
                Organised by Stepwells Renovater Foundation
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
