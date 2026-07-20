'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, UserCheck, UserX, FileText, Camera, Video } from 'lucide-react';
import { usersApi } from '@/lib/api';
import type { User } from '@/types/domain';
import { PageHeader, Card, Badge, EmptyState, Loading, Button } from '@/components/trainer/ui';

type TrainerRow = User & {
  portfolio?: string | null;
  teachingExperience?: string | null;
  createdAt?: string | null;
};

function initials(name?: string) {
  if (!name) return '?';
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

const PROOFS = [
  { icon: Video, title: 'Demo Lecture', detail: 'Review teaching style & HD video quality.' },
  { icon: Camera, title: 'Equipment Proof', detail: 'Verify DSLR/iPhone camera setup.' },
  { icon: Camera, title: 'Workspace Proof', detail: 'Verify professional environment.' },
  { icon: FileText, title: 'CV & Portfolio', detail: 'Review professional background.' },
];

export default function TrainerApprovalPage() {
  const [trainers, setTrainers] = useState<TrainerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function load() {
    try {
      // Admin-only endpoint — a non-admin viewer gets a 403, which we treat as an empty list.
      const data = await usersApi.list('trainer');
      setTrainers(Array.isArray(data) ? (data as TrainerRow[]) : []);
    } catch {
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleVerify(id: string, verified: boolean) {
    setProcessingId(id);
    try {
      await usersApi.verify(id, verified);
      await load();
    } catch {
      // Keep the UI responsive even if the request is rejected (e.g. 403).
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Trainer Approvals"
        subtitle="Review trainer applications, videos, and environment proofs."
      />

      {loading ? (
        <Card className="p-2">
          <Loading label="Loading trainers…" />
        </Card>
      ) : trainers.length === 0 ? (
        <Card className="p-2">
          <EmptyState
            icon={ShieldCheck}
            title="No pending trainers"
            detail="Trainer applications will appear here for review."
          />
        </Card>
      ) : (
        <div className="gt-stagger grid grid-cols-1 gap-6">
          {trainers.map((trainer) => {
            const expertise = trainer.trainerLevel
              ? `${trainer.trainerLevel.charAt(0).toUpperCase()}${trainer.trainerLevel.slice(1)} Level Trainer`
              : trainer.email;
            const applied = trainer.createdAt
              ? new Date(trainer.createdAt).toLocaleDateString()
              : '—';
            const busy = processingId === trainer.id;

            return (
              <Card key={trainer.id} className="flex flex-col gap-6 p-6 md:flex-row">
                <div className="md:w-1/3 md:border-r md:border-[var(--gt-border)] md:pr-6">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gt-accent)] to-[#ff8a4c] text-xl font-black text-white">
                    {initials(trainer.name)}
                  </div>
                  <h2 className="text-xl font-bold text-[var(--gt-text)]">{trainer.name}</h2>
                  <p className="mb-3 text-sm font-medium text-[var(--gt-accent)]">{expertise}</p>
                  <div className="mb-3">
                    <Badge tone={trainer.verifiedBadge ? 'success' : 'warn'} dot>
                      {trainer.verifiedBadge ? 'Verified' : 'Pending Review'}
                    </Badge>
                  </div>
                  <p className="mb-5 text-xs text-[var(--gt-text-3)]">Applied: {applied}</p>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleVerify(trainer.id, true)}
                      disabled={busy}
                      className="flex-1"
                    >
                      <UserCheck className="h-4 w-4" /> {trainer.verifiedBadge ? 'Verified' : 'Approve'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleVerify(trainer.id, false)}
                      disabled={busy}
                      className="flex-1"
                    >
                      <UserX className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:w-2/3">
                  {PROOFS.map(({ icon: Icon, title, detail }) => (
                    <div
                      key={title}
                      className="group cursor-pointer rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-5 transition-colors hover:border-[rgba(240,89,31,0.5)]"
                    >
                      <Icon className="mb-3 h-6 w-6 text-[var(--gt-text-3)] transition-colors group-hover:text-[var(--gt-accent)]" />
                      <h4 className="mb-1 font-bold text-[var(--gt-text)]">{title}</h4>
                      <p className="text-xs text-[var(--gt-text-2)]">{detail}</p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
