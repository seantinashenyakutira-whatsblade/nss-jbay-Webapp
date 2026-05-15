import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="page">
      <div className="container">
        <div className="text-center mb-10">
          <h1 className="page__title text-5xl">Contact Us</h1>
          <p className="page__subtitle">We&apos;d love to hear from you</p>
        </div>

        <div className="grid grid--2 gap-12" style={{ maxWidth: 960, margin: "0 auto" }}>
          <form action="/api/contact" method="POST">
            <div className="space-y-4">
              <div>
                <label htmlFor="contactName" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Name <span className="text-[#ef4444]">*</span></label>
                <input type="text" id="contactName" name="name" className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Your full name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Email <span className="text-[#ef4444]">*</span></label>
                  <input type="email" id="contactEmail" name="email" className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="your@email.com" required />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Phone</label>
                  <input type="tel" id="contactPhone" name="phone" className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="063 546 1740" />
                </div>
              </div>
              <div>
                <label htmlFor="contactMessage" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Message <span className="text-[#ef4444]">*</span></label>
                <textarea id="contactMessage" name="message" rows={5} className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="btn btn--primary btn--lg btn--block">Send Message</button>
            </div>
          </form>

          <div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
              <h4 className="text-xl mb-5">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-[#6b6560] uppercase min-w-[70px]">Address</span>
                  <span className="text-[#a09a95]">{process.env.SITE_ADDRESS || "35 St Croix Street, Jeffrey's Bay, Eastern Cape, 6330"}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-[#6b6560] uppercase min-w-[70px]">Phone</span>
                  <span className="text-[#a09a95]">
                    <a href={`tel:${(process.env.SITE_PHONE_1 || "0635461740").replace(/\s/g, "")}`} className="text-[#D4006A]">{process.env.SITE_PHONE_1 || "063 546 1740"}</a><br />
                    <a href={`tel:${(process.env.SITE_PHONE_2 || "0619058382").replace(/\s/g, "")}`} className="text-[#D4006A]">{process.env.SITE_PHONE_2 || "061 905 8382"}</a>
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-[#6b6560] uppercase min-w-[70px]">Email</span>
                  <span className="text-[#a09a95]"><a href={`mailto:${process.env.SITE_EMAIL || "info@nss-jbay.co.za"}`} className="text-[#D4006A]">{process.env.SITE_EMAIL || "info@nss-jbay.co.za"}</a></span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-[#6b6560] uppercase min-w-[70px]">Social</span>
                  <span className="text-[#a09a95]"><a href={process.env.FB_URL || "#"} target="_blank" rel="noopener" className="text-[#D4006A]">Follow us on Facebook</a></span>
                </div>
              </div>

              <h4 className="text-xl mt-8 mb-4">Operating Hours</h4>
              <table className="w-full">
                <tbody>
                  <tr><td className="py-1.5 text-sm text-[#a09a95]">Monday – Friday</td><td className="text-right text-sm text-[#a09a95]">08:00 – 17:00</td></tr>
                  <tr><td className="py-1.5 text-sm text-[#a09a95]">Saturday</td><td className="text-right text-sm text-[#a09a95]">09:00 – 13:00</td></tr>
                  <tr><td className="py-1.5 text-sm text-[#a09a95]">Sunday</td><td className="text-right text-sm text-[#6b6560]">Closed</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
