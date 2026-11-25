"use client";

import React, { useState } from "react";
import {
  Users,
  Calendar,
  Image as ImageIcon,
  Layers,
  Database,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  Save,
  RotateCcw,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  Plus,
  Search,
} from "lucide-react";
import {
  AuditLogEntry,
  CmsSectionEnvelope,
  MediaAsset,
  PermissionsSettingsData,
  SectionId,
  WebsiteSettingsData,
} from "@/lib/cms/types";
import { EventDatesConfig, DEFAULT_EVENT_DATES } from "@/lib/event-dates";
import { MediaPickerField } from "./MediaPickerField";
import { TextField, TextAreaField, ItemOrderControls } from "./FieldHelpers";
import type { AdminNavKey } from "./AdminSidebar";

export type RegistrationData = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  runSeries: string;
  category: string;
  paymentScreenshotUrl?: string;
  hasPledgedZeroPlastic: boolean;
  createdAt: string;
};

// ─── 1. Dashboard Overview ──────────────────────────────────────────────────

export function DashboardOverview({
  sectionsMap,
  mediaCount,
  registrationsCount,
  eventDates,
  auditLogs,
  firestoreAvailable,
  permissionError,
  isSeeding,
  onSeedAll,
  onNavigate,
}: {
  sectionsMap: Partial<Record<SectionId, CmsSectionEnvelope>>;
  mediaCount: number;
  registrationsCount: number;
  eventDates: EventDatesConfig;
  auditLogs: AuditLogEntry[];
  firestoreAvailable: boolean;
  permissionError?: string;
  isSeeding: boolean;
  onSeedAll: (overwrite: boolean) => Promise<void>;
  onNavigate: (key: AdminNavKey) => void;
}) {
  const sectionsList = Object.values(sectionsMap).filter(Boolean) as CmsSectionEnvelope[];
  const publishedCount = sectionsList.filter((s) => s.isPublished).length;
  const draftPendingCount = sectionsList.filter(
    (s) => JSON.stringify(s.draft) !== JSON.stringify(s.published)
  ).length;
  const notSeededCount = sectionsList.filter((s) => s.updatedBy === "not-seeded-yet").length;

  return (
    <div className="space-y-6">
      {/* Status Banner if Firestore rules missing or unseeded */}
      {!firestoreAvailable && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-950">
              <strong>Firestore Security Rules Needed:</strong> Cloud Firestore returned{" "}
              <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">
                {permissionError || "permission-denied"}
              </code>
              . Public site is safely using seeded content. Open{" "}
              <strong>Admin &amp; Permissions</strong> to copy &amp; apply the rules in Firebase Console.
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("permissions")}
            className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold uppercase tracking-wider shrink-0"
          >
            View Security Rules
          </button>
        </div>
      )}

      {firestoreAvailable && notSeededCount > 0 && (
        <div className="p-5 rounded-2xl bg-[#182B20] text-white border border-[#C69A3A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-[#C69A3A] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="text-[#D7B66A]">
                {notSeededCount} section(s) not yet seeded into Cloud Firestore.
              </strong>
              <p className="text-white/80 mt-0.5">
                Click below to migrate &amp; seed all initial website sections, images, and settings into Firebase Firestore right now.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isSeeding}
            onClick={() => onSeedAll(false)}
            className="px-5 py-2.5 rounded-xl bg-[#C69A3A] hover:bg-[#d8ab43] text-[#14231A] text-xs font-bold uppercase tracking-wider shrink-0 disabled:opacity-50"
          >
            {isSeeding ? "Seeding Firebase..." : "Seed All Content to Firebase"}
          </button>
        </div>
      )}

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onNavigate("hero")}
          className="text-left p-5 rounded-2xl bg-white border border-[#304B38]/12 hover:border-[#294D3A]/40 shadow-xs transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10.5px] font-mono font-bold tracking-wider text-[#8C6A43] uppercase">
              PUBLISHED SECTIONS
            </span>
            <Layers className="w-4 h-4 text-[#294D3A]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#171717]">
            {publishedCount} <span className="text-base font-normal text-[#595959]">/ {sectionsList.length}</span>
          </div>
          <p className="text-xs text-[#595959] mt-1">
            {draftPendingCount > 0 ? `${draftPendingCount} section(s) with pending draft` : "All drafts synced"}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("registrations")}
          className="text-left p-5 rounded-2xl bg-white border border-[#304B38]/12 hover:border-[#294D3A]/40 shadow-xs transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10.5px] font-mono font-bold tracking-wider text-[#8C6A43] uppercase">
              REGISTRATIONS
            </span>
            <Users className="w-4 h-4 text-[#294D3A]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#171717]">{registrationsCount}</div>
          <p className="text-xs text-[#595959] mt-1">Live Realtime DB participants</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("media")}
          className="text-left p-5 rounded-2xl bg-white border border-[#304B38]/12 hover:border-[#294D3A]/40 shadow-xs transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10.5px] font-mono font-bold tracking-wider text-[#8C6A43] uppercase">
              MEDIA ASSETS
            </span>
            <ImageIcon className="w-4 h-4 text-[#C69A3A]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#171717]">{mediaCount}</div>
          <p className="text-xs text-[#595959] mt-1">Images &amp; videos indexed</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("eventDates")}
          className="text-left p-5 rounded-2xl bg-white border border-[#304B38]/12 hover:border-[#294D3A]/40 shadow-xs transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10.5px] font-mono font-bold tracking-wider text-[#8C6A43] uppercase">
              RUN 01 DATE
            </span>
            <Calendar className="w-4 h-4 text-[#294D3A]" />
          </div>
          <div className="text-xl font-serif font-bold text-[#294D3A] truncate">
            {eventDates.run1Date}
          </div>
          <p className="text-xs text-[#595959] mt-2">Click to update event schedule</p>
        </button>
      </div>

      {/* Sections Quick Matrix + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-[#304B38]/12 rounded-[22px] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#304B38]/10">
            <h3 className="text-lg font-serif font-bold text-[#171717]">Website Sections Status</h3>
            <button
              type="button"
              disabled={isSeeding}
              onClick={() => onSeedAll(false)}
              className="text-[11px] font-mono font-bold text-[#294D3A] hover:underline uppercase"
            >
              {isSeeding ? "Syncing..." : "Sync Missing Seeds"}
            </button>
          </div>
          <div className="divide-y divide-[#304B38]/10">
            {sectionsList
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((sec) => (
                <div key={sec.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-[#171717]">{sec.label}</div>
                    <div className="text-xs text-[#595959]">
                      Order #{sec.displayOrder} · {sec.isVisible ? "Visible" : "Hidden"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        sec.updatedBy === "not-seeded-yet" || sec.updatedBy === "local-fallback"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : sec.isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {sec.updatedBy === "not-seeded-yet"
                        ? "Pending Seed"
                        : sec.updatedBy === "local-fallback"
                        ? "Rules Needed"
                        : sec.isPublished
                        ? "Published"
                        : "Draft Only"}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate(sec.id)}
                      className="px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#EFECE3] border border-[#304B38]/15 text-[11px] font-bold text-[#1F3026]"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#304B38]/12 rounded-[22px] p-6 shadow-xs">
          <h3 className="text-lg font-serif font-bold text-[#171717] mb-4 pb-3 border-b border-[#304B38]/10">
            Recent CMS Activity
          </h3>
          {auditLogs.length === 0 ? (
            <p className="text-xs text-[#595959] py-6 text-center">
              No CMS audit entries recorded yet. Save, publish, or upload media to see activity here.
            </p>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#304B38]/10 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#1F3026]">
                    <span>{log.action}</span>
                    <span className="text-[10px] font-mono text-[#8C6A43]">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[#595959] mt-0.5">
                    {log.target} · <span className="font-mono text-[10px]">{log.actorEmail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 2. Event Dates Settings Panel (Preserved RTDB Behaviour) ───────────────

export function EventDatesPanel({
  eventDates,
  setEventDates,
  isSavingDates,
  datesSaveSuccess,
  datesSaveError,
  onSaveDates,
  onResetToRevealingSoon,
}: {
  eventDates: EventDatesConfig;
  setEventDates: React.Dispatch<React.SetStateAction<EventDatesConfig>>;
  isSavingDates: boolean;
  datesSaveSuccess: boolean;
  datesSaveError: string;
  onSaveDates: (e: React.FormEvent) => Promise<void>;
  onResetToRevealingSoon: () => void;
}) {
  return (
    <div className="bg-white border border-[#171717]/10 rounded-[24px] p-6 sm:p-10 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#171717]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C69A3A]/10 text-[#8C6A43] text-[11px] font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C69A3A]" />
            Live Event Schedule Control (Realtime DB)
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#171717]">
            Event Dates Management
          </h2>
          <p className="text-sm text-[#595959] mt-1 max-w-2xl">
            Easily update the live run dates across the entire website (Registration Form, Footer, and FAQ) without writing any code.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetToRevealingSoon}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#171717]/20 hover:bg-[#FAF8F5] text-xs font-bold tracking-wider uppercase text-[#171717] transition-colors self-start md:self-auto shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to &quot;REVEALING SOON&quot;
        </button>
      </div>

      {datesSaveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong>Live Dates Updated!</strong> All event dates across the website have been synchronized in real-time.
          </div>
        </div>
      )}

      {datesSaveError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
          {datesSaveError}
        </div>
      )}

      <form onSubmit={onSaveDates} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "run1Date" as const, tag: "RUN 01 · AWAKEN", sub: "The Dawn Run", label: "Run 1 Event Date" },
            { key: "run2Date" as const, tag: "RUN 02 · RESTORE", sub: "The Rewilding Run", label: "Run 2 Event Date" },
            { key: "run3Date" as const, tag: "RUN 03 · CELEBRATE", sub: "The Triumph Run", label: "Run 3 Event Date" },
            { key: "trilogyDate" as const, tag: "TRILOGY PASS", sub: "All 3 Runs", label: "Trilogy Pass Summary Date" },
          ].map((cfg) => (
            <div key={cfg.key} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#171717]/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-wider text-[#C69A3A] uppercase">{cfg.tag}</span>
                  <span className="text-[10px] font-mono text-[#595959] uppercase">{cfg.sub}</span>
                </div>
                <label className="block text-sm font-bold text-[#171717] mb-2">{cfg.label}</label>
              </div>
              <div>
                <input
                  type="text"
                  value={eventDates[cfg.key]}
                  onChange={(e) => setEventDates({ ...eventDates, [cfg.key]: e.target.value })}
                  placeholder="e.g. REVEALING SOON or 15 MARCH 2027"
                  className="w-full h-12 bg-white border border-[#171717]/15 rounded-xl px-4 text-sm font-bold text-[#171717] focus:outline-none focus:border-[#294D3A]"
                />
                <button
                  type="button"
                  onClick={() => setEventDates({ ...eventDates, [cfg.key]: DEFAULT_EVENT_DATES[cfg.key] })}
                  className="text-[10px] font-bold text-[#8C6A43] hover:underline uppercase mt-2"
                >
                  + Set &quot;REVEALING SOON&quot;
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#171717]/10">
          <div className="flex items-center gap-2 text-xs text-[#595959]">
            <Clock className="w-4 h-4 text-[#8C6A43]" />
            <span>
              {eventDates.updatedAt
                ? `Last updated: ${new Date(eventDates.updatedAt).toLocaleString()}`
                : "Default system dates active"}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSavingDates}
            className="w-full sm:w-auto px-8 h-12 bg-[#294D3A] hover:bg-[#1C3628] text-white rounded-xl font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#D7B66A]" />
            <span>{isSavingDates ? "SAVING CHANGES..." : "SAVE & PUBLISH TO WEBSITE"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── 3. Registrations Panel (Preserved RTDB + CSV + Excel + Search) ─────────

export function RegistrationsPanel({
  registrations,
  isLoading,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onDeleteSelected,
  onExportCSV,
  onExportExcel,
}: {
  registrations: RegistrationData[];
  isLoading: boolean;
  selectedIds: string[];
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: string) => void;
  onDeleteSelected: () => Promise<void>;
  onExportCSV: () => void;
  onExportExcel: () => void;
}) {
  const [search, setSearch] = useState("");
  const visibleRows = registrations.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.runSeries.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-[#171717] mb-1">Registrations</h2>
          <p className="text-[#595959] text-sm">
            Overview of all participants registered for the Jawai Conservation Series.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={onDeleteSelected}
              className="px-5 h-11 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedIds.length})
            </button>
          )}

          <button
            onClick={onExportCSV}
            className="px-5 h-11 bg-[#294D3A] hover:bg-[#1C3628] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase"
          >
            <Download className="w-4 h-4 text-[#D7B66A]" />
            Export CSV
          </button>

          <button
            onClick={onExportExcel}
            className="px-5 h-11 bg-[#8C6A43] hover:bg-[#705536] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase"
          >
            <Download className="w-4 h-4 text-white/80" />
            Export Excel
          </button>

          <div className="flex items-center gap-3 bg-white border border-[#171717]/10 rounded-xl px-4 py-2.5 shadow-2xs">
            <Users className="w-4 h-4 text-[#294D3A]" />
            <div>
              <span className="text-[9px] font-bold tracking-wider text-[#8C6A43] uppercase block">Total</span>
              <span className="text-lg font-bold text-[#171717] leading-none">
                {isLoading ? "-" : registrations.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Input */}
      <div className="mb-4 relative max-w-md">
        <Search className="w-4 h-4 text-[#8C6A43] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search participant by name, email, city or run..."
          className="w-full h-11 bg-white border border-[#171717]/10 rounded-xl pl-10 pr-4 text-xs sm:text-sm"
        />
      </div>

      <div className="bg-white border border-[#171717]/10 rounded-[20px] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#171717]">
            <thead className="bg-[#FAF8F5] border-b border-[#171717]/10 text-[10px] font-bold tracking-[0.1em] text-[#595959] uppercase">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#171717]/20 text-[#294D3A]"
                    checked={registrations.length > 0 && selectedIds.length === registrations.length}
                    onChange={onSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Runner Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Event &amp; Distance</th>
                <th className="px-6 py-4 text-center">Payment</th>
                <th className="px-6 py-4 text-right">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#595959]">
                    Loading Registrations...
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#595959]">
                    No registrations match your filter.
                  </td>
                </tr>
              ) : (
                visibleRows.map((reg) => (
                  <tr
                    key={reg.id}
                    className={`hover:bg-[#FAF8F5]/50 transition-colors ${
                      selectedIds.includes(reg.id) ? "bg-[#294D3A]/5" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-[#171717]/20 text-[#294D3A]"
                        checked={selectedIds.includes(reg.id)}
                        onChange={() => onSelectOne(reg.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{reg.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{reg.email}</span>
                        <span className="text-xs text-[#595959] mt-0.5">{reg.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#595959]">{reg.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#294D3A]">{reg.runSeries}</span>
                        <span className="text-xs text-[#8C6A43] font-bold uppercase mt-0.5">{reg.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-[12px]">
                      {reg.paymentScreenshotUrl ? (
                        <a
                          href={reg.paymentScreenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#294D3A] underline font-medium hover:text-[#171717]"
                        >
                          View SS
                        </a>
                      ) : (
                        <span className="text-[#595959]/50">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-[#595959]">
                      {new Date(reg.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── 4. Website Settings Panel ──────────────────────────────────────────────

export function WebsiteSettingsPanel({
  settings,
  mediaAssets,
  onMediaUploaded,
  onSave,
  actorEmail,
}: {
  settings: WebsiteSettingsData;
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  onSave: (data: WebsiteSettingsData) => Promise<void>;
  actorEmail?: string;
}) {
  const [draft, setDraft] = useState<WebsiteSettingsData>(settings);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    try {
      await onSave(draft);
      setSavedMsg("Website Settings published to Firestore.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white border border-[#304B38]/12 rounded-[22px] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#304B38]/10">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171717]">Website Settings</h2>
          <p className="text-xs sm:text-sm text-[#595959]">Control Navbar branding, navigation links, and SEO metadata.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#294D3A] hover:bg-[#1C3628] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-[#D7B66A]" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {savedMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="SEO Page Title" value={draft.siteTitle} onChange={(siteTitle) => setDraft({ ...draft, siteTitle })} />
        <TextField label="Brand Name" value={draft.brandName} onChange={(brandName) => setDraft({ ...draft, brandName })} />
        <TextField label="Brand Subtitle" value={draft.brandSubtitle} onChange={(brandSubtitle) => setDraft({ ...draft, brandSubtitle })} />
        <TextField label="Navbar CTA Text" value={draft.navbarCtaText} onChange={(navbarCtaText) => setDraft({ ...draft, navbarCtaText })} />
      </div>

      <TextAreaField
        label="SEO Meta Description"
        value={draft.siteDescription}
        rows={2}
        onChange={(siteDescription) => setDraft({ ...draft, siteDescription })}
      />

      <MediaPickerField
        label="Navbar Brand Logo"
        value={draft.logoUrl}
        onChange={(logoUrl) => setDraft({ ...draft, logoUrl })}
        sectionTag="general"
        mediaAssets={mediaAssets}
        onMediaUploaded={onMediaUploaded}
        actorEmail={actorEmail}
      />

      <div className="space-y-2.5">
        <span className="text-xs font-bold text-[#8C6A43] uppercase block">Header Navigation Links</span>
        {draft.navbarLinks.map((lnk, idx) => (
          <div key={lnk.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
            <input
              type="text"
              value={lnk.name}
              onChange={(e) => {
                const next = [...draft.navbarLinks];
                next[idx] = { ...lnk, name: e.target.value };
                setDraft({ ...draft, navbarLinks: next });
              }}
              className="sm:col-span-2 h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm"
            />
            <input
              type="text"
              value={lnk.href}
              onChange={(e) => {
                const next = [...draft.navbarLinks];
                next[idx] = { ...lnk, href: e.target.value };
                setDraft({ ...draft, navbarLinks: next });
              }}
              className="sm:col-span-2 h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm font-mono"
            />
            <ItemOrderControls
              index={idx}
              total={draft.navbarLinks.length}
              onDelete={() =>
                setDraft({ ...draft, navbarLinks: draft.navbarLinks.filter((_, i) => i !== idx) })
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setDraft({
              ...draft,
              navbarLinks: [
                ...draft.navbarLinks,
                { id: `nl-${Date.now()}`, name: "NEW LINK", href: "#movement" },
              ],
            })
          }
          className="inline-flex items-center gap-1 text-xs font-bold text-[#294D3A] uppercase"
        >
          <Plus className="w-3.5 h-3.5" /> Add Nav Item
        </button>
      </div>
    </form>
  );
}

// ─── 5. Admin & Permissions + Security Rules + Seed Utility ─────────────────

const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthorizedAdmin() {
      return request.auth != null && (
        request.auth.token.admin == true ||
        !exists(/databases/$(database)/documents/cms_settings/permissions) ||
        request.auth.token.email in get(/databases/$(database)/documents/cms_settings/permissions).data.adminEmails
      );
    }
    match /cms_sections/{sectionId} {
      allow read: if resource.data.isPublished == true || isAuthorizedAdmin();
      allow create, update, delete: if isAuthorizedAdmin();
    }
    match /cms_media/{mediaId} {
      allow read: if true;
      allow create, update, delete: if isAuthorizedAdmin();
    }
    match /cms_settings/website {
      allow read: if true;
      allow create, update, delete: if isAuthorizedAdmin();
    }
    match /cms_settings/permissions {
      allow read, write: if isAuthorizedAdmin();
    }
    match /cms_audit/{logId} {
      allow read, write: if isAuthorizedAdmin();
    }
  }
}`;

export function PermissionsPanel({
  currentEmail,
  permissions,
  onSavePermissions,
  onSeedAll,
  onExportBackupJson,
  isSeeding,
}: {
  currentEmail: string;
  permissions: PermissionsSettingsData;
  onSavePermissions: (emails: string[]) => Promise<void>;
  onSeedAll: (overwrite: boolean) => Promise<void>;
  onExportBackupJson: () => void;
  isSeeding: boolean;
}) {
  const [emailsText, setEmailsText] = useState(permissions.adminEmails.join("\n"));
  const [copiedRules, setCopiedRules] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);

  const handleSaveAdmins = async () => {
    const list = emailsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    await onSavePermissions(list);
    setStatusMsg("Authorized administrator list updated in Firestore.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#304B38]/12 rounded-[22px] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[#304B38]/10">
          <div className="w-10 h-10 rounded-xl bg-[#294D3A]/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#294D3A]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#171717]">Admin Access &amp; Permissions</h2>
            <p className="text-xs text-[#595959]">
              Signed in as: <strong className="font-mono text-[#294D3A]">{currentEmail}</strong>
            </p>
          </div>
        </div>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            {statusMsg}
          </div>
        )}

        <TextAreaField
          label="Authorized Admin Emails (One per line)"
          value={emailsText}
          rows={4}
          onChange={setEmailsText}
          placeholder="admin@jawairunners.org"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAdmins}
            className="px-5 py-2.5 rounded-xl bg-[#294D3A] text-white text-xs font-bold uppercase tracking-wider"
          >
            Save Admin Whitelist
          </button>

          <button
            type="button"
            onClick={onExportBackupJson}
            className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#304B38]/20 text-[#1F3026] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download Full CMS JSON Backup
          </button>
        </div>
      </div>

      {/* Firebase Seeding Controls */}
      <div className="bg-white border border-[#304B38]/12 rounded-[22px] p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#171717]">Firebase Firestore Database Seeding</h3>
        <p className="text-xs sm:text-sm text-[#595959]">
          Seed initial sections, media metadata, and website settings into Cloud Firestore without affecting existing Realtime DB registrations or event dates.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isSeeding}
            onClick={() => onSeedAll(false)}
            className="px-5 py-2.5 rounded-xl bg-[#C69A3A] hover:bg-[#d8ab43] text-[#14231A] text-xs font-bold uppercase tracking-wider"
          >
            {isSeeding ? "Seeding..." : "Seed Missing Documents Only"}
          </button>

          <button
            type="button"
            disabled={isSeeding}
            onClick={() => setConfirmOverwrite(true)}
            className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider"
          >
            Reset &amp; Reseed All CMS Sections
          </button>
        </div>

        {confirmOverwrite && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-red-900 font-semibold">
              Confirm overwriting all Firestore CMS sections with initial seeded content?
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmOverwrite(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-red-200 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setConfirmOverwrite(false);
                  await onSeedAll(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-bold"
              >
                Confirm Overwrite
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security Rules Reference */}
      <div className="bg-white border border-[#304B38]/12 rounded-[22px] p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#171717]">Firestore Security Rules</h3>
            <p className="text-xs text-[#595959]">
              Also saved in <code className="font-mono">firestore.rules</code>. Deploy in Firebase Console. (Media assets upload securely via Cloudinary server API.)
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(FIRESTORE_RULES_SNIPPET);
              setCopiedRules(true);
              setTimeout(() => setCopiedRules(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#304B38]/20 text-xs font-bold text-[#1F3026]"
          >
            {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRules ? "Copied" : "Copy Firestore Rules"}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-[#141B16] text-[#FAF8F5] text-[11px] font-mono overflow-x-auto leading-relaxed">
          {FIRESTORE_RULES_SNIPPET}
        </pre>
      </div>
    </div>
  );
}
