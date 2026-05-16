import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface BookingNewPageProps {
  searchParams: { unit?: string };
}

export default async function BookingNewPage({ searchParams }: BookingNewPageProps) {
  const supabase = await createClient();
  const { data: units, error } = await supabase
    .from("units")
    .select("*")
    .eq("is_active", true)
    .order("sqm", { ascending: true });

  if (error) {
    console.error("Failed to fetch units:", error);
    return (
      <section className="page">
        <div className="container" style={{ maxWidth: 640, margin: "0 auto" }}>
          <a href="/units" className="inline-flex items-center gap-1.5 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Units
          </a>
          <div className="empty-state">
            <div className="empty-state__icon"><AlertTriangle className="w-16 h-16 mx-auto text-[#f59e0b]" /></div>
            <h3 className="empty-state__title">Unable to load units</h3>
            <p className="empty-state__text">Something went wrong. Please try again later.</p>
            <a href="/units" className="btn btn--primary">Browse Units</a>
          </div>
        </div>
      </section>
    );
  }

  const safeUnits = units || [];

  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 640, margin: "0 auto" }}>
        <a href="/units" className="inline-flex items-center gap-1.5 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Units
        </a>

        <h1 className="text-4xl mb-2">New Booking</h1>
        <p className="text-[#a09a95] mb-8">Select your unit and rental period</p>

        <form action="/api/bookings" method="POST">
          <div className="space-y-4">
            <div>
              <label htmlFor="unitId" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                Storage Unit <span className="text-[#ef4444]">*</span>
              </label>
              <select id="unitId" name="unitId" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required>
                <option value="">Select a unit...</option>
                {safeUnits?.map((u: any) => (
                  <option key={u.id} value={u.id} selected={searchParams.unit === u.id}>
                    {u.name} &mdash; R {Number(u.price_monthly).toLocaleString("en-ZA")}/month
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                Rental Duration <span className="text-[#ef4444]">*</span>
              </label>
              <select id="duration" name="duration" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required>
                <option value="1">1 Month &mdash; Full price</option>
                <option value="3">3 Months &mdash; 5% discount</option>
                <option value="6">6 Months &mdash; 10% discount</option>
                <option value="12">12 Months &mdash; 15% discount</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                Start Date <span className="text-[#ef4444]">*</span>
              </label>
              <input type="date" id="startDate" name="startDate" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required defaultValue={new Date().toISOString().split("T")[0]} />
            </div>

            <Button type="submit" variant="primary" size="lg" block>Confirm Booking</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
