"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!mounted) return;
      if (!u) { router.push("/auth/login?redirect=/profile"); return; }
      setUser(u);
      setFirstName(u.user_metadata?.first_name || "");
      setLastName(u.user_metadata?.last_name || "");
      setPhone(u.user_metadata?.phone || "");
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4006A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#a09a95]">Loading profile...</p>
        </div>
      </div>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName, phone },
    });
    if (error) {
      setMessage("error|Failed to update profile");
    } else {
      setMessage("success|Profile updated successfully");
    }
    setSaving(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordMessage("error|Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("error|Password must be at least 6 characters");
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordMessage(`error|${data.error || "Failed to update password"}`);
        setPasswordSaving(false);
        return;
      }

      setPasswordMessage("success|Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordMessage("error|An unexpected error occurred");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleDelete() {
    const { error } = await supabase.rpc("delete_user_account", {
      email: user?.email,
    });
    if (error) {
      setMessage("error|Failed to delete account. Please contact support.");
    } else {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
    setDeleteModalOpen(false);
  }

  return (
    <div>
      <h1 className="text-4xl mb-8">My Profile</h1>
      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.startsWith("success") ? "bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-[#22c55e]" : "bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444]"}`}>
          {message.split("|")[1]}
        </div>
      )}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6 mb-8" style={{ maxWidth: 640 }}>
        <h4 className="text-lg mb-5">Personal Information</h4>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">First Name <span className="text-[#ef4444]">*</span></label>
              <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Last Name <span className="text-[#ef4444]">*</span></label>
              <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" value={user?.email || ""} disabled className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white/60 outline-none cursor-not-allowed" />
            <span className="text-xs text-[#6b6560] mt-1">Email cannot be changed</span>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Phone</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="063 546 1740" />
          </div>
          <button type="submit" disabled={saving} className="btn btn--primary">{saving ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6 mb-8" style={{ maxWidth: 640 }}>
        <h4 className="text-lg mb-1">Change Password</h4>
        <p className="text-sm text-[#a09a95] mb-6">Enter a new password for your account</p>

        {passwordMessage && (
          <div className={`mb-4 p-3 rounded text-sm ${passwordMessage.startsWith("success") ? "bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-[#22c55e]" : "bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444]"}`}>
            {passwordMessage.split("|")[1]}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">New Password <span className="text-[#ef4444]">*</span></label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 pr-10 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Min. 6 characters" required minLength={6} autoComplete="new-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560] hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Confirm Password <span className="text-[#ef4444]">*</span></label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 pr-10 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Repeat password" required minLength={6} autoComplete="new-password" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560] hover:text-white" aria-label={showConfirm ? "Hide password" : "Show password"}>
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={passwordSaving} className="btn btn--outline">{passwordSaving ? "Updating..." : "Update Password"}</button>
        </form>
      </div>
      <div className="bg-[#1a1a1a] border border-[rgba(239,68,68,0.3)] rounded-md p-6" style={{ maxWidth: 640 }}>
        <h4 className="text-lg mb-1" style={{ color: "#ef4444" }}>Danger Zone</h4>
        <p className="text-sm text-[#a09a95] mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button onClick={() => setDeleteModalOpen(true)} className="btn btn--danger btn--sm">Delete My Account</button>
      </div>
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Account"
        footer={
          <>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn--outline">Cancel</button>
            <button onClick={handleDelete} disabled={deleteInput !== user?.email} className="btn btn--danger" style={{ opacity: deleteInput !== user?.email ? 0.5 : 1 }}>Permanently Delete Account</button>
          </>
        }
      >
        <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded p-4 mb-4">
          <p className="text-sm text-[#ef4444]"><AlertTriangle className="w-4 h-4 inline mr-1" /> Warning: This will permanently delete your account and all associated bookings and data.</p>
        </div>
        <p className="text-sm text-[#a09a95]">To confirm, please type your email address:</p>
        <p className="font-mono text-sm text-[#6b6560] mt-1">{user?.email}</p>
        <input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} className="w-full px-4 py-2.5 mt-4 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Type your email to confirm" />
      </Modal>
    </div>
  );
}
