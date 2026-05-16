import { Building2, ShieldAlert, Key, Mountain, Trees, Factory } from "lucide-react";
import { getFacilityImageUrl, getMapImageUrl } from "@/lib/images";

const securityFeatures = [
  { icon: Building2, title: "24/7 CCTV Surveillance", text: "High-definition cameras monitor all areas of our facility around the clock. Recorded footage is securely stored." },
  { icon: ShieldAlert, title: "Perimeter Electric Fencing", text: "Our facility is secured with electric fencing and controlled access gates to prevent unauthorized entry." },
  { icon: Key, title: "Secure Access Control", text: "Only authorized tenants can access the facility during business hours. Each unit has its own lock." },
];

const locationFeatures = [
  { icon: Mountain, title: "Growing Community", text: "Jeffrey's Bay is one of the fastest-growing coastal towns in the Eastern Cape. More residents and businesses mean more storage needs." },
  { icon: Trees, title: "Coastal Lifestyle", text: "Seasonal residents, surfers, and holidaymakers need reliable storage for their belongings between visits to JBay." },
  { icon: Factory, title: "Business Hub", text: "Local businesses need inventory and equipment storage. Our flexible terms make it easy for startups and established companies alike." },
];

export default function AboutPage() {
  return (
    <>
      <section className="page">
        <div className="container">
          <div className="text-center mb-6 md:mb-10">
            <h1 className="page__title text-3xl sm:text-4xl md:text-5xl">About Us</h1>
            <p className="page__subtitle">Your trusted self-storage partner in Jeffrey&apos;s Bay</p>
          </div>
        </div>
      </section>

      <section className="section section--sm" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid--2 items-center gap-6 md:gap-12">
            <div>
              <h3 className="text-2xl md:text-3xl mb-4">Our Story</h3>
              <p className="text-[#a09a95] leading-relaxed">National Secure Storage &mdash; Jeffrey&apos;s Bay is part of a trusted South African self-storage network dedicated to providing secure, affordable, and flexible storage solutions for residents and businesses in the Eastern Cape.</p>
              <p className="text-[#a09a95] leading-relaxed mt-4">Our facility at 35 St Croix Street offers a range of unit sizes from extra-small (6 m²) to large (27 m²), suitable for everything from a few boxes to the contents of a large home.</p>
            </div>
            <div>
              <img src={getFacilityImageUrl()} alt="National Secure Storage facility" className="w-full h-[200px] md:h-[300px] object-cover rounded-lg border border-[#2a2a2a]" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--sm section--alt">
        <div className="container">
          <div className="section__header">
            <h3 className="text-2xl md:text-3xl">Security Features</h3>
            <p className="section__subtitle">Your belongings are protected at every level</p>
          </div>
          <div className="grid grid--3">
            {securityFeatures.map((f, i) => (
              <div key={i} className="card card--static rounded-md">
                <div className="card__body text-center">
                  <div className="flex justify-center mb-4"><f.icon className="w-10 h-10 md:w-12 md:h-12 text-[#D4006A]" /></div>
                  <h4 className="text-lg md:text-xl mb-2">{f.title}</h4>
                  <p className="card__text">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sm">
        <div className="container">
          <div className="section__header">
            <h3 className="text-2xl md:text-3xl">Why Jeffrey&apos;s Bay?</h3>
            <p className="section__subtitle">The perfect location for your storage needs</p>
          </div>
          <div className="grid grid--3">
            {locationFeatures.map((f, i) => (
              <div key={i} className="card card--static rounded-md">
                <div className="card__body text-center">
                  <div className="flex justify-center mb-4"><f.icon className="w-10 h-10 md:w-12 md:h-12 text-[#D4006A]" /></div>
                  <h4 className="text-lg md:text-xl mb-2">{f.title}</h4>
                  <p className="card__text">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sm">
        <div className="container">
          <div className="grid grid--2 items-center gap-6 md:gap-12">
            <div>
              <img src={getMapImageUrl()} alt="Map showing NSS JBay location" className="w-full h-[200px] md:h-[250px] object-cover rounded-lg border border-[#2a2a2a]" loading="lazy" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl mb-4">Our Location</h3>
              <p className="text-[#a09a95] leading-relaxed">{process.env.SITE_ADDRESS || "35 St Croix Street, Jeffrey's Bay, Eastern Cape, 6330"}</p>
              <p className="text-[#a09a95] leading-relaxed mt-3">Conveniently located in the heart of Jeffrey&apos;s Bay, we&apos;re easy to find and offer drive-up access for hassle-free loading and unloading.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
