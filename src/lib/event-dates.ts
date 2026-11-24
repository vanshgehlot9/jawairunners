"use client";

import { useState, useEffect } from "react";
import { db, ref, onValue, set } from "@/lib/firebase";

export type EventDatesConfig = {
  run1Date: string;
  run2Date: string;
  run3Date: string;
  trilogyDate: string;
  updatedAt?: string;
};

export const DEFAULT_EVENT_DATES: EventDatesConfig = {
  run1Date: "REVEALING SOON",
  run2Date: "REVEALING SOON",
  run3Date: "REVEALING SOON",
  trilogyDate: "REVEALING SOON",
};

// Singleton in-memory cache to share state among all mounted components
let cachedDates: EventDatesConfig = { ...DEFAULT_EVENT_DATES };
let isListenerActive = false;
const subscribers = new Set<(dates: EventDatesConfig) => void>();

function attachFirebaseListener() {
  if (isListenerActive || typeof window === "undefined") return;
  isListenerActive = true;

  try {
    const datesRef = ref(db, "settings/eventDates");
    onValue(
      datesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          cachedDates = {
            run1Date: val.run1Date?.trim() || DEFAULT_EVENT_DATES.run1Date,
            run2Date: val.run2Date?.trim() || DEFAULT_EVENT_DATES.run2Date,
            run3Date: val.run3Date?.trim() || DEFAULT_EVENT_DATES.run3Date,
            trilogyDate: val.trilogyDate?.trim() || DEFAULT_EVENT_DATES.trilogyDate,
            updatedAt: val.updatedAt,
          };
        } else {
          cachedDates = { ...DEFAULT_EVENT_DATES };
        }
        subscribers.forEach((callback) => callback(cachedDates));
      },
      (error) => {
        console.error("Error reading event dates from Firebase:", error);
      }
    );
  } catch (err) {
    console.error("Failed to attach Firebase event dates listener:", err);
  }
}

/**
 * React hook that returns live-synced event dates from Firebase Realtime DB,
 * defaulting to "REVEALING SOON".
 */
export function useEventDates(): EventDatesConfig {
  const [dates, setDates] = useState<EventDatesConfig>(cachedDates);

  useEffect(() => {
    subscribers.add(setDates);
    attachFirebaseListener();

    // Immediately sync with current cache
    setDates(cachedDates);

    return () => {
      subscribers.delete(setDates);
    };
  }, []);

  return dates;
}

/**
 * Helper to persist updated dates in Firebase Realtime DB.
 */
export async function saveEventDatesToDb(dates: EventDatesConfig): Promise<void> {
  const datesRef = ref(db, "settings/eventDates");
  await set(datesRef, {
    run1Date: dates.run1Date.trim() || DEFAULT_EVENT_DATES.run1Date,
    run2Date: dates.run2Date.trim() || DEFAULT_EVENT_DATES.run2Date,
    run3Date: dates.run3Date.trim() || DEFAULT_EVENT_DATES.run3Date,
    trilogyDate: dates.trilogyDate.trim() || DEFAULT_EVENT_DATES.trilogyDate,
    updatedAt: new Date().toISOString(),
  });
}
