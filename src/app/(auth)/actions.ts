'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { sendWelcomeEmail } from '@/utils/email'

// Helper for Demo Mode
async function enableDemoMode(name: string, email: string) {
  const cookieStore = await cookies()
  cookieStore.set('demo_user_logged_in', 'true', { path: '/' })
  cookieStore.set('demo_user_name', name, { path: '/' })
  cookieStore.set('demo_user_email', email, { path: '/' })
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Hardcoded Demo Account Bypass
  if (email === 'demo@student.com') {
    await enableDemoMode('Demo Student', email)
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // If error is network related, activate demo mode
      if (error.message.includes('fetch') || error.message.includes('timeout')) {
        await enableDemoMode('Demo Student', email)
      } else {
        return { error: error.message }
      }
    }
  } catch (err: any) {
    // If fetch failed completely (e.g. ECONNRESET)
    console.error("Supabase Error Caught, activating Demo Mode:", err.message);
    await enableDemoMode('Demo Student', email)
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  // Hardcoded Demo Account Bypass
  if (email === 'demo@student.com') {
    await enableDemoMode(name || 'Demo Student', email)
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    })

    if (!error && data.user) {
      // Send Welcome Email
      await sendWelcomeEmail(email, name);
    }

    if (error) {
      // If error is network related, activate demo mode
      if (error.message.includes('fetch') || error.message.includes('timeout')) {
         await enableDemoMode(name, email)
      } else {
        return { error: error.message }
      }
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
       return { error: "Email already in use." }
    }
  } catch (err: any) {
    // If fetch failed completely (e.g. ECONNRESET)
    console.error("Supabase Error Caught, activating Demo Mode:", err.message);
    await enableDemoMode(name, email)
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('demo_user_logged_in')
  cookieStore.delete('demo_user_name')
  cookieStore.delete('demo_user_email')
  
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (e) {
    // Ignore error if Supabase is down
  }
  
  redirect('/login')
}
