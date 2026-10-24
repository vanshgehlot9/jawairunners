"use client";

import { PostponedNotice } from "@/components/sections/PostponedNotice";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#171717] selection:bg-[#304B38] selection:text-white">
      <PostponedNotice />
    </main>
  );
}
