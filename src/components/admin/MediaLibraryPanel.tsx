"use client";

import React, { useState, useMemo } from "react";
import {
  Upload,
  Search,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Film,
  Image as ImageIcon,
  AlertTriangle,
  X,
} from "lucide-react";
import { MediaAsset } from "@/lib/cms/types";
import {
  uploadMediaToFirebase,
  replaceMediaAndPropagate,
  deleteMediaFromFirebase,
  findMediaReferences,
  validateMediaFile,
  readImageDimensions,
} from "@/lib/cms/firestore-service";

interface MediaLibraryPanelProps {
  assets: MediaAsset[];
  onRefreshAssets: () => Promise<void>;
  onRefreshSections: () => Promise<void>;
  actorEmail?: string;
}

const SECTION_FILTER_OPTIONS = [
  { value: "all", label: "All Sections" },
  { value: "hero", label: "Hero Section" },
  { value: "firstInitiative", label: "Jawai Runner Initiative" },
  { value: "movement", label: "Movement & Experience" },
  { value: "foundation", label: "Foundation" },
  { value: "threeRuns", label: "Three Runs" },
  { value: "general", label: "General / Unassigned" },
];

function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function MediaLibraryPanel({
  assets,
  onRefreshAssets,
  onRefreshSections,
  actorEmail,
}: MediaLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  // Pending Upload Preview State (Preview media before saving!)
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string>("");
  const [pendingDims, setPendingDims] = useState<{ width?: number; height?: number }>({});
  const [pendingType, setPendingType] = useState<"image" | "video">("image");
  const [pendingSection, setPendingSection] = useState("general");
  const [pendingAlt, setPendingAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Replace / Delete / Copy states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    asset: MediaAsset;
    usedIn: string[];
  } | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (sectionFilter !== "all" && a.section !== sectionFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.alt.toLowerCase().includes(q) ||
        a.section.toLowerCase().includes(q)
      );
    });
  }, [assets, typeFilter, sectionFilter, searchQuery]);

  const handleStageFileForPreview = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setStatusMsg(null);

    const check = validateMediaFile(file);
    if (!check.valid || !check.type) {
      setStatusMsg({ type: "error", text: check.error || "Invalid media file" });
      return;
    }

    const dims = await readImageDimensions(file);
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);

    setPendingFile(file);
    setPendingType(check.type);
    setPendingDims(dims);
    setPendingAlt(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    setPendingPreviewUrl(URL.createObjectURL(file));
  };

  const clearPendingUpload = () => {
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setPendingFile(null);
    setPendingPreviewUrl("");
    setPendingDims({});
    setPendingAlt("");
  };

  const handleConfirmUpload = async () => {
    if (!pendingFile) return;
    setIsUploading(true);
    setUploadProgress(0);
    setStatusMsg(null);
    try {
      await uploadMediaToFirebase({
        file: pendingFile,
        section: pendingSection,
        alt: pendingAlt,
        actorEmail,
        onProgress: setUploadProgress,
      });
      clearPendingUpload();
      await onRefreshAssets();
      setStatusMsg({
        type: "success",
        text: "Media uploaded to Cloudinary & registered in Media Library.",
      });
    } catch (err: unknown) {
      setStatusMsg({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Failed to upload media to Cloudinary.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReplaceFile = async (asset: MediaAsset, e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    e.target.value = "";
    if (!newFile) return;

    setReplacingId(asset.id);
    setStatusMsg(null);
    try {
      const { sectionsUpdated } = await replaceMediaAndPropagate({
        existingAsset: asset,
        newFile,
        actorEmail,
      });
      await onRefreshAssets();
      await onRefreshSections();
      setStatusMsg({
        type: "success",
        text: `Replaced "${asset.name}" and synchronized ${sectionsUpdated} website section(s).`,
      });
    } catch (err: unknown) {
      setStatusMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to replace media asset.",
      });
    } finally {
      setReplacingId(null);
    }
  };

  const handleRequestDelete = async (asset: MediaAsset) => {
    const usedIn = await findMediaReferences(asset.url);
    setDeleteTarget({ asset, usedIn });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMediaFromFirebase(deleteTarget.asset, actorEmail);
      setDeleteTarget(null);
      await onRefreshAssets();
      setStatusMsg({ type: "success", text: `Deleted "${deleteTarget.asset.name}".` });
    } catch (err: unknown) {
      setStatusMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Delete failed.",
      });
    }
  };

  const handleCopyUrl = async (asset: MediaAsset) => {
    await navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Upload Trigger */}
      <div className="bg-white border border-[#304B38]/12 rounded-[22px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#304B38]/10">
          <div>
            <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-1">
              CLOUDINARY MEDIA + FIRESTORE
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#171717]">
              Central Media Library
            </h2>
            <p className="text-xs sm:text-sm text-[#595959] mt-1">
              Upload, preview, replace, copy URLs, and manage images &amp; videos organised by section.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#294D3A] hover:bg-[#1C3628] text-white font-bold text-xs tracking-wider uppercase cursor-pointer transition-colors shadow-sm shrink-0 self-start md:self-auto">
            <Upload className="w-4 h-4 text-[#D7B66A]" />
            <span>Upload Image / Video</span>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              onChange={handleStageFileForPreview}
              className="hidden"
            />
          </label>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`mt-5 p-3.5 rounded-xl border text-xs sm:text-sm font-medium ${
              statusMsg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Preview Before Saving Box */}
        {pendingFile && (
          <div className="mt-6 p-5 rounded-2xl bg-[#FAF8F5] border-2 border-[#C69A3A]/45">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-[#8C6A43] uppercase">
                Preview Media Before Saving
              </span>
              <button
                type="button"
                onClick={clearPendingUpload}
                className="p-1 rounded-lg hover:bg-black/5 text-[#595959]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-4 relative h-44 rounded-xl overflow-hidden bg-[#141B16] border border-[#304B38]/15">
                {pendingType === "video" ? (
                  <video src={pendingPreviewUrl} controls className="w-full h-full object-contain" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pendingPreviewUrl}
                    alt="Upload Preview"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="md:col-span-8 space-y-3">
                <div className="flex flex-wrap gap-3 text-xs font-mono text-[#595959]">
                  <span>File: <strong>{pendingFile.name}</strong></span>
                  <span>Size: <strong>{formatBytes(pendingFile.size)}</strong></span>
                  {pendingDims.width && (
                    <span>
                      Dimensions: <strong>{pendingDims.width} × {pendingDims.height} px</strong>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#171717] uppercase mb-1">
                      Website Section
                    </label>
                    <select
                      value={pendingSection}
                      onChange={(e) => setPendingSection(e.target.value)}
                      className="w-full h-10 bg-white border border-[#304B38]/15 rounded-xl px-3 text-xs font-semibold text-[#171717]"
                    >
                      {SECTION_FILTER_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#171717] uppercase mb-1">
                      Alt / Description
                    </label>
                    <input
                      type="text"
                      value={pendingAlt}
                      onChange={(e) => setPendingAlt(e.target.value)}
                      className="w-full h-10 bg-white border border-[#304B38]/15 rounded-xl px-3 text-xs text-[#171717]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={handleConfirmUpload}
                    className="px-5 py-2.5 rounded-xl bg-[#294D3A] hover:bg-[#1C3628] text-white text-xs font-bold tracking-wider uppercase transition-colors disabled:opacity-50"
                  >
                    {isUploading ? `Uploading ${uploadProgress}%...` : "Save to Cloudinary"}
                  </button>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={clearPendingUpload}
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#304B38]/15 text-xs font-bold text-[#595959]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#8C6A43] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media by filename, alt text or section..."
              className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#294D3A]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "image" | "video")}
              className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 text-xs font-semibold text-[#171717]"
            >
              <option value="all">All Media Types ({assets.length})</option>
              <option value="image">Images Only</option>
              <option value="video">Videos Only</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 text-xs font-semibold text-[#171717]"
            >
              {SECTION_FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-red-900">
              <strong>Confirm Delete &quot;{deleteTarget.asset.name}&quot;?</strong>
              {deleteTarget.usedIn.length > 0 ? (
                <p className="mt-1 font-semibold">
                  Warning: Currently referenced in {deleteTarget.usedIn.join(", ")}. Consider using &quot;Replace&quot; instead so website images do not break!
                </p>
              ) : (
                <p className="mt-0.5 text-red-800">Not currently referenced in any Firestore section. Safe to remove.</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-3.5 py-2 rounded-xl bg-white border border-red-200 text-xs font-bold text-[#171717]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      )}

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white border border-[#304B38]/12 rounded-2xl overflow-hidden shadow-xs flex flex-col"
          >
            <div className="relative h-44 bg-[#141B16] flex items-center justify-center overflow-hidden">
              {asset.type === "video" ? (
                <video src={asset.url} controls muted className="w-full h-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.url} alt={asset.alt} className="w-full h-full object-cover" />
              )}

              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/65 text-white text-[10px] font-mono uppercase">
                  {asset.type === "video" ? <Film className="w-3 h-3 text-[#C69A3A]" /> : <ImageIcon className="w-3 h-3 text-[#C69A3A]" />}
                  {asset.type}
                </span>
              </div>

              <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#182B20]/90 text-[#D7B66A] text-[10px] font-mono font-bold uppercase">
                {asset.section}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-sm text-[#171717] truncate">{asset.name}</h4>
                <p className="text-xs text-[#595959] truncate mt-0.5">{asset.alt}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono text-[#8C6A43] mt-2">
                  <span>{formatBytes(asset.size)}</span>
                  {asset.width && asset.height && (
                    <span>
                      {asset.width}×{asset.height}px
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#304B38]/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFECE3] text-[11px] font-bold text-[#1F3026] transition-colors"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <label
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#294D3A]/10 hover:bg-[#294D3A]/20 text-[11px] font-bold text-[#294D3A] cursor-pointer transition-colors"
                    title="Replace file & update section references"
                  >
                    <RefreshCw className={`w-3 h-3 ${replacingId === asset.id ? "animate-spin" : ""}`} />
                    <span>{replacingId === asset.id ? "..." : "Replace"}</span>
                    <input
                      type="file"
                      accept={asset.type === "video" ? "video/*" : "image/*"}
                      onChange={(e) => handleReplaceFile(asset, e)}
                      disabled={replacingId === asset.id}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRequestDelete(asset)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete unused asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
