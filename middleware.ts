import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

const allowedOrigins = [process.env.NEXT_WWW_URL, process.env.NEXT_URL]

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  const origin = req.headers.get("origin")

  if (pathname.startsWith("/api/") && origin) {
    const response = NextResponse.next()

    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
    } else {
      return new Response("Not allowed", { status: 403 })
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    )
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    )

    return response
  }

  if (pathname === "/pay/toss/success" || pathname === "/pay/toss/fail") {
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|^/pay).*)",
  ],
}
