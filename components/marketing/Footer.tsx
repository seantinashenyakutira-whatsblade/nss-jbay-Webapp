import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2a2a2a] bg-[#111]" role="contentinfo">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M20 2L38 12V28L20 38L2 28V12L20 2Z" fill="#D4006A"/>
                <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" fill="#0A0A0A"/>
                <path d="M20 14L25 17V23L20 26L15 23V17L20 14Z" fill="#D4006A"/>
              </svg>
              <span className="font-heading text-sm">NATIONAL SECURE STORAGE</span>
            </Link>
            <p className="text-sm text-[#a09a95] leading-relaxed mb-4">
              Secure, affordable self-storage solutions in Jeffrey&apos;s Bay. Your space, your peace of mind. 24/7 CCTV, flexible contracts, and drive-up access.
            </p>
            <a href={process.env.FB_URL || "#"} className="inline-flex items-center gap-2 text-sm text-[#a09a95] hover:text-[#D4006A] transition-colors" target="_blank" rel="noopener" aria-label="Follow us on Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="1.5"/></svg>
              Follow us on Facebook
            </a>
          </div>

          <div>
            <h4 className="font-mono text-xs text-[#6b6560] uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-[#a09a95] hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/units" className="text-sm text-[#a09a95] hover:text-white transition-colors">Storage Units</Link></li>
              <li><Link href="/about" className="text-sm text-[#a09a95] hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-[#a09a95] hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-sm text-[#a09a95] hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs text-[#6b6560] uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-[#a09a95] hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="text-sm text-[#a09a95] hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="text-sm text-[#a09a95] hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs text-[#6b6560] uppercase tracking-wider mb-4">Unit Sizes</h4>
            <ul className="space-y-2">
              <li><Link href="/units?size=extra-small" className="text-sm text-[#a09a95] hover:text-white transition-colors">Extra Small (6 m²)</Link></li>
              <li><Link href="/units?size=small" className="text-sm text-[#a09a95] hover:text-white transition-colors">Small (9 m²)</Link></li>
              <li><Link href="/units?size=medium" className="text-sm text-[#a09a95] hover:text-white transition-colors">Medium (18 m²)</Link></li>
              <li><Link href="/units?size=large" className="text-sm text-[#a09a95] hover:text-white transition-colors">Large (27 m²)</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#2a2a2a] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6b6560]">&copy; {currentYear} National Secure Storage &mdash; Jeffrey&apos;s Bay. All rights reserved.</p>
          <p className="text-xs text-[#6b6560]">
            Built by <a href="https://whatsblade.com" target="_blank" rel="noopener" className="text-[#a09a95] hover:text-white">Whatsblade technologies</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
