"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Settings {
  business_name: string;
  location: string;
  address: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  facebook_url: string;
  operating_hours: Record<string, string>;
}

const defaultHours = {
  monday: "08:00-18:00",
  tuesday: "08:00-18:00",
  wednesday: "08:00-18:00",
  thursday: "08:00-18:00",
  friday: "08:00-18:00",
  saturday: "08:00-14:00",
  sunday: "Closed",
  public_holidays: "Closed",
};

const defaultSettings: Settings = {
  business_name: "National Secure Storage",
  location: "Jeffrey's Bay",
  address: "35 St Croix Street, Jeffrey's Bay, Eastern Cape, 6330",
  phone_primary: "063 546 1740",
  phone_secondary: "061 905 8382",
  email: "info@nss-jbay.co.za",
  facebook_url: "https://facebook.com/nssjbay",
  operating_hours: defaultHours,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings({
          ...defaultSettings,
          ...data.settings,
          operating_hours: data.settings.operating_hours || defaultHours,
        });
      }
    } catch {
      setMessage("error|Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`error|${data.error || "Failed to save settings"}`);
        return;
      }

      setMessage("success|Settings saved successfully");
    } catch {
      setMessage("error|Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setSettings(defaultSettings);
    setMessage("");
  }

  function updateField(field: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4006A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#a09a95]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Facility Settings</h1>
          <p className="text-sm text-[#a09a95]">Configure your storage facility information</p>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.startsWith("success") ? "bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-[#22c55e]" : "bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444]"}`}>
          {message.split("|")[1]}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
          <h4 className="text-lg mb-5">Contact Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Facility Name</label>
              <input type="text" value={settings.business_name} onChange={(e) => updateField("business_name", e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Address</label>
              <input type="text" value={settings.address} onChange={(e) => updateField("address", e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Phone 1</label>
                <input type="tel" value={settings.phone_primary} onChange={(e) => updateField("phone_primary", e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Phone 2</label>
                <input type="tel" value={settings.phone_secondary} onChange={(e) => updateField("phone_secondary", e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={settings.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
          <h4 className="text-lg mb-5">Business Hours</h4>
          <div className="space-y-3">
            {Object.entries(settings.operating_hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between items-center py-2 border-b border-[#2a2a2a] last:border-b-0">
                <span className="text-sm text-[#a09a95] capitalize">{day.replace("_", " ")}</span>
                <span className="text-sm text-white font-mono">{hours}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h5 className="text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-3">Access Hours</h5>
            <p className="text-sm text-[#a09a95]">Tenants have 24/7 access to their units with their personal access code.</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
          <h4 className="text-lg mb-5">Social Media</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Facebook URL</label>
              <input type="url" value={settings.facebook_url} onChange={(e) => updateField("facebook_url", e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
          <h4 className="text-lg mb-5">Currency & Localization</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Currency Symbol</label>
              <input type="text" defaultValue="R" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Location</label>
              <input type="text" value={settings.location} onChange={(e) => updateField("location", e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn btn--primary">
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button onClick={handleReset} className="btn btn--outline">Reset to Defaults</button>
      </div>
    </div>
  );
}
