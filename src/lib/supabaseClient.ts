import { createClient } from '@supabase/supabase-js';

// Access Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase Client with graceful fallback
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Register or sync student profile into Supabase
 */
export async function syncStudentProfileToSupabase(studentData: {
  id?: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  student_id: string;
  roll_no: string;
  phone?: string;
  enrolled_course?: string;
  batch?: string;
  department?: string;
}) {
  if (!supabase) {
    console.log('[Supabase Demo Mode] Config not detected. Data stored in local browser state.');
    return { success: true, data: studentData, mode: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: studentData.id,
        full_name: studentData.name,
        email: studentData.email,
        role: 'learner',
        avatar_url: studentData.avatar_url,
        student_id: studentData.student_id,
        roll_no: studentData.roll_no,
        phone: studentData.phone,
        enrolled_course: studentData.enrolled_course,
        batch: studentData.batch,
        department: studentData.department,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data, mode: 'supabase' };
  } catch (err: any) {
    console.error('Supabase profile sync error:', err.message);
    return { success: false, error: err.message, mode: 'fallback' };
  }
}

/**
 * Upload student photo to Supabase Storage bucket 'student_avatars'
 */
export async function uploadStudentPhotoToSupabase(file: File, studentId: string): Promise<string | null> {
  if (!supabase) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${studentId}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('student_avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('student_avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err: any) {
    console.error('Supabase photo upload error:', err.message);
    return null;
  }
}
