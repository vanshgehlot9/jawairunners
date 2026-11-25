"use client";

import React, { useEffect, useState, useCallback } from "react";
import { db, ref, get, child, auth, remove } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { Menu, Users, ChevronLeft } from "lucide-react";
import * as XLSX from "xlsx";

import { EventDatesConfig, DEFAULT_EVENT_DATES, saveEventDatesToDb } from "@/lib/event-dates";
import {
  AuditLogEntry,
  CmsSectionEnvelope,
  MediaAsset,
  PermissionsSettingsData,
  SectionContentMap,
  SectionId,
  WebsiteSettingsData,
} from "@/lib/cms/types";
import {
  DEFAULT_WEBSITE_SETTINGS,
  INITIAL_MEDIA_SEED,
  INITIAL_SECTION_DATA,
  SECTION_META,
  createSeedEnvelope,
} from "@/lib/cms/seed-data";
import {
  fetchAllSectionsAdmin,
  fetchAuditLogs,
  fetchMediaLibrary,
  fetchPermissionsSettings,
  fetchWebsiteSettingsAdmin,
  publishSection,
  savePermissionsSettings,
  saveSectionDraft,
  saveWebsiteSettings,
  seedAllCmsToFirestore,
  unpublishSection,
} from "@/lib/cms/firestore-service";

import { AdminSidebar, AdminNavKey } from "@/components/admin/AdminSidebar";
import { CmsEditorShell, getPreviewUrl } from "@/components/admin/CmsEditorShell";
import { MediaLibraryPanel } from "@/components/admin/MediaLibraryPanel";
import { InstagramGalleryPanel } from "@/components/admin/InstagramGalleryPanel";
import {
  HeroEditor,
  ConservationMissionEditor,
  FirstInitiativeEditor,
  MovementEditor,
} from "@/components/admin/SectionEditorsPart1";
import {
  ThreeRunsEditor,
  RunDetailsEditor,
  FoundationEditor,
  InitiativesEditor,
  RegistrationContentEditor,
  FaqEditor,
  FooterEditor,
} from "@/components/admin/SectionEditorsPart2";
import {
  DashboardOverview,
  EventDatesPanel,
  RegistrationsPanel,
  WebsiteSettingsPanel,
  PermissionsPanel,
  RegistrationData,
} from "@/components/admin/SystemAndEventPanels";

function isSectionKey(key: AdminNavKey): key is SectionId {
  return key in SECTION_META;
}

export default function AdminPage() {
  // ── Auth State ─────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  // ── Navigation & Layout State ──────────────────────────────────────────────
  const [activeNav, setActiveNav] = useState<AdminNavKey>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // ── Existing RTDB Data (Registrations & Event Dates) ───────────────────────
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [eventDates, setEventDates] = useState<EventDatesConfig>(DEFAULT_EVENT_DATES);
  const [isSavingDates, setIsSavingDates] = useState(false);
  const [datesSaveSuccess, setDatesSaveSuccess] = useState(false);
  const [datesSaveError, setDatesSaveError] = useState("");

  // ── Firestore CMS State ────────────────────────────────────────────────────
  const [sectionsMap, setSectionsMap] = useState<
    Record<SectionId, CmsSectionEnvelope<SectionContentMap[SectionId]>>
  >(() => {
    const init = {} as Record<SectionId, CmsSectionEnvelope<SectionContentMap[SectionId]>>;
    (Object.keys(SECTION_META) as SectionId[]).forEach((id) => {
      init[id] = createSeedEnvelope(id, "not-seeded-yet");
    });
    return init;
  });
  const [draftEdits, setDraftEdits] = useState<Partial<SectionContentMap>>({});
  const [firestoreAvailable, setFirestoreAvailable] = useState(true);
  const [permissionError, setPermissionError] = useState<string | undefined>();
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(INITIAL_MEDIA_SEED);
  const [websiteSettings, setWebsiteSettings] =
    useState<WebsiteSettingsData>(DEFAULT_WEBSITE_SETTINGS);
  const [permissionsSettings, setPermissionsSettings] = useState<PermissionsSettingsData>({
    adminEmails: [],
    updatedAt: "",
    updatedBy: "",
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const [isCmsBusy, setIsCmsBusy] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [editorStatusMsg, setEditorStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ── Firebase Auth Listener ─────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setAdminEmail("");
        return;
      }

      const userEmail = (user.email || "").toLowerCase();
      setIsCheckingAccess(true);
      try {
        const perm = await fetchPermissionsSettings(userEmail);
        setPermissionsSettings(perm);

        // Enforce whitelist if adminEmails is explicitly populated
        if (perm.adminEmails.length > 0 && !perm.adminEmails.includes(userEmail)) {
          await signOut(auth);
          setIsAuthenticated(false);
          setAuthError("This account is not in the authorized CMS administrators list.");
          return;
        }
        setAdminEmail(user.email || "");
        setIsAuthenticated(true);
      } finally {
        setIsCheckingAccess(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const refreshCmsSections = useCallback(async () => {
    const res = await fetchAllSectionsAdmin();
    setSectionsMap(res.sections);
    setFirestoreAvailable(res.firestoreAvailable);
    setPermissionError(res.permissionError);
  }, []);

  const refreshMedia = useCallback(async () => {
    const list = await fetchMediaLibrary();
    setMediaAssets(list);
  }, []);

  // ── Load RTDB & Firestore Data When Authenticated ──────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadAll = async () => {
      try {
        const dbRef = ref(db);
        // 1. RTDB Registrations (preserved)
        const regSnapshot = await get(child(dbRef, "registrations"));
        if (regSnapshot.exists()) {
          const data = regSnapshot.val();
          const parsedData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          parsedData.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRegistrations(parsedData);
        } else {
          setRegistrations([]);
        }

        // 2. RTDB Event Dates (preserved)
        const datesSnapshot = await get(child(dbRef, "settings/eventDates"));
        if (datesSnapshot.exists()) {
          const val = datesSnapshot.val();
          setEventDates({
            run1Date: val.run1Date?.trim() || DEFAULT_EVENT_DATES.run1Date,
            run2Date: val.run2Date?.trim() || DEFAULT_EVENT_DATES.run2Date,
            run3Date: val.run3Date?.trim() || DEFAULT_EVENT_DATES.run3Date,
            trilogyDate: val.trilogyDate?.trim() || DEFAULT_EVENT_DATES.trilogyDate,
            updatedAt: val.updatedAt,
          });
        }
      } catch (err) {
        console.error("Error fetching RTDB data:", err);
      } finally {
        setIsLoadingRegistrations(false);
      }

      // 3. Firestore CMS Data
      await refreshCmsSections();
      await refreshMedia();
      const [ws, perms, logs] = await Promise.all([
        fetchWebsiteSettingsAdmin(),
        fetchPermissionsSettings(adminEmail),
        fetchAuditLogs(),
      ]);
      setWebsiteSettings(ws);
      setPermissionsSettings(perms);
      setAuditLogs(logs);
    };

    loadAll();
  }, [isAuthenticated, adminEmail, refreshCmsSections, refreshMedia]);

  // Reset status message when changing active panel
  useEffect(() => {
    setEditorStatusMsg(null);
  }, [activeNav]);

  // ── Auth Handlers ──────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setAuthError("Invalid admin credentials");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  // ── Registration Handlers (Preserved) ──────────────────────────────────────
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? registrations.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} registration(s)?`))
      return;
    setIsLoadingRegistrations(true);
    try {
      const dbRef = ref(db);
      await Promise.all(selectedIds.map((id) => remove(child(dbRef, `registrations/${id}`))));
      setRegistrations((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);
    } catch {
      alert("Failed to delete records.");
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    const headers = [
      "Runner Name",
      "Email",
      "Phone",
      "City",
      "Event",
      "Category",
      "Payment URL",
      "Registered On",
    ];
    const rows = registrations.map((reg) => [
      `"${reg.fullName}"`,
      `"${reg.email}"`,
      `"${reg.phone}"`,
      `"${reg.city}"`,
      `"${reg.runSeries}"`,
      `"${reg.category}"`,
      `"${reg.paymentScreenshotUrl || ""}"`,
      `"${new Date(reg.createdAt).toISOString()}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Jawai_Runners_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    if (registrations.length === 0) return;
    const data = registrations.map((reg) => ({
      "Runner Name": reg.fullName,
      Email: reg.email,
      Phone: reg.phone,
      City: reg.city,
      Event: reg.runSeries,
      Category: reg.category,
      "Payment URL": reg.paymentScreenshotUrl || "",
      "Registered On": new Date(reg.createdAt).toLocaleString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(
      workbook,
      `Jawai_Runners_Export_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // ── Event Dates Handlers (Preserved) ───────────────────────────────────────
  const handleSaveDates = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDates(true);
    setDatesSaveSuccess(false);
    setDatesSaveError("");
    try {
      await saveEventDatesToDb(eventDates);
      setDatesSaveSuccess(true);
      setEventDates((prev) => ({ ...prev, updatedAt: new Date().toISOString() }));
      setTimeout(() => setDatesSaveSuccess(false), 4500);
    } catch {
      setDatesSaveError("Failed to save changes to database. Please check connection.");
    } finally {
      setIsSavingDates(false);
    }
  };

  const handleResetToRevealingSoon = () => {
    setEventDates({ ...DEFAULT_EVENT_DATES });
  };

  // ── Section Publishing Workflow Handlers ───────────────────────────────────
  const getWorkingDraft = <K extends SectionId>(id: K): SectionContentMap[K] => {
    return (draftEdits[id] ?? sectionsMap[id].draft) as SectionContentMap[K];
  };

  const setWorkingDraft = <K extends SectionId>(id: K, next: SectionContentMap[K]) => {
    setDraftEdits((prev) => ({ ...prev, [id]: next }));
  };

  const clearDirty = (id: SectionId) => {
    setDraftEdits((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSaveDraftSection = async <K extends SectionId>(id: K) => {
    setIsCmsBusy(true);
    setEditorStatusMsg(null);
    try {
      const updated = await saveSectionDraft(id, getWorkingDraft(id), {
        actorEmail: adminEmail,
        existingEnvelope: sectionsMap[id] as CmsSectionEnvelope<SectionContentMap[K]>,
      });
      setSectionsMap((prev) => ({ ...prev, [id]: updated }));
      clearDirty(id);
      setAuditLogs(await fetchAuditLogs());
      setEditorStatusMsg({
        type: "success",
        text: "Draft saved to Firestore. Click Publish when ready to go live.",
      });
    } catch (err: unknown) {
      setEditorStatusMsg({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Failed saving draft. Ensure Firestore rules are deployed.",
      });
    } finally {
      setIsCmsBusy(false);
    }
  };

  const handlePreviewSection = async <K extends SectionId>(id: K) => {
    await handleSaveDraftSection(id);
    window.open(getPreviewUrl(id), "_blank");
  };

  const handlePublishSection = async <K extends SectionId>(id: K) => {
    setIsCmsBusy(true);
    setEditorStatusMsg(null);
    try {
      const updated = await publishSection(id, getWorkingDraft(id), {
        actorEmail: adminEmail,
        existingEnvelope: sectionsMap[id] as CmsSectionEnvelope<SectionContentMap[K]>,
      });
      setSectionsMap((prev) => ({ ...prev, [id]: updated }));
      clearDirty(id);
      setAuditLogs(await fetchAuditLogs());
      setEditorStatusMsg({
        type: "success",
        text: "Published live! Public visitors will now see these updates immediately.",
      });
    } catch (err: unknown) {
      setEditorStatusMsg({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Failed to publish. Ensure Firestore rules allow admin writes.",
      });
    } finally {
      setIsCmsBusy(false);
    }
  };

  const handleUnpublishSection = async <K extends SectionId>(id: K) => {
    setIsCmsBusy(true);
    setEditorStatusMsg(null);
    try {
      await unpublishSection(id, adminEmail);
      setSectionsMap((prev) => ({
        ...prev,
        [id]: { ...prev[id], isPublished: false, updatedAt: new Date().toISOString() },
      }));
      setAuditLogs(await fetchAuditLogs());
      setEditorStatusMsg({
        type: "success",
        text: "Section unpublished and hidden from public website.",
      });
    } catch (err: unknown) {
      setEditorStatusMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to unpublish section.",
      });
    } finally {
      setIsCmsBusy(false);
    }
  };

  const handleToggleVisibility = async <K extends SectionId>(id: K, visible: boolean) => {
    setSectionsMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], isVisible: visible },
    }));
    try {
      await saveSectionDraft(id, getWorkingDraft(id), {
        isVisible: visible,
        actorEmail: adminEmail,
        existingEnvelope: {
          ...(sectionsMap[id] as CmsSectionEnvelope<SectionContentMap[K]>),
          isVisible: visible,
        },
      });
    } catch {
      // handled visually
    }
  };

  const handleResetSectionDefault = async <K extends SectionId>(id: K) => {
    const seed = INITIAL_SECTION_DATA[id];
    setWorkingDraft(id, seed);
    setEditorStatusMsg({
      type: "success",
      text: "Default seed content loaded into editor draft. Save Draft or Publish to persist.",
    });
  };

  // ── Seed All CMS Content ───────────────────────────────────────────────────
  const handleSeedAllCms = async (overwrite: boolean) => {
    setIsSeeding(true);
    try {
      const { seededSections, seededMedia } = await seedAllCmsToFirestore(adminEmail, overwrite);
      await refreshCmsSections();
      await refreshMedia();
      setAuditLogs(await fetchAuditLogs());
      alert(
        `Firestore seeding complete: ${seededSections} section(s) and ${seededMedia} media asset(s) seeded.`
      );
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? `Seeding failed: ${err.message}. Check Admin & Permissions -> Security Rules.`
          : "Seeding failed."
      );
    } finally {
      setIsSeeding(false);
    }
  };

  const handleExportBackupJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      websiteSettings,
      eventDates,
      sections: sectionsMap,
      media: mediaAssets,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Jawai_Runners_CMS_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── Login Gate ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-sm border border-[#304B38]/15 w-full max-w-sm text-center"
        >
          <div className="w-12 h-12 bg-[#294D3A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-[#294D3A]" />
          </div>
          <h1 className="text-xl font-serif font-bold text-[#171717] mb-1">Jawai Runners CMS</h1>
          <p className="text-sm text-[#595959] mb-6">
            Sign in with your administrator Firebase account.
          </p>

          {authError && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-50 text-xs font-bold text-red-600">
              {authError}
            </div>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            required
            className="w-full text-center mb-4 bg-transparent border-b border-[#294D3A]/25 py-2.5 text-[#171717] outline-none focus:border-[#294D3A]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full text-center tracking-[0.2em] mb-6 bg-transparent border-b border-[#294D3A]/25 py-2.5 text-[#171717] outline-none focus:border-[#294D3A]"
          />
          <button
            type="submit"
            disabled={isCheckingAccess}
            className="w-full h-12 bg-[#294D3A] text-white font-bold tracking-widest text-xs rounded-xl hover:bg-[#1C3628] transition-colors disabled:opacity-50"
          >
            {isCheckingAccess ? "VERIFYING..." : "ENTER CMS STUDIO"}
          </button>

          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[#595959] hover:text-[#171717]"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Public Site
          </Link>
        </form>
      </main>
    );
  }

  // ── Render Active Section Editor ───────────────────────────────────────────
  const renderSectionEditor = (id: SectionId) => {
    const commonMedia = {
      mediaAssets,
      onMediaUploaded: (asset: MediaAsset) => setMediaAssets((prev) => [asset, ...prev]),
      actorEmail: adminEmail,
    };

    switch (id) {
      case "hero":
        return (
          <HeroEditor
            value={getWorkingDraft("hero")}
            onChange={(next) => setWorkingDraft("hero", next)}
            {...commonMedia}
          />
        );
      case "conservationMission":
        return (
          <ConservationMissionEditor
            value={getWorkingDraft("conservationMission")}
            onChange={(next) => setWorkingDraft("conservationMission", next)}
            {...commonMedia}
          />
        );
      case "firstInitiative":
        return (
          <FirstInitiativeEditor
            value={getWorkingDraft("firstInitiative")}
            onChange={(next) => setWorkingDraft("firstInitiative", next)}
            {...commonMedia}
          />
        );
      case "movement":
        return (
          <MovementEditor
            value={getWorkingDraft("movement")}
            onChange={(next) => setWorkingDraft("movement", next)}
            {...commonMedia}
          />
        );
      case "threeRuns":
        return (
          <ThreeRunsEditor
            value={getWorkingDraft("threeRuns")}
            onChange={(next) => setWorkingDraft("threeRuns", next)}
            eventDates={eventDates}
            {...commonMedia}
          />
        );
      case "runDetails":
        return (
          <RunDetailsEditor
            value={getWorkingDraft("runDetails")}
            onChange={(next) => setWorkingDraft("runDetails", next)}
            {...commonMedia}
          />
        );
      case "foundation":
        return (
          <FoundationEditor
            value={getWorkingDraft("foundation")}
            onChange={(next) => setWorkingDraft("foundation", next)}
            {...commonMedia}
          />
        );
      case "initiatives":
        return (
          <InitiativesEditor
            value={getWorkingDraft("initiatives")}
            onChange={(next) => setWorkingDraft("initiatives", next)}
            {...commonMedia}
          />
        );
      case "registrationContent":
        return (
          <RegistrationContentEditor
            value={getWorkingDraft("registrationContent")}
            onChange={(next) => setWorkingDraft("registrationContent", next)}
            {...commonMedia}
          />
        );
      case "faq":
        return (
          <FaqEditor
            value={getWorkingDraft("faq")}
            onChange={(next) => setWorkingDraft("faq", next)}
            {...commonMedia}
          />
        );
      case "footer":
        return (
          <FooterEditor
            value={getWorkingDraft("footer")}
            onChange={(next) => setWorkingDraft("footer", next)}
            {...commonMedia}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#171717] flex">
      {/* Left Persistent Sidebar */}
      <AdminSidebar
        activeKey={activeNav}
        onSelect={setActiveNav}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        registrationsCount={registrations.length}
        sectionsMap={sectionsMap}
        adminEmail={adminEmail}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Utility Header */}
        <header className="sticky top-0 z-20 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#304B38]/10 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#304B38]/15 text-[#1F3026]"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#8C6A43] uppercase block leading-none">
                JAWAI RUNNERS CMS
              </span>
              <span className="text-sm font-bold text-[#171717]">
                {isSectionKey(activeNav)
                  ? SECTION_META[activeNav].label
                  : activeNav === "dashboard"
                  ? "Overview Dashboard"
                  : activeNav === "media"
                  ? "Media Library"
                  : activeNav === "instagramGallery"
                  ? "Instagram & Video Gallery"
                  : activeNav === "eventDates"
                  ? "Event Dates Settings"
                  : activeNav === "registrations"
                  ? "Registrations Management"
                  : activeNav === "websiteSettings"
                  ? "Website Settings"
                  : "Admin & Permissions"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10.5px] font-bold uppercase ${
                firestoreAvailable
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  firestoreAvailable ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {firestoreAvailable ? "Firestore Connected" : "Rules Setup Pending"}
            </span>
          </div>
        </header>

        {/* Scrollable Workspace Body */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1320px] w-full mx-auto">
          {activeNav === "dashboard" && (
            <DashboardOverview
              sectionsMap={sectionsMap}
              mediaCount={mediaAssets.length}
              registrationsCount={registrations.length}
              eventDates={eventDates}
              auditLogs={auditLogs}
              firestoreAvailable={firestoreAvailable}
              permissionError={permissionError}
              isSeeding={isSeeding}
              onSeedAll={handleSeedAllCms}
              onNavigate={setActiveNav}
            />
          )}

          {isSectionKey(activeNav) && (
            <CmsEditorShell
              envelope={sectionsMap[activeNav]}
              isDirty={Boolean(draftEdits[activeNav])}
              isBusy={isCmsBusy}
              statusMessage={editorStatusMsg}
              onToggleVisibility={(vis) => handleToggleVisibility(activeNav, vis)}
              onSaveDraft={() => handleSaveDraftSection(activeNav)}
              onPreview={() => handlePreviewSection(activeNav)}
              onPublish={() => handlePublishSection(activeNav)}
              onUnpublish={() => handleUnpublishSection(activeNav)}
              onResetDefaults={() => handleResetSectionDefault(activeNav)}
            >
              {renderSectionEditor(activeNav)}
            </CmsEditorShell>
          )}

          {activeNav === "media" && (
            <MediaLibraryPanel
              assets={mediaAssets}
              onRefreshAssets={refreshMedia}
              onRefreshSections={refreshCmsSections}
              actorEmail={adminEmail}
            />
          )}

          {activeNav === "instagramGallery" && (
            <InstagramGalleryPanel
              initiativeContent={getWorkingDraft("firstInitiative")}
              mediaAssets={mediaAssets}
              onMediaUploaded={(asset) => setMediaAssets((prev) => [asset, ...prev])}
              actorEmail={adminEmail}
              onSaveDraft={async (next) => {
                setWorkingDraft("firstInitiative", next);
                const updated = await saveSectionDraft("firstInitiative", next, {
                  actorEmail: adminEmail,
                  existingEnvelope: sectionsMap.firstInitiative as CmsSectionEnvelope<
                    SectionContentMap["firstInitiative"]
                  >,
                });
                setSectionsMap((prev) => ({ ...prev, firstInitiative: updated }));
                clearDirty("firstInitiative");
              }}
              onPublish={async (next) => {
                setWorkingDraft("firstInitiative", next);
                const updated = await publishSection("firstInitiative", next, {
                  actorEmail: adminEmail,
                  existingEnvelope: sectionsMap.firstInitiative as CmsSectionEnvelope<
                    SectionContentMap["firstInitiative"]
                  >,
                });
                setSectionsMap((prev) => ({ ...prev, firstInitiative: updated }));
                clearDirty("firstInitiative");
              }}
            />
          )}

          {activeNav === "eventDates" && (
            <EventDatesPanel
              eventDates={eventDates}
              setEventDates={setEventDates}
              isSavingDates={isSavingDates}
              datesSaveSuccess={datesSaveSuccess}
              datesSaveError={datesSaveError}
              onSaveDates={handleSaveDates}
              onResetToRevealingSoon={handleResetToRevealingSoon}
            />
          )}

          {activeNav === "registrations" && (
            <RegistrationsPanel
              registrations={registrations}
              isLoading={isLoadingRegistrations}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              onDeleteSelected={handleDeleteSelected}
              onExportCSV={handleExportCSV}
              onExportExcel={handleExportExcel}
            />
          )}

          {activeNav === "websiteSettings" && (
            <WebsiteSettingsPanel
              settings={websiteSettings}
              mediaAssets={mediaAssets}
              onMediaUploaded={(asset) => setMediaAssets((prev) => [asset, ...prev])}
              actorEmail={adminEmail}
              onSave={async (next) => {
                const saved = await saveWebsiteSettings(next, adminEmail);
                setWebsiteSettings(saved);
                setAuditLogs(await fetchAuditLogs());
              }}
            />
          )}

          {activeNav === "permissions" && (
            <PermissionsPanel
              currentEmail={adminEmail}
              permissions={permissionsSettings}
              isSeeding={isSeeding}
              onSeedAll={handleSeedAllCms}
              onExportBackupJson={handleExportBackupJson}
              onSavePermissions={async (emails) => {
                const saved = await savePermissionsSettings(emails, adminEmail);
                setPermissionsSettings(saved);
                setAuditLogs(await fetchAuditLogs());
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
