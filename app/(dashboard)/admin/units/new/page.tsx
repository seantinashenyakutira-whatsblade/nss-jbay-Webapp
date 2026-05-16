import { Button } from "@/components/ui/Button";
import { Image } from "lucide-react";

export default function AdminNewUnitPage() {
  return (
    <div>
      <h1 className="text-4xl mb-1">Add New Unit</h1>
      <p className="text-sm text-[#a09a95] mb-8">Create a new storage unit</p>

      <form action="/api/admin/units" method="POST" encType="multipart/form-data" className="max-w-[960px]">
        <div className="grid grid--2 gap-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="unitName" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Unit Name <span className="text-[#ef4444]">*</span></label>
              <input type="text" id="unitName" name="name" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="e.g. Extra Small â€” Essentials" required />
            </div>
            <div>
              <label htmlFor="unitSize" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Size Category <span className="text-[#ef4444]">*</span></label>
              <select id="unitSize" name="size" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required>
                <option value="extra-small">Extra Small</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="unitSqm" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Square Meters <span className="text-[#ef4444]">*</span></label>
                <input type="number" id="unitSqm" name="sqm" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required />
              </div>
              <div>
                <label htmlFor="unitDims" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Dimensions <span className="text-[#ef4444]">*</span></label>
                <input type="text" id="unitDims" name="dimensions" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="3m Ã— 2m Ã— 2.4m" required />
              </div>
            </div>
            <div>
              <label htmlFor="unitDesc" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Description</label>
              <textarea id="unitDesc" name="description" rows={3} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Describe the unit..."></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="unitPriceMonthly" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Monthly Price (R) <span className="text-[#ef4444]">*</span></label>
                <input type="number" step="0.01" id="unitPriceMonthly" name="price_monthly" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required />
              </div>
              <div>
                <label htmlFor="unitPriceAnnual" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Annual Price (R)</label>
                <input type="number" step="0.01" id="unitPriceAnnual" name="price_annual" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="unitBlock" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Block / Section</label>
              <input type="text" id="unitBlock" name="block_section" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="A, B, C, D" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="unitImage" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Unit Image</label>
              <input type="file" id="unitImage" name="image" accept="image/jpeg,image/png,image/webp" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[#D4006A] file:text-white file:text-xs file:font-medium" />
              <div className="mt-3 w-full h-[180px] bg-[#111] rounded border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
                <Image className="w-8 h-8 text-[#6b6560]" />
                <span className="font-mono text-xs text-[#6b6560] ml-2">Image preview</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Availability <span className="text-[#ef4444]">*</span></label>
              <div className="flex gap-3 mt-2">
                <label className="flex items-center gap-2 text-sm text-[#a09a95]"><input type="radio" name="availability" value="available" defaultChecked /> Available</label>
                <label className="flex items-center gap-2 text-sm text-[#a09a95]"><input type="radio" name="availability" value="few-left" /> Few Left</label>
                <label className="flex items-center gap-2 text-sm text-[#a09a95]"><input type="radio" name="availability" value="rented" /> Rented</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Features</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["ground-floor", "cctv", "drive-up", "double-door", "climate", "security"].map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm text-[#a09a95]">
                    <input type="checkbox" name="features" value={f} /> {f.replace(/-/g, " ")}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--lg btn--block mt-8">Publish Unit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

