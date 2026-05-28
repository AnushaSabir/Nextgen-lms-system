-- Supabase SQL Schema for NextGen IT Portal

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255) NOT NULL,
    total_modules INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed_modules INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, course_id)
);

-- 3. Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Assignment Submissions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Pending',
    score VARCHAR(50),
    submitted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(assignment_id, student_id)
);

-- 5. Invoices (Fee Payment)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies (Simplified for development)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users for viewing
CREATE POLICY "Enable read access for all authenticated users" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON public.invoices FOR SELECT TO authenticated USING (true);

-- Allow students to read only their own data (Simplified: for development we are allowing broad access)
CREATE POLICY "Enable read for users based on user_id" ON public.enrollments FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Enable read for users based on user_id" ON public.assignment_submissions FOR SELECT TO authenticated USING (auth.uid() = student_id);

-- TEMPORARY: Allow all authenticated users to INSERT and UPDATE for development purposes
-- In production, these should be restricted to Admin users only via a user_roles table or similar mechanism.
CREATE POLICY "Enable insert access for all authenticated users" ON public.courses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for all authenticated users" ON public.courses FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable insert access for all authenticated users" ON public.announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for all authenticated users" ON public.announcements FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable insert access for all authenticated users" ON public.invoices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for all authenticated users" ON public.invoices FOR UPDATE TO authenticated USING (true);
