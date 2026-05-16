import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin/settings&domain=hub");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/dashboard");

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Facility Settings</h1>
          <p className="text-sm text-[#a09a95]">Configure your storage facility information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
          <h4 className="text-lg mb-5">Contact Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Facility Name</label>
              <input type="text" defaultValue={process.env.SITE_NAME || "National Secure Storage"} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Address</label>
              <input type="text" defaultValue={process.env.SITE_ADDRESS || "35 St Croix Street, Jeffrey's Bay, Eastern Cape, 6330"} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Phone 1</label>
                <input type="tel" defaultValue={process.env.SITE_PHONE_1 || "063 546 1740"} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Phone 2</label>
                <input type="tel" defaultValue={process.env.SITE_PHONE_2 || "061 905 8382"} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" defaultValue={process.env.SITE_EMAIL || "info@nss-jbay.co.za"} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
          <h4 className="text-lg mb-5">Business Hours</h4>
          <div className="space-y-3">
            {[
              { day: "Monday - Friday", hours: "08:00 - 18:00" },
              { day: "Saturday", hours: "08:00 - 14:00" },
              { day: "Sunday", hours: "Closed" },
              { day: "Public Holidays", hours: "Closed" },
            ].map((item) => (
              <div key={item.day} className="flex justify-between items-center py-2 border-b border-[#2a2a2a] last:border-b-0">
                <span className="text-sm text-[#a09a95]">{item.day}</span>
                <span className="text-sm text-white font-mono">{item.hours}</span>
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
              <input type="url" defaultValue={process.env.FB_URL || "https://facebook.com/nssjbay"} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
          <h4 className="text-lg mb-5">Currency & Localization</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Currency Symbol</label>
              <input type="text" defaultValue={process.env.CURRENCY || "R"} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Location</label>
              <input type="text" defaultValue={process.env.SITE_LOCATION || "Jeffrey's Bay"} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="btn btn--primary">Save Changes</button>
        <button className="btn btn--outline">Reset to Defaults</button>
      </div>
    </div>
  );
}
