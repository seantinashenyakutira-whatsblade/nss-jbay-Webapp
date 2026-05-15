"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const faqs = [
  { q: "How do I book a storage unit?", a: "Browse our available units, select the size that suits your needs, and click \"Book Now.\" You'll need to create an account or log in to complete your reservation. The entire process takes just a few minutes." },
  { q: "What sizes are available?", a: "We offer four size categories: Extra Small (6 m²), Small (9 m²), Medium (18 m²), and Large (27 m²). Within each category, we have different unit options. Visit our <a href='/units'>Units page</a> for full details and pricing." },
  { q: "What are the payment terms?", a: "You can choose monthly, quarterly (3 months), bi-annual (6 months), or annual (12 months) payment terms. Longer commitments come with discounts of up to 15% off the monthly rate. All payments are processed securely online via Visa or Mastercard." },
  { q: "Is my belongings safe?", a: "Absolutely. Our facility is equipped with 24/7 CCTV surveillance, perimeter fencing, and secure access controls. Each unit has its own lock (you provide the padlock). We recommend insurance for valuable items." },
  { q: "Can I access my unit anytime?", a: "Access is available during business hours: Monday to Friday 08:00–17:00, Saturday 09:00–13:00. The facility is closed on Sundays and public holidays. Drive-up units offer convenient vehicle access." },
  { q: "What can I store?", a: "You can store furniture, boxes, business inventory, sports equipment, seasonal items, documents, and more. We do not allow perishable goods, flammable materials, hazardous chemicals, or illegal items. Please contact us if you're unsure." },
  { q: "Can I cancel my booking?", a: "Yes, you can cancel your booking at any time. Refunds are processed according to our <a href='/refund-policy'>cancellation policy</a>. Monthly contracts have a 30-day notice period. Contact us for specific details about your booking." },
  { q: "How do I change my unit size?", a: "If you need a larger or smaller unit, contact us and we'll help you move. Subject to availability. Any price difference will be adjusted accordingly." },
  { q: "Do you offer insurance?", a: "We do not provide insurance directly, but we strongly recommend that you obtain coverage for your stored items. Contact your insurance provider or ask us for recommendations on coverage options." },
  { q: "What payment methods do you accept?", a: "We accept Visa and Mastercard credit cards for all online payments. You can also arrange bank transfers for annual contracts. Debit cards are not accepted for online payments at this time." },
  { q: "Are there any hidden fees?", a: "No. Our pricing is transparent. The only additional fee is a R150 administrative cancellation fee for monthly contracts when cancelling with less than 30 days' notice. All fees are clearly stated in our <a href='/refund-policy'>Refund & Cancellation Policy</a>." },
  { q: "Can I reserve a unit in advance?", a: "Yes! You can book a unit up to 30 days in advance of your desired start date. Your reservation is secured once payment is processed." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="page">
      <div className="container">
        <div className="section__header">
          <h1 className="text-5xl">Frequently Asked Questions</h1>
          <p className="section__subtitle">Everything you need to know about our storage</p>
        </div>

        <div className="max-w-[640px] mx-auto space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-white hover:bg-[#111] transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                {faq.q}
                <ChevronDown className={`w-4 h-4 text-[#6b6560] transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-sm text-[#a09a95] leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6 text-center mt-8" style={{ maxWidth: 480, margin: "2rem auto" }}>
          <h4 className="text-xl mb-2">Still have questions?</h4>
          <p className="text-sm text-[#a09a95] mb-4">Our team is happy to help with anything you need.</p>
          <Link href="/contact" className="btn btn--primary">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
