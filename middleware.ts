import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "./lib/rate-limit";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/bookings",
  "/payments",
  "/profile",
  "/admin",
];

const API_RATE_LIMITS: Record<string, string> = {
  "/api/auth/login": "auth",
  "/api/auth/register": "auth",
  "/api/auth/reset-password": "auth",
  "/api/contact": "contact",
  "/api/bookings": "bookings",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit API routes
  for (const [prefix, category] of Object.entries(API_RATE_LIMITS)) {
    if (pathname.startsWith(prefix) && request.method !== "GET") {
      const result = checkRateLimit(request, category);
      if (!result.allowed) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429, headers: { "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)) } }
        );
      }
    }
  }

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const { supabase, response } = createMiddlewareClient(request);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (!profile?.is_admin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return response;
  }

  return NextResponse.next();
}

function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, response };
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|sw.js|manifest.json|og-image.svg).*)",
  ],
};
