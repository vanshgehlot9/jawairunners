"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ThreeRuns } from "@/components/sections/ThreeRuns";
import { Foundation } from "@/components/sections/Foundation";
import { Registration } from "@/components/sections/Registration";
import { FAQ } from "@/components/sections/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#171717] selection:bg-[#304B38] selection:text-white">
      <Navbar />
      <Hero />
      <ThreeRuns />
      <Foundation />
      <Registration />
      <FAQ />
      <Footer />
    </main>
  );
}
