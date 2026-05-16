"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset link");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="w-full max-w-[460px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
        <h1 className="text-3xl text-center mb-4">Reset Password</h1>
        <p className="text-sm text-[#a09a95] text-center mb-8">Enter your email and we&apos;ll send you a reset link</p>

        {error && (
          <div className="mb-4 p-3 rounded bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-sm text-[#ef4444]" role="alert">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.3)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#22c55e]" />
            </div>
            <p className="text-sm text-[#22c55e] mb-4">Check your email for the reset link.</p>
            <a href="/auth/login" className="text-[#D4006A] text-sm">Back to login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                Email <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn--primary btn--block btn--lg">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="text-center mt-6 pt-5 border-t border-[#2a2a2a]">
          <p className="text-sm text-[#a09a95]">Remember your password? <a href="/auth/login" className="text-[#D4006A]">Log in</a></p>
        </div>
      </div>
    </section>
  );
}
