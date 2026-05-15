"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="font-heading text-[clamp(6rem,20vw,12rem)] leading-none text-[#D4006A] mb-2">500</div>
      <h1 className="text-3xl mb-3">Something went wrong</h1>
      <p className="text-[#a09a95] mb-8 max-w-[400px]">{error.message || "An unexpected error occurred. Please try again later."}</p>
      <button onClick={reset} className="btn btn--primary btn--lg">Try Again</button>
    </div>
  );
}
