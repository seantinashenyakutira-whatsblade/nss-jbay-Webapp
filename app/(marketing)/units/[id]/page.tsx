import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import UnitImage from "@/components/marketing/UnitImage";

interface UnitDetailPageProps {
  params: { id: string };
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const supabase = await createClient();
  const { data: unit, error } = await supabase
    .from("units")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    console.error("Failed to fetch unit:", error);
    return (
      <section className="page">
        <div className="container w-full" style={{ maxWidth: 760 }}>
          <a href="/units" className="inline-flex items-center gap-1.5 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Units
          </a>
          <div className="empty-state">
            <div className="empty-state__icon"><AlertTriangle className="w-16 h-16 mx-auto text-[#f59e0b]" /></div>
            <h3 className="empty-state__title">Unable to load unit details</h3>
            <p className="empty-state__text">Something went wrong. Please try again later.</p>
            <a href="/units" className="btn btn--primary">Browse All Units</a>
          </div>
        </div>
      </section>
    );
  }

  if (!unit) notFound();

  const badgeVariant = unit.availability === "available" ? "success" : unit.availability === "few-left" ? "warning" : "error";

  return (
    <section className="page">
      <div className="container w-full" style={{ maxWidth: 760 }}>
        <a href="/units" className="inline-flex items-center gap-1.5 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Units
        </a>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md overflow-hidden mb-6">
          <UnitImage unit={{ size: unit.size, name: unit.name }} width={800} height={400} className="h-[200px] md:h-[300px]" />
        </div>

        <div className="flex justify-between items-start flex-wrap gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl mb-1">{unit.name}</h1>
            <p className="font-mono text-sm text-[#6b6560]">{unit.sqm} m² &mdash; {unit.dimensions}</p>
          </div>
          <Badge variant={badgeVariant as "success" | "warning" | "error"}>
            {unit.availability === "few-left" ? "Few Left" : unit.availability.charAt(0).toUpperCase() + unit.availability.slice(1)}
          </Badge>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-4 md:p-6 mb-6">
          <div className="card__price text-3xl sm:text-4xl md:text-5xl">
            R {Number(unit.price_monthly).toLocaleString("en-ZA")}
            <span className="card__price-label">/month</span>
          </div>
          {unit.price_annual && (
            <p className="font-mono text-sm text-[#6b6560] mt-1">
              R {Number(unit.price_annual).toLocaleString("en-ZA")} per year &mdash; save up to 15%
            </p>
          )}
        </div>

        {unit.description && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-4 md:p-6 mb-6">
            <h4 className="text-lg mb-2">Description</h4>
            <p className="text-[#a09a95]" style={{ fontSize: "0.9375rem", lineHeight: 1.7 }}>{unit.description}</p>
          </div>
        )}

        {unit.features && unit.features.length > 0 && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-4 md:p-6 mb-6">
            <h4 className="text-lg mb-3">Features</h4>
            <div className="flex flex-wrap gap-2">
              {unit.features.map((f: string) => (
                <div key={f} className="flex items-center gap-1.5 text-sm text-[#a09a95]">
                  <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                  {f.replace(/-/g, " ")}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button href={`/bookings/new?unit=${unit.id}`} variant="primary" size="lg" block>Book This Unit</Button>
          <Button href="/units" variant="outline" size="lg" block>View All Units</Button>
        </div>
      </div>
    </section>
  );
}
