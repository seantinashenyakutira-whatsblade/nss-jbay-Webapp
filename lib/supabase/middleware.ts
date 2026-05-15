import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export function createClient(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isLocalDev =
    host === "localhost" || host.startsWith("localhost:") || host === "127.0.0.1";
  const isVercelPreview = host.endsWith(".vercel.app");
  const isSingleOriginMode = isLocalDev || isVercelPreview;

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
              domain: isSingleOriginMode ? undefined : `.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`,
            });
          });
        },
      },
    }
  );

  return { supabase, response };
}
