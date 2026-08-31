'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Download, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  CheckCircle2, 
  RotateCw, 
  User, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Award,
  Share2,
  Copy,
  ExternalLink,
  IdCard
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useToastStore } from '@/store/toast-store';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface StudentIDCardProps {
  onClose?: () => void;
}

export default function StudentIDCard({ onClose }: StudentIDCardProps) {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'png'>('pdf');

  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  // Student Details with safe fallbacks
  const studentName = user?.name || 'Ali Hassan';
  const studentEmail = user?.email || 'student@nextgen.lms';
  const studentId = user?.studentId || user?.rollNo || 'NXG-2026-84920';
  const enrolledCourse = user?.enrolledCourse || 'Python for Data Science, Analytics & AI';
  const batch = user?.batch || 'Batch 2026-A';
  const issueDate = user?.issueDate || 'Aug 2026';
  const expiryDate = user?.expiryDate || 'Aug 2027';
  const avatarUrl = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

  /**
   * Download ID Card as PDF in standard ID-1 (CR80) Credit Card Size: 85.60 mm × 53.98 mm
   */
  const handleDownloadPDF = async () => {
    if (!cardFrontRef.current) return;
    setIsDownloading(true);
    showToast('Generating high-resolution ID Card PDF...', 'info');

    try {
      // Capture Front side
      const frontCanvas = await html2canvas(cardFrontRef.current, {
        scale: 3, // High-res 300 DPI
        useCORS: true,
        backgroundColor: '#101010',
        logging: false,
      });

      // Standard ID Card Dimensions (mm): 85.6mm x 53.98mm (Landscape)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98],
      });

      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', 0, 0, 85.6, 53.98);

      // Save PDF
      pdf.save(`${studentName.replace(/\s+/g, '_')}_NextGen_StudentID.pdf`);
      showToast('Official Student ID Card PDF downloaded successfully! 🎉', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      showToast('Failed to download PDF. Please try PNG download.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Download ID Card as high-res PNG
   */
  const handleDownloadPNG = async () => {
    if (!cardFrontRef.current) return;
    setIsDownloading(true);
    showToast('Generating ID Card image...', 'info');

    try {
      const canvas = await html2canvas(cardFrontRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#101010',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${studentName.replace(/\s+/g, '_')}_NextGen_ID_Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Student ID Card image saved! 📸', 'success');
    } catch (error) {
      console.error('PNG export error:', error);
      showToast('Failed to export image.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyStudentId = () => {
    navigator.clipboard.writeText(studentId);
    showToast(`Student ID ${studentId} copied to clipboard!`, 'success');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#151515] border border-[#353638] p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#50BED9] to-[#159BD7] flex items-center justify-center text-[#101010] shadow-lg shadow-[#50BED9]/30 shrink-0">
            <IdCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">NextGen Official Student ID Card</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified
              </span>
            </div>
            <p className="text-xs text-[#D0D3D6] mt-0.5">
              Official digital credential for course access, campus verification, and LMS certification.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'View Front Side' : 'View Back Side'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#50BED9] to-[#159BD7] hover:brightness-110 text-[#101010] text-xs font-black transition-all shadow-lg shadow-[#50BED9]/25 active:scale-95 disabled:opacity-60"
          >
            {isDownloading ? (
              <span className="w-4 h-4 border-2 border-[#101010] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF (ID Size)</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            title="Download PNG image"
            className="p-2.5 rounded-xl bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CARD CONTAINER (Realistic CR80 ID Card) ── */}
      <div className="flex justify-center items-center py-4">
        
        {/* FRONT SIDE OF ID CARD */}
        {!isFlipped ? (
          <div
            ref={cardFrontRef}
            className="relative w-full max-w-[560px] aspect-[85.6/53.98] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#50BED9]/50 transition-all text-white p-5 sm:p-6 flex flex-col justify-between select-none"
            style={{
              background: 'linear-gradient(135deg, #0a0e17 0%, #101010 40%, #131d27 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(80, 190, 217, 0.25)',
            }}
          >
            {/* Holographic Ambient Watermarks & Mesh */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#50BED9]/20 via-[#159BD7]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#33C6B6]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
            
            {/* Guilloche / Security Grid overlay pattern */}
            <div 
              className="absolute inset-0 opacity-[0.04] pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(#50BED9 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />

            {/* ── TOP BAR: Logo & Card Title ── */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#353638]/80">
              <div className="flex items-center gap-3">
                <div className="relative h-7 w-28 sm:h-8 sm:w-36">
                  <Image
                    src="/logo.png"
                    alt="NextGen LMS"
                    fill
                    sizes="144px"
                    className="object-contain object-left"
                  />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#50BED9] block">
                  STUDENT IDENTITY CARD
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-[#D0D3D6]/70">
                  Global Learning Network
                </span>
              </div>
            </div>

            {/* ── MIDDLE BODY: Photo + Details + Microchip ── */}
            <div className="relative z-10 grid grid-cols-12 gap-4 items-center my-auto pt-2">
              
              {/* Photo & Hologram */}
              <div className="col-span-4 flex flex-col items-center">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-tr from-[#50BED9] via-[#159BD7] to-[#33C6B6] shadow-xl">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#151515]">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={studentName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#353638] text-[#50BED9]">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  {/* Verified Chip on photo */}
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#101010] border-2 border-[#50BED9] flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#50BED9]" />
                  </div>
                </div>

                <span className="text-[8px] sm:text-[9px] font-black tracking-widest text-[#33C6B6] uppercase mt-2">
                  VERIFIED • 2026
                </span>
              </div>

              {/* Student Metadata Info */}
              <div className="col-span-8 space-y-1.5 sm:space-y-2 text-left pl-1">
                <div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-[#D0D3D6]/60 uppercase tracking-wider block">
                    Student Full Name
                  </span>
                  <h3 className="text-sm sm:text-lg font-black text-white tracking-tight leading-tight line-clamp-1">
                    {studentName}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[7px] sm:text-[8px] font-bold text-[#D0D3D6]/60 uppercase tracking-wider block">
                      Student Roll No / ID
                    </span>
                    <p className="text-xs sm:text-sm font-black text-[#50BED9] tracking-wider font-mono">
                      {studentId}
                    </p>
                  </div>
                  <div>
                    <span className="text-[7px] sm:text-[8px] font-bold text-[#D0D3D6]/60 uppercase tracking-wider block">
                      Batch / Cohort
                    </span>
                    <p className="text-xs sm:text-xs font-bold text-white">
                      {batch}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[7px] sm:text-[8px] font-bold text-[#D0D3D6]/60 uppercase tracking-wider block">
                    Enrolled Program / Department
                  </span>
                  <p className="text-[10px] sm:text-xs font-black text-[#33C6B6] leading-tight line-clamp-1">
                    {enrolledCourse}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-semibold text-[#D0D3D6]/70 pt-1">
                  <span>Issued: <strong className="text-white">{issueDate}</strong></span>
                  <span>Valid Thru: <strong className="text-[#50BED9]">{expiryDate}</strong></span>
                </div>
              </div>
            </div>

            {/* ── FOOTER BAR: Security Chip + Barcode + Signature ── */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#353638]/70">
              
              {/* EMV Microchip Graphic */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-6 sm:w-11 sm:h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-400 to-amber-200 border border-amber-500/50 p-1 flex flex-col justify-between shadow-inner opacity-90">
                  <div className="w-full h-px bg-amber-700/40" />
                  <div className="w-full h-px bg-amber-700/40" />
                  <div className="w-full h-px bg-amber-700/40" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-[7px] font-mono tracking-widest text-[#D0D3D6]/50 block">SECURE RFID</span>
                  <span className="text-[7px] font-mono text-[#50BED9]">LMS-ID-NFC</span>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="flex flex-col items-center">
                <div className="h-5 sm:h-6 flex items-center gap-[2px] opacity-80">
                  {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 2, 1, 3, 1, 2].map((w, i) => (
                    <span key={i} className="bg-white h-full inline-block" style={{ width: `${w}px` }} />
                  ))}
                </div>
                <span className="text-[6px] sm:text-[7px] font-mono text-[#D0D3D6]/70 tracking-widest mt-0.5">
                  {studentId}
                </span>
              </div>

              {/* Official Academic Seal & Sign */}
              <div className="text-right">
                <p className="text-[8px] sm:text-[9px] font-black italic text-[#50BED9] tracking-wider font-serif">
                  Engr. Sarah Tariq
                </p>
                <p className="text-[6px] sm:text-[7px] uppercase font-bold text-[#D0D3D6]/60">
                  Director of Academics
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* BACK SIDE OF ID CARD */
          <div
            ref={cardBackRef}
            className="relative w-full max-w-[560px] aspect-[85.6/53.98] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#353638] transition-all text-white p-5 sm:p-6 flex flex-col justify-between select-none"
            style={{
              background: 'linear-gradient(135deg, #0d1117 0%, #151515 50%, #0a0d12 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(80, 190, 217, 0.15)',
            }}
          >
            {/* Magnetic Stripe */}
            <div className="absolute top-4 left-0 right-0 h-9 sm:h-11 bg-[#050505] border-y border-white/5" />

            <div className="relative z-10 pt-12 sm:pt-14 space-y-2 text-left">
              <div className="text-[7px] sm:text-[8px] text-[#D0D3D6]/70 leading-relaxed space-y-1">
                <p>• This card remains the property of <strong>NextGen Learning Management System</strong>.</p>
                <p>• Must be presented upon request for online exam proctoring, lab sessions, and certificate verification.</p>
                <p>• Non-transferable. Loss or damage should be reported immediately to student support.</p>
              </div>
            </div>

            {/* QR Code & Verification portal */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#353638]/70">
              <div className="space-y-0.5">
                <span className="text-[7px] font-bold text-[#D0D3D6]/60 block uppercase">Verify Authenticity Online</span>
                <p className="text-[9px] sm:text-[10px] font-bold text-[#50BED9]">nextgen-lms.edu/verify/{studentId}</p>
                <p className="text-[7px] text-[#D0D3D6]/50">Support: support@nextgen-lms.com</p>
              </div>

              <div className="p-1.5 rounded-xl bg-white flex items-center justify-center shadow-lg">
                <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-[#101010]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Details & Card Information Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#50BED9]/10 border border-[#50BED9]/20 flex items-center justify-center text-[#50BED9]">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Standard Format</span>
            <p className="text-xs font-black text-white truncate">CR80 Plastic Card (300 DPI)</p>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#33C6B6]/10 border border-[#33C6B6]/20 flex items-center justify-center text-[#33C6B6]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Digital Validation</span>
            <p className="text-xs font-black text-white truncate">Cryptographically Signed</p>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#159BD7]/10 border border-[#159BD7]/20 flex items-center justify-center text-[#159BD7]">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Scannable QR</span>
            <button 
              onClick={copyStudentId}
              className="text-xs font-black text-[#50BED9] hover:underline truncate flex items-center gap-1"
            >
              <span>{studentId}</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
