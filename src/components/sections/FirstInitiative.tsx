"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Check,
  Play,
  X,
  Eye,
  ExternalLink,
} from "lucide-react";
import { useCmsSection } from "@/lib/cms/use-cms";
import type { ReelItem } from "@/lib/cms/types";

function RunnerGlyph({ className = "w-5 h-5 text-[#294D3A]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="14" cy="4" r="2" />
      <path d="m7 21 3-4 2.5 1.5 2.5-3.5" />
      <path d="M12 11.5 15 8l3 3" />
      <path d="m6 13 4-2 3 3" />
    </svg>
  );
}

function MeditationGlyph({ className = "w-6 h-6 text-[#8C6A43]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="2.5" />
      <path d="M5 20c0-3 3-5 7-5s7 2 7 5" />
      <path d="M8 14l-2 3" />
      <path d="M16 14l2 3" />
      <path d="M9 19h6" />
    </svg>
  );
}

function InstagramReelIcon({ className = "w-4 h-4 text-white" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  );
}

export function FirstInitiative() {
  const { content, isVisible } = useCmsSection("firstInitiative");
  const [activeVideoReel, setActiveVideoReel] = useState<ReelItem | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isVisible) return null;

  const visibleReels = content.reels.filter((r) => r.visible !== false);
  const firstPhoto = content.archivePhotos[0]?.url || "/pastevent/landscape.jpeg";

  return (
    <section
      id="first-initiative"
      aria-label={content.sectionLabel}
      className="relative w-full bg-[#FAF8F5] text-[#171717] py-20 sm:py-24 lg:py-32 border-b border-[#304B38]/10 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#304B38_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        {/* TOP ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-3"
            >
              <span className="text-[11px] sm:text-[12px] font-mono font-bold tracking-[0.22em] text-[#C69A3A] uppercase">
                {content.sectionLabel}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-[44px] sm:text-[54px] lg:text-[64px] font-serif font-medium text-[#171717] leading-[1.02] tracking-tight"
            >
              {content.mainTitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-[26px] sm:text-[32px] lg:text-[38px] font-serif italic text-[#1F3026] leading-tight mt-1 mb-5"
            >
              {content.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="mb-6 w-full max-w-[480px]"
            >
              <div className="bg-[#1F3026] border-l-4 border-[#C69A3A] rounded-r-xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm">
                <h3 className="text-[15.5px] sm:text-[18px] lg:text-[20px] font-bold text-[#FAF8F5] tracking-[0.02em] leading-snug uppercase">
                  <span className="text-[#D7B66A]">{content.princessHeadline}</span>
                </h3>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="text-[15px] sm:text-[16px] text-[#171717]/80 leading-relaxed font-light mb-8 max-w-[500px]"
            >
              {content.introduction}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.34 }}
              className="w-full max-w-[420px] bg-[#EFECE3]/90 border border-[#304B38]/12 rounded-[22px] p-5 sm:p-6 flex items-center gap-5 sm:gap-6 shadow-xs"
            >
              <div className="flex items-baseline gap-1 text-[#294D3A] shrink-0">
                <span className="text-[44px] sm:text-[52px] font-serif font-bold tracking-tight leading-none">
                  {content.totalDistanceValue}
                </span>
                <span className="text-[20px] sm:text-[24px] font-serif italic font-medium leading-none">
                  {content.totalDistanceUnit}
                </span>
              </div>

              <div className="h-10 w-[1px] bg-[#304B38]/20 shrink-0" aria-hidden="true" />

              <div className="flex flex-col">
                <span className="text-[14px] sm:text-[15px] font-bold text-[#171717] leading-tight">
                  {content.totalDistanceTitle}
                </span>
                <span className="text-[11.5px] sm:text-[12.5px] text-[#171717]/65 leading-tight mt-0.5">
                  {content.totalDistanceSubtitle}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Reels */}
          <div className="lg:col-span-7 flex flex-col w-full">
            <div className="flex items-center justify-between pb-3 mb-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#171717]/80 uppercase">
                {content.highlightsLabel}
              </span>

              <a
                href={content.instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold tracking-[0.16em] text-[#171717] hover:text-[#294D3A] uppercase transition-colors group"
              >
                <span>{content.instagramCtaLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="flex lg:grid lg:grid-cols-4 gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {visibleReels.map((reel, idx) => (
                <motion.div
                  key={reel.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.08 * idx }}
                  className="group relative shrink-0 w-[165px] sm:w-[175px] lg:w-full aspect-[9/16] snap-center rounded-[20px] overflow-hidden bg-[#141B16] border border-[#171717]/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.025] cursor-pointer"
                  onClick={() => setActiveVideoReel(reel)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveVideoReel(reel);
                    }
                  }}
                  aria-label={`Play original video: ${reel.title}`}
                >
                  <Image
                    src={reel.thumbnail}
                    alt={reel.title}
                    fill
                    sizes="(max-width: 640px) 175px, (max-width: 1024px) 25vw, 200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 group-hover:from-black/80 transition-colors" />

                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-md bg-black/45 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <InstagramReelIcon className="w-3.5 h-3.5 text-white/95" />
                  </div>

                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-mono tracking-wider text-white uppercase font-bold">
                      PLAY VIDEO
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start">
                    <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/40 flex items-center justify-center mb-2 group-hover:bg-[#294D3A] group-hover:border-[#C69A3A] group-hover:scale-110 transition-all shadow-md">
                      <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                    </div>
                    <span className="text-[13px] sm:text-[14px] font-serif font-bold text-white leading-tight drop-shadow-sm group-hover:text-[#D7B66A] transition-colors">
                      {reel.title}
                    </span>
                    <span className="text-[9.5px] font-mono tracking-wider text-[#C69A3A] uppercase mt-0.5 font-semibold flex items-center gap-1">
                      <span>WATCH IN-SITE</span>
                      <span>▶</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedPhoto(firstPhoto)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8C6A43] hover:text-[#294D3A] transition-colors py-1"
              >
                <Eye className="w-3.5 h-3.5 text-[#C69A3A]" />
                <span>{content.archiveButtonLabel}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#304B38]/15 my-12 sm:my-16 lg:my-20" aria-hidden="true" />

        {/* MIDDLE ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: RUNNING JOURNEY */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11.5px] font-mono font-bold tracking-[0.2em] text-[#171717] uppercase">
                {content.runningJourneyHeading}
              </span>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {content.runners.map((runner) => (
                  <div
                    key={runner.id}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-[#304B38]/10 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#294D3A]/10 flex items-center justify-center shrink-0">
                      <RunnerGlyph className="w-4 h-4 text-[#294D3A]" />
                    </div>
                    <div className="text-[14px]">
                      <span className="font-bold text-[#171717]">{runner.name}</span>
                      <span className="text-[#304B38]/40 mx-2">—</span>
                      <span className="font-mono font-bold text-[#294D3A]">{runner.distance}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Princess */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#304B38]/15 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C69A3A]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <RunnerGlyph className="w-5 h-5 text-[#8C6A43]" />
                  </div>
                  <div className="flex flex-col text-[14px]">
                    <span className="font-bold text-[#171717] leading-snug">
                      {content.princessName}
                    </span>
                    <span className="text-[13px] text-[#171717]/75 font-light mt-1 leading-relaxed">
                      {content.princessDescription}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPhoto(firstPhoto)}
                  className="self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFECE3] border border-[#304B38]/15 text-[11px] font-mono font-bold text-[#294D3A] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C69A3A]" />
                  <span>VIEW PHOTO</span>
                </button>
              </div>

              {/* Theravada Buddhist Nun Card */}
              <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-[#F7F4EB] border-2 border-[#C69A3A]/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#C69A3A]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#8C6A43]/15 flex items-center justify-center shrink-0 border border-[#8C6A43]/20 shadow-xs">
                      <MeditationGlyph className="w-5 h-5 text-[#8C6A43]" />
                    </div>
                    <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#8C6A43] uppercase bg-white/90 px-3 py-1 rounded-md border border-[#8C6A43]/15 shadow-2xs">
                      {content.nunBadge}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(firstPhoto)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#294D3A] hover:text-[#171717] hover:underline self-start sm:self-auto uppercase tracking-wider transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C69A3A]" />
                    <span>Expand Photos</span>
                  </button>
                </div>

                <h4 className="text-[22px] sm:text-[26px] lg:text-[28px] font-serif font-bold text-[#171717] leading-tight mb-2 tracking-tight relative z-10">
                  {content.nunTitle}
                </h4>

                <p className="text-[14.5px] sm:text-[15.5px] text-[#171717]/85 font-normal leading-relaxed mb-5 relative z-10">
                  {content.nunDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[#304B38]/12 relative z-10">
                  {content.archivePhotos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-xl overflow-hidden bg-[#171717] border border-[#304B38]/20 shadow-sm cursor-pointer aspect-[16/11] sm:aspect-[4/3]"
                      onClick={() => setSelectedPhoto(photo.url)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedPhoto(photo.url);
                        }
                      }}
                      aria-label={`Enlarge ${photo.title} photo`}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 320px"
                        className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                          idx === 1 ? "object-[50%_20%]" : ""
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/75 transition-colors" />

                      <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3.5 h-3.5 text-[#D7B66A]" />
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <span className="text-[12.5px] font-serif font-bold leading-tight block text-white drop-shadow-xs">
                          {photo.title}
                        </span>
                        <span className="text-[9.5px] font-mono text-[#D7B66A] uppercase tracking-wider block mt-0.5">
                          {photo.subtitle}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 flex items-center justify-between text-[11px] text-[#8C6A43] font-mono relative z-10">
                  <span className="tracking-wider">AUTHENTIC ON-GROUND PHOTOGRAPHY</span>
                  <span className="text-[10px] uppercase font-bold text-[#294D3A] tracking-wider">
                    CLICK TO ENLARGE ↗
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: CONSERVATION ACTIVITIES */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11.5px] font-mono font-bold tracking-[0.2em] text-[#171717] uppercase">
                {content.conservationActivitiesHeading}
              </span>
            </div>

            <ul className="flex flex-col space-y-3 sm:space-y-3.5">
              {content.conservationActivities.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 text-[13.5px] sm:text-[14px] text-[#171717]/85 font-light leading-snug"
                >
                  <div className="w-4 h-4 rounded-full bg-[#294D3A]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-[#294D3A] stroke-[3]" />
                  </div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Confirmed Running Distance Pill */}
        <div className="mt-8 lg:mt-12 w-full p-3.5 sm:p-4 rounded-xl sm:rounded-full bg-[#EFECE3]/90 border border-[#304B38]/12 flex items-center gap-2.5 text-[12px] sm:text-[13px] text-[#171717] shadow-2xs">
          <MapPin className="w-4 h-4 text-[#C69A3A] shrink-0 ml-1" />
          <div className="leading-snug">
            <strong className="font-bold tracking-wide text-[#171717]">
              {content.confirmedDistanceLabel}
            </strong>
            <span className="text-[#304B38]/40 mx-2">•</span>
            <span className="italic text-[#171717]/70 font-light">
              {content.confirmedDistanceNote}
            </span>
          </div>
        </div>

        {/* BOTTOM BANNER: THE JOURNEY CONTINUES */}
        <div className="mt-14 sm:mt-18 lg:mt-20 relative w-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#182B20] border border-[#C69A3A]/35 shadow-xl">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src={content.continuationBgImage}
              alt="Jawai Wilderness Hills"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover object-right opacity-30 mix-blend-luminosity filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#14231A] via-[#1A2E22]/95 to-[#16291E]/85" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#14231A]/40 to-[#101C15]/90" />
          </div>

          <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-9 lg:px-12 lg:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
            <div className="flex flex-col shrink-0">
              <span className="text-[11px] sm:text-[11.5px] font-mono font-bold tracking-[0.24em] text-[#C69A3A] uppercase mb-1">
                {content.continuationLabel}
              </span>
              <h3 className="font-serif italic font-medium text-[34px] sm:text-[42px] lg:text-[46px] text-white leading-tight tracking-tight">
                {content.continuationDateHeading}
              </h3>
            </div>

            <div className="hidden lg:block w-[1px] h-14 bg-white/20 shrink-0" aria-hidden="true" />

            <div className="flex-1 max-w-2xl flex flex-col justify-center">
              <p className="text-[13.5px] sm:text-[14.5px] text-white/90 font-light leading-relaxed">
                {content.continuationDescription}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10.5px] sm:text-[11px] font-mono font-bold tracking-[0.24em] text-[#C69A3A] uppercase">
                  {content.continuationTagline}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center pt-2 sm:pt-0">
              <Link
                href={content.continuationCtaUrl || "#registration"}
                className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full border-2 border-[#C69A3A] text-[#D7B66A] hover:bg-[#C69A3A] hover:text-[#14231A] font-bold text-[12px] sm:text-[12.5px] tracking-[0.16em] uppercase transition-all duration-300 shadow-sm hover:shadow-lg group"
              >
                <span>{content.continuationCtaText}</span>
                <ArrowUpRight className="w-4 h-4 text-[#D7B66A] group-hover:text-[#14231A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideoReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setActiveVideoReel(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-[420px] sm:max-w-[460px] bg-[#141B16] rounded-[24px] overflow-hidden border border-white/20 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#294D3A] flex items-center justify-center shrink-0">
                    <InstagramReelIcon className="w-4 h-4 text-[#C69A3A]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-white leading-tight truncate">
                      {activeVideoReel.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#D7B66A] uppercase leading-tight truncate">
                      Jawai Runners On-Ground Reel
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeVideoReel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    title="Open on Instagram"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveVideoReel(null)}
                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close video player"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative w-full h-[65vh] max-h-[580px] bg-black">
                <iframe
                  src={`https://www.instagram.com/reel/${activeVideoReel.reelId}/embed/`}
                  className="w-full h-full border-0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  title={activeVideoReel.title}
                />
              </div>

              <div className="p-4 bg-[#18231C] border-t border-white/10 flex items-center justify-between gap-3 text-xs">
                <p className="text-white/80 text-[12px] leading-snug line-clamp-2">
                  {activeVideoReel.caption}
                </p>
                <a
                  href={activeVideoReel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3 py-1.5 rounded-full bg-[#C69A3A] hover:bg-[#b58b30] text-[#141B16] font-bold text-[10px] tracking-wider uppercase transition-colors"
                >
                  Instagram ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Archive Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#18372B] rounded-2xl overflow-hidden border border-white/20 p-2 sm:p-4 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-xl overflow-hidden">
                <Image
                  src={selectedPhoto}
                  alt="Jawai First Initiative Photo Archive"
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-contain"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 p-3 text-xs text-white/80">
                <span>Expedition Archive — Jawai Cave Meditation &amp; Community Walk</span>
                <div className="flex gap-2">
                  {content.archivePhotos.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPhoto(p.url)}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                        selectedPhoto === p.url ? "bg-[#C69A3A] text-black" : "bg-white/10"
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
