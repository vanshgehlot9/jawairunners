"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mountain, Sparkles, Clock } from "lucide-react";
import { useCmsSection } from "@/lib/cms/use-cms";
import { useEventDates } from "@/lib/event-dates";

export function ThreeRunsShowcase() {
  const { content: threeRuns, isVisible } = useCmsSection("threeRuns");
  const { content: runDetails } = useCmsSection("runDetails");
  const eventDates = useEventDates();
  const [selectedId, setSelectedId] = useState("run-1");

  if (!isVisible || !threeRuns.showOnHomepage) return null;

  const visibleRuns = threeRuns.runs.filter((r) => r.visible !== false);
  const activeRun = visibleRuns.find((r) => r.id === selectedId) || visibleRuns[0];
  if (!activeRun) return null;

  const detail = runDetails.items.find((d) => d.id === activeRun.id) || runDetails.items[0];
  const dateMap: Record<string, string> = {
    "run-1": eventDates.run1Date,
    "run-2": eventDates.run2Date,
    "run-3": eventDates.run3Date,
  };
  const liveDate = dateMap[activeRun.id] || "REVEALING SOON";

  return (
    <section
      id="three-runs-series"
      className="relative w-full bg-[#FFFFFF] text-[#171717] py-16 sm:py-24 border-b border-[#304B38]/10"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-[36px] sm:text-[48px] font-serif font-medium text-[#171717] leading-[1.04]">
            {threeRuns.sectionTitle}{" "}
            <span className="italic text-[#294D3A]">{threeRuns.sectionHighlightedTitle}</span>
          </h2>
          <p className="text-[15px] text-[#171717]/75 font-light mt-3 leading-relaxed">
            {threeRuns.sectionSubtitle}
          </p>
        </div>

        {/* Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {visibleRuns.map((run) => {
            const selected = run.id === activeRun.id;
            return (
              <button
                key={run.id}
                type="button"
                onClick={() => setSelectedId(run.id)}
                className={`text-left p-6 rounded-2xl border transition-all ${
                  selected
                    ? "bg-[#182B20] text-white border-[#C69A3A]"
                    : "bg-[#FAF8F5] text-[#171717] border-[#304B38]/12 hover:border-[#304B38]/35"
                }`}
              >
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#C69A3A] uppercase block mb-2">
                  {dateMap[run.id] || "REVEALING SOON"}
                </span>
                <span className="text-[11px] font-mono uppercase opacity-70 block">{run.number}</span>
                <h3 className="text-2xl font-serif font-bold mt-0.5">{run.name}</h3>
                <p className={`text-xs mt-2 ${selected ? "text-white/80" : "text-[#595959]"}`}>
                  {run.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Run Details */}
        {detail && (
          <div className="rounded-[24px] bg-[#FAF8F5] border border-[#304B38]/15 p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative h-[320px] rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={detail.coverImage || activeRun.coverImage}
                alt={detail.name}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-[#1F3026]/90 text-white border border-white/15">
                <span className="text-[9px] font-mono text-[#C69A3A] uppercase block">EVENT DATE</span>
                <span className="text-sm font-bold">{liveDate}</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono text-[#D7B66A] uppercase block">
                  KEY OBJECTIVE
                </span>
                <p className="text-sm font-semibold mt-0.5">{detail.missionFocus}</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#8C6A43] uppercase">
                  {activeRun.number} · {detail.codeName}
                </span>
                <h3 className="text-3xl font-serif font-bold text-[#171717] mt-1">{detail.name}</h3>
                <p className="text-sm text-[#171717]/80 font-light mt-2 leading-relaxed">
                  {activeRun.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#304B38]/10">
                  <span className="text-[10px] font-mono text-[#8C6A43] uppercase block">TERRAIN</span>
                  <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5 mt-1">
                    <Mountain className="w-3.5 h-3.5 text-[#294D3A]" />
                    {detail.terrain}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#304B38]/10">
                  <span className="text-[10px] font-mono text-[#8C6A43] uppercase block">ELEVATION</span>
                  <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C69A3A]" />
                    {detail.elevationGain}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {detail.distances.map((d, i) => (
                  <div key={i} className="px-3.5 py-2 rounded-xl bg-white border border-[#304B38]/12">
                    <span className="text-sm font-bold text-[#294D3A] block">{d.label}</span>
                    <span className="text-[10px] text-[#595959] uppercase">{d.tag}</span>
                  </div>
                ))}
              </div>

              {detail.schedule.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#8C6A43] uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Schedule
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {detail.schedule.map((s, i) => (
                      <div key={i} className="text-[#171717]/80">
                        <strong className="font-mono text-[#294D3A]">{s.time}</strong> — {s.activity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={activeRun.detailsUrl || "#registration"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#294D3A] hover:bg-[#1C3628] text-white text-xs font-bold uppercase tracking-wider"
              >
                <span>Register for {activeRun.name}</span>
                <ArrowRight className="w-4 h-4 text-[#D7B66A]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
