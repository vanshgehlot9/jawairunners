"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ConservationMission } from "@/components/sections/ConservationMission";
import { FirstInitiative } from "@/components/sections/FirstInitiative";
import { Movement } from "@/components/sections/Movement";
import { ThreeRunsShowcase } from "@/components/sections/ThreeRunsShowcase";
import { Foundation } from "@/components/sections/Foundation";
import { Registration } from "@/components/sections/Registration";
import { FAQ } from "@/components/sections/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#171717] selection:bg-[#304B38] selection:text-white">
      <Navbar />
      <Hero />
      <ConservationMission />
      <FirstInitiative />
      <Movement />
      <ThreeRunsShowcase />
      <Foundation />
      <Registration />
      <FAQ />
      <Footer />
    </main>
  );
}
