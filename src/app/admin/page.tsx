"use client";

import { useEffect, useState } from "react";
import { db, ref, get, child, auth, remove } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { 
  ChevronLeft, 
  Download, 
  Users, 
  Trash2, 
  Calendar, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Clock,
  Sparkles
} from "lucide-react";
import * as XLSX from "xlsx";
import { 
  EventDatesConfig, 
  DEFAULT_EVENT_DATES, 
  saveEventDatesToDb 
} from "@/lib/event-dates";

type RegistrationData = {
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

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Active admin section tab
  const [activeTab, setActiveTab] = useState<"dates" | "registrations">("dates");

  // Event Dates Form State
  const [eventDates, setEventDates] = useState<EventDatesConfig>(DEFAULT_EVENT_DATES);
  const [isSavingDates, setIsSavingDates] = useState(false);
  const [datesSaveSuccess, setDatesSaveSuccess] = useState(false);
  const [datesSaveError, setDatesSaveError] = useState("");

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(registrations.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} registration(s)?`)) return;
    
    setIsLoading(true);
    try {
      const dbRef = ref(db);
      const deletePromises = selectedIds.map(id => remove(child(dbRef, `registrations/${id}`)));
      await Promise.all(deletePromises);
      
      setRegistrations(prev => prev.filter(r => !selectedIds.includes(r.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete records.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    
    const headers = ['Runner Name', 'Email', 'Phone', 'City', 'Event', 'Category', 'Payment URL', 'Registered On'];
    const rows = registrations.map(reg => [
      `"${reg.fullName}"`,
      `"${reg.email}"`,
      `"${reg.phone}"`,
      `"${reg.city}"`,
      `"${reg.runSeries}"`,
      `"${reg.category}"`,
      `"${reg.paymentScreenshotUrl || ''}"`,
      `"${new Date(reg.createdAt).toISOString()}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Jawai_Runners_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    if (registrations.length === 0) return;
    
    const data = registrations.map(reg => ({
      "Runner Name": reg.fullName,
      "Email": reg.email,
      "Phone": reg.phone,
      "City": reg.city,
      "Event": reg.runSeries,
      "Category": reg.category,
      "Payment URL": reg.paymentScreenshotUrl || '',
      "Registered On": new Date(reg.createdAt).toLocaleString()
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `Jawai_Runners_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error(error);
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

  // Fetch registrations & event dates on auth
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const dbRef = ref(db);
        
        // 1. Fetch Registrations
        const regSnapshot = await get(child(dbRef, "registrations"));
        if (regSnapshot.exists()) {
          const data = regSnapshot.val();
          const parsedData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          }));
          parsedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setRegistrations(parsedData);
        } else {
          setRegistrations([]);
        }

        // 2. Fetch Event Dates
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
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleSaveDates = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDates(true);
    setDatesSaveSuccess(false);
    setDatesSaveError("");
    try {
      await saveEventDatesToDb(eventDates);
      setDatesSaveSuccess(true);
      setEventDates(prev => ({ ...prev, updatedAt: new Date().toISOString() }));
      setTimeout(() => setDatesSaveSuccess(false), 4500);
    } catch (err: any) {
      console.error("Error saving event dates:", err);
      setDatesSaveError("Failed to save changes to database. Please check connection.");
    } finally {
      setIsSavingDates(false);
    }
  };

  const handleResetToRevealingSoon = () => {
    setEventDates({ ...DEFAULT_EVENT_DATES });
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-[#171717]/10 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-[#294D3A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-[#294D3A]" />
          </div>
          <h1 className="text-xl font-serif font-bold text-[#171717] mb-2">Admin Access</h1>
          <p className="text-sm text-[#595959] mb-6">Sign in with your administrator account.</p>
          
          {authError && (
            <div className="mb-4 text-xs font-bold text-red-500 uppercase tracking-widest">{authError}</div>
          )}

          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            className="w-full text-center mb-4 bg-transparent border-b border-[#294D3A]/25 py-2.5 text-[#171717] outline-none focus:border-[#294D3A]"
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full text-center tracking-[0.2em] mb-6 bg-transparent border-b border-[#294D3A]/25 py-2.5 text-[#171717] outline-none focus:border-[#294D3A]"
          />
          <button type="submit" className="w-full h-12 bg-[#294D3A] text-white font-bold tracking-widest text-xs rounded-xl hover:bg-[#1C3628] transition-colors">
            ENTER
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#171717] pb-24">
      {/* Admin Navbar */}
      <nav className="w-full bg-white border-b border-[#171717]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#595959] hover:text-[#171717] transition-colors font-medium text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <div className="h-6 w-px bg-[#171717]/10" />
          <h1 className="font-bold text-[14px] tracking-[0.1em] text-[#294D3A] uppercase">
            Jawai Runners Admin
          </h1>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs font-bold tracking-[0.1em] text-[#595959] hover:text-[#171717] uppercase transition-colors"
        >
          Sign Out
        </button>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 mt-10">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-[#171717]/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("dates")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
              activeTab === "dates"
                ? "bg-[#294D3A] text-white shadow-sm"
                : "bg-white text-[#595959] border border-[#171717]/10 hover:text-[#171717]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Event Dates Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("registrations")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
              activeTab === "registrations"
                ? "bg-[#294D3A] text-white shadow-sm"
                : "bg-white text-[#595959] border border-[#171717]/10 hover:text-[#171717]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registrations ({registrations.length})</span>
          </button>
        </div>

        {/* TAB 1: EVENT DATES SETTINGS */}
        {activeTab === "dates" && (
          <div className="bg-white border border-[#171717]/10 rounded-[24px] p-6 sm:p-10 shadow-sm mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#171717]/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C69A3A]/10 text-[#8C6A43] text-[11px] font-bold tracking-wider uppercase mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C69A3A]" />
                  Live Event Schedule Control
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#171717]">
                  Event Dates Management
                </h2>
                <p className="text-sm text-[#595959] mt-1 max-w-2xl">
                  Easily update the live run dates across the entire website (Run Selector, Detail Panel, Registration Form, Footer, and FAQ) without writing any code.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetToRevealingSoon}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#171717]/20 hover:bg-[#FAF8F5] text-xs font-bold tracking-wider uppercase text-[#171717] transition-colors self-start md:self-auto shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to &quot;REVEALING SOON&quot;
              </button>
            </div>

            {/* Notification alert on save */}
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

            <form onSubmit={handleSaveDates} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Run 1 Date */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#171717]/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold tracking-wider text-[#C69A3A] uppercase">
                        RUN 01 · AWAKEN
                      </span>
                      <span className="text-[10px] font-mono text-[#595959] uppercase">The Dawn Run</span>
                    </div>
                    <label className="block text-sm font-bold text-[#171717] mb-1">
                      Run 1 Event Date
                    </label>
                    <p className="text-xs text-[#595959] mb-3">
                      Shown on Run 1 card, detail panel &amp; registration dropdown.
                    </p>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={eventDates.run1Date}
                      onChange={(e) => setEventDates({ ...eventDates, run1Date: e.target.value })}
                      placeholder="e.g. REVEALING SOON or 15 MARCH 2027"
                      className="w-full h-12 bg-white border border-[#171717]/15 rounded-xl px-4 text-sm font-bold text-[#171717] focus:outline-none focus:border-[#294D3A] focus:ring-1 focus:ring-[#294D3A] transition-all"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setEventDates({ ...eventDates, run1Date: "REVEALING SOON" })}
                        className="text-[10px] font-bold text-[#8C6A43] hover:underline uppercase"
                      >
                        + Set &quot;REVEALING SOON&quot;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Run 2 Date */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#171717]/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold tracking-wider text-[#4A7C59] uppercase">
                        RUN 02 · RESTORE
                      </span>
                      <span className="text-[10px] font-mono text-[#595959] uppercase">The Rewilding Run</span>
                    </div>
                    <label className="block text-sm font-bold text-[#171717] mb-1">
                      Run 2 Event Date
                    </label>
                    <p className="text-xs text-[#595959] mb-3">
                      Shown on Run 2 card, detail panel &amp; registration dropdown.
                    </p>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={eventDates.run2Date}
                      onChange={(e) => setEventDates({ ...eventDates, run2Date: e.target.value })}
                      placeholder="e.g. REVEALING SOON or 28 MARCH 2027"
                      className="w-full h-12 bg-white border border-[#171717]/15 rounded-xl px-4 text-sm font-bold text-[#171717] focus:outline-none focus:border-[#294D3A] focus:ring-1 focus:ring-[#294D3A] transition-all"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setEventDates({ ...eventDates, run2Date: "REVEALING SOON" })}
                        className="text-[10px] font-bold text-[#8C6A43] hover:underline uppercase"
                      >
                        + Set &quot;REVEALING SOON&quot;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Run 3 Date */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#171717]/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold tracking-wider text-[#8C6A43] uppercase">
                        RUN 03 · CELEBRATE
                      </span>
                      <span className="text-[10px] font-mono text-[#595959] uppercase">The Triumph Run</span>
                    </div>
                    <label className="block text-sm font-bold text-[#171717] mb-1">
                      Run 3 Event Date
                    </label>
                    <p className="text-xs text-[#595959] mb-3">
                      Shown on Run 3 card, detail panel &amp; registration dropdown.
                    </p>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={eventDates.run3Date}
                      onChange={(e) => setEventDates({ ...eventDates, run3Date: e.target.value })}
                      placeholder="e.g. REVEALING SOON or 12 APRIL 2027"
                      className="w-full h-12 bg-white border border-[#171717]/15 rounded-xl px-4 text-sm font-bold text-[#171717] focus:outline-none focus:border-[#294D3A] focus:ring-1 focus:ring-[#294D3A] transition-all"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setEventDates({ ...eventDates, run3Date: "REVEALING SOON" })}
                        className="text-[10px] font-bold text-[#8C6A43] hover:underline uppercase"
                      >
                        + Set &quot;REVEALING SOON&quot;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trilogy Pass Summary Date */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#171717]/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold tracking-wider text-[#294D3A] uppercase">
                        TRILOGY PASS
                      </span>
                      <span className="text-[10px] font-mono text-[#595959] uppercase">All 3 Runs</span>
                    </div>
                    <label className="block text-sm font-bold text-[#171717] mb-1">
                      Trilogy Pass Summary Date
                    </label>
                    <p className="text-xs text-[#595959] mb-3">
                      Shown on Trilogy Pass registration option.
                    </p>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={eventDates.trilogyDate}
                      onChange={(e) => setEventDates({ ...eventDates, trilogyDate: e.target.value })}
                      placeholder="e.g. REVEALING SOON"
                      className="w-full h-12 bg-white border border-[#171717]/15 rounded-xl px-4 text-sm font-bold text-[#171717] focus:outline-none focus:border-[#294D3A] focus:ring-1 focus:ring-[#294D3A] transition-all"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setEventDates({ ...eventDates, trilogyDate: "REVEALING SOON" })}
                        className="text-[10px] font-bold text-[#8C6A43] hover:underline uppercase"
                      >
                        + Set &quot;REVEALING SOON&quot;
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit & Status Row */}
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
        )}

        {/* TAB 2: REGISTRATIONS TABLE */}
        {activeTab === "registrations" && (
          <div>
            {/* Stats Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-serif text-[#171717] mb-2">Registrations</h2>
                <p className="text-[#595959] text-sm">
                  Overview of all users who have registered for the Jawai Conservation Series.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {selectedIds.length > 0 && (
                  <button 
                    onClick={handleDeleteSelected}
                    className="w-full sm:w-auto px-6 h-12 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs tracking-[0.1em] uppercase transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedIds.length})
                  </button>
                )}
                
                <button 
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto px-6 h-12 bg-[#294D3A] hover:bg-[#1C3628] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs tracking-[0.1em] uppercase transition-colors"
                >
                  <Download className="w-4 h-4 text-[#D7B66A]" />
                  Export CSV
                </button>
                
                <button 
                  onClick={handleExportExcel}
                  className="w-full sm:w-auto px-6 h-12 bg-[#8C6A43] hover:bg-[#705536] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs tracking-[0.1em] uppercase transition-colors"
                >
                  <Download className="w-4 h-4 text-white/80" />
                  Export Excel
                </button>

                <div className="flex items-center gap-4 bg-white border border-[#171717]/10 rounded-2xl p-4 shadow-sm min-w-[200px]">
                  <div className="w-12 h-12 bg-[#294D3A]/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#294D3A]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-[#8C6A43] uppercase mb-0.5">
                      Total Entries
                    </div>
                    <div className="text-3xl font-bold text-[#171717]">
                      {isLoading ? "-" : registrations.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-[#171717]/10 rounded-[20px] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#171717]">
                  <thead className="bg-[#FAF8F5] border-b border-[#171717]/10 text-[10px] font-bold tracking-[0.1em] text-[#595959] uppercase">
                    <tr>
                      <th className="px-6 py-4 w-12">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-[#171717]/20 text-[#294D3A] focus:ring-[#294D3A]"
                          checked={registrations.length > 0 && selectedIds.length === registrations.length}
                          onChange={handleSelectAll}
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
                          <div className="flex flex-col items-center gap-3">
                            <span className="w-6 h-6 border-2 border-[#171717]/20 border-t-[#294D3A] rounded-full animate-spin" />
                            <span className="text-xs tracking-widest uppercase">Loading Data...</span>
                          </div>
                        </td>
                      </tr>
                    ) : registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-[#595959]">
                          No registrations found in the database.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg) => (
                        <tr key={reg.id} className={`hover:bg-[#FAF8F5]/50 transition-colors ${selectedIds.includes(reg.id) ? 'bg-[#294D3A]/5' : ''}`}>
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-[#171717]/20 text-[#294D3A] focus:ring-[#294D3A]"
                              checked={selectedIds.includes(reg.id)}
                              onChange={() => handleSelectOne(reg.id)}
                            />
                          </td>
                          <td className="px-6 py-4 font-medium whitespace-nowrap">
                            {reg.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span>{reg.email}</span>
                              <span className="text-xs text-[#595959] mt-0.5">{reg.phone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[#595959]">
                            {reg.city}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#294D3A]">{reg.runSeries}</span>
                              <span className="text-xs text-[#8C6A43] font-bold uppercase mt-0.5">{reg.category}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-[12px]">
                            {reg.paymentScreenshotUrl ? (
                              <a href={reg.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer" className="text-[#294D3A] underline font-medium hover:text-[#171717]">View SS</a>
                            ) : (
                              <span className="text-[#595959]/50">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-[#595959]">
                            {new Date(reg.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
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
        )}

      </div>
    </main>
  );
}
