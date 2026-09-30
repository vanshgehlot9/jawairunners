/**
 * ThreeRuns.tsx
 * -------------
 * The 2026 Conservation Series — three-run selector and detail showcase.
 *
 * Architecture: DATA → STATE → COMPONENT → VISUAL OUTPUT
 *
 * Run data is imported from @/lib/runs (single source of truth).
 * Visuals are rendered by <RunVisual> based on run.visualType / run.status.
 * No hardcoded run-specific rendering conditions exist in this file.
 *
 * To add Run 04: add an entry to RUNS in @/lib/runs.ts — nothing else changes.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { RUNS } from "@/lib/runs";
import type { RunDetails } from "@/lib/runs";
import { RunVisual } from "@/components/ui/RunVisual";

// ─── Run Selector Card ────────────────────────────────────────────────────

interface RunCardProps {
  run: RunDetails;
  isSelected: boolean;
  onClick: () => void;
}

function RunCard({ run, isSelected, onClick }: RunCardProps) {
  // Derive the visual status from selection state.
  // The data layer records the canonical run status (upcoming / completed),
  // but the card's visual responds to interactive selection as "selected".
  const visualStatus = isSelected ? "selected" : run.status;

  return (
    <button
      id={`run-card-${run.id}`}
      key={run.id}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Select ${run.number}: ${run.name} — ${run.date}`}
      className={[
        "relative text-left p-6 lg:p-7 rounded-[20px] shrink-0 w-[85vw] snap-center md:w-auto",
        "transition-all duration-300 border flex flex-col justify-between cursor-pointer",
        isSelected
          ? "bg-[#1F3026] text-white border-[#1F3026] shadow-xl scale-[1.02]"
          : "bg-[#F9F7F2] text-[#171717] border-[#304B38]/15 hover:bg-[#F2EFE8] hover:border-[#304B38]/30",
      ].join(" ")}
    >
      {/* Active indicator pill */}
      {isSelected && (
        <motion.div
          layoutId="activePill"
          className="absolute -top-3 right-6 bg-[#C69A3A] text-black font-bold text-[9px] tracking-[0.16em] uppercase px-3 py-1 rounded-full shadow-md"
        >
          SELECTED RUN
        </motion.div>
      )}

      <div>
        {/* Visual header row: RunVisual (left) + date badge (right) */}
        <div className="flex items-center justify-between mb-4">
          <RunVisual
            type={run.visualType}
            status={visualStatus}
            accentHex={isSelected ? "#C69A3A" : run.accent.hex}
            label={run.visualLabel}
            size={44}
          />
          <span
            className={[
              "text-[10px] font-mono tracking-[0.15em] uppercase px-2.5 py-1 rounded-full font-bold",
              isSelected
                ? "bg-white/10 text-[#C69A3A] border border-white/10"
                : "bg-[#304B38]/10 text-[#304B38]",
            ].join(" ")}
          >
            {run.date}
          </span>
        </div>

        {/* Run number */}
        <span
          className={[
            "text-[11px] font-bold tracking-[0.15em] uppercase block mb-1",
            isSelected ? "text-[#C69A3A]" : "text-[#8C6A43]",
          ].join(" ")}
        >
          {run.number}
        </span>

        {/* Run name */}
        <h3
          className={[
            "text-[26px] lg:text-[30px] font-bold tracking-tight mb-2",
            isSelected ? "text-white" : "text-[#171717]",
          ].join(" ")}
        >
          {run.name}
        </h3>

        {/* Subtitle */}
        <p
          className={[
            "text-[13px] leading-snug line-clamp-2",
            isSelected ? "text-white/80" : "text-[#171717]/70",
          ].join(" ")}
        >
          {run.subtitle}
        </p>
      </div>

      {/* Footer CTA row */}
      <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between">
        <span
          className={[
            "text-[11px] font-semibold tracking-wider uppercase",
            isSelected ? "text-[#D7B66A]" : "text-[#304B38]",
          ].join(" ")}
        >
          View Run Details
        </span>
        <ArrowRight
          aria-hidden="true"
          className={[
            "w-4 h-4 transition-transform",
            isSelected ? "translate-x-1 text-[#D7B66A]" : "text-[#304B38]",
          ].join(" ")}
        />
      </div>
    </button>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────

interface DetailPanelProps {
  run: RunDetails;
}

function DetailPanel({ run }: DetailPanelProps) {
  return (
    <motion.div
      key={run.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="rounded-[28px] bg-[#FAF8F5] border border-[#304B38]/15 overflow-hidden shadow-lg p-6 sm:p-8 lg:p-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        {/* Left: Photo card */}
        <div className="lg:col-span-5 relative">
          <div className="relative h-[340px] sm:h-[420px] rounded-[22px] overflow-hidden shadow-md">
            <Image
              src={run.image}
              alt={`${run.name} — ${run.codeName}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Date badge */}
            <div className="absolute top-5 left-5">
              <div className="bg-[#1F3026]/90 backdrop-blur-md text-white rounded-xl p-3 border border-white/20">
                <span className="block text-[10px] font-bold tracking-[0.18em] text-[#C69A3A] uppercase">
                  EVENT DATE
                </span>
                <span className="text-[20px] font-bold tracking-tight">
                  {run.date}
                </span>
              </div>
            </div>

            {/* Mission focus overlay */}
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] font-bold tracking-[0.16em] text-[#D7B66A] uppercase block mb-1">
                KEY OBJECTIVE
              </span>
              <p className="text-[15px] font-medium leading-snug">
                {run.missionFocus}
              </p>
            </div>
          </div>

          {/* Organiser meta */}
          <div className="mt-4 flex items-center justify-between px-3 text-[11px] font-medium text-[#171717]/60">
            <span>Organised by: Stepwells Renovater Foundation</span>
            <span className="text-[#304B38] font-bold">100% Zero Single-Use Plastic</span>
          </div>
        </div>

        {/* Right: Run details */}
        <div className="lg:col-span-7 flex flex-col">

          {/* Header row: RunVisual (larger) + title */}
          <div className="flex items-center gap-3 mb-3">
            <RunVisual
              type={run.visualType}
              status="selected"
              accentHex={run.accent.hex}
              label={run.visualLabel}
              size={52}
            />
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#8C6A43] uppercase block">
                {run.number} · {run.codeName}
              </span>
              <h3 className="text-[34px] sm:text-[44px] font-bold text-[#171717] tracking-tight leading-none">
                RUN {run.name}
              </h3>
            </div>
          </div>

          {/* Subtitle tag */}
          <div className="inline-flex items-center gap-2 bg-[#304B38]/10 text-[#304B38] font-semibold text-[13px] px-3.5 py-1 rounded-full w-fit mb-6">
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: run.accent.hex }}
            />
            {run.subtitle}
          </div>

          {/* Description */}
          <p className="text-[16px] text-[#171717]/80 leading-relaxed font-light mb-8">
            {run.description}
          </p>

          {/* Terrain + Elevation metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-[#304B38]/10 shadow-sm">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#8C6A43] uppercase block mb-1">
                Terrain Profile
              </span>
              <span className="text-[14px] font-semibold text-[#171717]">
                {run.terrain}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#304B38]/10 shadow-sm">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#8C6A43] uppercase block mb-1">
                Elevation & Challenge
              </span>
              <span className="text-[14px] font-semibold text-[#171717]">
                {run.elevationGain}
              </span>
            </div>
          </div>

          {/* Distance options */}
          <div className="mb-8">
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#171717]/70 uppercase block mb-3">
              Available Distances for this run:
            </span>
            <div className="grid grid-cols-3 gap-3">
              {run.distances.map((dist) => (
                <div
                  key={dist.label}
                  className="bg-white p-3 sm:p-4 rounded-xl border border-[#304B38]/15 text-center"
                >
                  <span className="block text-[18px] sm:text-[22px] font-bold text-[#294D3A]">
                    {dist.label}
                  </span>
                  <span className="text-[10px] text-[#171717]/60 uppercase font-medium leading-tight block">
                    {dist.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="#registration"
              className="inline-flex items-center justify-center gap-2 bg-[#294D3A] text-white px-8 py-4 rounded-xl font-bold text-[12px] tracking-[0.12em] uppercase hover:bg-[#18372B] transition-all shadow-md group"
            >
              <span>REGISTER FOR RUN {run.name}</span>
              <ArrowRight
                aria-hidden="true"
                className="w-4 h-4 text-[#D7B66A] group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              href="#registration"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-[#294D3A] border border-[#294D3A]/40 px-6 py-4 rounded-xl font-semibold text-[12px] tracking-[0.1em] uppercase hover:bg-[#294D3A]/5 transition-colors"
            >
              <span>JOIN ALL 3 RUNS (TRILOGY PASS)</span>
            </Link>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────

export function ThreeRuns() {
  const [activeRunId, setActiveRunId] = useState<string>(RUNS[0].id);
  const activeRun = RUNS.find((r) => r.id === activeRunId) ?? RUNS[0];

  return (
    <section
      id="three-runs"
      aria-labelledby="three-runs-heading"
      className="relative w-full bg-[#FFFFFF] pt-14 pb-24 lg:pt-16 lg:pb-36 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">

        {/* Section header */}
        <div className="text-left max-w-[840px] mb-14 lg:mb-18">

          <motion.h2
            id="three-runs-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[40px] sm:text-[54px] md:text-[68px] lg:text-[76px] font-medium leading-[1.0] tracking-tight text-[#171717]"
          >
            THREE RUNS. <br className="sm:hidden" />
            <span className="text-[#304B38] italic font-serif">ONE MISSION.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[16px] md:text-[19px] text-[#171717]/70 font-light mt-5 leading-relaxed max-w-[640px]"
          >
            A 3-part seasonal series designed to restore Jawai's wild habitat step by step. Register for an individual run or take on the complete Trilogy.
          </motion.p>
        </div>

        {/* Run selector cards */}
        <div
          role="group"
          aria-label="Run selector"
          className="flex flex-row overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 lg:gap-6 mb-12 pb-4 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {RUNS.map((run) => (
            <RunCard
              key={run.id}
              run={run}
              isSelected={run.id === activeRunId}
              onClick={() => setActiveRunId(run.id)}
            />
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <DetailPanel key={activeRun.id} run={activeRun} />
        </AnimatePresence>

      </div>
    </section>
  );
}
