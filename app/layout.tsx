import type { Metadata } from "next";
import "./globals.css";

const siteName = process.env.SITE_NAME || "National Secure Storage";

export const metadata: Metadata = {
  title: {
    default: `${siteName} | Jeffrey's Bay`,
    template: `%s | ${siteName}`,
  },
  description: "Secure, affordable self-storage in Jeffrey's Bay. 24/7 CCTV, flexible contracts, drive-up access.",
  openGraph: {
    title: `${siteName} | Jeffrey's Bay`,
    description: "Secure, affordable self-storage solutions in Jeffrey's Bay. Book online today.",
    images: [{ url: "/assets/images/og-image.svg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
        <link rel="apple-touch-icon" href="/assets/images/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4006A" />
      </head>
      <body className="min-h-screen bg-[#0A0A0A] text-[#F5F0EB] antialiased">
        {children}
      </body>
    </html>
  );
}
