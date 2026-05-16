"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "National Secure Storage made moving so easy. The unit was clean, secure, and exactly what I needed for my business inventory.",
    author: "Sarah M.",
    role: "Small Business Owner",
  },
  {
    quote: "I've been storing my furniture here for 6 months. The 24/7 CCTV and drive-up access give me peace of mind.",
    author: "Johan K.",
    role: "Homeowner",
  },
  {
    quote: "Affordable rates and excellent security. The staff is friendly and the facility is always well-maintained.",
    author: "Thandi N.",
    role: "Student",
  },
  {
    quote: "Perfect for storing my seasonal equipment. The online booking process was quick and hassle-free.",
    author: "David P.",
    role: "Contractor",
  },
  {
    quote: "I compared several storage facilities in JBay and NSS offered the best value. Highly recommended!",
    author: "Linda V.",
    role: "Retail Manager",
  },
];

const AUTO_ADVANCE_MS = 5000;
const CROSSFADE_MS = 800;

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(advance, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isPaused, advance]);

  return (
    <div
      className="relative max-w-2xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[180px]">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-[800ms] ease-in-out",
              index === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <blockquote className="text-lg text-[#F5F0EB] leading-relaxed mb-4">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div>
              <div className="font-heading text-xl text-[#D4006A]">{testimonial.author}</div>
              <div className="text-sm text-[#a09a95]">{testimonial.role}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors duration-300",
              index === activeIndex ? "bg-[#D4006A]" : "bg-[#2a2a2a] hover:bg-[#333]"
            )}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
