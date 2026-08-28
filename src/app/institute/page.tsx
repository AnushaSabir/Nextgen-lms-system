import { DashboardShell } from '@/components/layout/DashboardShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { InstituteDashboard } from '@/features/institute/InstituteDashboard';

export default function InstitutePage() {
  return (
    <ProtectedRoute>
      <DashboardShell area="Institute">
        <InstituteDashboard />
      </DashboardShell>
    </ProtectedRoute>
  );
}
