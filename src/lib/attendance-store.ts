/**
 * NextGen LMS - Attendance Store (localStorage-based with Supabase sync)
 * Stores attendance records per student per session
 */

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrolledCourse: string;
  batch: string;
  sessionLabel: string; // e.g. "Python - Week 3 - Lecture 1"
  scannedAt: string; // ISO timestamp
  markedBy: string; // Admin name or "QR Scanner"
  status: 'present' | 'late' | 'absent';
  avatarUrl?: string;
}

export interface AttendanceSession {
  id: string;
  title: string;
  course: string;
  batch: string;
  date: string;
  records: AttendanceRecord[];
  createdAt: string;
  isActive: boolean;
}

const STORAGE_KEY = 'nextgen_attendance_sessions';
const PENDING_KEY = 'nextgen_pending_attendance';

// ─── Read / Write helpers ──────────────────────────────────────────────────────

function readSessions(): AttendanceSession[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeSessions(sessions: AttendanceSession[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
}

// ─── Session Management ────────────────────────────────────────────────────────

export function createAttendanceSession(opts: {
  title: string;
  course: string;
  batch: string;
}): AttendanceSession {
  const session: AttendanceSession = {
    id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: opts.title,
    course: opts.course,
    batch: opts.batch,
    date: new Date().toISOString(),
    records: [],
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  const sessions = readSessions();
  // Deactivate previous sessions
  sessions.forEach(s => { s.isActive = false; });
  sessions.unshift(session);
  writeSessions(sessions);
  return session;
}

export function getActiveSessions(): AttendanceSession[] {
  return readSessions().filter(s => s.isActive);
}

export function getAllSessions(): AttendanceSession[] {
  return readSessions();
}

export function getSessionById(id: string): AttendanceSession | null {
  return readSessions().find(s => s.id === id) || null;
}

export function closeSession(sessionId: string) {
  const sessions = readSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.isActive = false;
    writeSessions(sessions);
  }
}

// ─── Mark Attendance ───────────────────────────────────────────────────────────

export interface QRPayload {
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrolledCourse: string;
  batch: string;
  avatarUrl?: string;
  issueDate?: string;
  institution: string;
}

export function markAttendance(
  sessionId: string,
  payload: QRPayload,
  markedBy: string = 'QR Scanner'
): { success: boolean; message: string; record?: AttendanceRecord } {
  const sessions = readSessions();
  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    return { success: false, message: 'Session not found or has been closed.' };
  }

  if (!session.isActive) {
    return { success: false, message: 'This session is no longer active.' };
  }

  // Check if already marked
  const alreadyMarked = session.records.find(r => r.studentId === payload.studentId);
  if (alreadyMarked) {
    return {
      success: false,
      message: `${payload.studentName} is already marked present at ${new Date(alreadyMarked.scannedAt).toLocaleTimeString()}.`,
      record: alreadyMarked,
    };
  }

  // Determine if late (more than 15 mins after session start)
  const sessionStartTime = new Date(session.createdAt).getTime();
  const now = Date.now();
  const diffMins = (now - sessionStartTime) / 1000 / 60;
  const status: 'present' | 'late' = diffMins > 15 ? 'late' : 'present';

  const record: AttendanceRecord = {
    id: `rec-${Date.now()}`,
    studentId: payload.studentId,
    studentName: payload.studentName,
    studentEmail: payload.studentEmail,
    enrolledCourse: payload.enrolledCourse,
    batch: payload.batch,
    sessionLabel: session.title,
    scannedAt: new Date().toISOString(),
    markedBy,
    status,
    avatarUrl: payload.avatarUrl,
  };

  session.records.push(record);
  writeSessions(sessions);

  return { success: true, message: `✅ ${payload.studentName} marked ${status}!`, record };
}

// ─── QR Payload encoder/decoder ───────────────────────────────────────────────

export function encodeQRPayload(data: QRPayload): string {
  return JSON.stringify({
    ...data,
    institution: 'NextGen Learning Management System',
    version: '2.0',
    ts: Date.now(), // For uniqueness per scan
  });
}

export function decodeQRPayload(qrData: string): QRPayload | null {
  try {
    const parsed = JSON.parse(qrData);
    if (!parsed.studentId || !parsed.studentName) return null;
    return parsed as QRPayload;
  } catch {
    return null;
  }
}

// ─── Analytics helpers ─────────────────────────────────────────────────────────

export function getStudentAttendanceStats(studentId: string) {
  const sessions = readSessions();
  let present = 0, late = 0, absent = 0, total = 0;

  sessions.forEach(session => {
    total++;
    const record = session.records.find(r => r.studentId === studentId);
    if (!record) {
      absent++;
    } else if (record.status === 'late') {
      late++;
    } else {
      present++;
    }
  });

  const percentage = total > 0 ? Math.round((present + late) / total * 100) : 100;
  return { present, late, absent, total, percentage };
}
