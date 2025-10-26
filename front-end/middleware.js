import { NextResponse } from 'next/server'

export async function middleware(req, response) {
  let refrechToken = req.cookies.get('refrechToken')?.value

  if (!refrechToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  } else {
  return  NextResponse.next()
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
