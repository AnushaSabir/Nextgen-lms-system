'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Download, QrCode, ShieldCheck, CheckCircle2, RotateCw,
  User, Award, Copy, IdCard, Printer, Zap
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useToastStore } from '@/store/toast-store';
import { encodeQRPayload } from '@/lib/attendance-store';
import { QRCodeSVG } from 'qrcode.react';

interface StudentIDCardProps {
  onClose?: () => void;
}

export default function StudentIDCard({ onClose }: StudentIDCardProps) {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  // Student Details with real registered user data
  const studentName = user?.name || 'NextGen Student';
  const studentEmail = user?.email || 'student@nextgen.lms';
  const studentId = user?.studentId || user?.rollNo || `NXG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const enrolledCourse = user?.enrolledCourse || 'Python for Data Science, Analytics & AI';
  const batch = user?.batch || `Batch ${new Date().getFullYear()}-A`;
  const issueDate = user?.issueDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });
  const expiryDate = user?.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });
  const avatarUrl = user?.avatar || null;

  // Generate QR payload for attendance scanning
  const qrPayload = encodeQRPayload({
    studentId,
    studentName,
    studentEmail,
    enrolledCourse,
    batch,
    avatarUrl: avatarUrl || undefined,
    institution: 'NextGen Learning Management System',
  });

  // Generate barcode bars from studentId (deterministic visual bars)
  const generateBarcodePattern = (id: string) => {
    const chars = id.replace(/-/g, '');
    const pattern: number[] = [];
    for (let i = 0; i < Math.min(chars.length * 3, 60); i++) {
      const charCode = chars.charCodeAt(i % chars.length);
      pattern.push((charCode % 3) + 1); // widths: 1, 2, or 3
    }
    return pattern;
  };

  const barcodePattern = generateBarcodePattern(studentId);

  /**
   * PDF Download: Generates standard CR80 (85.60 mm × 53.98 mm) PDF
   * Includes Page 1 (Front Side) and Page 2 (Back Side with QR)
   */
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    showToast('Generating Complete 2-Sided ID Card PDF...', 'info');

    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;

      const frontEl = cardFrontRef.current;
      const backEl = cardBackRef.current;
      if (!frontEl || !backEl) throw new Error('Card elements not found');

      // 1. Capture Front Side
      const frontCanvas = await html2canvas(frontEl, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#101010',
        logging: false,
        imageTimeout: 15000,
      });

      // 2. Capture Back Side
      const backCanvas = await html2canvas(backEl, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#101010',
        logging: false,
        imageTimeout: 15000,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98],
      });

      // Page 1: Front
      const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(frontImgData, 'JPEG', 0, 0, 85.6, 53.98);

      // Page 2: Back
      pdf.addPage([85.6, 53.98], 'landscape');
      const backImgData = backCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(backImgData, 'JPEG', 0, 0, 85.6, 53.98);

      pdf.save(`${studentName.replace(/\s+/g, '_')}_${studentId}_NextGen_ID_Card.pdf`);
      showToast('✅ Official 2-Sided ID Card PDF downloaded!', 'success');
    } catch (error) {
      console.error('PDF error:', error);
      showToast('PDF error — generating PNG image instead...', 'error');
      await handleDownloadPNG();
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * PNG Download: Captures currently active side
   */
  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const targetEl = isFlipped ? cardBackRef.current : cardFrontRef.current;
      if (!targetEl) throw new Error('Card element not found');

      const canvas = await html2canvas(targetEl, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#101010',
        logging: false,
      });

      const side = isFlipped ? 'Back_QR' : 'Front';
      const link = document.createElement('a');
      link.download = `${studentName.replace(/\s+/g, '_')}_${studentId}_ID_${side}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`✅ ID Card (${side}) image downloaded!`, 'success');
    } catch (error) {
      showToast('Download failed. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyStudentId = () => {
    navigator.clipboard.writeText(studentId).then(() => {
      showToast(`Student ID "${studentId}" copied!`, 'success');
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#151515] border border-[#353638] p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#50BED9] to-[#159BD7] flex items-center justify-center text-[#101010] shadow-lg shadow-[#50BED9]/30 shrink-0">
            <IdCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-white">Official NextGen Student ID Card</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                QR Verified
              </span>
            </div>
            <p className="text-xs text-[#D0D3D6]/70 mt-0.5">
              Issued to: <strong className="text-white">{studentName}</strong> • ID: <strong className="text-[#50BED9] font-mono">{studentId}</strong>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white text-xs font-bold transition-all shadow-md"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'View Front Side' : 'View Back (QR Code)'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#50BED9] to-[#159BD7] hover:brightness-110 text-[#101010] text-xs font-black transition-all shadow-lg shadow-[#50BED9]/25 disabled:opacity-60"
          >
            {isDownloading ? (
              <span className="w-4 h-4 border-2 border-[#101010] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF (2-Sided)</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            title="Download PNG image"
            className="p-2.5 rounded-xl bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CARD DISPLAY CONTAINER ── */}
      <div className="flex justify-center items-center py-2">

        {/* FRONT SIDE CARD */}
        <div
          ref={cardFrontRef}
          style={{
            display: !isFlipped ? 'flex' : 'none',
            aspectRatio: '85.6 / 53.98',
            background: 'linear-gradient(135deg, #090d15 0%, #101010 45%, #131d27 100%)',
            border: '2px solid rgba(80,190,217,0.5)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(80,190,217,0.2)',
            padding: '5% 5.5%',
          }}
          className="relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-2xl text-white flex-col justify-between select-none"
        >
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#50BED9]/20 via-[#159BD7]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-[#33C6B6]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Grid security pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#50BED9 1px, transparent 1px)', backgroundSize: '10px 10px' }}
          />

          {/* TOP BAR */}
          <div className="relative z-10 flex items-center justify-between pb-[3%] border-b border-[#353638]/80">
            <div className="relative h-[8%] w-[38%]" style={{ minHeight: 24 }}>
              <Image src="/logo.png" alt="NextGen LMS" fill sizes="200px" className="object-contain object-left" />
            </div>
            <div className="text-right">
              <span className="block text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#50BED9]">
                STUDENT IDENTITY CARD
              </span>
              <span className="block text-[7px] sm:text-[9px] font-bold text-[#D0D3D6]/60">
                Academic Year {new Date().getFullYear()}
              </span>
            </div>
          </div>

          {/* MIDDLE: Photo + Info */}
          <div className="relative z-10 flex gap-[4%] items-center flex-1 py-[3%]">

            {/* Photo */}
            <div className="flex flex-col items-center shrink-0" style={{ width: '24%' }}>
              <div className="w-full aspect-square rounded-xl p-[3px] bg-gradient-to-tr from-[#50BED9] via-[#159BD7] to-[#33C6B6] shadow-lg">
                <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#1a1a1a] flex items-center justify-center relative">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={studentName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#353638] text-[#50BED9]">
                      <User className="w-1/2 h-1/2" />
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[7px] sm:text-[8px] font-black tracking-widest text-[#33C6B6] uppercase mt-[6%]">
                VERIFIED
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-[3.5%]">
              <div>
                <span className="block text-[7px] sm:text-[8px] font-bold text-[#D0D3D6]/50 uppercase tracking-wider">Student Name</span>
                <h3 className="text-[11px] sm:text-base font-black text-white tracking-tight leading-tight truncate">{studentName}</h3>
              </div>
              <div className="grid grid-cols-2 gap-[4%]">
                <div>
                  <span className="block text-[6px] sm:text-[7px] font-bold text-[#D0D3D6]/50 uppercase tracking-wider">Roll No / ID</span>
                  <p className="text-[8px] sm:text-[10px] font-black text-[#50BED9] tracking-wider font-mono leading-tight">{studentId}</p>
                </div>
                <div>
                  <span className="block text-[6px] sm:text-[7px] font-bold text-[#D0D3D6]/50 uppercase tracking-wider">Batch</span>
                  <p className="text-[8px] sm:text-[10px] font-bold text-white leading-tight">{batch}</p>
                </div>
              </div>
              <div>
                <span className="block text-[6px] sm:text-[7px] font-bold text-[#D0D3D6]/50 uppercase tracking-wider">Enrolled Program</span>
                <p className="text-[7.5px] sm:text-[9.5px] font-bold text-[#33C6B6] leading-tight truncate">{enrolledCourse}</p>
              </div>
              <div className="flex justify-between text-[7px] sm:text-[8px] font-semibold text-[#D0D3D6]/60">
                <span>Issued: <strong className="text-white">{issueDate}</strong></span>
                <span>Valid Thru: <strong className="text-[#50BED9]">{expiryDate}</strong></span>
              </div>
            </div>
          </div>

          {/* FOOTER BAR */}
          <div className="relative z-10 flex items-center justify-between pt-[3%] border-t border-[#353638]/70">
            {/* EMV Chip */}
            <div className="flex items-center gap-[3%]">
              <div
                className="rounded-[3px] opacity-90 border border-amber-500/50 flex flex-col justify-between p-[4px] shrink-0"
                style={{ width: '11%', aspectRatio: '1.6', minWidth: 24, background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706)' }}
              >
                <div className="w-full h-px bg-amber-800/40" />
                <div className="w-full h-px bg-amber-800/40" />
                <div className="w-full h-px bg-amber-800/40" />
              </div>
              <span className="text-[6px] sm:text-[7px] font-mono text-[#50BED9] hidden sm:block">RFID/NFC</span>
            </div>

            {/* Unique Barcode */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-[1px] h-[12px] sm:h-[15px] opacity-90">
                {barcodePattern.map((w, i) => (
                  <span key={i} className="bg-white h-full inline-block rounded-[0.5px]" style={{ width: `${w}px` }} />
                ))}
              </div>
              <span className="text-[5px] sm:text-[6px] font-mono text-[#D0D3D6]/60 tracking-widest mt-0.5">{studentId}</span>
            </div>

            {/* Director Signature */}
            <div className="text-right">
              <p className="text-[8px] sm:text-[10px] font-black italic text-[#50BED9] font-serif">Anusha Sabir</p>
              <p className="text-[6px] sm:text-[7px] uppercase font-bold text-[#D0D3D6]/60">Directed by Anusha Sabir</p>
            </div>
          </div>
        </div>

        {/* BACK SIDE CARD (WITH QR CODE) */}
        <div
          ref={cardBackRef}
          style={{
            display: isFlipped ? 'flex' : 'none',
            aspectRatio: '85.6 / 53.98',
            background: 'linear-gradient(135deg, #090d15 0%, #151515 50%, #0d141e 100%)',
            border: '2px solid rgba(80,190,217,0.5)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(80,190,217,0.15)',
            padding: '5% 5.5%',
          }}
          className="relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-2xl text-white flex-col justify-between select-none"
        >
          {/* Magnetic Stripe */}
          <div className="absolute top-[8%] left-0 right-0 h-[17%] bg-[#050505] border-y border-white/5 pointer-events-none" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#50BED9 1px, transparent 1px)', backgroundSize: '10px 10px' }}
          />

          {/* Content below stripe */}
          <div className="relative z-10 flex h-full pt-[22%] gap-[5%] items-center">

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center shrink-0" style={{ width: '32%' }}>
              <div className="p-2 bg-white rounded-2xl shadow-2xl border-2 border-[#50BED9]/40">
                <QRCodeSVG
                  value={qrPayload}
                  size={95}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#101010"
                />
              </div>
              <span className="text-[7px] sm:text-[8px] font-black text-[#50BED9] mt-1 text-center uppercase tracking-wide">
                SCAN FOR ATTENDANCE
              </span>
            </div>

            {/* Terms & Verification Info */}
            <div className="flex-1 flex flex-col justify-between h-full py-1 space-y-2">
              <div className="space-y-1">
                <span className="block text-[7px] sm:text-[8px] font-black uppercase text-[#50BED9] tracking-wider">
                  NextGen Official Student Pass
                </span>
                <p className="text-[6.5px] sm:text-[7.5px] text-[#D0D3D6]/70 leading-relaxed">
                  • This ID card is non-transferable and remains property of NextGen LMS.
                </p>
                <p className="text-[6.5px] sm:text-[7.5px] text-[#D0D3D6]/70 leading-relaxed">
                  • Required for live lectures, attendance verification, and exam validation.
                </p>
                <p className="text-[6.5px] sm:text-[7.5px] text-[#D0D3D6]/70 leading-relaxed">
                  • In case of loss, report immediately to student administration.
                </p>
              </div>

              <div className="pt-1 border-t border-[#353638]/60 flex items-end justify-between">
                <div>
                  <span className="block text-[6px] sm:text-[7px] font-bold text-[#D0D3D6]/50">Online Verification:</span>
                  <p className="text-[7px] sm:text-[8px] font-mono font-bold text-[#50BED9]">nextgen-lms.edu/verify/{studentId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[7px] sm:text-[8px] font-serif font-black italic text-white">Anusha Sabir</p>
                  <p className="text-[5.5px] sm:text-[6.5px] text-[#D0D3D6]/50 uppercase">Authorized Officer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Hidden Offscreen Container for PDF 2-page render (always present so both sides are captured by html2canvas) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {/* Offscreen front card for capture */}
        <div id="pdf-front-capture" style={{ width: 560, height: 353 }}>
          {/* Will use cardFrontRef or direct elements */}
        </div>
      </div>

      {/* Info strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#50BED9]/10 border border-[#50BED9]/20 flex items-center justify-center text-[#50BED9] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Format</span>
            <p className="text-xs font-black text-white">CR80 ID Card · 300 DPI</p>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#33C6B6]/10 border border-[#33C6B6]/20 flex items-center justify-center text-[#33C6B6] shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">QR Attendance</span>
            <p className="text-xs font-black text-white">Unique per Student</p>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#50BED9]/40 transition-colors" onClick={copyStudentId}>
          <div className="w-10 h-10 rounded-xl bg-[#159BD7]/10 border border-[#159BD7]/20 flex items-center justify-center text-[#159BD7] shrink-0">
            <Copy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Student ID (tap to copy)</span>
            <p className="text-xs font-black text-[#50BED9] font-mono">{studentId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
