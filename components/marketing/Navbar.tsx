"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="container flex items-center justify-between h-[72px]">
        <Link href="/" className="flex items-center gap-3" aria-label="National Secure Storage — Home">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M20 2L38 12V28L20 38L2 28V12L20 2Z" fill="#D4006A"/>
            <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" fill="#0A0A0A"/>
            <path d="M20 14L25 17V23L20 26L15 23V17L20 14Z" fill="#D4006A"/>
          </svg>
          <div>
            <div className="font-heading text-lg leading-none text-[#F5F0EB]">NATIONAL SECURE STORAGE</div>
            <div className="font-mono text-xs text-[#6b6560]">Jeffrey&apos;s Bay</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <Link href="/" className="text-sm text-[#a09a95] hover:text-white transition-colors">Home</Link>
          <Link href="/units" className="text-sm text-[#a09a95] hover:text-white transition-colors">Storage Units</Link>
          <Link href="/about" className="text-sm text-[#a09a95] hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="text-sm text-[#a09a95] hover:text-white transition-colors">Contact</Link>
          <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button className="flex items-center gap-1 text-sm text-[#a09a95] hover:text-white transition-colors">
              Legal <ChevronDown className="w-3 h-3" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 right-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg py-2 min-w-[180px] z-50">
                <Link href="/terms" className="block px-4 py-2 text-sm text-[#a09a95] hover:text-white hover:bg-[#111]">Terms of Use</Link>
                <Link href="/privacy" className="block px-4 py-2 text-sm text-[#a09a95] hover:text-white hover:bg-[#111]">Privacy Policy</Link>
                <Link href="/refund-policy" className="block px-4 py-2 text-sm text-[#a09a95] hover:text-white hover:bg-[#111]">Refund Policy</Link>
              </div>
            )}
          </div>
          <Link href="/dashboard" className="btn btn--outline btn--sm">
            <LayoutDashboard className="w-4 h-4" /> My Account
          </Link>
        </nav>

        <button className="md:hidden p-2 text-[#a09a95]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-t border-[#2a2a2a]">
          <div className="container py-4 space-y-2">
            <Link href="/" className="block py-2 text-sm text-[#a09a95]" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/units" className="block py-2 text-sm text-[#a09a95]" onClick={() => setMobileOpen(false)}>Storage Units</Link>
            <Link href="/about" className="block py-2 text-sm text-[#a09a95]" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/contact" className="block py-2 text-sm text-[#a09a95]" onClick={() => setMobileOpen(false)}>Contact</Link>
            <div className="border-t border-[#2a2a2a] my-2" />
            <div className="text-xs text-[#6b6560] uppercase tracking-wider px-2">Legal</div>
            <Link href="/terms" className="block py-2 pl-6 text-sm text-[#a09a95]" onClick={() => setMobileOpen(false)}>Terms of Use</Link>
            <Link href="/privacy" className="block py-2 pl-6 text-sm text-[#a09a95]" onClick={() => setMobileOpen(false)}>Privacy Policy</Link>
            <Link href="/refund-policy" className="block py-2 pl-6 text-sm text-[#a09a95]" onClick={() => setMobileOpen(false)}>Refund Policy</Link>
            <div className="border-t border-[#2a2a2a] my-2" />
            <Link href="/dashboard" className="block py-2 text-sm text-[#D4006A] font-medium" onClick={() => setMobileOpen(false)}>My Account</Link>
          </div>
        </div>
      )}
    </header>
  );
}
