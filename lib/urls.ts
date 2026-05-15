const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "example.com";
const HUB_DOMAIN = `hub.${MAIN_DOMAIN}`;

function isSingleOriginMode(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname.startsWith("localhost:") ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".vercel.app")
  );
}

export function getHubOrigin(hostname: string, protocol = "https:"): string {
  if (isSingleOriginMode(hostname)) return `${protocol}//${hostname}`;
  return `https://${HUB_DOMAIN}`;
}

export function getMarketingUrl(path = "/"): string {
  return `https://${MAIN_DOMAIN}${path}`;
}

export function getDashboardUrl(path = "/dashboard"): string {
  return `https://${HUB_DOMAIN}${path}`;
}

export function getLoginUrl(redirect?: string): string {
  const url = new URL("/auth/login", `https://${MAIN_DOMAIN}`);
  if (redirect) url.searchParams.set("redirect", redirect);
  return url.toString();
}
