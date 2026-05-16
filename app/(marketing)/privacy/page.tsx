export default function PrivacyPage() {
  return (
    <section className="page">
      <div className="container w-full" style={{ maxWidth: 800 }}>
        <div className="mb-6 md:mb-10">
          <h1 className="page__title text-3xl sm:text-4xl md:text-5xl">Privacy Policy</h1>
          <p className="text-sm text-[#6b6560] font-mono">Last updated: May 2025</p>
        </div>
        <div className="space-y-6 text-[#a09a95] leading-relaxed">
          <h2 className="text-2xl text-white mt-8">1. Information We Collect</h2>
          <p>National Secure Storage (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) collects information to provide better services to our customers.</p>
          <h3 className="text-xl text-white mt-6">1.1 Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Account Data:</strong> Name, email address, phone number, and password when you register.</li>
            <li><strong className="text-white">Profile Data:</strong> First name, last name, and phone number stored in your profile.</li>
            <li><strong className="text-white">Payment Data:</strong> Credit card details are processed by our payment gateway and are not stored on our servers.</li>
            <li><strong className="text-white">Booking Data:</strong> Rental history, unit preferences, and booking references.</li>
          </ul>
          <h3 className="text-xl text-white mt-6">1.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Usage Data:</strong> Pages visited, time spent on site, and navigation patterns.</li>
            <li><strong className="text-white">Device Data:</strong> Browser type, operating system, and device identifiers.</li>
            <li><strong className="text-white">Cookies:</strong> Small data files stored on your device to maintain session state and preferences.</li>
          </ul>
          <h2 className="text-2xl text-white mt-8">2. How We Use Your Information</h2>
          <p>We use collected information to create and manage your account, process payments, communicate about bookings, send notifications, improve our website, and comply with legal obligations.</p>
          <h2 className="text-2xl text-white mt-8">3. Information Sharing</h2>
          <p>We do not sell or rent your personal information. Information may be shared with payment processors, service providers, legal authorities when required, or in the event of a business transfer.</p>
          <h2 className="text-2xl text-white mt-8">4. Data Security</h2>
          <p>We implement SSL/TLS encryption, secure password hashing, access controls, and regular security reviews to protect your data.</p>
          <h2 className="text-2xl text-white mt-8">5. Data Retention</h2>
          <p>We retain your personal information for as long as your account is active and for a period thereafter as required by law (minimum 5 years for financial records).</p>
          <h2 className="text-2xl text-white mt-8">6. Your Rights</h2>
          <p>You have the right to access, correct, delete your data, and withdraw consent for marketing. Contact us at <a href="mailto:info@nss-jbay.co.za" className="text-[#D4006A]">info@nss-jbay.co.za</a> to exercise these rights.</p>
          <h2 className="text-2xl text-white mt-8">7. Cookies</h2>
          <p>We use cookies to keep you logged in, remember preferences, and analyze site usage. You can control cookies through your browser settings.</p>
          <h2 className="text-2xl text-white mt-8">8. Contact</h2>
          <p><strong className="text-white">National Secure Storage &mdash; Jeffrey&apos;s Bay</strong><br />35 St Croix Street, Jeffrey&apos;s Bay, Eastern Cape, 6330<br />Email: <a href="mailto:info@nss-jbay.co.za" className="text-[#D4006A]">info@nss-jbay.co.za</a><br />Phone: 063 546 1740 / 061 905 8382</p>
        </div>
      </div>
    </section>
  );
}
