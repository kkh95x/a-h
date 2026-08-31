import { NextResponse } from "next/server";

const COOKIE = "cs_admin";

function toBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function verify(token) {
  if (!token || !token.includes(".")) return null;
  const secret = process.env.ADMIN_SECRET || "dev-only-secret";
  const [body, sig] = token.split(".");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expectedBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const expected = toBase64Url(expectedBuf);
  if (!safeEqual(sig, expected)) return null;
  try {
    let b64 = body.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isWriteApi = pathname.startsWith("/api/") && request.method !== "GET";
  const needsAuth = pathname.startsWith("/admin") || isWriteApi;
  if (!needsAuth) return NextResponse.next();

  const session = await verify(request.cookies.get(COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/articles",
    "/api/articles/:path*",
    "/api/academy",
    "/api/academy/:path*",
    "/api/site",
    "/api/site/:path*",
  ],
};
