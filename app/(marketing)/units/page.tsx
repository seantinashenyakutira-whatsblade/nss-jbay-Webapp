import { createClient } from "@/lib/supabase/server";
import UnitCard from "@/components/marketing/UnitCard";
import { Search, SearchX, AlertTriangle } from "lucide-react";

interface UnitsPageProps {
  searchParams: { size?: string; availability?: string };
}

export default async function UnitsPage({ searchParams }: UnitsPageProps) {
  const supabase = await createClient();
  let query = supabase
    .from("units")
    .select("*")
    .eq("is_active", true)
    .order("sqm", { ascending: true });

  const size = searchParams.size;
  const availability = searchParams.availability;

  if (size && size !== "all") {
    query = query.eq("size", size);
  }
  if (availability && availability !== "all") {
    query = query.eq("availability", availability);
  }

  const { data: units, error } = await query;

  if (error) {
    console.error("Failed to fetch units:", error);
    return (
      <section className="page">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="page__title text-5xl">BROWSE &amp; BOOK</h1>
              <p className="page__subtitle">Storage units</p>
            </div>
          </div>
          <div className="empty-state">
            <div className="empty-state__icon"><AlertTriangle className="w-16 h-16 mx-auto text-[#f59e0b]" /></div>
            <h3 className="empty-state__title">Unable to load units</h3>
            <p className="empty-state__text">Something went wrong. Please try again later or contact support if the issue persists.</p>
            <a href="/units" className="btn btn--primary">Try Again</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="page__title text-5xl">BROWSE &amp; BOOK</h1>
            <p className="page__subtitle">{units?.length || 0} unit{(units?.length || 0) !== 1 ? "s" : ""} available</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6b6560] pointer-events-none" />
            <input
              type="text"
              id="unitSearch"
              placeholder="Search units..."
              aria-label="Search units"
              className="pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-sm text-white outline-none focus:border-[#D4006A] transition-colors w-full md:w-[260px]"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {["all", "extra-small", "small", "medium", "large"].map((s) => (
            <a
              key={s}
              href={`/units${s !== "all" ? `?size=${s}` : ""}`}
              className={`px-5 py-2 rounded-full border text-sm transition-all ${
                (size === s || (!size && s === "all"))
                  ? "bg-[#D4006A] text-white border-[#D4006A]"
                  : "border-[#2a2a2a] text-[#a09a95] hover:text-white hover:border-[#D4006A]"
              }`}
            >
              {s === "all" ? "All" : s === "extra-small" ? "Extra Small" : s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>

        {units && units.length > 0 ? (
          <div className="grid grid--3" id="unitsGrid">
            {units.map((unit: any) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon"><SearchX className="w-16 h-16 mx-auto text-[#6b6560]" /></div>
            <h3 className="empty-state__title">No units match your criteria</h3>
            <p className="empty-state__text">Try adjusting your filters or check back later.</p>
            <a href="/units" className="btn btn--primary">Clear Filters</a>
          </div>
        )}
      </div>
    </section>
  );
}
