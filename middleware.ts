import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/pay/toss")) {
    return NextResponse.next()
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|^/pay).*)",
  ],
}
