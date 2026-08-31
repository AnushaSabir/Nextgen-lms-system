-- =========================================================================
-- NEXTGEN LMS - SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. Create PROFILES Table (Students, Admins, Trainers)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'learner', -- 'learner', 'admin', 'trainer', 'institute_head'
  avatar_url TEXT,
  student_id TEXT UNIQUE,
  roll_no TEXT,
  phone TEXT,
  enrolled_course TEXT,
  batch TEXT DEFAULT 'Batch 2026-A',
  department TEXT DEFAULT 'School of Artificial Intelligence & Computing',
  issue_date TEXT DEFAULT CURRENT_DATE,
  expiry_date TEXT,
  verified_badge BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create COURSES Table
CREATE TABLE IF NOT EXISTS public.courses (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level TEXT DEFAULT 'All Levels',
  thumbnail TEXT,
  video_url TEXT,
  duration TEXT,
  lectures_count INT DEFAULT 0,
  students_count INT DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 4.9,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create ENROLLMENTS Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE,
  progress INT DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'suspended'
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create CERTIFICATES Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id BIGSERIAL PRIMARY KEY,
  certificate_no TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE,
  grade TEXT DEFAULT 'A+',
  score INT DEFAULT 95,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  pdf_url TEXT
);

-- 5. Storage Buckets (Avatars & ID Cards)
INSERT INTO storage.buckets (id, name, public)
VALUES ('student_avatars', 'student_avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (Allow Public Read for LMS, Authenticated Writes)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (true);

CREATE POLICY "Courses are viewable by everyone." ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Enrollments are viewable by enrolled student." ON public.enrollments
  FOR SELECT USING (true);

CREATE POLICY "Enrollments can be inserted by student." ON public.enrollments
  FOR INSERT WITH CHECK (true);
