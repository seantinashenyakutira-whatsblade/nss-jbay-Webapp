"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, UserPlus } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    window.location.href = redirect;
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    setError("");
    alert("Account created! Check your email for confirmation.");
    setActiveTab("login");
    setLoading(false);
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="w-full max-w-[460px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
        <div className="flex mb-8 border-b border-[#2a2a2a]">
          <button
            className={`flex-1 pb-3 font-heading text-xl text-center transition-colors border-b-2 ${
              activeTab === "login" ? "text-[#D4006A] border-[#D4006A]" : "text-[#6b6560] border-transparent hover:text-[#a09a95]"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Log In
          </button>
          <button
            className={`flex-1 pb-3 font-heading text-xl text-center transition-colors border-b-2 ${
              activeTab === "register" ? "text-[#D4006A] border-[#D4006A]" : "text-[#6b6560] border-transparent hover:text-[#a09a95]"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-sm text-[#ef4444]" role="alert">
            {error}
          </div>
        )}

        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="loginEmail" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                Email <span className="text-[#ef4444]">*</span>
              </label>
              <input type="email" id="loginEmail" name="email" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="your@email.com" required autoComplete="email" />
            </div>
            <div>
              <label htmlFor="loginPassword" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                Password <span className="text-[#ef4444]">*</span>
              </label>
              <input type="password" id="loginPassword" name="password" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Enter your password" required autoComplete="current-password" />
            </div>
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-xs text-[#a09a95] hover:text-white">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn btn--primary btn--block btn--lg">
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="regFirstName" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">First Name <span className="text-[#ef4444]">*</span></label>
                <input type="text" id="regFirstName" name="firstName" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="John" required />
              </div>
              <div>
                <label htmlFor="regLastName" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Last Name <span className="text-[#ef4444]">*</span></label>
                <input type="text" id="regLastName" name="lastName" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Doe" required />
              </div>
            </div>
            <div>
              <label htmlFor="regEmail" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Email <span className="text-[#ef4444]">*</span></label>
              <input type="email" id="regEmail" name="email" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="your@email.com" required autoComplete="email" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="regPassword" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Password <span className="text-[#ef4444]">*</span></label>
                <input type="password" id="regPassword" name="password" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Min. 8 characters" required minLength={8} autoComplete="new-password" />
              </div>
              <div>
                <label htmlFor="regConfirm" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Confirm <span className="text-[#ef4444]">*</span></label>
                <input type="password" id="regConfirm" name="confirmPassword" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Repeat password" required minLength={8} autoComplete="new-password" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn--primary btn--block btn--lg">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-sm text-[#a09a95]">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
