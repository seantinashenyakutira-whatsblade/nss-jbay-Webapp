"use client";

import { useState } from "react";
import { sanitizeInput, validateEmail, validatePhone } from "@/lib/sanitize";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;
    const sanitizedMessage = sanitizeInput(message);

    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
      setFormError("Please fill in all required fields");
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setFormError("Invalid email format");
      return;
    }

    if (sanitizedPhone && !validatePhone(sanitizedPhone)) {
      setFormError("Invalid phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          message: sanitizedMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to send message");
        setLoading(false);
        return;
      }

      setFormSuccess(data.message);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setFormError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <div className="container">
        <div className="text-center mb-10">
          <h1 className="page__title text-5xl">Contact Us</h1>
          <p className="page__subtitle">We&apos;d love to hear from you</p>
        </div>

        <div className="grid grid--2 gap-12" style={{ maxWidth: 960, margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            {formError && (
              <div className="mb-4 p-3 rounded bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-sm text-[#ef4444]" role="alert">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 rounded bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-sm text-[#22c55e]" role="alert">
                {formSuccess}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="contactName" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Name <span className="text-[#ef4444]">*</span></label>
                <input type="text" id="contactName" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Your full name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Email <span className="text-[#ef4444]">*</span></label>
                  <input type="email" id="contactEmail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="your@email.com" required />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Phone</label>
                  <input type="tel" id="contactPhone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="063 546 1740" />
                </div>
              </div>
              <div>
                <label htmlFor="contactMessage" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Message <span className="text-[#ef4444]">*</span></label>
                <textarea id="contactMessage" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" disabled={loading} className="btn btn--primary btn--lg btn--block">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>

          <div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
              <h4 className="text-xl mb-5">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-[#6b6560] uppercase min-w-[70px]">Address</span>
                  <span className="text-[#a09a95]">35 St Croix Street, Jeffrey&apos;s Bay, Eastern Cape, 6330</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-[#6b6560] uppercase min-w-[70px]">Phone</span>
                  <span className="text-[#a09a95]">
                    <a href="tel:0635461740" className="text-[#D4006A]">063 546 1740</a><br />
                    <a href="tel:0619058382" className="text-[#D4006A]">061 905 8382</a>
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-[#6b6560] uppercase min-w-[70px]">Email</span>
                  <span className="text-[#a09a95]"><a href="mailto:info@nss-jbay.co.za" className="text-[#D4006A]">info@nss-jbay.co.za</a></span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-[#6b6560] uppercase min-w-[70px]">Social</span>
                  <span className="text-[#a09a95]"><a href="https://facebook.com/nssjbay" target="_blank" rel="noopener" className="text-[#D4006A]">Follow us on Facebook</a></span>
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
