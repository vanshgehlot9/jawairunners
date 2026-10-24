"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AboutTriathlon } from "@/components/sections/AboutTriathlon";
import { StartingPoints } from "@/components/sections/StartingPoints";
import { ChooseExperience } from "@/components/sections/ChooseExperience";
import { ConservationImpact } from "@/components/sections/ConservationImpact";
import { Foundation } from "@/components/sections/Foundation";
import { Partnerships } from "@/components/sections/Partnerships";
import { Registration } from "@/components/sections/Registration";
import { FAQ } from "@/components/sections/FAQ";

export default function FullWebsite() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#171717] selection:bg-[#304B38] selection:text-white">
      <Navbar />
      <Hero />
      <AboutTriathlon />
      <StartingPoints />
      <ChooseExperience />
      <ConservationImpact />
      <Foundation />
      <Partnerships />
      <Registration />
      <FAQ />
      <Footer />
    </main>
  );
}
