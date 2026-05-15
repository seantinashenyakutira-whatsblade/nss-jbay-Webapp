export default function StatsBar() {
  return (
    <div className="border-y border-[#2a2a2a] bg-[#111]">
      <div className="container grid grid-cols-2 md:grid-cols-4 divide-x divide-[#2a2a2a]">
        <div className="py-7 text-center">
          <div className="font-heading text-3xl text-[#D4006A]">24/7</div>
          <div className="font-mono text-xs text-[#a09a95] uppercase tracking-wider">CCTV &amp; Security</div>
        </div>
        <div className="py-7 text-center">
          <div className="font-heading text-3xl text-[#D4006A]">8</div>
          <div className="font-mono text-xs text-[#a09a95] uppercase tracking-wider">Unit Sizes</div>
        </div>
        <div className="py-7 text-center">
          <div className="font-heading text-3xl text-[#D4006A]">R 450</div>
          <div className="font-mono text-xs text-[#a09a95] uppercase tracking-wider">Starting Price</div>
        </div>
        <div className="py-7 text-center">
          <div className="font-heading text-3xl text-[#D4006A]">Central</div>
          <div className="font-mono text-xs text-[#a09a95] uppercase tracking-wider">JBay Location</div>
        </div>
      </div>
    </div>
  );
}
