export default function RefundPolicyPage() {
  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="mb-10">
          <h1 className="page__title text-5xl">Refund &amp; Cancellation Policy</h1>
          <p className="text-sm text-[#6b6560] font-mono">Last updated: May 2025</p>
        </div>
        <div className="space-y-6 text-[#a09a95] leading-relaxed">
          <h2 className="text-2xl text-white mt-8">1. Cancellation Policy</h2>
          <p>You may cancel your storage unit rental at any time by providing written notice.</p>
          <h3 className="text-xl text-white mt-6">1.1 Monthly Contracts</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Minimum 30 days&apos; written notice required.</li>
            <li>A R150 administrative cancellation fee applies.</li>
            <li>No refund for the current month&apos;s payment.</li>
            <li>Pro-rata refund for unused days in the final paid month.</li>
          </ul>
          <h3 className="text-xl text-white mt-6">1.2 Quarterly (3-month) Contracts</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>30 days&apos; written notice required.</li>
            <li>No refund for the current quarter&apos;s payment.</li>
            <li>Unused future quarters are refunded in full.</li>
          </ul>
          <h3 className="text-xl text-white mt-6">1.3 Bi-Annual (6-month) Contracts</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>30 days&apos; written notice required.</li>
            <li>No refund for the current period&apos;s payment.</li>
            <li>Unused future periods are refunded in full.</li>
          </ul>
          <h3 className="text-xl text-white mt-6">1.4 Annual (12-month) Contracts</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>30 days&apos; written notice required.</li>
            <li>No refund for the current year&apos;s payment.</li>
            <li>Unused future months refunded on a pro-rata basis.</li>
            <li>Discount already applied to the annual rate is retained by NSS.</li>
          </ul>
          <h2 className="text-2xl text-white mt-8">2. How to Cancel</h2>
          <p>Log in to your account or send written notice to <a href="mailto:info@nss-jbay.co.za" className="text-[#D4006A]">info@nss-jbay.co.za</a> with your booking reference.</p>
          <h2 className="text-2xl text-white mt-8">3. Refund Process</h2>
          <p>Approved refunds are processed within 14 business days to the original payment method.</p>
          <h2 className="text-2xl text-white mt-8">4. Contact</h2>
          <p><strong className="text-white">National Secure Storage &mdash; Jeffrey&apos;s Bay</strong><br />35 St Croix Street, Jeffrey&apos;s Bay, Eastern Cape, 6330<br />Email: <a href="mailto:info@nss-jbay.co.za" className="text-[#D4006A]">info@nss-jbay.co.za</a><br />Phone: 063 546 1740 / 061 905 8382</p>
        </div>
      </div>
    </section>
  );
}
