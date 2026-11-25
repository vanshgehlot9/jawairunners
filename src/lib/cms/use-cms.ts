"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import {
  CmsSectionEnvelope,
  SectionContentMap,
  SectionId,
  WebsiteSettingsData,
} from "./types";
import {
  DEFAULT_WEBSITE_SETTINGS,
  INITIAL_SECTION_DATA,
} from "./seed-data";

// ─── Shared Singleton Section Cache & Listeners ─────────────────────────────

type SectionState<K extends SectionId> = {
  content: SectionContentMap[K];
  isVisible: boolean;
  isPublished: boolean;
  isLoaded: boolean;
};

const sectionCache = new Map<SectionId, CmsSectionEnvelope | null>();
const activeListeners = new Set<SectionId>();
const sectionSubscribers = new Map<SectionId, Set<(env: CmsSectionEnvelope | null) => void>>();

function attachSectionListener(sectionId: SectionId) {
  if (activeListeners.has(sectionId) || typeof window === "undefined") return;
  activeListeners.add(sectionId);

  try {
    const ref = doc(firestore, "cms_sections", sectionId);
    onSnapshot(
      ref,
      (snap) => {
        const val = snap.exists() ? (snap.data() as CmsSectionEnvelope) : null;
        sectionCache.set(sectionId, val);
        const subs = sectionSubscribers.get(sectionId);
        subs?.forEach((cb) => cb(val));
      },
      (err) => {
        // Gracefully fall back if Firestore rules are not deployed yet
        console.warn(`[CMS] Using seeded fallback for "${sectionId}":`, err.code || err.message);
        sectionCache.set(sectionId, null);
        const subs = sectionSubscribers.get(sectionId);
        subs?.forEach((cb) => cb(null));
      }
    );
  } catch (err) {
    console.warn(`[CMS] Listener setup error for "${sectionId}":`, err);
  }
}

/**
 * React hook for public website sections.
 * Reads ONLY `published` data when `isPublished === true`.
 * Supports `?preview=true` ONLY when an admin is signed into Firebase Auth.
 */
export function useCmsSection<K extends SectionId>(sectionId: K): SectionState<K> {
  const [envelope, setEnvelope] = useState<CmsSectionEnvelope | null>(
    () => sectionCache.get(sectionId) ?? null
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(() => sectionCache.has(sectionId));
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preview") === "true" && auth.currentUser) {
        setIsPreview(true);
      }
    }

    if (!sectionSubscribers.has(sectionId)) {
      sectionSubscribers.set(sectionId, new Set());
    }
    const handler = (env: CmsSectionEnvelope | null) => {
      setEnvelope(env);
      setIsLoaded(true);
    };
    sectionSubscribers.get(sectionId)!.add(handler);
    attachSectionListener(sectionId);

    if (sectionCache.has(sectionId)) {
      setEnvelope(sectionCache.get(sectionId) ?? null);
      setIsLoaded(true);
    }

    return () => {
      sectionSubscribers.get(sectionId)?.delete(handler);
    };
  }, [sectionId]);

  if (!envelope) {
    return {
      content: INITIAL_SECTION_DATA[sectionId],
      isVisible: sectionId === "threeRuns" ? INITIAL_SECTION_DATA.threeRuns.showOnHomepage : true,
      isPublished: true,
      isLoaded,
    };
  }

  // Preview mode for authenticated admins: show draft data
  if (isPreview && envelope.draft) {
    return {
      content: envelope.draft as SectionContentMap[K],
      isVisible: envelope.isVisible,
      isPublished: envelope.isPublished,
      isLoaded,
    };
  }

  // Public visitors: strictly show published data if published, else safe fallback or hidden
  if (!envelope.isPublished) {
    return {
      content: (envelope.published ?? INITIAL_SECTION_DATA[sectionId]) as SectionContentMap[K],
      isVisible: false,
      isPublished: false,
      isLoaded,
    };
  }

  return {
    content: (envelope.published ?? INITIAL_SECTION_DATA[sectionId]) as SectionContentMap[K],
    isVisible: envelope.isVisible ?? true,
    isPublished: true,
    isLoaded,
  };
}

// ─── Website Settings Listener ──────────────────────────────────────────────

let cachedSettings: WebsiteSettingsData | null = null;
let isSettingsListenerActive = false;
const settingsSubscribers = new Set<(s: WebsiteSettingsData) => void>();

function attachSettingsListener() {
  if (isSettingsListenerActive || typeof window === "undefined") return;
  isSettingsListenerActive = true;

  try {
    onSnapshot(
      doc(firestore, "cms_settings", "website"),
      (snap) => {
        const val = snap.exists() ? (snap.data() as WebsiteSettingsData) : DEFAULT_WEBSITE_SETTINGS;
        cachedSettings = val;
        settingsSubscribers.forEach((cb) => cb(val));
      },
      () => {
        cachedSettings = DEFAULT_WEBSITE_SETTINGS;
        settingsSubscribers.forEach((cb) => cb(DEFAULT_WEBSITE_SETTINGS));
      }
    );
  } catch {
    // ignore
  }
}

export function useWebsiteSettings(): WebsiteSettingsData {
  const [settings, setSettings] = useState<WebsiteSettingsData>(
    cachedSettings ?? DEFAULT_WEBSITE_SETTINGS
  );

  useEffect(() => {
    settingsSubscribers.add(setSettings);
    attachSettingsListener();
    if (cachedSettings) setSettings(cachedSettings);
    return () => {
      settingsSubscribers.delete(setSettings);
    };
  }, []);

  return settings;
}
