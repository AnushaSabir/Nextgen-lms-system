'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCourseById } from '@/data/courses'

export async function enrollCourse(formData: FormData) {
  const courseId = formData.get('courseId') as string;
  if (!courseId) return;

  const cookieStore = await cookies();
  
  // Check if logged in (demo mode check)
  const isDemoLogged = cookieStore.get('demo_user_logged_in')?.value === 'true';
  if (!isDemoLogged) {
    redirect('/signup?message=Please sign up to enroll in courses');
  }

  // Get current enrolled courses
  const enrolledCookie = cookieStore.get('enrolled_courses')?.value;
  let enrolledCourses: string[] = [];
  
  if (enrolledCookie) {
    try {
      enrolledCourses = JSON.parse(enrolledCookie);
    } catch (e) {
      // Ignore parse error
    }
  }

  // Add new course if not already enrolled
  if (!enrolledCourses.includes(courseId)) {
    enrolledCourses.push(courseId);
    cookieStore.set('enrolled_courses', JSON.stringify(enrolledCourses), { path: '/' });
  }

  // Redirect to dashboard
  redirect('/dashboard');
}
