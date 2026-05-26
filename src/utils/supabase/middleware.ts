import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check for Demo Mode cookie first to bypass slow network requests
  const isDemoMode = request.cookies.get('demo_user_logged_in')?.value === 'true'
  const pathname = request.nextUrl.pathname
  const isPublicRoute = pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/auth')

  let user = null;

  if (isDemoMode) {
    user = { id: 'demo-user-id' }; // Mock user object for demo mode
  } else {
    try {
      // Wrap getUser in a timeout to prevent hanging the whole app if Supabase is down
      const getUserPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
      
      const { data } = await Promise.race([getUserPromise, timeoutPromise]) as any
      user = data?.user
    } catch (e) {
      console.warn("Supabase auth timeout or error in middleware")
      user = null
    }
  }

  // If user is not logged in and trying to access a protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in, check roles for /admin routes
  if (user && pathname.startsWith('/admin')) {
    if (isDemoMode) {
       // Demo student cannot access admin
       // TEMPORARY BYPASS: Allow demo mode to see admin for testing
       // const url = request.nextUrl.clone()
       // url.pathname = '/dashboard'
       // return NextResponse.redirect(url)
    }

    try {
      const getRolePromise = supabase.from('user_roles').select('role').eq('user_id', user.id).single()
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
      
      const { data: roleData } = await Promise.race([getRolePromise, timeoutPromise]) as any
      
      // TEMPORARY BYPASS: Allow all logged-in users to view admin for testing
      // if (roleData?.role !== 'admin') {
      //   const url = request.nextUrl.clone()
      //   url.pathname = '/dashboard' 
      //   return NextResponse.redirect(url)
      // }
    } catch (e) {
        // TEMPORARY BYPASS: Don't redirect on timeout so UI can be tested
        // const url = request.nextUrl.clone()
        // url.pathname = '/dashboard'
        // return NextResponse.redirect(url)
    }
  }

  // If user is logged in and trying to access login/signup, redirect to dashboard
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
