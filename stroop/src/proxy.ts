import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return NextResponse.next();

  let canonical: URL;
  try {
    canonical = new URL(configured);
  } catch {
    return NextResponse.next();
  }
  if (canonical.protocol !== "https:") return NextResponse.next();

  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0] ?? "";
  if (hostname === "localhost" || hostname === "127.0.0.1") return NextResponse.next();

  const forwarded = request.headers.get("x-forwarded-proto");
  const protocol = forwarded ?? request.nextUrl.protocol.replace(":", "");
  if (hostname === canonical.hostname && protocol === "https") return NextResponse.next();

  const destination = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, canonical);
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|data/).*)"],
};
