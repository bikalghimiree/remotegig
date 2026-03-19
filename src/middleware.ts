import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Homepage: process session verifier callback from auth
  if (pathname === "/") {
    const hasVerifier = request.nextUrl.searchParams.has("neon_auth_session_verifier");
    if (hasVerifier) {
      const authResponse = await auth.middleware()(request);
      if (authResponse && authResponse.status >= 300 && authResponse.status < 400) {
        return authResponse;
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
