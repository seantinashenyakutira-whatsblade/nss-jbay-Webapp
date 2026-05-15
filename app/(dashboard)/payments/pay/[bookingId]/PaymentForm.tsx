"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck, CheckCircle, XCircle } from "lucide-react";

interface BookingData {
  id: string;
  reference: string;
  total_amount: number;
  duration_months: number;
  units?: { name?: string; sqm?: number } | null;
}

export function PaymentForm({ booking }: { booking: BookingData }) {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  function detectCardBrand(number: string): string | null {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "mastercard";
    return null;
  }

  function formatCardNumber(value: string): string {
    const cleaned = value.replace(/\D/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ").substring(0, 19);
  }

  function formatExpiry(value: string): string {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    return cleaned;
  }

  function luhnCheck(num: string): boolean {
    const arr = num.split("").reverse().map(Number);
    const sum = arr.reduce((acc, val, i) => {
      if (i % 2 !== 0) { val *= 2; if (val > 9) val -= 9; }
      return acc + val;
    }, 0);
    return sum % 10 === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    const errors: Record<string, string> = {};
    const cleanedCard = cardNumber.replace(/\s/g, "");

    if (!cleanedCard || cleanedCard.length < 13) errors.cardNumber = "Please enter a valid card number";
    else if (!luhnCheck(cleanedCard)) errors.cardNumber = "Invalid card number";
    else if (!detectCardBrand(cleanedCard)) errors.cardNumber = "We only accept Visa and Mastercard";

    if (!cardName || cardName.length < 2) errors.cardName = "Please enter the cardholder name";

    const parts = expiry.split("/");
    if (expiry.length !== 5 || parts.length !== 2) errors.expiry = "Enter expiry as MM/YY";
    else {
      const month = parseInt(parts[0]);
      const year = parseInt("20" + parts[1]);
      if (month < 1 || month > 12 || new Date(year, month - 1) < new Date()) errors.expiry = "Card has expired";
    }

    if (!cvc || cvc.length !== 3) errors.cvc = "CVC must be 3 digits";

    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setProcessing(true);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));
    const isSuccessful = Math.random() < 0.85;

    if (isSuccessful) {
      try {
        const csrfToken = document.querySelector("[name='_csrf']")?.getAttribute("content") || "";
        await fetch("/api/payments/process", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
          body: JSON.stringify({
            bookingId: booking.id,
            cardLastFour: cleanedCard.slice(-4),
            cardBrand: detectCardBrand(cleanedCard),
            amount: booking.total_amount,
          }),
        });
      } catch (_) {}
      setSuccess(true);
    } else {
      const errors_list = [
        "Card declined: insufficient funds",
        "Do not honor",
        "Card declined: call your bank",
        "Transaction timeout",
      ];
      setError(errors_list[Math.floor(Math.random() * errors_list.length)]);
    }
    setProcessing(false);
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mb-4"><CheckCircle className="w-16 h-16 mx-auto text-[#22c55e]" /></div>
        <h2 className="text-4xl font-heading text-[#22c55e] mb-2">Payment Successful!</h2>
        <p className="text-[#a09a95] mb-6">Your booking is confirmed. Reference: <span className="font-mono text-[#D4006A]">{booking.reference}</span></p>
        <div className="mb-6 space-y-1">
          <p className="text-sm text-[#6b6560]">Amount paid: <span className="font-heading text-[#D4006A]">R {Number(booking.total_amount).toLocaleString("en-ZA")}</span></p>
          <p className="text-sm text-[#6b6560]">Booking ID: <span className="font-mono">{booking.id}</span></p>
        </div>
        <div className="flex gap-3 justify-center">
          <a href={`/bookings/${booking.id}`} className="btn btn--primary">View Booking Details</a>
          <a href="/bookings" className="btn btn--outline">My Rentals</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <a href="/bookings" className="inline-flex items-center gap-2 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to My Bookings
      </a>

      <div className="max-w-[560px]">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
          <h1 className="text-3xl mb-2">Complete Your Payment</h1>
          <p className="text-sm text-[#6b6560] mb-6">Booking: <span className="font-mono">{booking.reference}</span></p>

          <div className="bg-[#111] border border-[#2a2a2a] rounded-md p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#a09a95]">Unit</span>
              <span className="text-white">{booking.units?.name || "Storage Unit"}{booking.units?.sqm ? ` (${booking.units.sqm} m²)` : ""}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#a09a95]">Duration</span>
              <span className="text-white">{booking.duration_months} Month{booking.duration_months > 1 ? "s" : ""}</span>
            </div>
            <div className="flex justify-between text-lg font-medium border-t border-[#2a2a2a] pt-3 mt-2">
              <span className="text-white">Amount Due</span>
              <span className="text-[#D4006A] font-heading">R {Number(booking.total_amount).toLocaleString("en-ZA")}</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-sm text-[#ef4444]" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Card Number <span className="text-[#ef4444]">*</span></label>
                <div className="relative">
                  <input
                    type="text" id="cardNumber" value={cardNumber} onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setCardNumber(formatted);
                      setBrand(detectCardBrand(formatted));
                    }}
                    className="w-full px-4 py-2.5 pr-12 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white font-mono tracking-widest outline-none focus:border-[#D4006A] transition-colors"
                    placeholder="1234 5678 9012 3456" maxLength={19} autoComplete="cc-number" inputMode="numeric" required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {brand === "visa" && (
                      <svg width="32" height="20" viewBox="0 0 48 30" fill="none"><rect width="48" height="30" rx="4" fill="#1A1F71"/><text x="24" y="20" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">VISA</text></svg>
                    )}
                    {brand === "mastercard" && (
                      <svg width="32" height="20" viewBox="0 0 48 30" fill="none"><rect width="48" height="30" rx="4" fill="#1A1F71"/><circle cx="18" cy="15" r="9" fill="#EB001B" opacity="0.9"/><circle cx="30" cy="15" r="9" fill="#F79E1B" opacity="0.9"/><path d="M24 9a8.5 8.5 0 0 0 0 12 8.5 8.5 0 0 0 0-12z" fill="#FF5F00"/></svg>
                    )}
                  </span>
                </div>
                {fieldErrors.cardNumber && <p className="text-xs text-[#ef4444] mt-1">{fieldErrors.cardNumber}</p>}
              </div>

              <div>
                <label htmlFor="cardName" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Cardholder Name <span className="text-[#ef4444]">*</span></label>
                <input type="text" id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="John Smith" autoComplete="cc-name" required />
                {fieldErrors.cardName && <p className="text-xs text-[#ef4444] mt-1">{fieldErrors.cardName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Expiry (MM/YY) <span className="text-[#ef4444]">*</span></label>
                  <input type="text" id="expiry" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="MM/YY" maxLength={5} autoComplete="cc-exp" inputMode="numeric" required />
                  {fieldErrors.expiry && <p className="text-xs text-[#ef4444] mt-1">{fieldErrors.expiry}</p>}
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">CVC <span className="text-[#ef4444]">*</span></label>
                  <input type="text" id="cvc" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 3))} className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="123" maxLength={3} autoComplete="cc-csc" inputMode="numeric" required />
                  {fieldErrors.cvc && <p className="text-xs text-[#ef4444] mt-1">{fieldErrors.cvc}</p>}
                </div>
              </div>

              <div className="flex gap-2">
                <span className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-all ${brand === "visa" ? "border-[#D4006A] bg-[rgba(212,0,106,0.12)] text-[#D4006A]" : "border-[#2a2a2a] bg-[#111] text-[#6b6560]"}`}>
                  <svg width="20" height="12" viewBox="0 0 48 30" fill="none"><rect width="48" height="30" rx="4" fill="#1A1F71"/><text x="24" y="20" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">VISA</text></svg>
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-all ${brand === "mastercard" ? "border-[#D4006A] bg-[rgba(212,0,106,0.12)] text-[#D4006A]" : "border-[#2a2a2a] bg-[#111] text-[#6b6560]"}`}>
                  <svg width="20" height="12" viewBox="0 0 48 30" fill="none"><rect width="48" height="30" rx="4" fill="#1A1F71"/><circle cx="18" cy="15" r="9" fill="#EB001B" opacity="0.9"/><circle cx="30" cy="15" r="9" fill="#F79E1B" opacity="0.9"/><path d="M24 9a8.5 8.5 0 0 0 0 12 8.5 8.5 0 0 0 0-12z" fill="#FF5F00"/></svg>
                </span>
              </div>

              <button type="submit" disabled={processing} className="btn btn--primary btn--lg btn--block">
                {processing ? (
                  <span className="flex items-center gap-2"><span className="spinner" /> Processing...</span>
                ) : (
                  <>Pay R {Number(booking.total_amount).toLocaleString("en-ZA")}</>
                )}
              </button>

              <p className="text-center text-xs text-[#6b6560] mt-4">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                Demo mode &mdash; No real charges will be made
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
