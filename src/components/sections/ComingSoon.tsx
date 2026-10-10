"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function ComingSoon() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#18372B] flex flex-col items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
      >
        <source src="/jawai-runner.mp4" type="video/mp4" />
      </video>

      {/* Grain & Vignette */}
      <div className="absolute inset-0 bg-black/30 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#18372B_100%)] opacity-80 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="text-[12px] md:text-[14px] font-mono tracking-[0.3em] text-[#D7B66A] uppercase mb-6 block">
            Jawai Runners
          </span>
          <h1 className="text-[48px] md:text-[80px] lg:text-[100px] font-medium leading-[0.9] text-white tracking-tight uppercase">
            SOMETHING <br />
            <span className="text-[#C69A3A] italic font-serif">WILD</span> IS COMING.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="h-[1px] w-[60px] bg-[#D7B66A]/30 mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          className="text-[16px] md:text-[20px] text-white/70 font-light max-w-[600px] leading-relaxed"
        >
          We are preparing an extraordinary experience for the Jawai Conservation Series. 
          The trail will be ready soon.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="mt-12"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] text-[#D7B66A]/70 uppercase border border-[#D7B66A]/20 px-6 py-3 rounded-full bg-[#18372B]/50 backdrop-blur-md">
            RUN • RESTORE • REWILD
          </div>
        </motion.div>
      </div>
    </div>
  );
}
