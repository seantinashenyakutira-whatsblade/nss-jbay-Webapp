"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="min-h-screen flex items-center justify-center py-24 px-4">
        <div className="w-full max-w-[460px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.3)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl mb-4">Password Updated</h1>
          <p className="text-sm text-[#a09a95]">Your password has been updated. Redirecting to dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="w-full max-w-[460px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
        <h1 className="text-3xl text-center mb-4">Set New Password</h1>
        <p className="text-sm text-[#a09a95] text-center mb-8">Choose a new password for your account</p>

        {error && (
          <div className="mb-4 p-3 rounded bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-sm text-[#ef4444]" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
              New Password <span className="text-[#ef4444]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560] hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
              Confirm Password <span className="text-[#ef4444]">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors"
                placeholder="Repeat password"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560] hover:text-white"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn--primary btn--block btn--lg">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        <div className="text-center mt-6 pt-5 border-t border-[#2a2a2a]">
          <p className="text-sm text-[#a09a95]"><a href="/auth/login" className="text-[#D4006A]">Back to login</a></p>
        </div>
      </div>
    </section>
  );
}
