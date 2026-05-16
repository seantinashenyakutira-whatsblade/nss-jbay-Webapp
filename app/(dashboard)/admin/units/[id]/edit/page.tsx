import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface EditUnitPageProps {
  params: { id: string };
}

export default async function EditUnitPage({ params }: EditUnitPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin/units");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: unit, error } = await supabase.from("units").select("*").eq("id", params.id).single();
  if (error || !unit) notFound();

  const allFeatures = ["ground-floor", "cctv", "drive-up", "double-door", "climate", "security", "well-lit", "wide-access"];
  const unitFeatures = unit.features || [];

  return (
    <div>
      <a href="/admin/units" className="inline-flex items-center gap-1.5 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Units
      </a>

      <h1 className="text-4xl mb-1">Edit Unit</h1>
      <p className="text-sm text-[#a09a95] mb-8">Update {unit.name}</p>

      <form action={`/api/admin/units/${unit.id}`} method="POST" encType="multipart/form-data" className="max-w-[960px]">
        <input type="hidden" name="_method" value="PUT" />
        <div className="grid grid--2 gap-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="unitName" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Unit Name <span className="text-[#ef4444]">*</span></label>
              <input type="text" id="unitName" name="name" defaultValue={unit.name} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required />
            </div>
            <div>
              <label htmlFor="unitSize" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Size Category <span className="text-[#ef4444]">*</span></label>
              <select id="unitSize" name="size" defaultValue={unit.size} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required>
                <option value="extra-small">Extra Small</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="unitSqm" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Square Meters <span className="text-[#ef4444]">*</span></label>
                <input type="number" id="unitSqm" name="sqm" defaultValue={unit.sqm} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required />
              </div>
              <div>
                <label htmlFor="unitDims" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Dimensions <span className="text-[#ef4444]">*</span></label>
                <input type="text" id="unitDims" name="dimensions" defaultValue={unit.dimensions} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required />
              </div>
            </div>
            <div>
              <label htmlFor="unitDesc" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Description</label>
              <textarea id="unitDesc" name="description" rows={3} defaultValue={unit.description || ""} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Describe the unit..."></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="unitPriceMonthly" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Monthly Price (R) <span className="text-[#ef4444]">*</span></label>
                <input type="number" step="0.01" id="unitPriceMonthly" name="price_monthly" defaultValue={unit.price_monthly} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required />
              </div>
              <div>
                <label htmlFor="unitPriceAnnual" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Annual Price (R)</label>
                <input type="number" step="0.01" id="unitPriceAnnual" name="price_annual" defaultValue={unit.price_annual || ""} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="unitBlock" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Block / Section</label>
              <input type="text" id="unitBlock" name="block_section" defaultValue={unit.block_section || ""} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="A, B, C, D" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Availability <span className="text-[#ef4444]">*</span></label>
              <div className="flex gap-3 mt-2">
                <label className="flex items-center gap-2 text-sm text-[#a09a95]"><input type="radio" name="availability" value="available" defaultChecked={unit.availability === "available"} /> Available</label>
                <label className="flex items-center gap-2 text-sm text-[#a09a95]"><input type="radio" name="availability" value="few-left" defaultChecked={unit.availability === "few-left"} /> Few Left</label>
                <label className="flex items-center gap-2 text-sm text-[#a09a95]"><input type="radio" name="availability" value="rented" defaultChecked={unit.availability === "rented"} /> Rented</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Features</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {allFeatures.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm text-[#a09a95]">
                    <input type="checkbox" name="features" value={f} defaultChecked={unitFeatures.includes(f)} /> {f.replace(/-/g, " ")}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="isActive" name="is_active" defaultChecked={unit.is_active} className="rounded border-[#2a2a2a] bg-[#0A0A0A] text-[#D4006A] focus:ring-[#D4006A]" />
              <label htmlFor="isActive" className="text-sm text-[#a09a95]">Unit is active and visible to customers</label>
            </div>
            <button type="submit" className="btn btn--primary btn--lg btn--block mt-8">Update Unit</button>
          </div>
        </div>
      </form>
    </div>
  );
}
