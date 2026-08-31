export type Role = 'admin' | 'trainer' | 'learner' | 'institute_head';

export type LearnerCategory =
  | 'school_student'
  | 'college_student'
  | 'university_student'
  | 'individual_learner';

export type LearningLevel = 'school' | 'college' | 'university' | 'individual';

export type CourseStatus = 'draft' | 'pending_review' | 'approved' | 'rejected';

export type ReviewDecision = 'pass' | 'fail' | 'improve';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  learnerCategory?: LearnerCategory | null;
  trainerLevel?: LearningLevel | null;
  institutionId?: string | null;
  marketplaceGigAccess?: boolean;
  avatar?: string | null;
  verifiedBadge?: boolean;
  studentId?: string;
  rollNo?: string;
  phone?: string;
  enrolledCourse?: string;
  batch?: string;
  department?: string;
  issueDate?: string;
  expiryDate?: string;
  emergencyContact?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: LearningLevel;
  status: CourseStatus;
  trainer?: User;
  videos?: VideoLesson[];
  createdAt?: string;
}

export interface VideoLesson {
  id: string;
  courseId: string;
  title: string;
  position: number;
  videoUrl: string;
  summary?: string | null;
  locked?: boolean;
}

export interface Enrollment {
  id: string;
  learnerId: string;
  courseId: string;
  status: 'active' | 'completed' | 'suspended';
  unlockedVideoPosition: number;
  course?: Course;
}

export interface Question {
  id: string;
  assessmentSetId: string;
  type: 'mcq' | 'quiz' | 'summary' | 'homework';
  prompt: string;
  options?: string[] | null;
  points: number;
}

export interface ProgressiveTest {
  enrollmentId: string;
  afterVideoPosition: number;
  assessmentSetIds: string[];
  questions: Question[];
}

export interface TestAttempt {
  id: string;
  score: number;
  maxScore: number;
  passed: boolean;
}

export interface PricingPackage {
  id: string;
  level: LearningLevel;
  duration: 'monthly' | 'six_months' | 'yearly';
  pricePerStudentPkr: number;
  grapeTaskRevenuePercent: number;
  trainerRevenuePercent: number;
}

export interface Institution {
  id: string;
  name: string;
  level: LearningLevel;
  studentCount: number;
  logoUrl?: string | null;
  portalSlug?: string | null;
}

export interface Certificate {
  id: string;
  learnerId: string;
  courseId: string;
  badge: string;
  certificateUrl: string;
  certificationDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}
