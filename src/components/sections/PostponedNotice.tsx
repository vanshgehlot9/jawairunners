"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Mail,
} from "lucide-react";

export function PostponedNotice() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#171717] selection:bg-[#304B38] selection:text-white overflow-x-hidden">
      {/* Top Tri-Color Brand Accent Stripe */}
      <div className="w-full flex h-[3px]" aria-hidden="true">
        <div className="flex-1 bg-[#304B38]" />
        <div className="w-[140px] sm:w-[160px] bg-[#C69A3A]" />
        <div className="w-[70px] sm:w-[90px] bg-[#8A6545]" />
      </div>

      {/* Main Editorial Header */}
      <header className="w-full border-b border-[#171717]/10 bg-[#FFFFFF]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 h-20 md:h-24 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border border-[#304B38]/15 bg-[#FAF8F5] flex items-center justify-center shrink-0 shadow-xs">
              <Image
                src="/logo.jpg"
                alt="Jawai Runners"
                width={48}
                height={48}
                className="object-contain w-8 h-8 md:w-10 md:h-10"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] sm:text-[14px] md:text-[15px] font-bold tracking-[0.12em] sm:tracking-[0.14em] text-[#171717] leading-tight uppercase truncate">
                Jawai Runners &amp; Triathlon
              </span>
              <span className="text-[9px] sm:text-[9.5px] md:text-[10px] font-bold tracking-[0.16em] sm:tracking-[0.18em] text-[#C69A3A] uppercase leading-tight truncate">
                Stepwells Renovater Foundation
              </span>
            </div>
          </div>

          {/* Right Header Status & Desk */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <span className="hidden md:inline text-[11px] font-mono tracking-widest text-[#171717]/60 uppercase">
              COMMUNIQUÉ · 2026
            </span>
            <a
              href="mailto:support@stepwellsrenovaterfoundation.org?subject=Jawai%20Triathlon%20-%20Postponement%20Inquiry"
              className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-full border border-[#304B38]/30 hover:border-[#304B38] text-[#304B38] text-[11px] sm:text-[12px] font-bold tracking-wider uppercase transition-colors min-h-[42px]"
            >
              <Mail className="w-3.5 h-3.5 text-[#304B38] shrink-0" />
              <span className="hidden sm:inline">CONTACT SECRETARIAT</span>
              <span className="sm:hidden">CONTACT</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Communiqué Body */}
      <main className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20">
        
        {/* Top Dateline */}
        <div className="mb-3 sm:mb-4">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[0.2em] sm:tracking-[0.22em] text-[#8C6A43] uppercase block">
            OFFICIAL PRESS COMMUNIQUÉ · JAWAI, RAJASTHAN
          </span>
        </div>

        {/* Hero Editorial Heading & Supporting Paragraph */}
        <div className="max-w-[960px] mb-10 sm:mb-12 lg:mb-16">
          <h1 className="text-[clamp(2.1rem,6vw,3.75rem)] font-serif text-[#171717] font-semibold tracking-tight leading-[1.08] sm:leading-[1.1] mb-4 sm:mb-6 break-words">
            Event Postponed Due to <br className="hidden sm:inline" />
            <span className="italic text-[#304B38] font-normal">
              Wildfire in Jawai.
            </span>
          </h1>
          <p className="text-[16px] sm:text-[18px] lg:text-[21px] text-[#171717]/85 font-light leading-[1.6] sm:leading-[1.65] max-w-[880px]">
            Due to an active wildfire across the granite ridges and wildlife corridors of Jawai, the upcoming Jawai Triathlon has been temporarily postponed. The safety of our participants, local communities, and sanctuary wildlife remains our foremost duty.
          </p>
        </div>

        {/* Main Grid: Story, Participant Info & Enquiry (Left) + Ground Footage (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] gap-10 sm:gap-12 lg:gap-[clamp(2rem,4vw,4rem)] items-start pb-14 sm:pb-16 border-b border-[#171717]/15">
          
          {/* Left Column: Narrative, Numbered Information & Official Enquiry */}
          <div className="flex flex-col space-y-8 sm:space-y-10 min-w-0">
            
            {/* The Situation Statement */}
            <div className="space-y-4 sm:space-y-5 text-[15px] sm:text-[16px] text-[#171717]/85 font-light leading-[1.65] max-w-[680px]">
              <p className="text-[16px] sm:text-[17px] text-[#171717] font-normal leading-relaxed">
                Over the past 48 hours, a significant wildfire incident affected stretches of the rugged granite hills and forested scrub tracts in the Jawai wilderness, including territory around Bagheera&apos;s Camp and surrounding leopard habitats.
              </p>
              <p>
                Our movement was founded upon a clear principle: <strong className="font-semibold text-[#171717]">Jungle Pacho Lanao — Bring the Jungle Back</strong>. We exist to protect this unique landscape where wildlife, villages, granite boulders, and ancient stepwells coexist. To proceed with an athletic event through recovering terrain and stressed animal passages would be hazardous to participants and directly at odds with our conservation values.
              </p>
              <p>
                Forest department officials, local rangers, and Stepwells Renovater Foundation ground personnel are stationed across the landscape actively monitoring animal movements, securing trail boundaries, and coordinating initial post-fire recovery operations.
              </p>
            </div>

            {/* Numbered Information for Participants & Partners */}
            <div className="pt-6 sm:pt-8 border-t border-[#171717]/10">
              <h2 className="text-[20px] sm:text-[23px] lg:text-[26px] font-serif font-bold text-[#171717] mb-6 leading-snug">
                Important Information for Participants &amp; Partners
              </h2>

              <div className="space-y-6 sm:space-y-7">
                {/* Item 1 */}
                <div className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 sm:gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-[#304B38]/10 text-[#304B38] flex items-center justify-center font-serif italic text-base shrink-0 font-bold mt-0.5">
                    1
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#171717] mb-1 leading-snug">
                      All Registrations Remain 100% Protected
                    </h3>
                    <p className="text-[14px] text-[#171717]/75 font-light leading-[1.6]">
                      Every registration, category selection (Runner, Cyclist, or Horse Rider), and issued Eco-Pass remains fully secure and will automatically transition to the rescheduled dates without requiring any re-enrolment.
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 sm:gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-[#304B38]/10 text-[#304B38] flex items-center justify-center font-serif italic text-base shrink-0 font-bold mt-0.5">
                    2
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#171717] mb-1 leading-snug">
                      Rescheduled Dates Announcement
                    </h3>
                    <p className="text-[14px] text-[#171717]/75 font-light leading-[1.6]">
                      Revised event dates will be announced in direct consultation with the forest department and local administration once the terrain is declared stabilized and safe for outdoor endurance sports.
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 sm:gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-[#304B38]/10 text-[#304B38] flex items-center justify-center font-serif italic text-base shrink-0 font-bold mt-0.5">
                    3
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#171717] mb-1 leading-snug">
                      Directing Energy Toward Habitat Relief
                    </h3>
                    <p className="text-[14px] text-[#171717]/75 font-light leading-[1.6]">
                      Our volunteer corps and foundation resources are actively redirecting immediate logistics toward water replenishment for displaced wildlife and preparing native seed balls for post-fire afforestation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Enquiry Section */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#304B38]/20 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#8C6A43] uppercase block mb-1">
                  OFFICIAL ENQUIRY DESK
                </span>
                <p className="text-[13px] sm:text-[13.5px] text-[#171717]/80 font-light leading-relaxed">
                  Direct questions or corporate inquiries may be routed to our organising secretariat:
                </p>
                <a
                  href="mailto:support@stepwellsrenovaterfoundation.org"
                  className="text-[13px] sm:text-[13.5px] font-semibold text-[#304B38] hover:underline block mt-1 break-all sm:break-normal"
                >
                  support@stepwellsrenovaterfoundation.org
                </a>
              </div>

              <a
                href="mailto:support@stepwellsrenovaterfoundation.org?subject=Jawai%20Triathlon%20Inquiry"
                className="w-full md:w-auto h-12 md:h-auto px-6 py-3 rounded-full bg-[#304B38] hover:bg-[#1F3026] text-white text-[12px] font-bold tracking-wider uppercase transition-colors shrink-0 shadow-sm flex items-center justify-center text-center"
              >
                EMAIL SECRETARIAT
              </a>
            </div>

          </div>

          {/* Right Column: Curated Documentary Video Panel */}
          <div className="flex flex-col w-full min-w-0">
            <div className="bg-[#FFFFFF] border border-[#304B38]/20 rounded-2xl sm:rounded-[28px] p-4 sm:p-6 shadow-sm w-full max-w-[440px] lg:max-w-none mx-auto lg:mx-0">
              
              {/* Header Label */}
              <div className="flex items-center justify-between border-b border-[#171717]/10 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.2em] text-[#8C6A43] uppercase block">
                    INCIDENT REPORT FOOTAGE
                  </span>
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-[#171717] font-serif leading-tight">
                    Jawai Hills &amp; Ridge Fire
                  </h3>
                </div>
                <span className="text-[10.5px] sm:text-[11px] font-mono text-[#171717]/50 uppercase">
                  RAJASTHAN
                </span>
              </div>

              {/* Video Player Container preserving original 9:16 portrait aspect ratio */}
              <div className="relative w-full aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-inner group">
                <video
                  ref={videoRef}
                  src="/postpone.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover block"
                />

                {/* Clean Semi-Transparent Player Overlay Controls with min 44px touch targets */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-10">
                  <button
                    onClick={togglePlay}
                    className="w-11 h-11 rounded-full bg-black/75 hover:bg-black/95 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="w-11 h-11 rounded-full bg-black/75 hover:bg-black/95 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white/70" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#C69A3A]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Documentary Caption */}
              <div className="pt-3 sm:pt-4 text-left">
                <p className="text-[12px] sm:text-[12.5px] text-[#171717]/70 font-light leading-relaxed italic">
                  Field footage documenting the active blaze across granite hill tracts near Bagheera&apos;s Camp. Forest containment operations and wildlife observation are actively underway.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Foundation Mission Commitment Section (Signature Dark Green Card) */}
        <div className="mt-12 sm:mt-16 rounded-2xl sm:rounded-[28px] bg-[#1F3026] text-white p-6 sm:p-10 lg:p-14 shadow-xl relative overflow-hidden w-full">
          <div className="max-w-[820px] relative z-10">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-2 sm:mb-3">
              THE GUIDING COMMITMENT · JUNGLE PACHO LANAO
            </span>

            <h2 className="text-[22px] sm:text-3xl lg:text-4xl font-serif text-white font-semibold tracking-tight leading-[1.18] mb-4 sm:mb-6">
              “Conservation is not a single day on the calendar. <br className="hidden sm:inline" />
              <span className="italic text-[#8ec94a] font-normal">
                It is our responsibility when the land needs us most.”
              </span>
            </h2>

            <p className="text-white/85 text-[14px] sm:text-[15px] lg:text-[16px] font-light leading-[1.65] mb-6 sm:mb-8">
              Jawai Triathlon is fundamentally dedicated to the regeneration of nature. As fire containment concludes, our focus immediately transitions toward planting native trees, replenishing degraded watering spots, and preparing Jawai for a safer, greener future.
            </p>

            <div className="pt-5 sm:pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
              <span className="text-[11px] sm:text-[12px] font-mono tracking-wider text-white/60 uppercase">
                Stepwells Renovater Foundation Rajasthan
              </span>
              <span className="text-[11px] sm:text-[12px] font-bold tracking-widest text-[#C69A3A] uppercase">
                #BRINGTHEJUNGLEBACK
              </span>
            </div>
          </div>
        </div>

      </main>

      {/* Official Footnote Footer */}
      <footer className="w-full border-t border-[#171717]/10 py-6 sm:py-8 px-4 sm:px-6 bg-[#FFFFFF] text-center text-[11px] sm:text-[12px] text-[#171717]/60 font-mono tracking-wider leading-relaxed">
        <div className="max-w-[1360px] mx-auto">
          © 2026 JAWAI TRIATHLON · STEPWELLS RENOVATER FOUNDATION · ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
