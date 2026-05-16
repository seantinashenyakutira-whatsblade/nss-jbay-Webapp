import Link from "next/link";
import { ArrowRight } from "lucide-react";

const units = [
  { size: "Extra Small", sqm: 6, dims: "3m × 2m × 2.4m", price: "R 450", query: "extra-small" },
  { size: "Small", sqm: 9, dims: "3m × 3m × 2.4m", price: "R 750", query: "small" },
  { size: "Medium", sqm: 18, dims: "6m × 3m × 2.4m", price: "R 1 200", query: "medium" },
  { size: "Large", sqm: 27, dims: "9m × 3m × 2.4m", price: "R 1 800", query: "large" },
];

export default function UnitGridSection() {
  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section__header">
          <h2 className="text-3xl sm:text-4xl md:text-5xl">Our Unit Sizes</h2>
          <p className="section__subtitle">Find the perfect space for your needs</p>
        </div>
        <div className="grid grid--2 gap-4">
          {units.map((u) => (
            <Link
              key={u.query}
              href={`/units?size=${u.query}`}
              className="flex flex-col justify-between p-4 md:p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md hover:border-[#D4006A] hover:-translate-y-0.5 transition-all group min-h-[140px] md:min-h-[180px]"
            >
              <div>
                <div className="font-heading text-2xl md:text-3xl text-white mb-1">{u.size}</div>
                <div className="text-sm text-[#a09a95] mb-3">{u.sqm} m² · {u.dims}</div>
                <div className="font-heading text-2xl text-[#D4006A]">
                  {u.price} <span className="text-sm text-[#6b6560] font-body">/month</span>
                </div>
              </div>
              <span className="font-mono text-xs text-[#D4006A] uppercase tracking-widest opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                Book Now <ArrowRight className="w-3 h-3 inline" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
