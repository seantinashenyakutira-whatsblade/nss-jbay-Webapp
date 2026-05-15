import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "example.com";
const HUB_DOMAIN = `hub.${MAIN_DOMAIN}`;

const PROTECTED_ROUTES = [
  "/dashboard",
  "/bookings",
  "/payments",
  "/profile",
  "/admin",
];

const MARKETING_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/refund-policy",
  "/units",
  "/bookings/new",
  "/auth",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const isLocalDev =
    hostname === "localhost" ||
    hostname.startsWith("localhost:") ||
    hostname === "127.0.0.1";
  const isVercelPreview = hostname.endsWith(".vercel.app");
  const isSingleOriginMode = isLocalDev || isVercelPreview;
  const isHubDomain =
    hostname.startsWith("hub.") || hostname === HUB_DOMAIN;
  const isMainDomain = !isHubDomain && !isSingleOriginMode;

  // ── Step 1: Domain Enforcement (skip in local dev or Vercel preview) ──
  if (!isSingleOriginMode) {
    if (isMainDomain) {
      const isProtectedRoute = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );
      if (isProtectedRoute) {
        const hubUrl = new URL(pathname, `https://${HUB_DOMAIN}`);
        hubUrl.search = request.nextUrl.search;
        return NextResponse.redirect(hubUrl);
      }
    } else if (isHubDomain) {
      const isMarketingRoute = MARKETING_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );
      if (isMarketingRoute) {
        const mainUrl = new URL(pathname, `https://${MAIN_DOMAIN}`);
        mainUrl.search = request.nextUrl.search;
        return NextResponse.redirect(mainUrl);
      }
    }
  }

  // ── Step 2: Auth Check (hub domain only, or single origin mode) ──
  if (isHubDomain || isSingleOriginMode) {
    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute) {
      const { supabase, response } = await createMiddlewareClient(request, isSingleOriginMode);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const loginUrl = isSingleOriginMode
          ? new URL("/auth/login", `${request.nextUrl.protocol}//${hostname}`)
          : new URL("/auth/login", `https://${MAIN_DOMAIN}`);
        loginUrl.searchParams.set("redirect", pathname);
        loginUrl.searchParams.set("domain", "hub");
        return NextResponse.redirect(loginUrl);
      }

      // Admin route check
      if (pathname.startsWith("/admin")) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();

        if (!profile?.is_admin) {
          const denyUrl = isSingleOriginMode
            ? new URL("/dashboard", `${request.nextUrl.protocol}//${hostname}`)
            : new URL("/dashboard", `https://${HUB_DOMAIN}`);
          return NextResponse.redirect(denyUrl);
        }
      }

      return response;
    }
  }

  // ── Step 3: Ensure cookies are set on root domain ──
  const response = NextResponse.next();
  if (!isSingleOriginMode) {
    const cookiesToSet = request.cookies.getAll();
    for (const cookie of cookiesToSet) {
      if (cookie.name.startsWith("sb-") || cookie.name.startsWith("supabase-")) {
        response.cookies.set(cookie.name, cookie.value, {
          domain: `.${MAIN_DOMAIN}`,
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }
  }

  return response;
}

async function createMiddlewareClient(request: NextRequest, isSingleOriginMode = false) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, {
              ...options,
              domain: isSingleOriginMode ? undefined : `.${MAIN_DOMAIN}`,
            });
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
