-- NextGen IT Institute LMS - Supabase Schema
-- Run this entire script in the Supabase SQL Editor

-- 1. Create Tables

-- Courses Table
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Lessons Table
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT, -- Markdown or HTML content
  video_url TEXT,
  order_num INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enrollments Table
CREATE TABLE public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, course_id)
);

-- Exams Table
CREATE TABLE public.exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Questions Table
CREATE TABLE public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- e.g., ["A", "B", "C", "D"]
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Submissions Table
CREATE TABLE public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, exam_id)
);

-- Roles Table (Simple Role Management)
CREATE TABLE public.user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin'))
);

-- Function to handle new user registration and default role to 'student'
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Enable Row Level Security (RLS)

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Courses: Anyone can read, only admin can write
CREATE POLICY "Courses are viewable by everyone." ON public.courses FOR SELECT USING (true);
CREATE POLICY "Courses are insertable by admin." ON public.courses FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Courses are updatable by admin." ON public.courses FOR UPDATE USING (public.is_admin());
CREATE POLICY "Courses are deletable by admin." ON public.courses FOR DELETE USING (public.is_admin());

-- Lessons: Anyone can read, only admin can write
CREATE POLICY "Lessons are viewable by everyone." ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Lessons are insertable by admin." ON public.lessons FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Lessons are updatable by admin." ON public.lessons FOR UPDATE USING (public.is_admin());
CREATE POLICY "Lessons are deletable by admin." ON public.lessons FOR DELETE USING (public.is_admin());

-- Enrollments: Users can see their own, admin can see all. Only users can enroll themselves (or admin)
CREATE POLICY "Enrollments viewable by user or admin." ON public.enrollments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert their own enrollment." ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Enrollments deletable by user or admin." ON public.enrollments FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Exams: Anyone can read, only admin can write
CREATE POLICY "Exams are viewable by everyone." ON public.exams FOR SELECT USING (true);
CREATE POLICY "Exams are insertable by admin." ON public.exams FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Exams are updatable by admin." ON public.exams FOR UPDATE USING (public.is_admin());
CREATE POLICY "Exams are deletable by admin." ON public.exams FOR DELETE USING (public.is_admin());

-- Questions: Anyone can read (for the exam), admin can write
CREATE POLICY "Questions are viewable by everyone." ON public.questions FOR SELECT USING (true);
CREATE POLICY "Questions are insertable by admin." ON public.questions FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Questions are updatable by admin." ON public.questions FOR UPDATE USING (public.is_admin());
CREATE POLICY "Questions are deletable by admin." ON public.questions FOR DELETE USING (public.is_admin());

-- Submissions: Users can view their own, admin can view all. Users can insert their own.
CREATE POLICY "Submissions viewable by user or admin." ON public.submissions FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert their own submissions." ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- User Roles: Users can read their own, admin can read/write all
CREATE POLICY "Users can view their own role." ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Only admin can update roles." ON public.user_roles FOR UPDATE USING (public.is_admin());
