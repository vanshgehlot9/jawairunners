import { PostponedNotice } from "@/components/sections/PostponedNotice";

export const metadata = {
  title: "Notice: Event Postponed Due to Fire in Jawai | Jawai Triathlon",
  description: "Official advisory regarding the temporary postponement of Jawai Triathlon 2026 due to wildfire in Jawai.",
};

export default function PostponedPage() {
  return (
    <main className="min-h-screen bg-[#0B150F] text-white selection:bg-[#C69A3A] selection:text-[#0B150F]">
      <PostponedNotice />
    </main>
  );
}
