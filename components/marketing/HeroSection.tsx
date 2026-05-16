import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-[72px]">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(212,0,106,0.08)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_70%_60%,rgba(212,0,106,0.05)_0%,transparent_50%),linear-gradient(180deg,#0A0A0A_0%,#111_100%)]" />
      <div className="container relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#111] font-mono text-xs text-[#a09a95] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          Now Open in Jeffrey&apos;s Bay
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] leading-none mb-4">
          STORE SAFE. <span className="text-[#D4006A]">STORE SMART.</span>
        </h1>
        <p className="text-base md:text-lg text-[#a09a95] leading-relaxed max-w-[540px] mb-6">
          Secure, affordable self-storage units in Jeffrey&apos;s Bay. 24/7 CCTV, flexible month-to-month contracts, and drive-up access. Your space, your peace of mind.
        </p>
        <div className="flex gap-3 md:gap-4 flex-wrap">
          <a href="/units" className="btn btn--primary btn--lg">
            Browse Storage Units <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#how-it-works" className="btn btn--outline btn--lg">How It Works</a>
        </div>
      </div>
    </section>
  );
}
