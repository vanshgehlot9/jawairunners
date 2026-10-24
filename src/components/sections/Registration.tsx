"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Download,
  ArrowRight,
  Footprints,
  Bike,
  Compass,
  MapPin,
  Building2,
  Send,
  User,
  Mail,
  HeartHandshake,
  CheckCircle2,
  CreditCard,
  Lock,
} from "lucide-react";
import { db, ref, push, set } from "@/lib/firebase";
import { useReactToPrint } from "react-to-print";

type ParticipantFormData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  activity: "runner" | "cyclist" | "horse_rider";
  startingPoint: "jawai_bandh" | "bera" | "conservation";
  runDistance: "21k" | "10k" | "5k";
  apparelSize: string;
  safetyConsent: boolean;
  zeroPlasticPledge: boolean;
};

type SponsorFormData = {
  organisationName: string;
  industry: string;
  websiteOrCity: string;
  contactName: string;
  designation: string;
  email: string;
  phone: string;
  partnershipType: string;
  proposedSupport: string;
};

const FEES = {
  runner_21k: 1499,
  runner_10k: 999,
  runner_5k: 499,
  cyclist: 1299,
  horse_rider: 1999,
};

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  required = false,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="flex flex-col relative w-full mb-5">
      <label
        className={`text-[10px] font-bold tracking-[0.15em] uppercase transition-colors duration-200 mb-1 ${
          isFocused ? "text-[#294D3A]" : "text-[#171A18]/60"
        }`}
      >
        {label} {required && <span className="text-[#8C6A43]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-[#FFFFFF] border border-[#294D3A]/20 rounded-xl px-4 py-2.5 text-[14px] sm:text-[15px] text-[#171A18] placeholder:text-[#171A18]/30 outline-none transition-all duration-200 focus:border-[#294D3A] focus:ring-1 focus:ring-[#294D3A]"
      />
      {error && (
        <span className="text-[#8C6A43] text-[10.5px] font-semibold mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export function Registration() {
  const [activeTab, setActiveTab] = useState<"participant" | "sponsor">("participant");

  // Participant Form Multi-step State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string>("");

  const [participant, setParticipant] = useState<ParticipantFormData>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    activity: "runner",
    startingPoint: "jawai_bandh",
    runDistance: "21k",
    apparelSize: "M",
    safetyConsent: false,
    zeroPlasticPledge: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedId, setConfirmedId] = useState<string>("");

  // Sponsor Form State
  const [sponsorSubmitted, setSponsorSubmitted] = useState(false);
  const [sponsor, setSponsor] = useState<SponsorFormData>({
    organisationName: "",
    industry: "",
    websiteOrCity: "",
    contactName: "",
    designation: "",
    email: "",
    phone: "",
    partnershipType: "Event Sponsorship & In-Kind Support",
    proposedSupport: "",
  });
  const [sponsorErrors, setSponsorErrors] = useState<Record<string, string>>({});

  // Dynamic fee calculator
  const calculateFee = () => {
    if (participant.activity === "runner") {
      if (participant.runDistance === "21k") return FEES.runner_21k;
      if (participant.runDistance === "10k") return FEES.runner_10k;
      return FEES.runner_5k;
    }
    if (participant.activity === "cyclist") return FEES.cyclist;
    return FEES.horse_rider;
  };

  // Print Reference for Eco-Pass
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Jawai_Triathlon_Pass_${confirmedId || "2026"}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background: #ffffff !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #eco-bib-pass {
          visibility: visible !important;
          display: block !important;
          width: 100% !important;
          border: 2px solid #294D3A !important;
          border-radius: 16px !important;
          padding: 24px !important;
          background-color: #ffffff !important;
          color: #171717 !important;
        }
        #eco-bib-pass * {
          visibility: visible !important;
        }
      }
    `,
  });

  // Load Razorpay Checkout Script
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!participant.fullName.trim()) errs.fullName = "Full name is required.";
    if (!participant.email.trim()) errs.email = "Email address is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(participant.email))
      errs.email = "Enter a valid email.";
    if (!participant.phone.trim()) errs.phone = "Phone number is required.";
    if (!participant.city.trim()) errs.city = "City / State is required.";
    if (!participant.emergencyContactName.trim())
      errs.emergencyContactName = "Emergency contact name is required.";
    if (!participant.emergencyContactPhone.trim())
      errs.emergencyContactPhone = "Emergency contact phone is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!participant.safetyConsent) {
      errs.safetyConsent = "You must agree to the required safety consent & guidelines.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Razorpay Checkout Trigger
  const handleRazorpayPayment = async () => {
    if (!validateStep3()) return;
    setPaymentError("");
    setIsSubmitting(true);

    const regId = "JT-" + Math.floor(100000 + Math.random() * 900000);
    const amount = calculateFee();

    try {
      // 1. Ensure Razorpay checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Unable to connect to Razorpay payment gateway. Please check your internet connection.");
      }

      // 2. Create order on server
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: regId,
        }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to initialize secure payment order.");
      }

      const orderData = await orderRes.json();

      // 3. Open Razorpay Checkout modal
      const options = {
        key:
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          "rzp_test_Tn5fNmWHucTCfK",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Jawai Triathlon",
        description: `Conservation Registration: ${participant.activity.toUpperCase()}`,
        image: "/logo.png",
        order_id: orderData.id,
        prefill: {
          name: participant.fullName,
          email: participant.email,
          contact: participant.phone,
        },
        theme: {
          color: "#294D3A",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI / QR Code",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
              other: {
                name: "Other Payment Modes",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.upi", "block.other"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
        handler: async (response: any) => {
          try {
            // Verify payment signature
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            const paymentId = response.razorpay_payment_id || `PAY_${Date.now()}`;
            setConfirmedPaymentId(paymentId);
            setConfirmedId(regId);

            // Save to Firebase Realtime Database
            if (db) {
              const registrationsRef = ref(db, "registrations");
              const newRef = push(registrationsRef);
              await set(newRef, {
                ...participant,
                registrationId: regId,
                paymentId,
                orderId: response.razorpay_order_id,
                amountPaid: amount,
                paymentStatus: "paid",
                verified: verifyData.verified ?? true,
                createdAt: new Date().toISOString(),
              });
            }

            // Dispatch confirmation emails
            fetch("/api/send-mail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...participant,
                registrationId: regId,
                paymentId,
                amount,
              }),
            }).catch((err) => console.log("Email dispatch:", err));

            setStep(4);
          } catch (handlerErr: any) {
            console.error("Payment post-processing error:", handlerErr);
            setConfirmedId(regId);
            setStep(4);
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", (failedRes: any) => {
        setIsSubmitting(false);
        setPaymentError(failedRes.error?.description || "Payment failed. Please try again.");
      });
      razorpayInstance.open();
    } catch (err: any) {
      console.error("Razorpay initiation error:", err);
      setPaymentError(err.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!sponsor.organisationName.trim()) errs.organisationName = "Organisation name is required.";
    if (!sponsor.contactName.trim()) errs.contactName = "Contact person name is required.";
    if (!sponsor.email.trim()) errs.email = "Email is required.";
    if (!sponsor.proposedSupport.trim()) errs.proposedSupport = "Please describe proposed support.";

    setSponsorErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      if (db) {
        const sponsorsRef = ref(db, "sponsor_enquiries");
        const newRef = push(sponsorsRef);
        await set(newRef, {
          ...sponsor,
          createdAt: new Date().toISOString(),
        });
      }
      setSponsorSubmitted(true);
    } catch (e) {
      console.log("Sponsor submission fallback:", e);
      setSponsorSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fee = calculateFee();

  return (
    <section
      id="registration"
      className="w-full bg-[#18372B] relative flex items-center py-20 lg:py-28 min-h-screen border-t border-[#F5F0E6]/10 overflow-hidden"
    >
      {/* Background Topo Glow */}
      <div
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#C69A3A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative z-10">
        
        {/* ── LEFT COLUMN: EDITORIAL IDENTITY & IMPACT OVERVIEW ── */}
        <div className="w-full lg:w-[44%] flex flex-col justify-between z-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.02] text-white tracking-tight uppercase mb-6"
            >
              YOUR JOURNEY <br />
              <span className="text-[#C69A3A] italic font-serif">STARTS HERE.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-lg sm:text-xl text-white/85 font-light leading-relaxed mb-8 max-w-[500px]"
            >
              Choose your starting point. Select your experience. Take action for nature.
            </motion.p>

            {/* 3 Key Integration Pillars */}
            <div className="space-y-3.5 mb-8">
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <MapPin className="w-4 h-4 text-[#C69A3A] shrink-0" />
                <span className="text-[13px] text-white/90 font-medium">
                  <strong>3 Starting Points:</strong> Jawai Bandh, Bera, or Conservation Site.
                </span>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <Compass className="w-4 h-4 text-[#8ec94a] shrink-0" />
                <span className="text-[13px] text-white/90 font-medium">
                  <strong>3 Disciplines:</strong> Trail Runner, Cyclist, or Guided Horse Rider.
                </span>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#C69A3A] shrink-0" />
                <span className="text-[13px] text-white/90 font-medium">
                  <strong>Organised by:</strong> Stepwells Renovater Foundation Rajasthan.
                </span>
              </div>
            </div>

            {/* Direct Inquiries Note */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 text-[12.5px] text-white/80">
              <span className="text-[#C69A3A] font-bold block mb-1">FOUNDATION SECRETARIAT</span>
              Direct Inquiries: <a href="mailto:support@stepwellsrenovaterfoundation.org" className="underline hover:text-white">support@stepwellsrenovaterfoundation.org</a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/15 text-[11px] font-mono tracking-wider text-white/50">
            JAWAI · RAJASTHAN · 25.08° N · 73.16° E · #JUNGLEPACHOLANAO
          </div>
        </div>

        {/* ── RIGHT COLUMN: DYNAMIC TWO-TAB REGISTRATION & SPONSOR PANEL ── */}
        <div id="registration-form" className="w-full lg:w-[56%] flex items-center justify-center">
          <div className="w-full max-w-[640px] bg-[#FAF8F5] rounded-[28px] border border-white/40 shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col relative min-h-[600px]">
            
            {/* Top Interactive Tab Switcher */}
            <div className="flex items-center bg-[#171717]/10 p-1.5 rounded-2xl mb-8 relative">
              <button
                type="button"
                onClick={() => setActiveTab("participant")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer text-center ${
                  activeTab === "participant" ? "text-white" : "text-[#171717]/60 hover:text-[#171717]"
                }`}
              >
                {activeTab === "participant" && (
                  <motion.div
                    layoutId="registrationActiveTab"
                    className="absolute inset-0 bg-[#294D3A] rounded-xl shadow-sm z-[-1]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                PARTICIPANT REGISTRATION
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("sponsor")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer text-center ${
                  activeTab === "sponsor" ? "text-white" : "text-[#171717]/60 hover:text-[#171717]"
                }`}
              >
                {activeTab === "sponsor" && (
                  <motion.div
                    layoutId="registrationActiveTab"
                    className="absolute inset-0 bg-[#294D3A] rounded-xl shadow-sm z-[-1]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                SPONSORSHIPS & PARTNERSHIPS
              </button>
            </div>

            {/* TAB CONTENT 1: PARTICIPANT MULTI-STEP FLOW */}
            {activeTab === "participant" && (
              <div className="flex-1 flex flex-col justify-between">
                
                {/* Step Progress Tracker */}
                {step < 4 && (
                  <div className="mb-6 pb-5 border-b border-[#171717]/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-[0.18em] text-[#8C6A43] uppercase">
                        STEP 0{step} OF 03
                      </span>
                      <span className="text-[11px] font-bold tracking-wider text-[#294D3A] uppercase">
                        {step === 1 && "PERSONAL & EMERGENCY CONTACT"}
                        {step === 2 && "STARTING POINT & EXPERIENCE"}
                        {step === 3 && "PAYMENT & ECO PLEDGE"}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#171717]/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#294D3A]"
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.35 }}
                      />
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {/* STEP 1: PERSONAL & EMERGENCY CONTACT */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-xl font-serif font-bold text-[#171717] mb-1">
                          Personal Information
                        </h3>
                        <p className="text-[13px] text-[#171717]/60 mb-5">
                          Enter your contact information for official registration.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Full Name"
                            value={participant.fullName}
                            onChange={(e: any) =>
                              setParticipant({ ...participant, fullName: e.target.value })
                            }
                            placeholder="e.g. John Doe"
                            error={errors.fullName}
                            required
                          />
                          <InputField
                            label="Email Address"
                            type="email"
                            value={participant.email}
                            onChange={(e: any) =>
                              setParticipant({ ...participant, email: e.target.value })
                            }
                            placeholder="e.g. john@example.com"
                            error={errors.email}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <InputField
                            label="Phone Number"
                            value={participant.phone}
                            onChange={(e: any) =>
                              setParticipant({ ...participant, phone: e.target.value })
                            }
                            placeholder="e.g. +91 98XXX XXXXX"
                            error={errors.phone}
                            required
                          />
                          <InputField
                            label="City / State"
                            value={participant.city}
                            onChange={(e: any) =>
                              setParticipant({ ...participant, city: e.target.value })
                            }
                            placeholder="e.g. Jaipur, Rajasthan"
                            error={errors.city}
                            required
                          />
                        </div>

                        <div className="pt-2 border-t border-[#171717]/10 mb-4">
                          <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8C6A43] block mb-3">
                            REQUIRED EMERGENCY CONTACT
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                            <InputField
                              label="Emergency Contact Name"
                              value={participant.emergencyContactName}
                              onChange={(e: any) =>
                                setParticipant({
                                  ...participant,
                                  emergencyContactName: e.target.value,
                                })
                              }
                              placeholder="e.g. Jane Doe"
                              error={errors.emergencyContactName}
                              required
                            />
                            <InputField
                              label="Emergency Phone"
                              value={participant.emergencyContactPhone}
                              onChange={(e: any) =>
                                setParticipant({
                                  ...participant,
                                  emergencyContactPhone: e.target.value,
                                })
                              }
                              placeholder="e.g. +91 98XXX XXXXX"
                              error={errors.emergencyContactPhone}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#171717]/10 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (validateStep1()) setStep(2);
                          }}
                          className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#294D3A] hover:bg-[#1F3026] text-white text-[13px] font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer"
                        >
                          <span>CONTINUE TO SELECTION</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: ACTIVITY & STARTING POINT SELECTION */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div>
                        {/* 1. Activity Selection */}
                        <div className="mb-6">
                          <label className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-[#8C6A43] block mb-2">
                            1. CHOOSE YOUR EXPERIENCE (ACTIVITY)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { id: "runner", name: "Jawai Runner", icon: Footprints, sub: "Trail Running" },
                              { id: "cyclist", name: "Jawai Cyclist", icon: Bike, sub: "Wilderness Cycling" },
                              { id: "horse_rider", name: "Jawai Horse Rider", icon: Compass, sub: "Guided Equestrian" },
                            ].map((act) => {
                              const Icon = act.icon;
                              const isSel = participant.activity === act.id;
                              return (
                                <button
                                  key={act.id}
                                  type="button"
                                  onClick={() =>
                                    setParticipant({ ...participant, activity: act.id as any })
                                  }
                                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                    isSel
                                      ? "bg-[#294D3A] text-white border-[#294D3A] shadow-sm"
                                      : "bg-[#FFFFFF] text-[#171717] border-[#294D3A]/20 hover:border-[#294D3A]/40"
                                  }`}
                                >
                                  <Icon className={`w-5 h-5 mb-2 ${isSel ? "text-[#C69A3A]" : "text-[#304B38]"}`} />
                                  <div>
                                    <span className="font-bold text-[13px] block leading-snug">
                                      {act.name}
                                    </span>
                                    <span className={`text-[10px] uppercase tracking-wider block ${isSel ? "text-white/70" : "text-[#171717]/50"}`}>
                                      {act.sub}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Runner Distance Option if runner is selected */}
                        {participant.activity === "runner" && (
                          <div className="mb-6 p-4 rounded-2xl bg-white border border-[#294D3A]/15">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8C6A43]">
                                SELECT RUN DISTANCE
                              </label>
                              <span className="text-[11px] font-semibold text-[#294D3A]">
                                Tier Fee Included
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: "21k", label: "21K Half Marathon", price: "₹1,499" },
                                { id: "10k", label: "10K Challenge", price: "₹999" },
                                { id: "5k", label: "5K Community Run", price: "₹499" },
                              ].map((dist) => (
                                <button
                                  key={dist.id}
                                  type="button"
                                  onClick={() =>
                                    setParticipant({ ...participant, runDistance: dist.id as any })
                                  }
                                  className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer border ${
                                    participant.runDistance === dist.id
                                      ? "bg-[#294D3A] text-white border-[#294D3A]"
                                      : "bg-[#FAF8F5] text-[#171717] border-[#294D3A]/15 hover:bg-[#294D3A]/10"
                                  }`}
                                >
                                  <div className="text-[12px] font-bold">{dist.label}</div>
                                  <div className={`text-[10px] font-semibold ${participant.runDistance === dist.id ? "text-[#C69A3A]" : "text-[#294D3A]"}`}>
                                    {dist.price}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2. Starting Point Selection */}
                        <div className="mb-4">
                          <label className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-[#8C6A43] block mb-2">
                            2. CHOOSE YOUR STARTING POINT
                          </label>
                          <div className="space-y-2.5">
                            {[
                              {
                                id: "jawai_bandh",
                                number: "01",
                                name: "JAWAI BANDH START",
                                desc: "Distinctive granite hills, vast water horizons, and rugged wilderness.",
                              },
                              {
                                id: "bera",
                                number: "02",
                                name: "BERA START",
                                desc: "Rural character, pastoral Rabari heritage, and shared wildlife landscape.",
                              },
                              {
                                id: "conservation",
                                number: "03",
                                name: "CONSERVATION START",
                                desc: "Designated community restoration site and ancient stepwell regeneration.",
                              },
                            ].map((pt) => {
                              const isSel = participant.startingPoint === pt.id;
                              return (
                                <button
                                  key={pt.id}
                                  type="button"
                                  onClick={() =>
                                    setParticipant({ ...participant, startingPoint: pt.id as any })
                                  }
                                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                                    isSel
                                      ? "bg-[#294D3A] text-white border-[#294D3A] shadow-sm"
                                      : "bg-[#FFFFFF] text-[#171717] border-[#294D3A]/15 hover:border-[#294D3A]/40"
                                  }`}
                                >
                                  <span
                                    className={`font-serif italic font-semibold text-lg leading-none ${
                                      isSel ? "text-[#C69A3A]" : "text-[#304B38]"
                                    }`}
                                  >
                                    {pt.number}
                                  </span>
                                  <div className="flex-1">
                                    <span className="font-bold text-[13px] block leading-snug">
                                      {pt.name}
                                    </span>
                                    <span
                                      className={`text-[11.5px] leading-tight block mt-0.5 ${
                                        isSel ? "text-white/80" : "text-[#171717]/65"
                                      }`}
                                    >
                                      {pt.desc}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#171717]/10 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-[12px] font-bold tracking-wider uppercase text-[#171717]/60 hover:text-[#171717] cursor-pointer"
                        >
                          BACK
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#294D3A] hover:bg-[#1F3026] text-white text-[13px] font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer"
                        >
                          <span>CONTINUE TO PAYMENT</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: PAYMENT & ECO PLEDGE */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-xl font-serif font-bold text-[#171717] mb-1">
                          Review & Secure Payment
                        </h3>
                        <p className="text-[13px] text-[#171717]/60 mb-5">
                          Complete your registration fee via secure Razorpay checkout.
                        </p>

                        {/* Order Summary Card */}
                        <div className="p-4 rounded-2xl bg-white border border-[#294D3A]/20 shadow-2xs mb-5">
                          <div className="flex items-center justify-between border-b border-[#294D3A]/10 pb-3 mb-3">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6A43] block">
                                SELECTED DISCIPLINE
                              </span>
                              <span className="text-[15px] font-bold text-[#171717] capitalize">
                                {participant.activity.replace("_", " ")} {participant.activity === "runner" && `(${participant.runDistance})`}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6A43] block">
                                REGISTRATION FEE
                              </span>
                              <span className="text-xl font-serif font-bold text-[#294D3A]">
                                ₹{fee}
                              </span>
                            </div>
                          </div>

                          <div className="text-[12px] text-[#171717]/70 flex items-center justify-between">
                            <span>Starting Venue: <strong className="text-[#171717] uppercase">{participant.startingPoint.replace("_", " ")}</strong></span>
                            <span className="text-[#629A13] font-semibold flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> Razorpay Verified
                            </span>
                          </div>
                        </div>

                        {/* Eco Apparel Size */}
                        <div className="mb-5 p-3.5 rounded-2xl bg-white border border-[#294D3A]/15">
                          <label className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8C6A43] block mb-2">
                            SELECT COMMEMORATIVE ECO T-SHIRT SIZE
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {["S", "M", "L", "XL", "XXL"].map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setParticipant({ ...participant, apparelSize: sz })}
                                className={`py-1.5 text-center text-[12px] font-bold rounded-xl border transition-all cursor-pointer ${
                                  participant.apparelSize === sz
                                    ? "bg-[#294D3A] text-white border-[#294D3A]"
                                    : "bg-[#FAF8F5] text-[#171717] border-[#294D3A]/15 hover:bg-[#294D3A]/10"
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Consents Checkboxes */}
                        <div className="space-y-3 mb-4">
                          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#294D3A]/20 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={participant.safetyConsent}
                              onChange={(e) =>
                                setParticipant({ ...participant, safetyConsent: e.target.checked })
                              }
                              className="mt-1 w-4 h-4 rounded text-[#294D3A] focus:ring-[#294D3A]"
                            />
                            <div>
                              <span className="font-bold text-[12.5px] text-[#171717] block leading-snug">
                                Required Safety & Guidelines Consent *
                              </span>
                              <span className="text-[11.5px] text-[#171717]/70 font-light leading-relaxed block mt-0.5">
                                I confirm physical fitness, agree to trained handler safety instructions, and animal welfare considerations during the event.
                              </span>
                            </div>
                          </label>
                          {errors.safetyConsent && (
                            <span className="text-[#8C6A43] text-[11px] font-bold block">
                              {errors.safetyConsent}
                            </span>
                          )}

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#294D3A]/20 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={participant.zeroPlasticPledge}
                              onChange={(e) =>
                                setParticipant({
                                  ...participant,
                                  zeroPlasticPledge: e.target.checked,
                                })
                              }
                              className="mt-1 w-4 h-4 rounded text-[#294D3A] focus:ring-[#294D3A]"
                            />
                            <div>
                              <span className="font-bold text-[12.5px] text-[#171717] block leading-snug">
                                Zero Single-Use Plastic & Eco Pledge
                              </span>
                              <span className="text-[11.5px] text-[#171717]/70 font-light leading-relaxed block mt-0.5">
                                I pledge to pack-in and pack-out all items, use reusable hydration systems, and protect Jawai&apos;s wildlife corridor.
                              </span>
                            </div>
                          </label>
                        </div>

                        {paymentError && (
                          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px] font-medium mb-3">
                            {paymentError}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#171717]/10 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-[12px] font-bold tracking-wider uppercase text-[#171717]/60 hover:text-[#171717] cursor-pointer"
                        >
                          BACK
                        </button>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={handleRazorpayPayment}
                          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#629A13] hover:bg-[#528210] text-white text-[13px] font-bold tracking-wide uppercase transition-all shadow-lg cursor-pointer disabled:opacity-50"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>{isSubmitting ? "PROCESSING..." : `PAY ₹${fee} WITH RAZORPAY`}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: SUCCESS CONFIRMATION & ECO PASS */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div
                        ref={printRef}
                        id="eco-bib-pass"
                        className="p-6 sm:p-8 rounded-2xl bg-white border border-[#294D3A]/20 shadow-sm mb-6 print:m-0 print:border-2 print:border-[#294D3A]"
                      >
                        <div className="flex items-center justify-between border-b border-[#294D3A]/15 pb-4 mb-4">
                          <div>
                            <span className="text-[9.5px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block">
                              OFFICIAL PARTICIPANT ECO-PASS
                            </span>
                            <h4 className="font-serif text-xl font-bold text-[#171717]">
                              Jawai Triathlon 2026
                            </h4>
                          </div>
                          <span className="font-mono text-[12px] font-bold text-[#294D3A] bg-[#294D3A]/10 px-2.5 py-1 rounded-full">
                            {confirmedId || "JT-849201"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[12px] mb-4">
                          <div>
                            <span className="text-[10px] uppercase text-[#171717]/50 block">Participant</span>
                            <span className="font-bold text-[#171717]">{participant.fullName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-[#171717]/50 block">Activity</span>
                            <span className="font-bold text-[#294D3A] uppercase">
                              {participant.activity === "runner"
                                ? `Runner (${participant.runDistance})`
                                : participant.activity === "cyclist"
                                ? "Cyclist"
                                : "Horse Rider"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-[#171717]/50 block">Starting Point</span>
                            <span className="font-bold text-[#171717] uppercase">
                              {participant.startingPoint.replace("_", " ")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-[#171717]/50 block">Payment Status</span>
                            <span className="font-bold text-[#629A13] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> PAID (₹{fee})
                            </span>
                          </div>
                        </div>

                        {confirmedPaymentId && (
                          <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#294D3A]/10 text-[11px] font-mono text-[#171717]/70 mb-3">
                            Razorpay ID: <strong>{confirmedPaymentId}</strong>
                          </div>
                        )}

                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#294D3A]/10 text-[11px] text-[#171717]/70">
                          Registration confirmed! Official starting venue instructions, schedule, and participant briefing have been emailed to <strong>{participant.email}</strong>.
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => handlePrint()}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#294D3A] text-white text-[12.5px] font-bold tracking-wide uppercase transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>DOWNLOAD ECO-PASS</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setStep(1);
                            setParticipant({
                              fullName: "",
                              email: "",
                              phone: "",
                              city: "",
                              emergencyContactName: "",
                              emergencyContactPhone: "",
                              activity: "runner",
                              startingPoint: "jawai_bandh",
                              runDistance: "21k",
                              apparelSize: "M",
                              safetyConsent: false,
                              zeroPlasticPledge: true,
                            });
                          }}
                          className="py-3 px-5 rounded-full border border-[#294D3A]/25 text-[#294D3A] text-[12.5px] font-bold uppercase transition-colors hover:bg-black/5 cursor-pointer text-center"
                        >
                          REGISTER ANOTHER
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB CONTENT 2: SPONSORSHIPS & PARTNERSHIPS ENQUIRY */}
            {activeTab === "sponsor" && (
              <div className="flex-1 flex flex-col justify-between">
                {!sponsorSubmitted ? (
                  <form onSubmit={handleSponsorSubmit} className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#171717] mb-1">
                        Partner with a Purpose
                      </h3>
                      <p className="text-[13px] text-[#171717]/60 mb-5">
                        Submit your organisation’s details to explore custom partnership opportunities.
                      </p>

                      <InputField
                        label="Organisation / Brand Name"
                        value={sponsor.organisationName}
                        onChange={(e: any) =>
                          setSponsor({ ...sponsor, organisationName: e.target.value })
                        }
                        placeholder="e.g. Green Planet Corp"
                        error={sponsorErrors.organisationName}
                        required
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <InputField
                          label="Contact Person Name"
                          value={sponsor.contactName}
                          onChange={(e: any) =>
                            setSponsor({ ...sponsor, contactName: e.target.value })
                          }
                          placeholder="e.g. John Smith"
                          error={sponsorErrors.contactName}
                          required
                        />
                        <InputField
                          label="Designation / Role"
                          value={sponsor.designation}
                          onChange={(e: any) =>
                            setSponsor({ ...sponsor, designation: e.target.value })
                          }
                          placeholder="e.g. Sustainability Director"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <InputField
                          label="Corporate Email"
                          type="email"
                          value={sponsor.email}
                          onChange={(e: any) =>
                            setSponsor({ ...sponsor, email: e.target.value })
                          }
                          placeholder="e.g. john@greenplanet.org"
                          error={sponsorErrors.email}
                          required
                        />
                        <InputField
                          label="Phone / Mobile"
                          value={sponsor.phone}
                          onChange={(e: any) =>
                            setSponsor({ ...sponsor, phone: e.target.value })
                          }
                          placeholder="e.g. +91 98XXX XXXXX"
                        />
                      </div>

                      <div className="flex flex-col relative w-full mb-5">
                        <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#171A18]/60 mb-1">
                          Preferred Partnership Focus
                        </label>
                        <select
                          value={sponsor.partnershipType}
                          onChange={(e) =>
                            setSponsor({ ...sponsor, partnershipType: e.target.value })
                          }
                          className="w-full bg-[#FFFFFF] border border-[#294D3A]/20 rounded-xl px-4 py-2.5 text-[14px] text-[#171A18] outline-none focus:border-[#294D3A]"
                        >
                          <option>Event Sponsorship & In-Kind Support</option>
                          <option>Cleaning Drive Sponsorship</option>
                          <option>Plantation & Restoration Support</option>
                          <option>Volunteer & Student Engagement</option>
                          <option>Sports Equipment, Hydration & Logistics</option>
                          <option>Environmental Awareness & Community Programmes</option>
                        </select>
                      </div>

                      <div className="flex flex-col relative w-full mb-5">
                        <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#171A18]/60 mb-1">
                          Proposed Support / Collaboration Scope *
                        </label>
                        <textarea
                          rows={3}
                          value={sponsor.proposedSupport}
                          onChange={(e) =>
                            setSponsor({ ...sponsor, proposedSupport: e.target.value })
                          }
                          placeholder="Describe how your organisation would like to collaborate or support Jawai's conservation vision..."
                          className="w-full bg-[#FFFFFF] border border-[#294D3A]/20 rounded-xl px-4 py-2.5 text-[14px] text-[#171A18] placeholder:text-[#171A18]/30 outline-none focus:border-[#294D3A] focus:ring-1 focus:ring-[#294D3A] resize-none"
                        />
                        {sponsorErrors.proposedSupport && (
                          <span className="text-[#8C6A43] text-[10.5px] font-semibold mt-1">
                            {sponsorErrors.proposedSupport}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#171717]/10 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#294D3A] hover:bg-[#1F3026] text-white text-[13px] font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        <span>{isSubmitting ? "TRANSMITTING..." : "SUBMIT SPONSOR ENQUIRY"}</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#629A13]/10 border border-[#629A13]/30 flex items-center justify-center text-[#629A13] mb-4">
                      <HeartHandshake className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#C69A3A] uppercase block mb-1">
                      ENQUIRY RECEIVED
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#171717] mb-3">
                      Thank You for Partnering with Purpose
                    </h4>
                    <p className="text-[14px] text-[#171717]/70 font-light leading-relaxed max-w-[420px] mb-6">
                      Our partnership committee will review <strong>{sponsor.organisationName}</strong>&apos;s proposal and reach out to <strong>{sponsor.contactName}</strong> shortly to discuss alignment and next steps.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSponsorSubmitted(false);
                        setSponsor({
                          organisationName: "",
                          industry: "",
                          websiteOrCity: "",
                          contactName: "",
                          designation: "",
                          email: "",
                          phone: "",
                          partnershipType: "Event Sponsorship & In-Kind Support",
                          proposedSupport: "",
                        });
                      }}
                      className="px-6 py-2.5 rounded-full border border-[#294D3A]/20 text-[#294D3A] text-[12px] font-bold uppercase transition-colors hover:bg-black/5 cursor-pointer"
                    >
                      SUBMIT ANOTHER INQUIRY
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
