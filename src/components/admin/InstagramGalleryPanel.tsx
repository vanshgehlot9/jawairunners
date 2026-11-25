"use client";

import React, { useState } from "react";
import { Film, Plus, Send, Save, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { FirstInitiativeContent, MediaAsset } from "@/lib/cms/types";
import { MediaPickerField } from "./MediaPickerField";
import { TextField, ItemOrderControls, moveArrayItem } from "./FieldHelpers";
import { extractInstagramReelId } from "./SectionEditorsPart1";

interface InstagramGalleryPanelProps {
  initiativeContent: FirstInitiativeContent;
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  onSaveDraft: (next: FirstInitiativeContent) => Promise<void>;
  onPublish: (next: FirstInitiativeContent) => Promise<void>;
  actorEmail?: string;
}

export function InstagramGalleryPanel({
  initiativeContent,
  mediaAssets,
  onMediaUploaded,
  onSaveDraft,
  onPublish,
  actorEmail,
}: InstagramGalleryPanelProps) {
  const [draft, setDraft] = useState<FirstInitiativeContent>(initiativeContent);
  const [isBusy, setIsBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const runAction = async (fn: (data: FirstInitiativeContent) => Promise<void>, successText: string) => {
    setIsBusy(true);
    setMsg(null);
    try {
      await fn(draft);
      setMsg({ type: "success", text: successText });
    } catch (err: unknown) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Operation failed" });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#304B38]/12 rounded-[22px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#304B38]/10">
          <div>
            <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-1">
              INSTAGRAM REELS &amp; HIGHLIGHTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#171717]">
              Instagram &amp; Video Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#595959] mt-1">
              Manage Reel embed URLs, portrait 9:16 thumbnails, captions, and display order on the live homepage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => runAction(onSaveDraft, "Gallery draft saved.")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EFECE3] border border-[#304B38]/20 text-xs font-bold uppercase tracking-wider text-[#1F3026]"
            >
              <Save className="w-3.5 h-3.5 text-[#8C6A43]" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => runAction(onPublish, "Instagram gallery published live to homepage!")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#294D3A] hover:bg-[#1C3628] text-white text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-[#D7B66A]" />
              <span>{isBusy ? "Saving..." : "Publish Gallery"}</span>
            </button>
          </div>
        </div>

        {msg && (
          <div
            className={`mt-4 p-3.5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-medium ${
              msg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Instagram Account URL"
            value={draft.instagramProfileUrl}
            onChange={(instagramProfileUrl) => setDraft({ ...draft, instagramProfileUrl })}
          />
          <TextField
            label="Gallery Header Label"
            value={draft.highlightsLabel}
            onChange={(highlightsLabel) => setDraft({ ...draft, highlightsLabel })}
          />
        </div>
      </div>

      {/* Reel Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {draft.reels.map((reel, idx) => (
          <div key={reel.id} className="bg-white border border-[#304B38]/12 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#304B38]/10 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#C69A3A]" />
                <span className="text-xs font-mono font-bold text-[#1F3026] uppercase">
                  REEL #{idx + 1} · ID: {reel.reelId}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={reel.visible}
                    onChange={(e) => {
                      const next = [...draft.reels];
                      next[idx] = { ...reel, visible: e.target.checked };
                      setDraft({ ...draft, reels: next });
                    }}
                  />
                  Visible
                </label>
                <ItemOrderControls
                  index={idx}
                  total={draft.reels.length}
                  onMoveUp={() =>
                    setDraft({ ...draft, reels: moveArrayItem(draft.reels, idx, idx - 1) })
                  }
                  onMoveDown={() =>
                    setDraft({ ...draft, reels: moveArrayItem(draft.reels, idx, idx + 1) })
                  }
                  onDelete={() =>
                    setDraft({ ...draft, reels: draft.reels.filter((_, i) => i !== idx) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label="Display Title"
                value={reel.title}
                onChange={(title) => {
                  const next = [...draft.reels];
                  next[idx] = { ...reel, title };
                  setDraft({ ...draft, reels: next });
                }}
              />
              <TextField
                label="Theme"
                value={reel.theme}
                onChange={(theme) => {
                  const next = [...draft.reels];
                  next[idx] = { ...reel, theme };
                  setDraft({ ...draft, reels: next });
                }}
              />
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField
                  label="Original Instagram Reel URL"
                  value={reel.url}
                  onChange={(url) => {
                    const next = [...draft.reels];
                    next[idx] = { ...reel, url, reelId: extractInstagramReelId(url) };
                    setDraft({ ...draft, reels: next });
                  }}
                />
              </div>
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-3 rounded-xl bg-[#FAF8F5] border border-[#304B38]/15 flex items-center justify-center text-[#294D3A]"
                title="Open original Reel"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <TextField
              label="Video Modal Caption"
              value={reel.caption}
              onChange={(caption) => {
                const next = [...draft.reels];
                next[idx] = { ...reel, caption };
                setDraft({ ...draft, reels: next });
              }}
            />

            <MediaPickerField
              label="Reel Cover Image"
              value={reel.thumbnail}
              onChange={(thumbnail) => {
                const next = [...draft.reels];
                next[idx] = { ...reel, thumbnail };
                setDraft({ ...draft, reels: next });
              }}
              sectionTag="firstInitiative"
              mediaAssets={mediaAssets}
              onMediaUploaded={onMediaUploaded}
              actorEmail={actorEmail}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          setDraft({
            ...draft,
            reels: [
              ...draft.reels,
              {
                id: `reel-${Date.now()}`,
                reelId: "De5efmQEhMu",
                title: "New Jawai Highlight",
                url: "https://www.instagram.com/reel/De5efmQEhMu/",
                thumbnail: "/pastevent/reel-1-orig.jpg",
                theme: "Conservation Highlight",
                caption: "On-ground highlight from Jawai.",
                visible: true,
              },
            ],
          })
        }
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#294D3A]/10 hover:bg-[#294D3A]/20 text-[#294D3A] font-bold text-xs uppercase tracking-wider"
      >
        <Plus className="w-4 h-4" /> Add New Reel Card
      </button>
    </div>
  );
}
