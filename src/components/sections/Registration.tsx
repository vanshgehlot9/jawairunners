"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { Check, Sparkles, Droplets, TreePine, ShieldCheck, Download, Award, ArrowRight } from "lucide-react";
import { db, ref, push, set } from "@/lib/firebase";
import { useReactToPrint } from "react-to-print";
import { useEventDates, EventDatesConfig } from "@/lib/event-dates";
import { useCmsSection } from "@/lib/cms/use-cms";
import type { ThreeRunSummaryItem } from "@/lib/cms/types";

type ParticipantData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  emergencyContact: string;
  hasPledgedZeroPlastic: boolean;
  paymentScreenshotUrl?: string;
};

function getRunSeriesOptions(
  dates: EventDatesConfig,
  runs: ThreeRunSummaryItem[],
  trilogy: { title: string; subtitle: string; tag: string }
) {
  const dateMap: Record<string, string> = {
    "run-1": dates.run1Date,
    "run-2": dates.run2Date,
    "run-3": dates.run3Date,
  };
  const series = runs
    .filter((r) => r.visible !== false)
    .map((r) => ({
      id: r.id,
      name: `${r.number.replace("0", "")} — ${r.name}`,
      date: dateMap[r.id] || "REVEALING SOON",
      subtitle: r.subtitle,
      tag: r.tag,
    }));

  return [
    ...series,
    {
      id: "trilogy",
      name: trilogy.title,
      date: dates.trilogyDate,
      subtitle: trilogy.subtitle,
      tag: trilogy.tag,
    },
  ];
}

const InputField = ({ label, value, onChange, placeholder, error, type = "text", onFocus }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="flex flex-col relative w-full mb-6">
      <label className={`text-[10px] font-bold tracking-[0.15em] uppercase transition-colors duration-200 ${isFocused ? 'text-[#294D3A]' : 'text-[#171A18]/50'}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true);
          if (onFocus) onFocus();
        }}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent border-b border-[#294D3A]/25 py-2.5 text-[15px] md:text-[17px] text-[#171A18] placeholder:text-[#171A18]/30 outline-none transition-all duration-200 focus:border-[#294D3A] focus:border-b-[2px]"
      />
      {error && (
        <span className="absolute -bottom-4 left-0 text-[#8C6A43] text-[10px] font-semibold tracking-wide">{error}</span>
      )}
    </div>
  );
};

export function Registration() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRunSeries, setSelectedRunSeries] = useState<string>("run-1");
  const [selectedCategory, setSelectedCategory] = useState<string>("21k");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [participant, setParticipant] = useState<ParticipantData>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    emergencyContact: "",
    hasPledgedZeroPlastic: true
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ParticipantData, string>>>({});
  
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Jawai_Runners_Eco_Pass",
  });

  // Scene parallax controls
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isFormInView = useInView(containerRef, { margin: "-20% 0px -20% 0px" });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof ParticipantData, string>> = {};
    if (!participant.fullName.trim()) newErrors.fullName = "Please enter your full name.";
    if (!participant.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(participant.email)) newErrors.email = "Enter a valid email.";
    if (!participant.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!participant.city.trim()) newErrors.city = "City is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext1 = () => {
    if (validateStep1()) setStep(2);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      let uploadedUrl = "";
      if (paymentFile) {
        const formData = new FormData();
        formData.append("file", paymentFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          uploadedUrl = data.url;
        }
      }

      const finalParticipantData = {
        ...participant,
        paymentScreenshotUrl: uploadedUrl,
      };

      const registrationsRef = ref(db, 'registrations');
      const newRegistrationRef = push(registrationsRef);
      await set(newRegistrationRef, {
        ...finalParticipantData,
        runSeries: selectedRunSeries,
        category: selectedCategory,
        createdAt: new Date().toISOString()
      });
      // Trigger email sending
      fetch('/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...finalParticipantData,
          runSeries: selectedRunSeries,
          category: selectedCategory,
        }),
      }).catch(err => console.error("Email send failed:", err));

      setStep(5);
    } catch (error) {
      console.error("Error saving registration:", error);
      alert("There was an error submitting your registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventDates = useEventDates();
  const { content, isVisible } = useCmsSection("registrationContent");
  const { content: threeRuns } = useCmsSection("threeRuns");

  const runSeriesOptions = useMemo(
    () =>
      getRunSeriesOptions(eventDates, threeRuns.runs, {
        title: content.trilogyTitle,
        subtitle: content.trilogySubtitle,
        tag: content.trilogyTag,
      }),
    [eventDates, threeRuns.runs, content.trilogyTitle, content.trilogySubtitle, content.trilogyTag]
  );
  const selectedRunData = runSeriesOptions.find((r) => r.id === selectedRunSeries);
  const selectedCatData = content.categories.find((c) => c.id === selectedCategory);

  if (!isVisible) return null;

  // Dynamic progress value
  let progress = 0.2;
  if (step === 2) progress = 0.4;
  if (step === 3) progress = 0.6;
  if (step === 4) progress = 0.8;
  if (step === 5) progress = 1.0;

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full bg-[#18372B] relative flex items-center py-16 lg:py-24 min-h-screen border-t border-[#F5F0E6]/10 overflow-hidden" 
      id="registration"
    >
      {/* Background Topo Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C69A3A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center relative z-10">
        
        {/* LEFT SIDE - CONSERVATION PROMISE & RUN CALLOUT */}
        <div className="w-full lg:w-[42%] flex flex-col justify-between z-10">
          <div>

            <h2 className="text-[44px] sm:text-[60px] lg:text-[76px] font-medium leading-[0.92] text-white tracking-tight drop-shadow-md uppercase mb-6">
              {content.heading} <br />
              <span className="text-[#C69A3A] italic font-serif">{content.highlightedHeading}</span>
            </h2>

            <p className="text-[16px] md:text-[18px] text-white/80 font-light leading-relaxed mb-8 max-w-[500px]">
              {content.description}
            </p>

            {/* 3 Impact Guarantees */}
            <div className="space-y-4 mb-8">
              {content.guarantees.map((g) => {
                const Icon =
                  g.iconType === "tree"
                    ? TreePine
                    : g.iconType === "droplet"
                    ? Droplets
                    : ShieldCheck;
                return (
                  <div
                    key={g.id}
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <Icon className="w-5 h-5 text-[#C69A3A] flex-shrink-0" />
                    <span className="text-[13px] text-white/90 font-medium">
                      <strong>{g.title}</strong> {g.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-white/15 text-[11px] font-mono tracking-wider text-white/50">
            {content.coordinates}
          </div>
        </div>

        {/* RIGHT SIDE - INTERACTIVE REGISTRATION PANEL */}
        <div id="registration-form" className="w-full lg:w-[58%] flex items-center justify-center">
          <div className="w-full max-w-[620px] bg-[#FAF8F5] rounded-[24px] border border-white/30 shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col relative min-h-[580px]">
            
            {/* Progress Header */}
            {step < 5 && (
              <div className="mb-8 pb-6 border-b border-[#171717]/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-[0.18em] text-[#8C6A43] uppercase">
                    STEP 0{step} OF 04
                  </span>
                  <span className="text-[11px] font-bold tracking-wider text-[#294D3A] uppercase">
                    {step === 1 && "PARTICIPANT DETAILS"}
                    {step === 2 && "SELECT RUN & DISTANCE"}
                    {step === 3 && "DONATION & PAYMENT"}
                    {step === 4 && "ECO COMMITMENT & CONFIRM"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#171717]/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#294D3A]"
                    initial={{ width: "20%" }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: PARTICIPANT DETAILS */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex-1">
                      <InputField
                        label="FULL NAME"
                        value={participant.fullName}
                        onChange={(e: any) => setParticipant({ ...participant, fullName: e.target.value })}
                        placeholder="e.g. John Doe"
                        error={errors.fullName}
                      />
                      <InputField
                        label="EMAIL ADDRESS"
                        type="email"
                        value={participant.email}
                        onChange={(e: any) => setParticipant({ ...participant, email: e.target.value })}
                        placeholder="you@domain.com"
                        error={errors.email}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                          label="PHONE NUMBER"
                          type="tel"
                          value={participant.phone}
                          onChange={(e: any) => setParticipant({ ...participant, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          error={errors.phone}
                        />
                        <InputField
                          label="CITY / STATE"
                          value={participant.city}
                          onChange={(e: any) => setParticipant({ ...participant, city: e.target.value })}
                          placeholder="e.g. City, State"
                          error={errors.city}
                        />
                      </div>

                      {/* T-Shirt Size Info */}
                      <div className="mb-4">
                        <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#171A18]/60 block mb-2">
                          ECO APPAREL
                        </label>
                        <p className="text-[13px] text-[#171A18]/80 bg-black/5 p-3 rounded-xl border border-black/10">
                          {content.ecoApparelNote}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#171717]/10">
                      <button
                        type="button"
                        onClick={handleNext1}
                        className="w-full h-[52px] bg-[#294D3A] text-white rounded-xl flex items-center justify-center gap-3 font-bold text-[12px] tracking-[0.12em] uppercase hover:bg-[#1C3628] transition-all shadow-md group cursor-pointer"
                      >
                        <span>CONTINUE TO RUN SELECTION</span>
                        <ArrowRight className="w-4 h-4 text-[#D7B66A] group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: SELECT RUN SERIES & DISTANCE */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex-1 space-y-6">
                      
                      {/* Run Series Selection */}
                      <div>
                        <label className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8C6A43] block mb-2.5">
                          CHOOSE YOUR RUN EVENT
                        </label>
                        <div className="relative mb-6">
                          <select
                            value={selectedRunSeries}
                            onChange={(e) => setSelectedRunSeries(e.target.value)}
                            className="w-full h-14 bg-white border border-[#171717]/15 rounded-xl px-4 text-[14px] font-bold text-[#171717] focus:outline-none focus:border-[#294D3A] focus:ring-1 focus:ring-[#294D3A] transition-all appearance-none cursor-pointer"
                          >
                            {runSeriesOptions.map((run) => (
                              <option key={run.id} value={run.id}>
                                {run.name} ({run.tag}) — {run.date}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1.5L6 6.5L11 1.5" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Distance Selection */}
                      <div>
                        <label className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8C6A43] block mb-2.5">
                          CHOOSE YOUR DISTANCE CATEGORY
                        </label>
                        <div className="grid grid-cols-1 gap-2.5">
                          {content.categories.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                                selectedCategory === cat.id
                                  ? "bg-white border-[#294D3A] ring-2 ring-[#294D3A] shadow-sm"
                                  : "bg-white text-[#171717] border-[#171717]/15 hover:border-[#294D3A]/40"
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[18px] font-bold text-[#294D3A]">{cat.distance}</span>
                                  <span className="text-[10px] font-bold text-[#8C6A43] tracking-wider uppercase">{cat.format}</span>
                                </div>
                                <p className="text-[11px] text-[#171717]/70 mt-0.5 line-clamp-1">{cat.description}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                                selectedCategory === cat.id ? "border-[#294D3A] bg-[#294D3A] text-white" : "border-[#171717]/30"
                              }`}>
                                {selectedCategory === cat.id && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    <div className="mt-6 flex gap-3 pt-4 border-t border-[#171717]/10">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="h-[50px] px-5 text-[#171717]/70 text-[11px] font-bold tracking-wider hover:text-[#171717] transition-colors cursor-pointer"
                      >
                        BACK
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 h-[50px] bg-[#294D3A] text-white rounded-xl flex items-center justify-center gap-3 font-bold text-[12px] tracking-[0.12em] uppercase hover:bg-[#1C3628] transition-all shadow-md group cursor-pointer"
                      >
                        <span>CONTINUE TO DONATION</span>
                        <ArrowRight className="w-4 h-4 text-[#D7B66A] group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: DONATION & PAYMENT */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex-1 space-y-6">
                      
                      <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#294D3A]/20">
                        <h4 className="text-[12px] font-bold tracking-[0.15em] uppercase text-[#294D3A] mb-3">{content.donationHeading}</h4>
                        <p className="text-[13px] text-[#171A18]/80 leading-relaxed mb-4">
                          {content.donationDescription}
                        </p>
                        
                        <div className="bg-white p-4 rounded-lg border border-[#171717]/10 space-y-2 text-[13px]">
                          <div className="flex justify-between">
                            <span className="text-[#171A18]/50 uppercase text-[10px] font-bold">Account Name</span>
                            <span className="font-semibold text-[#171A18]">{content.bankDetails.accountName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#171A18]/50 uppercase text-[10px] font-bold">Account Number</span>
                            <span className="font-semibold text-[#171A18]">{content.bankDetails.accountNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#171A18]/50 uppercase text-[10px] font-bold">IFSC Code</span>
                            <span className="font-semibold text-[#171A18]">{content.bankDetails.ifscCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#171A18]/50 uppercase text-[10px] font-bold">Bank</span>
                            <span className="font-semibold text-[#171A18]">{content.bankDetails.bankName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#171A18]/60 block mb-2">
                          ATTACH PAYMENT SCREENSHOT
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPaymentFile(e.target.files ? e.target.files[0] : null)}
                          className="text-[13px] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:tracking-wider file:bg-[#294D3A]/10 file:text-[#294D3A] hover:file:bg-[#294D3A]/20 transition-colors cursor-pointer"
                        />
                        {paymentFile && (
                          <span className="text-[11px] text-[#294D3A] mt-2 font-medium">Selected: {paymentFile.name}</span>
                        )}
                      </div>

                    </div>

                    <div className="mt-6 flex gap-3 pt-4 border-t border-[#171717]/10">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="h-[50px] px-5 text-[#171717]/70 text-[11px] font-bold tracking-wider hover:text-[#171717] transition-colors cursor-pointer"
                      >
                        BACK
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="flex-1 h-[50px] bg-[#294D3A] text-white rounded-xl flex items-center justify-center gap-3 font-bold text-[12px] tracking-[0.12em] uppercase hover:bg-[#1C3628] transition-all shadow-md group cursor-pointer"
                      >
                        <span>REVIEW & ECO PLEDGE</span>
                        <ArrowRight className="w-4 h-4 text-[#D7B66A] group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: ECO COMMITMENT & CONFIRM */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex-1 space-y-5">
                      
                      {/* Summary card */}
                      <div className="bg-white rounded-xl p-5 border border-[#171717]/10 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-[#171717]/10 pb-3">
                          <span className="text-[10px] font-bold tracking-[0.16em] text-[#8C6A43] uppercase">
                            REGISTRATION SUMMARY
                          </span>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-[10px] font-bold text-[#294D3A] underline uppercase hover:text-[#171717]"
                          >
                            Edit
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-[13px]">
                          <div>
                            <span className="text-[10px] text-[#171717]/50 uppercase block font-bold">Runner</span>
                            <span className="font-semibold text-[#171717]">{participant.fullName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#171717]/50 uppercase block font-bold">Email</span>
                            <span className="font-semibold text-[#171717] truncate block">{participant.email}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#171717]/50 uppercase block font-bold">Selected Event</span>
                            <span className="font-semibold text-[#294D3A]">{selectedRunData?.name}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#171717]/50 uppercase block font-bold">Category</span>
                            <span className="font-semibold text-[#294D3A]">{selectedCatData?.distance} ({selectedCatData?.format})</span>
                          </div>
                        </div>
                      </div>

                      {/* Green Runner Pledge Checklist */}
                      <div className="bg-[#294D3A]/5 border border-[#294D3A]/20 rounded-xl p-4.5">
                        <span className="text-[10px] font-bold tracking-[0.16em] text-[#294D3A] uppercase block mb-3">
                          {content.pledgeTitle}
                        </span>

                        <label className="flex items-start gap-3 cursor-pointer mb-3">
                          <input
                            type="checkbox"
                            checked={participant.hasPledgedZeroPlastic}
                            onChange={(e) => setParticipant({ ...participant, hasPledgedZeroPlastic: e.target.checked })}
                            className="mt-0.5 rounded text-[#294D3A] focus:ring-[#294D3A]"
                          />
                          <span className="text-[12px] text-[#171717]/80 leading-snug">
                            <strong>{content.pledge1Title}</strong> {content.pledge1Description}
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mt-0.5 rounded text-[#294D3A] focus:ring-[#294D3A]"
                          />
                          <span className="text-[12px] text-[#171717]/80 leading-snug">
                            <strong>{content.pledge2Title}</strong> {content.pledge2Description}
                          </span>
                        </label>
                      </div>

                      <p className="text-[11px] text-[#171717]/50 text-center font-light">
                        {content.pledgeFooterNote}
                      </p>

                    </div>

                    <div className="mt-6 flex gap-3 pt-4 border-t border-[#171717]/10">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="h-[50px] px-5 text-[#171717]/70 text-[11px] font-bold tracking-wider hover:text-[#171717] transition-colors cursor-pointer"
                      >
                        BACK
                      </button>
                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        disabled={!participant.hasPledgedZeroPlastic || isSubmitting}
                        className={`flex-1 h-[50px] rounded-xl flex items-center justify-center gap-3 font-bold text-[12px] tracking-[0.12em] uppercase transition-all shadow-md group ${
                          participant.hasPledgedZeroPlastic && !isSubmitting
                            ? "bg-[#294D3A] text-white hover:bg-[#1C3628] cursor-pointer"
                            : "bg-[#171717]/20 text-[#171717]/40 cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting ? (
                           <span className="w-5 h-5 border-2 border-[#171717]/40 border-t-[#294D3A] rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>CONFIRM REGISTRATION & GET PASS</span>
                            <ArrowRight className="w-4 h-4 text-[#D7B66A] group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: PASS / CONFIRMATION */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45 }}
                    className="flex flex-col items-center justify-center h-full text-center py-2"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#294D3A]/10 text-[#294D3A] text-[10px] font-bold tracking-[0.15em] uppercase mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C69A3A]" />
                      REGISTRATION CONFIRMED
                    </div>

                    <h3 className="text-[28px] sm:text-[34px] font-bold text-[#171717] tracking-tight mb-1">
                      {content.ecoPassTitle}
                    </h3>
                    <p className="text-[11px] font-bold tracking-[0.2em] text-[#8C6A43] uppercase mb-6">
                      {content.ecoPassSubtitle}
                    </p>

                    {/* Digital Eco-Bib Pass */}
                    <div id="eco-bib-pass" ref={printRef} className="w-full bg-[#18372B] rounded-[20px] p-6 sm:p-7 text-left relative overflow-hidden shadow-2xl border border-[#294D3A] text-white mb-6">
                      <div className="absolute top-0 right-0 w-36 h-36 bg-[#C69A3A] opacity-10 rounded-bl-full pointer-events-none" />
                      
                      {/* Top Header */}
                      <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4 relative z-10">
                        <div>
                          <span className="text-[15px] font-bold tracking-widest text-[#FAF8F5] block">
                            JAWAI RUNNERS
                          </span>
                          <span className="text-[9px] font-mono tracking-[0.2em] text-[#D7B66A] uppercase">
                            RUN • RESTORE • REWILD
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-white/50 uppercase font-mono block">ORGANISER</span>
                          <span className="text-[10px] font-bold text-white tracking-wide">Stepwells Renovater Fdn</span>
                        </div>
                      </div>

                      {/* Main Bib Body */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10 my-4">
                        <div>
                          <span className="text-[9px] font-bold text-white/50 tracking-[0.18em] uppercase block mb-1">
                            BIB NUMBER
                          </span>
                          <span className="text-[22px] font-mono font-bold text-[#D7B66A]">
                            JR-2026-88
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-white/50 tracking-[0.18em] uppercase block mb-1">
                            SERIES EVENT
                          </span>
                          <span className="text-[14px] font-bold text-white block">
                            {selectedRunData?.name}
                          </span>
                          <span className="text-[10px] text-[#D7B66A]">{selectedRunData?.date}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-white/50 tracking-[0.18em] uppercase block mb-1">
                            DISTANCE
                          </span>
                          <span className="text-[16px] font-bold text-[#FAF8F5]">
                            {selectedCatData?.distance}
                          </span>
                        </div>
                      </div>

                      {/* Runner & Plant Dedication */}
                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] relative z-10">
                        <div>
                          <span className="text-[9px] text-white/50 uppercase block font-mono">PARTICIPANT</span>
                          <span className="font-semibold text-white">{participant.fullName || "Jawai Conservation Runner"}</span>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-[9px] text-[#D7B66A] uppercase block font-mono">TAGGED NATIVE TREE</span>
                          <span className="text-white/90 font-medium">Dhok (Anogeissus pendula) #14,291</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                      <button
                        type="button"
                        onClick={() => handlePrint()}
                        className="w-full sm:flex-1 h-[48px] bg-[#294D3A] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-[11px] tracking-[0.15em] uppercase hover:bg-[#1C3628] transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#D7B66A]" />
                        <span>SAVE / PRINT PASS</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setPaymentFile(null);
                          setParticipant({
                            fullName: "",
                            email: "",
                            phone: "",
                            city: "",
                            emergencyContact: "",
                            hasPledgedZeroPlastic: true
                          });
                        }}
                        className="w-full sm:w-auto px-6 h-[48px] text-[11px] font-bold text-[#294D3A] tracking-[0.1em] uppercase hover:text-[#171717] transition-colors cursor-pointer"
                      >
                        Register Another Runner
                      </button>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
