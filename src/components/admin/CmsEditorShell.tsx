"use client";

import React, { useState } from "react";
import {
  Save,
  Eye,
  Send,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
} from "lucide-react";
import { CmsSectionEnvelope, SectionId } from "@/lib/cms/types";

interface CmsEditorShellProps {
  envelope: CmsSectionEnvelope;
  isDirty: boolean;
  isBusy: boolean;
  statusMessage?: { type: "success" | "error"; text: string } | null;
  onToggleVisibility: (visible: boolean) => void;
  onSaveDraft: () => Promise<void>;
  onPreview: () => Promise<void>;
  onPublish: () => Promise<void>;
  onUnpublish: () => Promise<void>;
  onResetDefaults: () => Promise<void>;
  children: React.ReactNode;
}

const PREVIEW_HASH_MAP: Record<SectionId, string> = {
  hero: "#home",
  conservationMission: "#conservation-mission",
  firstInitiative: "#first-initiative",
  movement: "#movement",
  threeRuns: "#three-runs",
  runDetails: "#registration",
  foundation: "#foundation",
  initiatives: "#foundation",
  registrationContent: "#registration",
  faq: "#faq",
  footer: "",
};

export function getPreviewUrl(sectionId: SectionId): string {
  return `/?preview=true${PREVIEW_HASH_MAP[sectionId] || ""}`;
}

export function CmsEditorShell({
  envelope,
  isDirty,
  isBusy,
  statusMessage,
  onToggleVisibility,
  onSaveDraft,
  onPreview,
  onPublish,
  onUnpublish,
  onResetDefaults,
  children,
}: CmsEditorShellProps) {
  const [confirmAction, setConfirmAction] = useState<"unpublish" | "reset" | null>(null);
  const hasPendingPublishedDiff =
    JSON.stringify(envelope.draft) !== JSON.stringify(envelope.published);

  return (
    <div className="space-y-6">
      {/* Header & Publishing Controls */}
      <div className="bg-white border border-[#304B38]/12 rounded-[22px] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-5 border-b border-[#304B38]/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#8C6A43] uppercase">
                {envelope.category}
              </span>

              {envelope.isPublished ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  <Globe className="w-3 h-3" />
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase tracking-wider">
                  <EyeOff className="w-3 h-3" />
                  Unpublished
                </span>
              )}

              {(isDirty || hasPendingPublishedDiff) && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                  {isDirty ? "Unsaved Edits" : "Draft Ahead of Live"}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#171717]">
              {envelope.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#595959] mt-1">{envelope.subtitle}</p>
          </div>

          {/* Workflow Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#304B38]/15 cursor-pointer text-xs font-semibold text-[#171717]">
              <input
                type="checkbox"
                checked={envelope.isVisible}
                onChange={(e) => onToggleVisibility(e.target.checked)}
                className="rounded text-[#294D3A] focus:ring-[#294D3A]"
              />
              <span>Visible</span>
            </label>

            <button
              type="button"
              disabled={isBusy}
              onClick={onSaveDraft}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EFECE3] border border-[#304B38]/20 text-[#1F3026] text-xs font-bold tracking-wider uppercase transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-[#8C6A43]" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              disabled={isBusy}
              onClick={onPreview}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#304B38]/20 text-[#171717] text-xs font-bold tracking-wider uppercase transition-colors disabled:opacity-50"
            >
              <Eye className="w-3.5 h-3.5 text-[#C69A3A]" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              disabled={isBusy}
              onClick={onPublish}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#294D3A] hover:bg-[#1C3628] text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#D7B66A]" />
              <span>{isBusy ? "Saving..." : "Publish"}</span>
            </button>
          </div>
        </div>

        {/* Footer Meta + Secondary Destructive Actions */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#595959]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8C6A43]" />
              Updated: {new Date(envelope.updatedAt).toLocaleString()}
            </span>
            {envelope.publishedAt && (
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Last Published: {new Date(envelope.publishedAt).toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {envelope.isPublished && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => setConfirmAction("unpublish")}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 uppercase tracking-wider"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Unpublish</span>
              </button>
            )}

            <button
              type="button"
              disabled={isBusy}
              onClick={() => setConfirmAction("reset")}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6A43] hover:text-[#171717] uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Seed Default</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`mt-4 p-3.5 rounded-xl border flex items-center gap-2.5 text-xs sm:text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Destructive Action Confirmation Dialog */}
        {confirmAction && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-amber-950 font-medium">
              {confirmAction === "unpublish"
                ? "Confirm Unpublish: This section will be hidden from public website visitors until re-published."
                : "Confirm Reset: Replace your current draft fields with the default initial content?"}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-bold text-[#171717]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const act = confirmAction;
                  setConfirmAction(null);
                  if (act === "unpublish") await onUnpublish();
                  if (act === "reset") await onResetDefaults();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Editor Body */}
      <div className="bg-white border border-[#304B38]/12 rounded-[22px] p-5 sm:p-7 shadow-xs">
        {children}
      </div>
    </div>
  );
}
