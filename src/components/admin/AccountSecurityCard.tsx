"use client";

import React, { useState } from "react";
import { initializeApp, deleteApp } from "firebase/app";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import {
  KeyRound,
  Mail,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { app, auth } from "@/lib/firebase";
import { recordAuditLog } from "@/lib/cms/firestore-service";

interface AccountSecurityCardProps {
  currentEmail: string;
  existingAdminEmails: string[];
  onWhitelistEmail: (newEmail: string) => Promise<void>;
  onAuditRecorded?: () => Promise<void>;
}

function mapFirebaseAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || "";
  if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
    return "Current password is incorrect.";
  }
  if (code === "auth/weak-password") {
    return "New password is too weak. Use at least 8 characters.";
  }
  if (code === "auth/requires-recent-login") {
    return "Please verify your current password to continue.";
  }
  if (code === "auth/email-already-in-use") {
    return "An account with this email ID already exists.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  return err instanceof Error ? err.message : "Failed to update account credentials.";
}

export function AccountSecurityCard({
  currentEmail,
  existingAdminEmails,
  onWhitelistEmail,
  onAuditRecorded,
}: AccountSecurityCardProps) {
  const [mode, setMode] = useState<"password" | "email" | "create">("password");

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Change Email ID state
  const [nextEmail, setNextEmail] = useState("");
  const [emailVerifyPassword, setEmailVerifyPassword] = useState("");

  // Provision Owner ID & Password state
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [showProvisionPw, setShowProvisionPw] = useState(false);

  const [isBusy, setIsBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const user = auth.currentUser;
    if (!user || !user.email) {
      setFeedback({ type: "error", text: "No active admin session found." });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    if (currentPassword === newPassword) {
      setFeedback({ type: "error", text: "New password must be different from current password." });
      return;
    }

    setIsBusy(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      await recordAuditLog("Changed Admin Password", user.email, user.email);
      if (onAuditRecorded) await onAuditRecorded();

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFeedback({
        type: "success",
        text: "Admin password updated successfully! Use your new password next time you sign in.",
      });
    } catch (err) {
      setFeedback({ type: "error", text: mapFirebaseAuthError(err) });
    } finally {
      setIsBusy(false);
    }
  };

  const handleUpdateLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const user = auth.currentUser;
    const trimmedEmail = nextEmail.trim().toLowerCase();
    if (!user || !user.email) {
      setFeedback({ type: "error", text: "No active admin session found." });
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setFeedback({ type: "error", text: "Enter a valid new admin email address." });
      return;
    }

    setIsBusy(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, emailVerifyPassword);
      await reauthenticateWithCredential(user, credential);

      // Whitelist the new email first so the owner stays authorized after confirming
      if (!existingAdminEmails.includes(trimmedEmail)) {
        await onWhitelistEmail(trimmedEmail);
      }

      await verifyBeforeUpdateEmail(user, trimmedEmail);
      await recordAuditLog("Requested Admin Email Change", `${user.email} -> ${trimmedEmail}`, user.email);
      if (onAuditRecorded) await onAuditRecorded();

      setNextEmail("");
      setEmailVerifyPassword("");
      setFeedback({
        type: "success",
        text: `Verification link sent to ${trimmedEmail}. Click the link in that inbox to finalize your new Admin ID.`,
      });
    } catch (err) {
      setFeedback({ type: "error", text: mapFirebaseAuthError(err) });
    } finally {
      setIsBusy(false);
    }
  };

  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const trimmedEmail = newAdminEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setFeedback({ type: "error", text: "Enter a valid email ID for the new admin account." });
      return;
    }
    if (newAdminPassword.length < 8) {
      setFeedback({ type: "error", text: "Initial password must be at least 8 characters long." });
      return;
    }

    setIsBusy(true);
    const secondaryName = `admin-provisioner-${Date.now()}`;
    const secondaryApp = initializeApp(app.options, secondaryName);
    try {
      const secondaryAuth = getAuth(secondaryApp);
      await createUserWithEmailAndPassword(secondaryAuth, trimmedEmail, newAdminPassword);
      await signOut(secondaryAuth);

      await onWhitelistEmail(trimmedEmail);
      await recordAuditLog("Created Owner Admin Login", trimmedEmail, currentEmail);
      if (onAuditRecorded) await onAuditRecorded();

      setNewAdminEmail("");
      setNewAdminPassword("");
      setFeedback({
        type: "success",
        text: `Created & authorized admin ID "${trimmedEmail}". Share these credentials with the owner — they can change the password anytime after signing in.`,
      });
    } catch (err) {
      setFeedback({ type: "error", text: mapFirebaseAuthError(err) });
    } finally {
      try {
        await deleteApp(secondaryApp);
      } catch {
        // ignore cleanup errors
      }
      setIsBusy(false);
    }
  };

  const handleSendResetLink = async () => {
    if (!currentEmail) return;
    setIsBusy(true);
    setFeedback(null);
    try {
      await sendPasswordResetEmail(auth, currentEmail);
      setFeedback({
        type: "success",
        text: `Password reset link sent to ${currentEmail}.`,
      });
    } catch (err) {
      setFeedback({ type: "error", text: mapFirebaseAuthError(err) });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="bg-white border border-[#304B38]/12 rounded-[22px] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#304B38]/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#182B20] flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5 text-[#C69A3A]" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#C69A3A] uppercase block">
              ADMIN ID &amp; PASSWORD MANAGEMENT
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#171717]">
              Account Credentials &amp; Password
            </h2>
            <p className="text-xs text-[#595959] mt-0.5">
              Active Admin ID: <strong className="font-mono text-[#294D3A]">{currentEmail}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isBusy}
          onClick={handleSendResetLink}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFECE3] border border-[#304B38]/15 text-xs font-bold text-[#1F3026] transition-colors self-start md:self-auto"
        >
          <Send className="w-3.5 h-3.5 text-[#8C6A43]" />
          <span>Email Reset Link</span>
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setFeedback(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            mode === "password"
              ? "bg-[#294D3A] text-white"
              : "bg-[#FAF8F5] border border-[#304B38]/15 text-[#171717]"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Change Password</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("email");
            setFeedback(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            mode === "email"
              ? "bg-[#294D3A] text-white"
              : "bg-[#FAF8F5] border border-[#304B38]/15 text-[#171717]"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Change Admin ID (Email)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("create");
            setFeedback(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            mode === "create"
              ? "bg-[#294D3A] text-white"
              : "bg-[#FAF8F5] border border-[#304B38]/15 text-[#171717]"
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Create Owner ID &amp; Password</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs sm:text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* TAB 1: Change Current Admin Password */}
      {mode === "password" && (
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 pr-10 text-sm text-[#171717] focus:outline-none focus:border-[#294D3A]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#595959] hover:text-[#171717]"
                aria-label="Toggle current password visibility"
              >
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
                New Password (Min 8 chars)
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="New strong password"
                  className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 pr-10 text-sm text-[#171717] focus:outline-none focus:border-[#294D3A]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#595959] hover:text-[#171717]"
                  aria-label="Toggle new password visibility"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showNewPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Re-enter new password"
                className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#294D3A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="px-6 py-3 rounded-xl bg-[#294D3A] hover:bg-[#1C3628] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isBusy ? "Updating Password..." : "Update Admin Password"}
          </button>
        </form>
      )}

      {/* TAB 2: Change Admin Login Email ID */}
      {mode === "email" && (
        <form onSubmit={handleUpdateLoginEmail} className="space-y-4 max-w-xl">
          <p className="text-xs text-[#595959]">
            Change the email ID used to sign in to this admin account. Firebase will send a verification link to the new email ID before switching.
          </p>
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
              New Admin Email / ID
            </label>
            <input
              type="email"
              value={nextEmail}
              onChange={(e) => setNextEmail(e.target.value)}
              required
              placeholder="owner@jawairunners.org"
              className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#294D3A]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
              Verify Current Password
            </label>
            <input
              type="password"
              value={emailVerifyPassword}
              onChange={(e) => setEmailVerifyPassword(e.target.value)}
              required
              placeholder="Current password"
              className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#294D3A]"
            />
          </div>
          <button
            type="submit"
            disabled={isBusy}
            className="px-6 py-3 rounded-xl bg-[#294D3A] hover:bg-[#1C3628] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isBusy ? "Sending Verification..." : "Verify & Update Admin ID"}
          </button>
        </form>
      )}

      {/* TAB 3: Create New Owner ID & Password */}
      {mode === "create" && (
        <form onSubmit={handleCreateAdminUser} className="space-y-4 max-w-xl">
          <p className="text-xs text-[#595959]">
            Provision a dedicated Admin ID &amp; initial password for the website owner during handover. It will automatically be added to the authorized admin whitelist without signing you out.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
                Owner Admin Email ID
              </label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
                placeholder="owner@domain.com"
                className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#294D3A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
                Initial Password (Min 8 chars)
              </label>
              <div className="relative">
                <input
                  type={showProvisionPw ? "text" : "password"}
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Initial handover password"
                  className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 pr-10 text-sm text-[#171717] focus:outline-none focus:border-[#294D3A]"
                />
                <button
                  type="button"
                  onClick={() => setShowProvisionPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#595959] hover:text-[#171717]"
                  aria-label="Toggle password visibility"
                >
                  {showProvisionPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="px-6 py-3 rounded-xl bg-[#C69A3A] hover:bg-[#d8ab43] text-[#14231A] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isBusy ? "Creating Admin..." : "Create & Authorize Owner Account"}
          </button>
        </form>
      )}
    </div>
  );
}
