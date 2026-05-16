import { randomBytes, createHash } from "crypto";

const CSRF_COOKIE_NAME = "__csrf";
const CSRF_HEADER_NAME = "x-csrf-token";

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashCsrfToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function setCsrfCookie(response: Response, token: string) {
  response.headers.set(
    "Set-Cookie",
    `${CSRF_COOKIE_NAME}=${hashCsrfToken(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
  );
}

export function getCsrfTokenFromCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${CSRF_COOKIE_NAME}=([^;]+)`));
  return match?.[1];
}

export function getCsrfTokenFromHeader(request: Request): string | undefined {
  return request.headers.get(CSRF_HEADER_NAME) || undefined;
}

export function validateCsrfToken(request: Request): boolean {
  const cookieToken = getCsrfTokenFromCookie(request);
  const headerToken = getCsrfTokenFromHeader(request);

  if (!cookieToken || !headerToken) return false;

  return hashCsrfToken(headerToken) === cookieToken;
}

export { CSRF_HEADER_NAME };
