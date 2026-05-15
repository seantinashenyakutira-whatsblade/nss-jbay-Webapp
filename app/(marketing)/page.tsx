import HeroSection from "@/components/marketing/HeroSection";
import StatsBar from "@/components/marketing/StatsBar";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import UnitGridSection from "@/components/marketing/UnitGridSection";
import TestimonialCard from "@/components/marketing/TestimonialCard";
import { ArrowRight } from "lucide-react";

const testimonials = [
  { quote: "Safe, clean, and affordable. The online booking made it so easy to reserve my unit. Highly recommend!", author: "Sarah V., JBay" },
  { quote: "I store my business inventory here. The drive-up access saves me so much time. Great service all around.", author: "Mark T., St Francis" },
  { quote: "Moved from a house to an apartment and needed overflow space. The medium unit was perfect — easy access and great security.", author: "Linda K., Jeffreys Bay" },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <UnitGridSection />
      <section className="section bg-gradient-to-br from-[#D4006A] to-[#a00050]">
        <div className="container text-center">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] text-white mb-3">READY TO GET STARTED?</h2>
          <p className="text-lg text-white/80 mb-8">Choose your unit, book online, and move in today.</p>
          <a href="/units" className="btn btn--outline btn--lg border-white/50 text-white hover:border-white hover:bg-white/10">
            Browse Available Units <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="text-4xl md:text-5xl">What Our Customers Say</h2>
          </div>
          <div className="grid grid--3">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} quote={t.quote} author={t.author} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
