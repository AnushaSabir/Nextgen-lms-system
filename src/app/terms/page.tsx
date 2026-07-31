'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Building, Upload, CheckCircle2, Check, ChevronRight, FileImage } from 'lucide-react';

export default function TermsAndConditionsPage() {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Store actual file objects or their names
  const [equipmentFile, setEquipmentFile] = useState<File | null>(null);
  const [workspaceFile, setWorkspaceFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Refs for hidden file inputs
  const equipmentInputRef = useRef<HTMLInputElement>(null);
  const workspaceInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleFinish = () => {
    window.localStorage.setItem('nextgen-lms_lms_token', 'dummy-token');
    window.localStorage.setItem('nextgen-lms_lms_user', JSON.stringify({ role: 'trainer', name: 'Test User' }));
    router.push('/trainer/dashboard');
  };

  const handleEquipmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEquipmentFile(e.target.files[0]);
    }
  };

  const handleWorkspaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setWorkspaceFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#c8e6c9] text-[#0f3d1a] py-12 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background styling elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#5E6F58] opacity-[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-600 opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-[#1e293b] rounded-[40px] p-8 sm:p-12 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-3xl font-black text-[#0f3d1a] mb-2 leading-tight">Final Requirements</h1>
        <p className="text-[#1a6b2e] text-lg mb-8">Review terms and provide your environment proofs.</p>

        <div className="space-y-6 mb-8">
          {/* Equipment Upload */}
          <div>
            <h3 className="text-sm font-bold text-[#0f3d1a] mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#d94d19]" /> 1. Proof of Equipment
            </h3>
            <p className="text-xs text-[#1a6b2e] mb-3 leading-relaxed">Upload a picture of your recording equipment (DSLR, iPhone, or high-quality Webcam).</p>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={equipmentInputRef} 
              onChange={handleEquipmentUpload} 
            />
            
            <div 
              onClick={() => equipmentInputRef.current?.click()}
              className={`cursor-pointer p-4 rounded-2xl border-2 border-dashed flex items-center justify-between transition-colors ${equipmentFile ? 'bg-[#5E6F58]/10 border-[#5E6F58]' : 'bg-[#0f172a] border-[#1e293b] hover:border-[#334155]'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${equipmentFile ? 'bg-[#5E6F58]' : 'bg-[#1e293b]'}`}>
                  <Camera className={`w-6 h-6 ${equipmentFile ? 'text-[#0f3d1a]' : 'text-[#64748b]'}`} />
                </div>
                <div>
                  <h4 className={`font-bold ${equipmentFile ? 'text-[#0f3d1a]' : 'text-[#1a6b2e]'}`}>
                    {equipmentFile ? 'Equipment Photo Uploaded' : 'Upload Equipment Photo'}
                  </h4>
                  <p className="text-xs text-[#64748b] flex items-center gap-1">
                    {equipmentFile ? <><FileImage className="w-3 h-3" /> {equipmentFile.name}</> : 'JPG, PNG (Max 5MB)'}
                  </p>
                </div>
              </div>
              {equipmentFile ? <CheckCircle2 className="text-[#d94d19] w-6 h-6" /> : <Upload className="text-[#64748b] w-5 h-5" />}
            </div>
          </div>

          {/* Workspace Upload */}
          <div>
            <h3 className="text-sm font-bold text-[#0f3d1a] mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#d94d19]" /> 2. Proof of Workspace
            </h3>
            <p className="text-xs text-[#1a6b2e] mb-3 leading-relaxed">Upload a picture of your office or recording space.</p>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={workspaceInputRef} 
              onChange={handleWorkspaceUpload} 
            />
            
            <div 
              onClick={() => workspaceInputRef.current?.click()}
              className={`cursor-pointer p-4 rounded-2xl border-2 border-dashed flex items-center justify-between transition-colors ${workspaceFile ? 'bg-[#5E6F58]/10 border-[#5E6F58]' : 'bg-[#0f172a] border-[#1e293b] hover:border-[#334155]'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${workspaceFile ? 'bg-[#5E6F58]' : 'bg-[#1e293b]'}`}>
                  <Building className={`w-6 h-6 ${workspaceFile ? 'text-[#0f3d1a]' : 'text-[#64748b]'}`} />
                </div>
                <div>
                  <h4 className={`font-bold ${workspaceFile ? 'text-[#0f3d1a]' : 'text-[#1a6b2e]'}`}>
                    {workspaceFile ? 'Workspace Photo Uploaded' : 'Upload Workspace Photo'}
                  </h4>
                  <p className="text-xs text-[#64748b] flex items-center gap-1">
                    {workspaceFile ? <><FileImage className="w-3 h-3" /> {workspaceFile.name}</> : 'JPG, PNG (Max 5MB)'}
                  </p>
                </div>
              </div>
              {workspaceFile ? <CheckCircle2 className="text-[#d94d19] w-6 h-6" /> : <Upload className="text-[#64748b] w-5 h-5" />}
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <h3 className="text-sm font-bold text-[#0f3d1a] mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#d94d19]" /> 3. Intro / Workspace Video
            </h3>
            <p className="text-xs text-[#1a6b2e] mb-3 leading-relaxed">Upload a short video showing your workspace and equipment setup (Optional but recommended).</p>
            
            <input 
              type="file" 
              accept="video/mp4,video/webm" 
              className="hidden" 
              ref={videoInputRef} 
              onChange={handleVideoUpload} 
            />
            
            <div 
              onClick={() => videoInputRef.current?.click()}
              className={`cursor-pointer p-4 rounded-2xl border-2 border-dashed flex items-center justify-between transition-colors ${videoFile ? 'bg-[#5E6F58]/10 border-[#5E6F58]' : 'bg-[#0f172a] border-[#1e293b] hover:border-[#334155]'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${videoFile ? 'bg-[#5E6F58]' : 'bg-[#1e293b]'}`}>
                  <Camera className={`w-6 h-6 ${videoFile ? 'text-[#0f3d1a]' : 'text-[#64748b]'}`} />
                </div>
                <div>
                  <h4 className={`font-bold ${videoFile ? 'text-[#0f3d1a]' : 'text-[#1a6b2e]'}`}>
                    {videoFile ? 'Video Uploaded' : 'Upload Setup Video'}
                  </h4>
                  <p className="text-xs text-[#64748b] flex items-center gap-1">
                    {videoFile ? <><FileImage className="w-3 h-3" /> {videoFile.name}</> : 'MP4, WebM (Max 50MB)'}
                  </p>
                </div>
              </div>
              {videoFile ? <CheckCircle2 className="text-[#d94d19] w-6 h-6" /> : <Upload className="text-[#64748b] w-5 h-5" />}
            </div>
          </div>
        </div>

        <div className="bg-[#c8e6c9] border border-[#1e293b] rounded-3xl p-6 h-48 overflow-y-auto mb-8 text-sm text-[#1a6b2e] space-y-4 hide-scrollbar shadow-inner relative">
          <h3 className="text-[#0f3d1a] font-bold text-lg sticky top-0 bg-[#c8e6c9] py-2 z-10 border-b border-[#1e293b]/50">NextGen-LMS Trainer Agreement</h3>
          <p>By becoming a trainer on NextGen-LMS, you agree to maintain the highest quality of education and support for your students.</p>
          <h4 className="text-[#0f3d1a] font-bold">1. Revenue Share</h4>
          <p>Trainers earn a standard 70% revenue share on all course sales, processed monthly to the provided bank account.</p>
          <h4 className="text-[#0f3d1a] font-bold">2. Content Ownership</h4>
          <p>You retain the rights to your content. However, you grant NextGen-LMS a license to host and promote your courses.</p>
          <h4 className="text-[#0f3d1a] font-bold">3. Quality Standards</h4>
          <p>You confirm that you possess the necessary equipment (iPhone/DSLR, good microphone) and a professional environment as uploaded above. All demo videos and subsequent course uploads must meet our minimum audio (clear, no echo) and video (1080p HD) standards.</p>
        </div>

        {/* Checkbox fixed with an onClick on the container label */}
        <label 
          className="flex items-start gap-4 cursor-pointer group mb-8"
          onClick={(e) => {
            e.preventDefault();
            setAcceptedTerms(!acceptedTerms);
          }}
        >
          <div className={`mt-1 w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors flex-shrink-0 ${acceptedTerms ? 'bg-[#5E6F58] border-[#5E6F58]' : 'bg-[#0f172a] border-[#334155] group-hover:border-[#5E6F58]'}`}>
            {acceptedTerms && <Check className="w-4 h-4 text-[#0f3d1a]" />}
          </div>
          <p className="text-[#1a6b2e] text-sm leading-relaxed select-none">
            I have read and agree to the NextGen-LMS Trainer Agreement and acknowledge that my profile will be reviewed by an Admin before final approval.
          </p>
        </label>

        <button 
          onClick={handleFinish}
          disabled={!acceptedTerms || !equipmentFile || !workspaceFile}
          className="w-full flex items-center justify-center gap-2 bg-[#5E6F58] hover:bg-[#ea580c] disabled:opacity-50 disabled:bg-[#1e293b] disabled:text-[#64748b] text-[#0f3d1a] px-8 py-4 rounded-full font-black text-lg transition-all active:scale-95 shadow-[0_10px_20px_-10px_rgba(240,89,31,0.5)]"
        >
          Submit Application & Go to Dashboard <ChevronRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
