import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  Certificate,
  Course,
  CourseStatus,
  Enrollment,
  Institution,
  LearningLevel,
  PricingPackage,
  ProgressiveTest,
  ReviewDecision,
  TestAttempt,
  User,
} from '@/types/domain';

// ─── Base URLs ──────────────────────────────────────────────────────────────
// The .env file currently has NEXT_PUBLIC_API_URL=http://localhost:8000/graphql
// So we must explicitly separate the REST and GraphQL base URLs.
const envApiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/graphql';

// GraphQL endpoint (Lighthouse) — used for auth mutations only
const GRAPHQL_URL = envApiUrl.endsWith('/graphql') ? envApiUrl : `${envApiUrl}/graphql`;

// REST endpoint — used for all trainer module and resource routes.
// Strip a trailing /graphql or /api so we never double the /api segment
// (env may be http://host/graphql or http://host/api).
const REST_BASE_URL = envApiUrl.replace(/\/(graphql|api)\/?$/, '') + '/api';

// ─── Shared interceptor factory ──────────────────────────────────────────────
function attachInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('nextgen-lms_lms_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      // Surface GraphQL-level errors as JS errors
      if (response.data?.errors) {
        const message = response.data.errors[0]?.message || 'GraphQL Error';
        return Promise.reject(new Error(message));
      }
      return response;
    },
    (error: AxiosError<{ message?: string | string[] }>) => {

      // --- MOCK FALLBACK FOR OFFLINE / VERCEL DEMO ---
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        const url = error.config?.url || '';
        const reqData = error.config?.data || '';
        
        console.warn('Network Error caught. Using mock fallback for:', url);
        
        if (url.includes('graphql') || (error.config?.baseURL && error.config.baseURL.includes('graphql'))) {
          if (reqData.includes('Login')) {
            let role = 'learner';
            let name = 'Ali Hassan';
            if (reqData.toLowerCase().includes('admin')) {
              role = 'admin';
              name = 'Master Admin';
            } else if (reqData.toLowerCase().includes('school') || reqData.toLowerCase().includes('institute')) {
              role = 'institute_head';
              name = 'Beaconhouse Admin';
            }
            return Promise.resolve({
              data: {
                data: {
                  login: { access_token: 'mock-token', user: { id: '1', name, email: 'demo@nextgen.lms', role } }
                }
              }
            });
          }
          if (reqData.includes('Register')) {
            return Promise.resolve({
              data: {
                data: {
                  register: { access_token: 'mock-token', user: { id: '1', name: 'Demo User', email: 'demo@nextgen.lms', role: 'learner' } }
                }
              }
            });
          }
        }
        
        // Mock REST returns
        if (error.config?.method === 'get') {
          return Promise.resolve({ data: [] });
        }
        return Promise.resolve({ data: {} });
      }
      // ------------------------------------------------

      if (typeof window !== 'undefined' && error.response?.status === 401) {
        // Clear local session on 401. Do not force a navigation here —
        // leave routing decisions to the client-side auth guard to avoid
        // premature redirects triggered by background requests.
        window.localStorage.removeItem('nextgen-lms_lms_token');
        window.localStorage.removeItem('nextgen-lms_lms_user');
      }
      const message = error.response?.data?.message;
      return Promise.reject(
        new Error(Array.isArray(message) ? message.join(', ') : message ?? error.message),
      );
    },
  );
}

// ─── GraphQL client (auth only) ──────────────────────────────────────────────
export const api = axios.create({
  baseURL: GRAPHQL_URL,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
});
attachInterceptors(api);

// ─── REST client (trainer module + all resource routes) ──────────────────────
export const restApi = axios.create({
  baseURL: REST_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
attachInterceptors(restApi);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
  role: 'admin' | 'trainer' | 'learner' | 'institute_head';
  learnerCategory?: string;
  trainerLevel?: string;
  portfolio?: string;
  teachingExperience?: string;
  joiningReason?: string;
  institutionId?: string;
  avatar?: string;
  studentId?: string;
  rollNo?: string;
  phone?: string;
  enrolledCourse?: string;
  batch?: string;
  department?: string;
}

export const authApi = {
  async login(input: LoginInput) {
    const { data } = await api.post('', {
      query: `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            access_token
            user {
              id
              name
              email
              role
            }
          }
        }
      `,
      variables: { input },
    });

    const { access_token, user } = data.data.login;
    return { accessToken: access_token, user };
  },

  async register(input: RegisterInput) {
    const { data } = await api.post('', {
      query: `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            access_token
            user {
              id
              name
              email
              role
              learnerCategory
            }
          }
        }
      `,
      variables: { input },
    });

    const { access_token, user } = data.data.register;
    return { accessToken: access_token, user };
  },

  async profile() {
    const raw =
      typeof window !== 'undefined' ? window.localStorage.getItem('nextgen-lms_lms_user') : null;
    return raw ? (JSON.parse(raw) as User) : null;
  },
};

// ─── Courses (trainer REST) ───────────────────────────────────────────────────
export const coursesApi = {
  /** Trainer's own courses — GET /api/trainer/courses */
  async list(_level?: LearningLevel) {
    const { data } = await restApi.get<Course[]>('/trainer/courses');
    return data;
  },

  /** Admin-side published listing — kept for admin pages */
  async adminList() {
    const { data } = await restApi.get<Course[]>('/courses/admin');
    return data;
  },

  /** Create a new course — POST /api/trainer/courses */
  async create(input: Pick<Course, 'title' | 'description' | 'level'>) {
    const { data } = await restApi.post<Course>('/trainer/courses', input);
    return data;
  },

  /** Submit course for admin review — POST /api/trainer/courses/:id/submit-approval */
  async submitReview(courseId: string) {
    const { data } = await restApi.post<Course>(`/trainer/courses/${courseId}/submit-approval`);
    return data;
  },

  /** Admin approve/reject — PATCH /api/trainer/courses/:id/admin-review */
  async adminReview(
    courseId: string,
    status: Extract<CourseStatus, 'approved' | 'rejected'>,
    notes?: string,
  ) {
    const { data } = await restApi.patch<Course>(`/courses/${courseId}/admin-review`, {
      status,
      notes,
    });
    return data;
  },

  /** Add a video lesson — POST /api/trainer/courses/:id/videos */
  async addVideo(
    courseId: string,
    input: { title: string; position: number; videoUrl: string; summary?: string },
  ) {
    const { data } = await restApi.post(`/trainer/courses/${courseId}/videos`, input);
    return data;
  },

  async addAssessmentSet(videoId: string, input: unknown) {
    const { data } = await restApi.post(`/courses/videos/${videoId}/assessment-sets`, input);
    return data;
  },

  async enroll(courseId: string) {
    const { data } = await restApi.post<Enrollment>(`/courses/${courseId}/enroll`);
    return data;
  },

  async progress(enrollmentId: string) {
    const { data } = await restApi.get<{ enrollment: Enrollment; videos: Course['videos'] }>(
      `/courses/enrollments/${enrollmentId}/progress`,
    );
    return data;
  },
};

// ─── Assessments ─────────────────────────────────────────────────────────────
export const assessmentApi = {
  async build(enrollmentId: string, position: number) {
    const { data } = await restApi.get<ProgressiveTest>(
      `/assessments/enrollments/${enrollmentId}/after-video/${position}`,
    );
    return data;
  },
  async submit(
    enrollmentId: string,
    position: number,
    assessmentSetIds: string[],
    answers: Record<string, unknown>,
  ) {
    const { data } = await restApi.post<TestAttempt>(
      `/assessments/enrollments/${enrollmentId}/after-video/${position}/submit`,
      { assessmentSetIds, answers },
    );
    return data;
  },
};

// ─── Submissions ──────────────────────────────────────────────────────────────
export const submissionsApi = {
  async submitHomework(input: {
    enrollmentId: string;
    videoId: string;
    fileUrl?: string;
    textAnswer?: string;
  }) {
    const { data } = await restApi.post('/submissions/homework', input);
    return data;
  },

  /** Trainer's homework submissions — GET /api/trainer/submissions */
  async trainerList() {
    try {
      const { data } = await restApi.get('/trainer/submissions');
      return Array.isArray(data) ? data : data?.data ?? [];
    } catch {
      return [];
    }
  },

  /** Review a submission — PATCH /api/trainer/submissions/:id/review */
  async review(id: string, decision: ReviewDecision, remarks?: string) {
    const { data } = await restApi.patch(`/trainer/submissions/${id}/review`, { decision, remarks });
    return data;
  },
};

// ─── Institutions ─────────────────────────────────────────────────────────────
export const institutionsApi = {
  async list() {
    const { data } = await restApi.get<Institution[]>('/institutions');
    return data;
  },
  async students(institutionId: string) {
    const { data } = await restApi.get<User[]>(`/institutions/${institutionId}/students`);
    return data;
  },
  async pricing(level?: LearningLevel) {
    const { data } = await restApi.get<PricingPackage[]>('/institutions/pricing', {
      params: { level },
    });
    return data;
  },
  async createGroup(
    institutionId: string,
    input: { name: string; type: 'institute' | 'class' | 'trainer_head_room' },
  ) {
    const { data } = await restApi.post(`/institutions/${institutionId}/groups`, input);
    return data;
  },
};

// ─── Groups ───────────────────────────────────────────────────────────────────
export const groupsApi = {
  async joinGlobal() {
    const { data } = await restApi.post('/groups/global/join');
    return data;
  },
  async mine() {
    const { data } = await restApi.get('/groups/mine');
    return data;
  },
  async messages(groupId: string) {
    const { data } = await restApi.get(`/groups/${groupId}/messages`);
    return data;
  },
  async send(groupId: string, body: string, voiceNoteUrl?: string) {
    const { data } = await restApi.post(`/groups/${groupId}/messages`, { body, voiceNoteUrl });
    return data;
  },
  async askTrainer(trainerId: string, body: string) {
    const { data } = await restApi.post('/groups/questions', { trainerId, body });
    return data;
  },
};

// ─── Reports ──────────────────────────────────────────────────────────────────
export const reportsApi = {
  async create(input: {
    learnerId: string;
    institutionId: string;
    courseId: string;
    remarks: string;
  }) {
    const { data } = await restApi.post('/reports', input);
    return data;
  },
  async byInstitution(institutionId: string) {
    const { data } = await restApi.get(`/reports/institutions/${institutionId}`);
    return data;
  },
};

// ─── Certificates ─────────────────────────────────────────────────────────────
export const certificatesApi = {
  async mine() {
    const { data } = await restApi.get<Certificate[]>('/certificates/mine');
    return data;
  },
};

// ─── Meetings ─────────────────────────────────────────────────────────────────
export const meetingsApi = {
  /** List all trainer meetings — GET /api/trainer/meetings */
  async list() {
    try {
      const { data } = await restApi.get('/trainer/meetings');
      return Array.isArray(data) ? data : data?.data ?? [];
    } catch {
      return [];
    }
  },

  /** Schedule a new meeting — POST /api/trainer/meetings */
  async create(input: {
    courseId: string;
    startsAt: string;
    provider: 'zoom' | 'google_meet';
    meetingUrl: string;
    agenda?: string;
  }) {
    const { data } = await restApi.post('/trainer/meetings', input);
    return data;
  },

  /** Meetings for a specific course — GET /api/trainer/meetings/courses/:courseId */
  async byCourse(courseId: string) {
    try {
      const { data } = await restApi.get(`/trainer/meetings/courses/${courseId}`);
      return Array.isArray(data) ? data : data?.data ?? [];
    } catch {
      return [];
    }
  },

  /** Cancel a meeting — DELETE /api/trainer/meetings/:id */
  async destroy(id: string) {
    const { data } = await restApi.delete(`/trainer/meetings/${id}`);
    return data;
  },
};

// ─── Analytics ───────────────────────────────────────────────────────────────
export const analyticsApi = {
  async overview() {
    const { data } = await restApi.get('/analytics/overview');
    return data;
  },
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  async list(role?: string) {
    const { data } = await restApi.get<User[]>('/users', { params: { role } });
    return data;
  },
  async verify(id: string, verified = true) {
    const { data } = await restApi.patch(`/users/${id}/verify`, { verified });
    return data;
  },
};

// ─── Trainer portal (analytics, students, earnings, notifications, withdrawal) ──
export const trainerApi = {
  async analytics() {
    const { data } = await restApi.get('/trainer/analytics');
    return data as {
      totalCourses: number;
      activeCourses: number;
      totalStudents: number;
      totalSubmissions: number;
      pendingReviews: number;
      passRate: number;
      totalEarnings: number;
    };
  },
  async students() {
    const { data } = await restApi.get('/trainer/students');
    return data as Array<{
      id: string;
      learnerId: string;
      name: string;
      email: string;
      course: string;
      courseId: string;
      status: string;
      progress: number;
      totalVideos: number;
      unlockedVideoPosition: number;
    }>;
  },
  async earnings() {
    const { data } = await restApi.get('/trainer/earnings');
    return data as {
      total: number;
      cleared: number;
      pending: number;
      trainerSharePercent: number;
      platformSharePercent: number;
      perCourse: Array<{ course: string; students: number; gross: number; earned: number }>;
    };
  },
  async earningsHistory() {
    const { data } = await restApi.get('/trainer/earnings/history');
    return data as Array<{
      id: string;
      course: string;
      learner: string;
      grossAmount: number;
      trainerShare: number;
      status: string;
      date: string | null;
    }>;
  },
  async notifications() {
    const { data } = await restApi.get('/trainer/notifications');
    return data as Array<{ id: string; title: string; body: string; read: boolean; createdAt: string }>;
  },
  async markNotificationRead(id: string) {
    const { data } = await restApi.patch(`/trainer/notifications/${id}/read`);
    return data;
  },
  async markAllNotificationsRead() {
    const { data } = await restApi.post('/trainer/notifications/read-all');
    return data;
  },
  async withdrawalMethods() {
    const { data } = await restApi.get('/trainer/withdrawal/methods');
    return data as Array<{ id: string; provider: string; accountTitle: string; accountNumber: string; isActive: boolean }>;
  },
  async addWithdrawalMethod(input: { provider: string; accountTitle: string; accountNumber: string }) {
    const { data } = await restApi.post('/trainer/withdrawal/methods', input);
    return data;
  },
  async withdrawals() {
    const { data } = await restApi.get('/trainer/withdrawals');
    return data as {
      availableBalance: number;
      requests: Array<{ id: string; amount: number; status: string; createdAt: string; method?: { provider: string; accountTitle: string } }>;
    };
  },
  async requestWithdrawal(input: { methodId: string; amount: number }) {
    const { data } = await restApi.post('/trainer/withdrawals', input);
    return data;
  },
  // ── Chat ──
  async chatThreads() {
    const { data } = await restApi.get('/trainer/chat/threads');
    return data as Array<{ userId: string; name: string; email: string; lastMessage: string; lastAt: string }>;
  },
  async chatMessages(userId: string) {
    const { data } = await restApi.get(`/trainer/chat/${userId}/messages`);
    return data as {
      contact: { id: string; name: string; email: string } | null;
      messages: Array<{ id: string; body: string; fromMe: boolean; createdAt: string }>;
    };
  },
  async sendChat(userId: string, body: string) {
    const { data } = await restApi.post(`/trainer/chat/${userId}/messages`, { body });
    return data as { id: string; body: string; fromMe: boolean; createdAt: string };
  },
  // ── Assessment sets (retry / backup) ──
  async assessmentSets(videoId: string) {
    const { data } = await restApi.get(`/trainer/videos/${videoId}/assessment-sets`);
    return data as Array<{
      id: string;
      title: string;
      version: number;
      active: boolean;
      label: string;
      counts: { mcq: number; quiz: number; summary: number };
    }>;
  },
  async createAssessmentSet(videoId: string) {
    const { data } = await restApi.post(`/trainer/videos/${videoId}/assessment-sets`);
    return data;
  },
  // ── Student reports (create + list) ──
  async reports() {
    const { data } = await restApi.get('/trainer/reports');
    return data as Array<{ id: string; learner: string; course: string; remarks: string; createdAt: string }>;
  },
  async createReport(input: { learnerId: string; courseId: string; remarks: string; institutionId?: string }) {
    const { data } = await restApi.post('/trainer/reports', input);
    return data;
  },
};
