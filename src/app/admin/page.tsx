import { DashboardShell } from '@/components/layout/DashboardShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminDashboard } from '@/features/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <DashboardShell area="Admin">
        <AdminDashboard />
      </DashboardShell>
    </ProtectedRoute>
  );
}
