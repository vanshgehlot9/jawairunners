import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  addDoc,
} from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import {
  AuditLogEntry,
  CmsSectionEnvelope,
  MediaAsset,
  PermissionsSettingsData,
  SectionContentMap,
  SectionId,
  WebsiteSettingsData,
} from "./types";
import {
  createSeedEnvelope,
  DEFAULT_WEBSITE_SETTINGS,
  INITIAL_MEDIA_SEED,
  SECTION_META,
} from "./seed-data";

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

export function validateMediaFile(file: File): { valid: boolean; type?: "image" | "video"; error?: string } {
  if (ALLOWED_IMAGE_TYPES.has(file.type)) {
    if (file.size > MAX_IMAGE_BYTES) {
      return { valid: false, error: "Image exceeds 10MB size limit." };
    }
    return { valid: true, type: "image" };
  }
  if (ALLOWED_VIDEO_TYPES.has(file.type)) {
    if (file.size > MAX_VIDEO_BYTES) {
      return { valid: false, error: "Video exceeds 50MB size limit." };
    }
    return { valid: true, type: "video" };
  }
  return {
    valid: false,
    error: "Unsupported file format. Allowed: JPEG, PNG, WebP, GIF, SVG, MP4, WebM, MOV.",
  };
}

export function readImageDimensions(file: File): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || typeof window === "undefined") {
      resolve({});
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const dims = { width: img.naturalWidth, height: img.naturalHeight };
      URL.revokeObjectURL(url);
      resolve(dims);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({});
    };
    img.src = url;
  });
}

// ─── Audit Log ──────────────────────────────────────────────────────────────

export async function recordAuditLog(action: string, target: string, actorEmail: string) {
  try {
    await addDoc(collection(firestore, "cms_audit"), {
      action,
      target,
      actorEmail: actorEmail || "admin",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Audit log skipped:", err);
  }
}

export async function fetchAuditLogs(maxEntries = 15): Promise<AuditLogEntry[]> {
  try {
    const q = query(collection(firestore, "cms_audit"), orderBy("timestamp", "desc"), limit(maxEntries));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AuditLogEntry, "id">) }));
  } catch {
    return [];
  }
}

// ─── Section CRUD & Publishing ──────────────────────────────────────────────

export async function fetchAllSectionsAdmin(): Promise<{
  sections: Record<SectionId, CmsSectionEnvelope<SectionContentMap[SectionId]>>;
  firestoreAvailable: boolean;
  permissionError?: string;
}> {
  const result = {} as Record<SectionId, CmsSectionEnvelope<SectionContentMap[SectionId]>>;
  const allIds = Object.keys(SECTION_META) as SectionId[];

  try {
    const snap = await getDocs(collection(firestore, "cms_sections"));
    const byId = new Map<string, CmsSectionEnvelope>();
    snap.docs.forEach((docSnap) => {
      byId.set(docSnap.id, docSnap.data() as CmsSectionEnvelope);
    });

    for (const id of allIds) {
      if (byId.has(id)) {
        result[id] = byId.get(id) as CmsSectionEnvelope<SectionContentMap[SectionId]>;
      } else {
        result[id] = createSeedEnvelope(id, "not-seeded-yet");
      }
    }

    return { sections: result, firestoreAvailable: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Permission denied reading Firestore";
    for (const id of allIds) {
      result[id] = createSeedEnvelope(id, "local-fallback");
    }
    return {
      sections: result,
      firestoreAvailable: false,
      permissionError: message,
    };
  }
}

export async function saveSectionDraft<K extends SectionId>(
  id: K,
  draftData: SectionContentMap[K],
  options: {
    title?: string;
    subtitle?: string;
    isVisible?: boolean;
    displayOrder?: number;
    actorEmail?: string;
    existingEnvelope?: CmsSectionEnvelope<SectionContentMap[K]>;
  } = {}
): Promise<CmsSectionEnvelope<SectionContentMap[K]>> {
  const now = new Date().toISOString();
  const base = options.existingEnvelope || createSeedEnvelope(id);

  const payload: CmsSectionEnvelope<SectionContentMap[K]> = {
    ...base,
    id,
    title: options.title ?? base.title,
    subtitle: options.subtitle ?? base.subtitle,
    isVisible: options.isVisible ?? base.isVisible,
    displayOrder: options.displayOrder ?? base.displayOrder,
    draft: draftData,
    updatedAt: now,
    updatedBy: options.actorEmail || "admin",
  };

  await setDoc(doc(firestore, "cms_sections", id), payload, { merge: true });
  await recordAuditLog("Saved Draft", SECTION_META[id].label, options.actorEmail || "admin");
  return payload;
}

export async function publishSection<K extends SectionId>(
  id: K,
  draftData: SectionContentMap[K],
  options: {
    title?: string;
    subtitle?: string;
    isVisible?: boolean;
    displayOrder?: number;
    actorEmail?: string;
    existingEnvelope?: CmsSectionEnvelope<SectionContentMap[K]>;
  } = {}
): Promise<CmsSectionEnvelope<SectionContentMap[K]>> {
  const now = new Date().toISOString();
  const base = options.existingEnvelope || createSeedEnvelope(id);

  const payload: CmsSectionEnvelope<SectionContentMap[K]> = {
    ...base,
    id,
    title: options.title ?? base.title,
    subtitle: options.subtitle ?? base.subtitle,
    isVisible: options.isVisible ?? base.isVisible,
    displayOrder: options.displayOrder ?? base.displayOrder,
    draft: draftData,
    published: draftData,
    isPublished: true,
    updatedAt: now,
    publishedAt: now,
    updatedBy: options.actorEmail || "admin",
  };

  await setDoc(doc(firestore, "cms_sections", id), payload, { merge: true });
  await recordAuditLog("Published Section", SECTION_META[id].label, options.actorEmail || "admin");
  return payload;
}

export async function unpublishSection<K extends SectionId>(
  id: K,
  actorEmail = "admin"
): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(doc(firestore, "cms_sections", id), {
    isPublished: false,
    updatedAt: now,
    updatedBy: actorEmail,
  });
  await recordAuditLog("Unpublished Section", SECTION_META[id].label, actorEmail);
}

// ─── Seeding All Website Content to Firestore ───────────────────────────────

export async function seedAllCmsToFirestore(
  actorEmail = "admin",
  overwriteExisting = false
): Promise<{ seededSections: number; seededMedia: number }> {
  const now = new Date().toISOString();
  const allIds = Object.keys(SECTION_META) as SectionId[];
  let seededSections = 0;
  let seededMedia = 0;

  for (const id of allIds) {
    const refDoc = doc(firestore, "cms_sections", id);
    if (!overwriteExisting) {
      const existing = await getDoc(refDoc);
      if (existing.exists()) continue;
    }
    const envelope = createSeedEnvelope(id, actorEmail);
    await setDoc(refDoc, envelope);
    seededSections++;
  }

  for (const asset of INITIAL_MEDIA_SEED) {
    const mediaDocRef = doc(firestore, "cms_media", asset.id);
    if (!overwriteExisting) {
      const existing = await getDoc(mediaDocRef);
      if (existing.exists()) continue;
    }
    await setDoc(mediaDocRef, { ...asset, updatedAt: now, uploadedBy: actorEmail });
    seededMedia++;
  }

  const websiteRef = doc(firestore, "cms_settings", "website");
  const websiteExists = await getDoc(websiteRef);
  if (overwriteExisting || !websiteExists.exists()) {
    await setDoc(websiteRef, { ...DEFAULT_WEBSITE_SETTINGS, updatedAt: now });
  }

  const permRef = doc(firestore, "cms_settings", "permissions");
  const permExists = await getDoc(permRef);
  if (!permExists.exists() && actorEmail) {
    await setDoc(permRef, {
      adminEmails: [actorEmail],
      updatedAt: now,
      updatedBy: actorEmail,
    });
  }

  await recordAuditLog(
    overwriteExisting ? "Reset & Seeded All CMS Data" : "Seeded Initial CMS Data",
    `${seededSections} sections, ${seededMedia} media assets`,
    actorEmail
  );

  return { seededSections, seededMedia };
}

// ─── Settings & Permissions ─────────────────────────────────────────────────

export async function fetchWebsiteSettingsAdmin(): Promise<WebsiteSettingsData> {
  try {
    const snap = await getDoc(doc(firestore, "cms_settings", "website"));
    if (snap.exists()) {
      return snap.data() as WebsiteSettingsData;
    }
  } catch {
    // fallback
  }
  return DEFAULT_WEBSITE_SETTINGS;
}

export async function saveWebsiteSettings(
  data: WebsiteSettingsData,
  actorEmail = "admin"
): Promise<WebsiteSettingsData> {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  await setDoc(doc(firestore, "cms_settings", "website"), payload);
  await recordAuditLog("Updated Website Settings", "SEO & Navigation", actorEmail);
  return payload;
}

export async function fetchPermissionsSettings(currentEmail = ""): Promise<PermissionsSettingsData> {
  try {
    const snap = await getDoc(doc(firestore, "cms_settings", "permissions"));
    if (snap.exists()) {
      return snap.data() as PermissionsSettingsData;
    }
  } catch {
    // fallback
  }
  return {
    adminEmails: currentEmail ? [currentEmail] : [],
    updatedAt: new Date().toISOString(),
    updatedBy: currentEmail || "system",
  };
}

export async function savePermissionsSettings(
  adminEmails: string[],
  actorEmail: string
): Promise<PermissionsSettingsData> {
  const normalized = Array.from(
    new Set(adminEmails.map((e) => e.trim().toLowerCase()).filter(Boolean))
  );
  if (actorEmail && !normalized.includes(actorEmail.toLowerCase())) {
    normalized.unshift(actorEmail.toLowerCase());
  }
  const payload: PermissionsSettingsData = {
    adminEmails: normalized,
    updatedAt: new Date().toISOString(),
    updatedBy: actorEmail,
  };
  await setDoc(doc(firestore, "cms_settings", "permissions"), payload);
  await recordAuditLog("Updated Admin Permissions", `${normalized.length} admins`, actorEmail);
  return payload;
}

// ─── Media Library (Cloudinary Storage + Firestore Metadata) ───────────────

async function uploadFileViaCloudinaryApi(params: {
  file: File;
  section: string;
  replacePublicId?: string;
  onProgress?: (pct: number) => void;
}): Promise<{ url: string; publicId: string; width?: number; height?: number }> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    throw new Error("Admin authentication required to upload media.");
  }

  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("section", params.section);
  if (params.replacePublicId) {
    formData.append("replacePublicId", params.replacePublicId);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/cms/media");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (evt) => {
      if (params.onProgress && evt.lengthComputable && evt.total > 0) {
        params.onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const parsed = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300 && parsed.url) {
          resolve({
            url: parsed.url,
            publicId: parsed.publicId,
            width: parsed.width,
            height: parsed.height,
          });
        } else {
          reject(new Error(parsed.error || "Cloudinary upload failed."));
        }
      } catch {
        reject(new Error("Invalid response from Cloudinary upload API."));
      }
    };

    xhr.onerror = () => reject(new Error("Network error uploading media."));
    xhr.send(formData);
  });
}

export async function fetchMediaLibrary(): Promise<MediaAsset[]> {
  try {
    const q = query(collection(firestore, "cms_media"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MediaAsset, "id">) }));
    }
    return INITIAL_MEDIA_SEED;
  } catch {
    return INITIAL_MEDIA_SEED;
  }
}

export async function uploadMediaToFirebase(params: {
  file: File;
  section: string;
  alt: string;
  actorEmail?: string;
  onProgress?: (pct: number) => void;
}): Promise<MediaAsset> {
  const validation = validateMediaFile(params.file);
  if (!validation.valid || !validation.type) {
    throw new Error(validation.error || "Invalid media file");
  }

  const clientDims = await readImageDimensions(params.file);
  const uploaded = await uploadFileViaCloudinaryApi({
    file: params.file,
    section: params.section,
    onProgress: params.onProgress,
  });

  const mediaId = `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const width = uploaded.width ?? clientDims.width;
  const height = uploaded.height ?? clientDims.height;

  const asset: MediaAsset = {
    id: mediaId,
    name: params.file.name,
    url: uploaded.url,
    storagePath: uploaded.publicId,
    type: validation.type,
    mimeType: params.file.type,
    size: params.file.size,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    section: params.section,
    alt: params.alt || params.file.name,
    createdAt: now,
    updatedAt: now,
    uploadedBy: params.actorEmail || "admin",
  };

  await setDoc(doc(firestore, "cms_media", mediaId), asset);
  await recordAuditLog("Uploaded Media", params.file.name, params.actorEmail || "admin");
  return asset;
}

function deepReplaceUrl<T>(obj: T, oldUrl: string, newUrl: string): { updated: T; changed: boolean } {
  if (typeof obj === "string") {
    if (obj === oldUrl) return { updated: newUrl as unknown as T, changed: true };
    return { updated: obj, changed: false };
  }
  if (Array.isArray(obj)) {
    let anyChanged = false;
    const next = obj.map((item) => {
      const res = deepReplaceUrl(item, oldUrl, newUrl);
      if (res.changed) anyChanged = true;
      return res.updated;
    });
    return { updated: next as unknown as T, changed: anyChanged };
  }
  if (obj && typeof obj === "object") {
    let anyChanged = false;
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const res = deepReplaceUrl(v, oldUrl, newUrl);
      if (res.changed) anyChanged = true;
      next[k] = res.updated;
    }
    return { updated: next as unknown as T, changed: anyChanged };
  }
  return { updated: obj, changed: false };
}

export async function replaceMediaAndPropagate(params: {
  existingAsset: MediaAsset;
  newFile: File;
  actorEmail?: string;
  onProgress?: (pct: number) => void;
}): Promise<{ updatedAsset: MediaAsset; sectionsUpdated: number }> {
  const validation = validateMediaFile(params.newFile);
  if (!validation.valid || !validation.type) {
    throw new Error(validation.error || "Invalid media file");
  }

  const clientDims = await readImageDimensions(params.newFile);
  const uploaded = await uploadFileViaCloudinaryApi({
    file: params.newFile,
    section: params.existingAsset.section,
    replacePublicId: params.existingAsset.storagePath,
    onProgress: params.onProgress,
  });

  const oldUrl = params.existingAsset.url;
  const newUrl = uploaded.url;
  const now = new Date().toISOString();

  const updatedAsset: MediaAsset = {
    ...params.existingAsset,
    name: params.newFile.name,
    url: newUrl,
    storagePath: uploaded.publicId,
    type: validation.type,
    mimeType: params.newFile.type,
    size: params.newFile.size,
    width: uploaded.width ?? clientDims.width ?? params.existingAsset.width,
    height: uploaded.height ?? clientDims.height ?? params.existingAsset.height,
    updatedAt: now,
    uploadedBy: params.actorEmail || "admin",
  };

  await setDoc(doc(firestore, "cms_media", params.existingAsset.id), updatedAsset);

  // Propagate replacement to all referencing sections cleanly
  let sectionsUpdated = 0;
  try {
    const secSnap = await getDocs(collection(firestore, "cms_sections"));
    for (const secDoc of secSnap.docs) {
      const env = secDoc.data() as CmsSectionEnvelope;
      const draftRes = deepReplaceUrl(env.draft, oldUrl, newUrl);
      const pubRes = env.published ? deepReplaceUrl(env.published, oldUrl, newUrl) : { updated: null, changed: false };
      if (draftRes.changed || pubRes.changed) {
        await updateDoc(doc(firestore, "cms_sections", secDoc.id), {
          draft: draftRes.updated,
          published: pubRes.updated,
          updatedAt: now,
          updatedBy: params.actorEmail || "admin",
        });
        sectionsUpdated++;
      }
    }
  } catch (err) {
    console.warn("Propagation check skipped:", err);
  }

  await recordAuditLog(
    "Replaced Media",
    `${params.existingAsset.name} (${sectionsUpdated} sections updated)`,
    params.actorEmail || "admin"
  );

  return { updatedAsset, sectionsUpdated };
}

export async function findMediaReferences(url: string): Promise<string[]> {
  const usedIn: string[] = [];
  try {
    const snap = await getDocs(collection(firestore, "cms_sections"));
    snap.docs.forEach((d) => {
      const env = d.data() as CmsSectionEnvelope;
      const serialized = JSON.stringify({ draft: env.draft, published: env.published });
      if (serialized.includes(url)) {
        usedIn.push(env.label || d.id);
      }
    });
  } catch {
    // ignore
  }
  return usedIn;
}

export async function deleteMediaFromFirebase(
  asset: MediaAsset,
  actorEmail = "admin"
): Promise<void> {
  if (asset.storagePath.startsWith("jawairunners/cms/")) {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        await fetch("/api/cms/media", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            publicId: asset.storagePath,
            resourceType: asset.type,
          }),
        });
      }
    } catch {
      // ignore if already removed on Cloudinary
    }
  }
  await deleteDoc(doc(firestore, "cms_media", asset.id));
  await recordAuditLog("Deleted Media", asset.name, actorEmail);
}
