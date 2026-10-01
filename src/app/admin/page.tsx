"use client";

import { useEffect, useState } from "react";
import { db, ref, get, child, auth, remove } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { ChevronLeft, Download, Users, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";

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
      // Delete all selected
      const deletePromises = selectedIds.map(id => remove(child(dbRef, `registrations/${id}`)));
      await Promise.all(deletePromises);
      
      // Update local state
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
    
    // Define headers
    const headers = ['Runner Name', 'Email', 'Phone', 'City', 'Event', 'Category', 'Payment URL', 'Registered On'];
    
    // Create rows
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
    
    // Combine
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\\n');
    
    // Download
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
    
    // Create rows with objects for xlsx
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
    
    // Create a new workbook and a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    
    // Generate buffer and download
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

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchRegistrations = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "registrations"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const parsedData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          }));
          
          // Sort by newest first
          parsedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          setRegistrations(parsedData);
        } else {
          setRegistrations([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [isAuthenticated]);

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
      <nav className="w-full bg-white border-b border-[#171717]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
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

      <div className="max-w-[1200px] mx-auto px-6 mt-12">
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
                  <th className="px-6 py-4">Event & Distance</th>
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
    </main>
  );
}
