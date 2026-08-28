import { DashboardShell } from '@/components/layout/DashboardShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { StudentDashboard } from '@/features/student/StudentDashboard';

export default function StudentPage() {
  return (
    <ProtectedRoute>
      <DashboardShell area="Student">
        <StudentDashboard />
      </DashboardShell>
    </ProtectedRoute>
  );
}
