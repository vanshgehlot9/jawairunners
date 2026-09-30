import type { Metadata } from "next";
import { Inter, JetBrains_Mono, DM_Sans, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jawairunners.org"),
  title: "Jawai Runners — Run for Conservation & Wilderness",
  description: "A premier running movement across the ancient granite hills of Jawai, Rajasthan. Protecting leopard habitats, empowering Rabari communities, and running for wildlife conservation.",
  keywords: ["Jawai Runners", "Jawai Marathon", "Leopard Conservation", "Rajasthan Trail Running", "Rabari Culture", "Wildlife Sanctuary"],
  authors: [{ name: "Jawai Runners Movement" }],
  openGraph: {
    title: "Jawai Runners — Run for Conservation & Wilderness",
    description: "Experience the untamed granite trails of Rajasthan. Join the conservation running movement.",
    url: "https://jawairunners.org",
    siteName: "Jawai Runners",
    images: [
      {
        url: "/Jawai/Lake_Scene_1280x720.jpg",
        width: 1280,
        height: 720,
        alt: "Jawai Runners Landscape",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable, dmSans.variable, lora.variable, "scroll-smooth")}>
      <body className="bg-paper-white text-ink-black font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
