import { NextRequest, NextResponse } from 'next/server'

export default async function proxy(req: NextRequest): Promise<NextResponse> {
  const cookie = req.cookies.get('admin_session')?.value
  if (!cookie) {
    return NextResponse.redirect(new URL(req.nextUrl.basePath + '/login', req.nextUrl.origin))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!login|_next/static|_next/image|favicon.ico).*)'],
}
