import { Shield, CreditCard, Calendar, MapPin } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "24/7 CCTV & Electric Fencing",
    description: "Your belongings are monitored around the clock with CCTV cameras and secure perimeter fencing.",
  },
  {
    icon: CreditCard,
    title: "Book & Pay Online Anytime",
    description: "Our online platform lets you reserve, manage, and pay for your storage unit 24/7 from anywhere.",
  },
  {
    icon: Calendar,
    title: "Flexible Monthly Payments",
    description: "No long-term contracts. Choose monthly, quarterly, or annual terms with discounts up to 15%.",
  },
  {
    icon: MapPin,
    title: "Central Jeffrey's Bay Location",
    description: "Conveniently located on St Croix Street, easy to find and access. Drive-up units available.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section__header">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-2">Why Choose Us</h2>
          <p className="section__subtitle">We make storage simple, secure, and affordable</p>
        </div>
        <div className="grid grid--4">
          {features.map((f, i) => (
            <div key={i} className="card card--glow border border-[#2a2a2a] rounded-md p-6 text-center hover:border-[#D4006A] transition-all hover:shadow-[0_0_20px_rgba(212,0,106,0.15)]" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex justify-center mb-4">
                <f.icon className="w-12 h-12 text-[#D4006A]" />
              </div>
              <h3 className="card__title text-lg">{f.title}</h3>
              <p className="card__text">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
