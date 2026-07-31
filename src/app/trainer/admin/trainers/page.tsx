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
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f3d1a] mb-2 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#d94d19]" /> Trainer Approvals
          </h1>
          <p className="text-[#1a6b2e]">Review trainer applications, videos, and environment proofs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingTrainers.map((trainer) => (
          <div key={trainer.id} className="bg-[#0f172a]/80 backdrop-blur-md border border-[#1e293b] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5E6F58]/5 rounded-bl-[100px] pointer-events-none" />
            
            <div className="md:w-1/3 border-r border-[#1e293b] pr-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[#0f3d1a] font-black text-xl shadow-lg mb-4">
                {trainer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-2xl font-bold text-[#0f3d1a]">{trainer.name}</h2>
              <p className="text-[#d94d19] font-medium text-sm mb-4">{trainer.expertise}</p>
              <p className="text-xs text-[#64748b] mb-6">Applied: {trainer.applied}</p>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-[#0f3d1a] py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" /> Approve
                </button>
                <button className="flex-1 bg-[#1e293b] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 text-[#1a6b2e] py-2.5 rounded-xl font-bold transition-all border border-[#334155] flex items-center justify-center gap-2">
                  <UserX className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>

            <div className="md:w-2/3 grid grid-cols-2 gap-6 relative z-10">
              <div className="bg-[#c8e6c9] rounded-2xl p-5 border border-[#1e293b] hover:border-[#5E6F58]/50 transition-colors cursor-pointer group">
                <Video className="w-6 h-6 text-[#64748b] mb-3 group-hover:text-[#d94d19]" />
                <h4 className="font-bold text-[#0f3d1a] mb-1">Demo Lecture</h4>
                <p className="text-xs text-[#1a6b2e]">Review teaching style & HD video quality.</p>
              </div>
              <div className="bg-[#c8e6c9] rounded-2xl p-5 border border-[#1e293b] hover:border-[#5E6F58]/50 transition-colors cursor-pointer group">
                <Camera className="w-6 h-6 text-[#64748b] mb-3 group-hover:text-[#d94d19]" />
                <h4 className="font-bold text-[#0f3d1a] mb-1">Equipment Proof</h4>
                <p className="text-xs text-[#1a6b2e]">Verify DSLR/iPhone camera setup.</p>
              </div>
              <div className="bg-[#c8e6c9] rounded-2xl p-5 border border-[#1e293b] hover:border-[#5E6F58]/50 transition-colors cursor-pointer group">
                <Camera className="w-6 h-6 text-[#64748b] mb-3 group-hover:text-[#d94d19]" />
                <h4 className="font-bold text-[#0f3d1a] mb-1">Workspace Proof</h4>
                <p className="text-xs text-[#1a6b2e]">Verify professional environment.</p>
              </div>
              <div className="bg-[#c8e6c9] rounded-2xl p-5 border border-[#1e293b] hover:border-[#5E6F58]/50 transition-colors cursor-pointer group">
                <FileText className="w-6 h-6 text-[#64748b] mb-3 group-hover:text-[#d94d19]" />
                <h4 className="font-bold text-[#0f3d1a] mb-1">CV & Portfolio</h4>
                <p className="text-xs text-[#1a6b2e]">Review professional background.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
