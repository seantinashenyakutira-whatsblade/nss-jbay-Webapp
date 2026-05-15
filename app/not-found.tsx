import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="font-heading text-[clamp(6rem,20vw,12rem)] leading-none text-[#D4006A] mb-2">404</div>
      <h1 className="text-3xl mb-3">Page Not Found</h1>
      <p className="text-[#a09a95] mb-8 max-w-[400px]">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="btn btn--primary btn--lg">Go Home</Link>
    </div>
  );
}
