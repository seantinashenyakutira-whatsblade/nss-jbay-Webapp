"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface Unit {
  id: string;
  name: string;
  price_monthly: number;
  availability: string;
}

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedUnit = searchParams.get("unit") || "";

  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState(preselectedUnit);
  const [duration, setDuration] = useState("1");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login?redirect=/bookings/new");
        return;
      }
    });

    supabase
      .from("units")
      .select("*")
      .eq("is_active", true)
      .order("sqm", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch units:", error);
        } else {
          setUnits(data || []);
        }
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!selectedUnit || !duration || !startDate) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId: selectedUnit, duration: parseInt(duration), startDate }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create booking");
        setSubmitting(false);
        return;
      }

      router.push(`/payments/pay/${data.booking.id}`);
    } catch {
      setError("An unexpected error occurred");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <div className="container" style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#D4006A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#a09a95]">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (units.length === 0) {
    return (
      <section className="page">
        <div className="container" style={{ maxWidth: 640, margin: "0 auto" }}>
          <a href="/units" className="inline-flex items-center gap-1.5 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Units
          </a>
          <div className="empty-state">
            <div className="empty-state__icon"><AlertTriangle className="w-16 h-16 mx-auto text-[#f59e0b]" /></div>
            <h3 className="empty-state__title">No units available</h3>
            <p className="empty-state__text">Please try again later.</p>
            <a href="/units" className="btn btn--primary">Browse Units</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 640, margin: "0 auto" }}>
        <a href="/units" className="inline-flex items-center gap-1.5 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Units
        </a>

        <h1 className="text-4xl mb-2">New Booking</h1>
        <p className="text-[#a09a95] mb-8">Select your unit and rental period</p>

        {error && (
          <div className="mb-4 p-3 rounded bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-sm text-[#ef4444]" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="unitId" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                Storage Unit <span className="text-[#ef4444]">*</span>
              </label>
              <select id="unitId" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required>
                <option value="">Select a unit...</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} &mdash; R {Number(u.price_monthly).toLocaleString("en-ZA")}/month
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                Rental Duration <span className="text-[#ef4444]">*</span>
              </label>
              <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required>
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
              <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" required />
            </div>

            <Button type="submit" variant="primary" size="lg" block disabled={submitting}>
              {submitting ? "Creating Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function BookingNewPage() {
  return (
    <Suspense fallback={
      <section className="page">
        <div className="container" style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#D4006A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#a09a95]">Loading...</p>
          </div>
        </div>
      </section>
    }>
      <BookingForm />
    </Suspense>
  );
}
