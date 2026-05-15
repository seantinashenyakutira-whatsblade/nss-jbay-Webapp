import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getUnitImageUrl } from "@/lib/images";

interface UnitCardProps {
  unit: {
    id: string;
    name: string;
    size: string;
    sqm: number;
    dimensions: string;
    description?: string;
    price_monthly: number;
    price_annual?: number | null;
    availability: string;
    features?: string[];
    currency?: string;
  };
}

export default function UnitCard({ unit }: UnitCardProps) {
  const badgeVariant = unit.availability === "available" ? "success" : unit.availability === "few-left" ? "warning" : "error";
  const badgeLabel = unit.availability === "few-left" ? "Few Left" : unit.availability.charAt(0).toUpperCase() + unit.availability.slice(1);

  return (
    <div className="card rounded-md group">
      <div className="w-full h-[180px] overflow-hidden relative">
        <img
          src={getUnitImageUrl(unit.name)}
          alt={unit.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#111] to-[#222]"></div>';
          }}
        />
      </div>
      <div className="p-6">
        <div className="card__meta">
          <Badge variant={badgeVariant as "success" | "warning" | "error"}>{badgeLabel}</Badge>
          <span className="card__meta-item">{unit.sqm} m²</span>
        </div>
        <h3 className="card__title">{unit.name}</h3>
        <p className="card__text mb-4 line-clamp-2">{unit.dimensions}. {unit.description || ""}</p>
        <div className="card__price text-4xl">
          {unit.currency || "R"} {Number(unit.price_monthly).toLocaleString("en-ZA")}
          <span className="card__price-label">/month</span>
        </div>
        {unit.features && unit.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {unit.features.map((f) => (
              <span key={f} className="font-mono text-xs px-2.5 py-1 bg-[#111] rounded-full text-[#a09a95] border border-[#2a2a2a] lowercase first-letter:uppercase">
                {f.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#2a2a2a]">
        <Link href={`/bookings/new?unit=${unit.id}`} className="btn btn--primary btn--sm">Book Now</Link>
        {unit.price_annual && (
          <span className="font-mono text-xs text-[#6b6560]">
            {unit.currency || "R"} {Number(unit.price_annual).toLocaleString("en-ZA")}/yr
          </span>
        )}
      </div>
    </div>
  );
}
