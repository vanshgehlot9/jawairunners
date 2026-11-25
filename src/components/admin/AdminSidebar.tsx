"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  Map,
  Building2,
  Trees,
  Compass,
  Award,
  ClipboardList,
  HelpCircle,
  PanelBottom,
  Image as ImageIcon,
  Film,
  Calendar,
  Users,
  Settings,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ExternalLink,
  X,
  HeartHandshake,
} from "lucide-react";
import { SectionId, CmsSectionEnvelope } from "@/lib/cms/types";

export type AdminNavKey =
  | "dashboard"
  | SectionId
  | "media"
  | "instagramGallery"
  | "eventDates"
  | "registrations"
  | "websiteSettings"
  | "permissions";

interface NavItemConfig {
  key: AdminNavKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  sectionId?: SectionId;
}

const NAV_GROUPS: { title: string; items: NavItemConfig[] }[] = [
  {
    title: "OVERVIEW",
    items: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "WEBSITE CONTENT",
    items: [
      { key: "hero", label: "Hero Section", icon: Sparkles, sectionId: "hero" },
      {
        key: "conservationMission",
        label: "Conservation Mission",
        icon: HeartHandshake,
        sectionId: "conservationMission",
      },
      {
        key: "firstInitiative",
        label: "Jawai Runner Initiative",
        icon: Award,
        sectionId: "firstInitiative",
      },
      {
        key: "movement",
        label: "Movement & Vision",
        icon: Compass,
        sectionId: "movement",
      },
      { key: "threeRuns", label: "Three Runs", icon: Layers, sectionId: "threeRuns" },
      { key: "runDetails", label: "Run Details", icon: Map, sectionId: "runDetails" },
      { key: "foundation", label: "Foundation", icon: Building2, sectionId: "foundation" },
      { key: "initiatives", label: "Initiatives", icon: Trees, sectionId: "initiatives" },
      {
        key: "registrationContent",
        label: "Registration Content",
        icon: ClipboardList,
        sectionId: "registrationContent",
      },
      { key: "faq", label: "FAQ", icon: HelpCircle, sectionId: "faq" },
      { key: "footer", label: "Footer", icon: PanelBottom, sectionId: "footer" },
    ],
  },
  {
    title: "MEDIA",
    items: [
      { key: "media", label: "Media Library", icon: ImageIcon },
      { key: "instagramGallery", label: "Instagram & Video Gallery", icon: Film },
    ],
  },
  {
    title: "EVENT MANAGEMENT",
    items: [
      { key: "eventDates", label: "Event Dates Settings", icon: Calendar },
      { key: "registrations", label: "Registrations", icon: Users },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { key: "websiteSettings", label: "Website Settings", icon: Settings },
      { key: "permissions", label: "Admin & Permissions", icon: ShieldCheck },
    ],
  },
];

interface AdminSidebarProps {
  activeKey: AdminNavKey;
  onSelect: (key: AdminNavKey) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  registrationsCount: number;
  sectionsMap: Partial<Record<SectionId, CmsSectionEnvelope>>;
  adminEmail: string;
  onLogout: () => void;
}

export function AdminSidebar({
  activeKey,
  onSelect,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  registrationsCount,
  sectionsMap,
  adminEmail,
  onLogout,
}: AdminSidebarProps) {
  const handleSelect = (key: AdminNavKey) => {
    onSelect(key);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#182B20] text-[#FAF8F5] border-r border-white/10 select-none">
      {/* Top Brand Header */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#FAF8F5] border border-[#C69A3A]/40 shrink-0 flex items-center justify-center">
              <Image src="/logo.jpg" alt="Jawai Runners" width={36} height={36} className="object-contain" />
            </div>
            <div className="min-w-0">
              <span className="text-[12px] font-bold tracking-[0.14em] text-white block truncate">
                JAWAI RUNNERS
              </span>
              <span className="text-[9px] font-mono tracking-[0.18em] text-[#C69A3A] uppercase block truncate">
                CMS STUDIO
              </span>
            </div>
          </Link>
        )}

        {/* Collapse Button (Desktop) */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center text-white/70 hover:text-white transition-colors shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        {/* Close Button (Mobile) */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"
          aria-label="Close navigation menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {!isCollapsed ? (
              <div className="px-3 mb-2 text-[9.5px] font-mono font-bold tracking-[0.2em] text-[#C69A3A]/85 uppercase">
                {group.title}
              </div>
            ) : (
              <div className="mx-2 mb-2 h-px bg-white/10" />
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeKey === item.key;
                const secEnv = item.sectionId ? sectionsMap[item.sectionId] : undefined;
                const hasPendingDraft =
                  secEnv && JSON.stringify(secEnv.draft) !== JSON.stringify(secEnv.published);

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelect(item.key)}
                    title={isCollapsed ? item.label : undefined}
                    className={[
                      "w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left transition-all text-[12.5px]",
                      isActive
                        ? "bg-[#C69A3A] text-[#14231A] font-bold shadow-sm"
                        : "text-white/75 hover:bg-white/8 hover:text-white font-medium",
                      isCollapsed ? "justify-center px-2" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={[
                          "w-4 h-4 shrink-0",
                          isActive ? "text-[#14231A]" : "text-[#C69A3A]",
                        ].join(" ")}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.key === "registrations" && (
                          <span
                            className={[
                              "px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold",
                              isActive
                                ? "bg-[#14231A] text-[#C69A3A]"
                                : "bg-white/10 text-white/90",
                            ].join(" ")}
                          >
                            {registrationsCount}
                          </span>
                        )}

                        {secEnv && (
                          <span
                            className={[
                              "w-2 h-2 rounded-full",
                              !secEnv.isPublished
                                ? "bg-red-400"
                                : hasPendingDraft
                                ? "bg-amber-300"
                                : isActive
                                ? "bg-[#14231A]"
                                : "bg-emerald-400",
                            ].join(" ")}
                            title={
                              !secEnv.isPublished
                                ? "Unpublished"
                                : hasPendingDraft
                                ? "Unpublished draft changes"
                                : "Published"
                            }
                          />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/10 space-y-2 shrink-0 bg-[#14231A]/70">
        <Link
          href="/"
          target="_blank"
          className={[
            "w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/85 hover:text-white text-[11.5px] font-medium transition-colors",
            isCollapsed ? "justify-center px-2" : "",
          ].join(" ")}
          title="Open live website"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#C69A3A] shrink-0" />
          {!isCollapsed && <span>View Live Website</span>}
        </Link>

        {!isCollapsed && adminEmail && (
          <div className="px-3 py-1.5 text-[10.5px] text-white/50 font-mono truncate">
            {adminEmail}
          </div>
        )}

        <button
          type="button"
          onClick={onLogout}
          className={[
            "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-300/85 hover:bg-red-500/15 hover:text-red-200 text-[11.5px] font-semibold transition-colors",
            isCollapsed ? "justify-center px-2" : "",
          ].join(" ")}
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-all duration-300 z-30 ${
          isCollapsed ? "w-[74px]" : "w-[272px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-[285px] max-w-[85vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
