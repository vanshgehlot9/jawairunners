"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon, Film, X, Check } from "lucide-react";
import { MediaAsset } from "@/lib/cms/types";
import { uploadMediaToFirebase } from "@/lib/cms/firestore-service";

interface MediaPickerFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  sectionTag: string;
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  actorEmail?: string;
  accept?: "image" | "video" | "both";
  helperText?: string;
}

export function MediaPickerField({
  label,
  value,
  onChange,
  sectionTag,
  mediaAssets,
  onMediaUploaded,
  actorEmail,
  accept = "image",
  helperText,
}: MediaPickerFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");

  const isVideoUrl =
    value?.endsWith(".mp4") || value?.endsWith(".webm") || value?.endsWith(".mov") || accept === "video";

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setIsUploading(true);
    setProgress(0);
    try {
      const asset = await uploadMediaToFirebase({
        file,
        section: sectionTag,
        alt: label,
        actorEmail,
        onProgress: setProgress,
      });
      onMediaUploaded(asset);
      onChange(asset.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed. Check Storage permissions.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const filteredAssets = mediaAssets.filter((a) => {
    if (accept === "image" && a.type !== "image") return false;
    if (accept === "video" && a.type !== "video") return false;
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.section.toLowerCase().includes(q) || a.alt.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#304B38]/12 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold tracking-wider text-[#171717] uppercase">{label}</label>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#294D3A] hover:bg-[#1C3628] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors">
            <Upload className="w-3 h-3 text-[#D7B66A]" />
            <span>{isUploading ? `${progress}%` : "Upload"}</span>
            <input
              type="file"
              accept={
                accept === "video"
                  ? "video/mp4,video/webm,video/quicktime"
                  : accept === "both"
                  ? "image/*,video/mp4,video/webm"
                  : "image/*"
              }
              onChange={handleDirectUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#EFECE3] border border-[#304B38]/20 text-[#1F3026] text-[11px] font-bold uppercase tracking-wider transition-colors"
          >
            {accept === "video" ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
            <span>Library</span>
          </button>
        </div>
      </div>

      {/* Preview & URL Input */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {value && (
          <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-[#141B16] border border-[#304B38]/20 shrink-0 flex items-center justify-center">
            {isVideoUrl ? (
              <video src={value} muted className="w-full h-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt={label} className="w-full h-full object-cover" />
            )}
          </div>
        )}
        <div className="flex-1 w-full">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste asset URL or upload/pick from library"
            className="w-full h-10 bg-white border border-[#304B38]/15 rounded-xl px-3.5 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#294D3A]"
          />
          {helperText && <p className="text-[11px] text-[#595959] mt-1">{helperText}</p>}
        </div>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      {/* Media Library Picker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#304B38]/15 max-w-3xl w-full max-h-[82vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#304B38]/10 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#171717]">Select Media Asset</h4>
                <p className="text-xs text-[#595959]">Choose from uploaded Cloudinary &amp; project media</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[#FAF8F5] text-[#595959]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-3 bg-[#FAF8F5] border-b border-[#304B38]/10">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search by filename or section..."
                className="w-full h-10 bg-white border border-[#304B38]/15 rounded-xl px-3.5 text-xs text-[#171717] focus:outline-none focus:border-[#294D3A]"
              />
            </div>

            <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {filteredAssets.map((asset) => {
                const isSelected = asset.url === value;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      onChange(asset.url);
                      setIsModalOpen(false);
                    }}
                    className={`group text-left rounded-xl overflow-hidden border transition-all flex flex-col ${
                      isSelected
                        ? "border-[#294D3A] ring-2 ring-[#294D3A]"
                        : "border-[#304B38]/15 hover:border-[#C69A3A]"
                    }`}
                  >
                    <div className="relative w-full h-28 bg-[#141B16] flex items-center justify-center overflow-hidden">
                      {asset.type === "video" ? (
                        <video src={asset.url} muted className="w-full h-full object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={asset.url} alt={asset.alt} className="w-full h-full object-cover" />
                      )}
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#294D3A] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="p-2.5 bg-white">
                      <div className="text-[11px] font-bold text-[#171717] truncate">{asset.name}</div>
                      <div className="text-[10px] font-mono text-[#8C6A43] uppercase">{asset.section}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
