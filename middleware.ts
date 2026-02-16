import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value
  const userRole = request.cookies.get('user_role')?.value

  // Check if the request is for admin routes (but NOT admin-login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin-login')) {
    // If user is not logged in, redirect to admin login
    if (!userId) {
      const loginUrl = new URL('/admin-login', request.url)
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user has proper role (ADMIN or STAFF only)
    if (userRole === 'PATIENT' || userRole === 'DOCTOR') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Allow ADMIN and STAFF to access admin routes
  }

  // Check if the request is for doctor dashboard routes
  if (request.nextUrl.pathname.startsWith('/doctor/dashboard')) {
    // If user is not logged in, redirect to doctor login
    if (!userId) {
      const loginUrl = new URL('/doctor/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Only doctors and admins can access doctor dashboard
    const userType = request.cookies.get('user_type')?.value
    if (userType !== 'doctor' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Check if the request is for patient routes (dashboard, appointments, records, etc.)
  if (request.nextUrl.pathname.startsWith('/patient/') && !request.nextUrl.pathname.startsWith('/patient/login')) {
    // If user is not logged in, redirect to patient login
    if (!userId) {
      const loginUrl = new URL('/patient/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Only patients can access patient routes (admins can manage via /admin)
    const userType = request.cookies.get('user_type')?.value
    if (userType !== 'patient') {
      // Redirect doctors to doctor dashboard, admins to admin dashboard
      if (userType === 'doctor') {
        return NextResponse.redirect(new URL('/doctor/dashboard', request.url))
      }
      if (userRole === 'ADMIN' || userRole === 'STAFF') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // If user is logged in and tries to access login/signup, redirect based on role
  const loginPaths = ['/login', '/signup', '/patient/login', '/doctor/login', '/admin-login'];
  if (loginPaths.includes(request.nextUrl.pathname) && userId) {
    const userType = request.cookies.get('user_type')?.value

    // Redirect ADMIN/STAFF to admin dashboard
    if (userRole === 'ADMIN' || userRole === 'STAFF') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    // Redirect DOCTOR to doctor dashboard
    if (userType === 'doctor' || userRole === 'DOCTOR') {
      return NextResponse.redirect(new URL('/doctor/dashboard', request.url))
    }
    // Redirect PATIENT to patient dashboard
    if (userType === 'patient' || userRole === 'PATIENT') {
      return NextResponse.redirect(new URL('/patient/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/doctor/dashboard/:path*',
    '/patient/:path*',
    '/login',
    '/signup',
    '/patient/login',
    '/doctor/login',
    '/admin-login'
  ],
}
