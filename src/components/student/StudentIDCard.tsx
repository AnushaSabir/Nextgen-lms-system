'use client';

import React, { useState, useEffect } from 'react';
import {
  Download, RotateCw, User, Award, Copy, IdCard, Printer, Zap
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
  const [mounted, setMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Student Details with real registered user data
  const studentName = user?.name || 'NextGen Student';
  const studentEmail = user?.email || 'student@nextgen.lms';
  const studentId = user?.studentId || user?.rollNo || 'NXG-2026-88219';
  const enrolledCourse = user?.enrolledCourse || 'Artificial Intelligence (AI) Advance';
  const batch = user?.batch || 'Batch 2026-A';
  const issueDate = user?.issueDate || 'Sep 3, 2026';
  const expiryDate = user?.expiryDate || 'Sep 3, 2027';
  const avatarUrl = user?.avatar || null;
  const photoOffset = typeof user?.photoOffset === 'number' ? user.photoOffset : 20;

  // Generate QR payload for attendance scanning (Clean lightweight payload without bulky base64)
  const qrPayload = encodeQRPayload({
    studentId,
    studentName,
    studentEmail,
    enrolledCourse,
    batch,
    institution: 'NextGen Learning Management System',
  });

  // Generate barcode bars from studentId
  const generateBarcodePattern = (id: string) => {
    const chars = id.replace(/-/g, '');
    const pattern: number[] = [];
    for (let i = 0; i < Math.min(chars.length * 3, 44); i++) {
      const charCode = chars.charCodeAt(i % chars.length);
      pattern.push((charCode % 3) + 1);
    }
    return pattern;
  };

  const barcodePattern = generateBarcodePattern(studentId);

  /**
   * Cross-Platform File Downloader — works on Android, iOS Safari, and Desktop
   */
  const triggerDownload = async (blob: Blob, fileName: string) => {
    // iOS Safari: use Web Share API which lets user save to Files
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: blob.type })] })) {
      try {
        const file = new File([blob, ], fileName, { type: blob.type });
        await navigator.share({ files: [file], title: fileName });
        return;
      } catch { /* fall through to link download */ }
    }

    // Android + Desktop: direct blob URL download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 2000);
  };

  /**
   * High-Precision PDF Download (CR80 Standard 85.6mm x 53.98mm at 300 DPI)
   * Reliable on Mobile Chrome, Android, iOS Safari, and Desktop
   */
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    showToast('Generating official ID Card PDF...', 'info');

    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;

      const frontEl = document.getElementById('pdf-render-front');
      const backEl = document.getElementById('pdf-render-back');
      if (!frontEl || !backEl) throw new Error('Render elements not found');

      // Capture Front Side
      const frontCanvas = await html2canvas(frontEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 1012,
        height: 638,
      });
      const frontImg = frontCanvas.toDataURL('image/jpeg', 0.98);

      // Capture Back Side
      const backCanvas = await html2canvas(backEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 1012,
        height: 638,
      });
      const backImg = backCanvas.toDataURL('image/jpeg', 0.98);

      // Build CR80 PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98],
        compress: true,
      });

      pdf.addImage(frontImg, 'JPEG', 0, 0, 85.6, 53.98, undefined, 'FAST');
      pdf.addPage([85.6, 53.98], 'landscape');
      pdf.addImage(backImg, 'JPEG', 0, 0, 85.6, 53.98, undefined, 'FAST');

      const fileName = `${studentName.replace(/\s+/g, '_')}_${studentId}_NextGen_StudentID.pdf`;

      // Get PDF as blob and use our reliable cross-platform downloader
      const pdfBlob = pdf.output('blob');
      await triggerDownload(pdfBlob, fileName);

      showToast('✅ ID Card PDF saved to your device!', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      showToast('Falling back to image download...', 'info');
      await handleDownloadPNG();
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * PNG Image Download (Direct save to Mobile Gallery / Photos)
   */
  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const targetId = isFlipped ? 'pdf-render-back' : 'pdf-render-front';
      const targetEl = document.getElementById(targetId);
      if (!targetEl) throw new Error('Render element not found');

      const canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 1012,
        height: 638,
      });

      const side = isFlipped ? 'Back_QR' : 'Front';
      const fileName = `${studentName.replace(/\s+/g, '_')}_${studentId}_ID_${side}.png`;

      await new Promise<void>((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await triggerDownload(blob, fileName);
            showToast(`✅ ID Card (${side}) image saved!`, 'success');
          }
          resolve();
        }, 'image/png');
      });
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0F2C59] flex items-center justify-center text-white shadow-lg shadow-[#0284C7]/30 shrink-0">
            <IdCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-white">Official NextGen Student ID Card</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CR80 Official Format
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
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#353638] hover:bg-[#0284C7] hover:text-white text-white text-xs font-bold transition-all shadow-md"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'View Front Side' : 'View Back (QR Code)'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0F2C59] to-[#0284C7] hover:brightness-110 text-white text-xs font-black transition-all shadow-lg shadow-[#0284C7]/30 disabled:opacity-60"
          >
            {isDownloading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF (Mobile & Laptop)</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            title="Download PNG to Gallery"
            className="p-2.5 rounded-xl bg-[#353638] hover:bg-[#0284C7] hover:text-white text-white transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE ON-SCREEN CARD PREVIEW ── */}
      <div className="flex justify-center items-center py-2">

        {/* FRONT SIDE */}
        {!isFlipped ? (
          <div
            className="relative w-full max-w-[580px] rounded-3xl overflow-hidden shadow-2xl text-[#0F2C59] flex flex-col justify-between select-none bg-white border-2 border-[#0284C7]/30"
            style={{
              aspectRatio: '85.6 / 53.98',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 35px rgba(2,132,199,0.2)',
            }}
          >
            {/* TOP WAVY HEADER RIBBON */}
            <div className="absolute top-0 left-0 right-0 h-[22%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 110" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 L500,0 L500,55 C380,90 240,35 120,65 C60,80 0,45 0,45 Z" fill="#0284C7" opacity="0.9" />
                <path d="M0,0 L500,0 L500,35 C350,70 200,25 90,50 C40,60 0,25 0,25 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* BOTTOM WAVY FOOTER RIBBON (Thin accent line at base) */}
            <div className="absolute bottom-0 left-0 right-0 h-[8%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 40" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,20 C120,5 260,30 380,15 C440,8 500,22 500,22 L500,40 L0,40 Z" fill="#0284C7" opacity="0.85" />
                <path d="M0,28 C150,12 300,32 410,20 C460,15 500,32 500,32 L500,40 L0,40 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* CARD CONTENT */}
            <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5">

              {/* TOP: Logo on DARK NAVY portion + Title & Year on right */}
              <div className="flex items-start justify-between">
                {/* Logo on dark blue part */}
                <div className="flex flex-col -mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="NextGen LMS" className="h-8 sm:h-10 object-contain object-left drop-shadow" />
                  <span className="text-[7px] sm:text-[9px] font-black text-[#0284C7] tracking-wider uppercase mt-0.5 drop-shadow">
                    LEARNING MANAGEMENT SYSTEM
                  </span>
                </div>

                {/* Header text inside top blue wave */}
                <div className="text-right pr-1 -mt-1">
                  <span className="block text-[11px] sm:text-[14px] font-black uppercase tracking-wider text-white drop-shadow">
                    STUDENT CARD
                  </span>
                  <span className="block text-[7px] sm:text-[9px] font-bold text-sky-200">
                    Academic Year {new Date().getFullYear()}
                  </span>
                </div>
              </div>

              {/* MIDDLE: Info Table (Left) + Student Photo (Right with FIXED PASSPORT SIZE) */}
              <div className="flex items-center justify-between gap-4 my-auto py-1">

                {/* Left Side: Detail Rows with aligned colons & LARGER, CRISPER FONTS */}
                <div className="flex-1 space-y-1.5 sm:space-y-2 text-[#0F2C59]">
                  <div className="flex items-baseline">
                    <span className="w-24 sm:w-32 uppercase text-[7.5px] sm:text-[10px] font-black text-[#0F2C59] tracking-wider shrink-0">STUDENT NAME</span>
                    <span className="mx-1.5 text-[#0284C7] font-black">:</span>
                    <span className="font-black text-[#0F2C59] text-[11px] sm:text-[15px] truncate leading-tight">{studentName}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-24 sm:w-32 uppercase text-[7.5px] sm:text-[10px] font-black text-[#0F2C59] tracking-wider shrink-0">STUDENT ID</span>
                    <span className="mx-1.5 text-[#0284C7] font-black">:</span>
                    <span className="font-black font-mono text-[#0284C7] text-[10px] sm:text-[13px] leading-tight">{studentId}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-24 sm:w-32 uppercase text-[7.5px] sm:text-[10px] font-black text-[#0F2C59] tracking-wider shrink-0">COURSE TRACK</span>
                    <span className="mx-1.5 text-[#0284C7] font-black">:</span>
                    <span className="font-bold text-[#0F2C59] text-[9.5px] sm:text-[12px] leading-tight break-words">{enrolledCourse}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-24 sm:w-32 uppercase text-[7.5px] sm:text-[10px] font-black text-[#0F2C59] tracking-wider shrink-0">BATCH</span>
                    <span className="mx-1.5 text-[#0284C7] font-black">:</span>
                    <span className="font-bold text-slate-700 text-[9px] sm:text-[11.5px] leading-tight">{batch}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-24 sm:w-32 uppercase text-[7.5px] sm:text-[10px] font-black text-[#0F2C59] tracking-wider shrink-0">VALIDITY</span>
                    <span className="mx-1.5 text-[#0284C7] font-black">:</span>
                    <span className="font-semibold text-slate-600 text-[8.5px] sm:text-[11px] leading-tight">{issueDate} - {expiryDate}</span>
                  </div>
                </div>

                {/* Right Side: Student Photo (STRICT FIXED PASSPORT PROPORTIONS) */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-[85px] h-[105px] sm:w-[115px] sm:h-[140px] rounded-2xl p-[3px] bg-gradient-to-b from-[#0284C7] to-[#0F2C59] shadow-md shrink-0">
                    <div className="w-full h-full rounded-[13px] overflow-hidden bg-slate-100 flex items-center justify-center relative">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={studentName}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: `center ${photoOffset}%` }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-[#0284C7]">
                          <User className="w-10 h-10" />
                          <span className="text-[7px] font-black text-slate-600 uppercase mt-0.5">Photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[7.5px] sm:text-[9.5px] font-black tracking-widest text-emerald-600 uppercase mt-1">
                    ★ VERIFIED ★
                  </span>
                </div>
              </div>

              {/* BOTTOM: Barcode (Left on White Area) + Single Signature (Right on White Area) */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-200/80 z-10">
                {/* Barcode */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-[1px] h-3.5 sm:h-4.5">
                    {barcodePattern.map((w, i) => (
                      <span key={i} className="bg-[#0F2C59] h-full inline-block rounded-[0.5px]" style={{ width: `${w}px` }} />
                    ))}
                  </div>
                  <span className="text-[6.5px] sm:text-[8px] font-mono font-bold text-[#0F2C59] tracking-widest mt-0.5">{studentId}</span>
                </div>

                {/* Single Directed by Signature */}
                <div className="text-right">
                  <p className="text-[11px] sm:text-[14px] font-black italic text-[#0F2C59] font-serif">
                    Directed by Anusha Sabir
                  </p>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* BACK SIDE */
          <div
            className="relative w-full max-w-[580px] rounded-3xl overflow-hidden shadow-2xl text-[#0F2C59] flex flex-col justify-between select-none bg-white border-2 border-[#0284C7]/30"
            style={{
              aspectRatio: '85.6 / 53.98',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 35px rgba(2,132,199,0.2)',
            }}
          >
            {/* Top wave */}
            <div className="absolute top-0 left-0 right-0 h-[22%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 110" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 L500,0 L500,55 C380,90 240,35 120,65 C60,80 0,45 0,45 Z" fill="#0284C7" opacity="0.9" />
                <path d="M0,0 L500,0 L500,35 C350,70 200,25 90,50 C40,60 0,25 0,25 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0 h-[8%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 40" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,20 C120,5 260,30 380,15 C440,8 500,22 500,22 L500,40 L0,40 Z" fill="#0284C7" opacity="0.85" />
                <path d="M0,28 C150,12 300,32 410,20 C460,15 500,32 500,32 L500,40 L0,40 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5">

              {/* Top Header */}
              <div className="flex items-center justify-between -mt-1">
                <span className="text-[10px] sm:text-[13px] font-black text-white uppercase tracking-wider drop-shadow">
                  ATTENDANCE & IDENTITY PASS
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-sky-200">
                  NextGen LMS
                </span>
              </div>

              {/* Middle: QR Code + Terms */}
              <div className="flex items-center gap-4 my-auto py-1">
                {/* QR Code */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="p-2 bg-white rounded-xl shadow-md border-2 border-[#0284C7]">
                    <QRCodeSVG
                      value={qrPayload}
                      size={85}
                      level="H"
                      includeMargin={false}
                      bgColor="#ffffff"
                      fgColor="#0F2C59"
                    />
                  </div>
                  <span className="text-[7px] sm:text-[8.5px] font-black text-[#0284C7] mt-1 text-center uppercase tracking-wider">
                    SCAN FOR ATTENDANCE
                  </span>
                </div>

                {/* Terms */}
                <div className="flex-1 space-y-1 text-[7.5px] sm:text-[9.5px] text-[#0F2C59]">
                  <p className="font-black text-[#0F2C59] uppercase text-[8px] sm:text-[10px]">Official NextGen Identity Terms:</p>
                  <p className="text-slate-700">• This card is non-transferable and remains property of NextGen LMS.</p>
                  <p className="text-slate-700">• Required for live lectures, attendance scanning, and exam validation.</p>
                  <p className="text-slate-700">• In case of loss or inquiry, contact administration immediately.</p>
                </div>
              </div>

              {/* Bottom: Verification Link + Auth Officer */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-200/80 z-10">
                <div>
                  <span className="block text-[6.5px] sm:text-[8px] font-bold text-slate-500">Online Verification:</span>
                  <p className="text-[8px] sm:text-[10px] font-mono font-bold text-[#0284C7]">nextgen-lms.edu/verify/{studentId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] sm:text-[14px] font-black italic text-[#0F2C59] font-serif">
                    Directed by Anusha Sabir
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Photo Position Adjustment Strip — shows only when user has a photo on front side */}
      {avatarUrl && !isFlipped && (
        <div className="flex items-center justify-center gap-3 py-2.5 px-4 bg-[#151515] border border-[#353638] rounded-2xl">
          <span className="text-[10px] font-black text-[#D0D3D6]/70 uppercase tracking-wider">Adjust Photo Position:</span>
          <button
            type="button"
            onClick={() => {
              const newOffset = Math.max(0, photoOffset - 10);
              useAuthStore.setState((s: any) => ({ user: s.user ? { ...s.user, photoOffset: newOffset } : s.user }));
            }}
            className="w-8 h-8 rounded-xl bg-[#353638] hover:bg-[#0284C7] text-white font-black text-base transition-all flex items-center justify-center"
          >▲</button>
          <div className="w-24 h-2 bg-[#353638] rounded-full relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0284C7] to-[#0F2C59] rounded-full transition-all" style={{ width: `${photoOffset}%` }} />
          </div>
          <button
            type="button"
            onClick={() => {
              const newOffset = Math.min(100, photoOffset + 10);
              useAuthStore.setState((s: any) => ({ user: s.user ? { ...s.user, photoOffset: newOffset } : s.user }));
            }}
            className="w-8 h-8 rounded-xl bg-[#353638] hover:bg-[#0284C7] text-white font-black text-base transition-all flex items-center justify-center"
          >▼</button>
          <span className="text-[9px] text-[#D0D3D6]/50 font-mono">{photoOffset}%</span>
        </div>
      )}

      {/* ── 100% RELIABLE CAPTURE CONTAINER (VISIBLE IN DOM BUFFER FOR HTML2CANVAS) ── */}
      <div style={{ position: 'fixed', top: '0', left: '0', opacity: 0, pointerEvents: 'none', zIndex: -100 }}>
        
        {/* EXACT FRONT SIDE (1012px × 638px) */}
        <div
          id="pdf-render-front"
          style={{
            width: '1012px',
            height: '638px',
            background: '#ffffff',
            border: '4px solid #0284C7',
            boxSizing: 'border-box',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#0F2C59',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Wavy SVG */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '140px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 140" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,0 L1000,0 L1000,75 C750,125 500,45 250,85 C120,105 0,60 0,60 Z" fill="#0284C7" opacity="0.9" />
              <path d="M0,0 L1000,0 L1000,50 C700,100 400,35 180,70 C80,85 0,35 0,35 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Bottom Wavy SVG (Thin Accent) */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 55" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,28 C250,8 500,42 750,22 C880,12 1000,32 1000,32 L1000,55 L0,55 Z" fill="#0284C7" opacity="0.85" />
              <path d="M0,38 C300,18 600,45 820,32 C920,25 1000,45 1000,45 L1000,55 L0,55 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Foreground Content */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '22px 38px 18px', boxSizing: 'border-box' }}>

            {/* Top Bar: Logo (Higher Left) + Header (White in top-right blue wave) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid rgba(15,44,89,0.12)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="NextGen LMS" style={{ height: '46px', objectFit: 'contain', objectPosition: 'left' }} />
                <div style={{ fontSize: '11.5px', fontWeight: '900', color: '#0284C7', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '2px' }}>
                  LEARNING MANAGEMENT SYSTEM
                </div>
              </div>

              <div style={{ textAlign: 'right', paddingRight: '4px' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#ffffff' }}>
                  STUDENT CARD
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#bae6fd', marginTop: '2px' }}>
                  Academic Year {new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* Middle: Details (Left) + Photo (Right with FIXED PASSPORT PROPORTIONS) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px', flex: 1, padding: '10px 0' }}>

              {/* Details List */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '11px' }}>

                <div style={{ display: 'flex', alignItems: 'baseline', fontSize: '19px' }}>
                  <span style={{ width: '190px', fontSize: '13.5px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>STUDENT NAME</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: '25px', fontWeight: '900', color: '#0F2C59', letterSpacing: '-0.5px' }}>{studentName}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '19px' }}>
                  <span style={{ width: '190px', fontSize: '13.5px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>STUDENT ID</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: '#0284C7', fontFamily: 'monospace' }}>{studentId}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', fontSize: '19px' }}>
                  <span style={{ width: '190px', fontSize: '13.5px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>COURSE TRACK</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: enrolledCourse.length > 32 ? '15px' : '17.5px', fontWeight: '800', color: '#0F2C59', lineHeight: '1.25' }}>{enrolledCourse}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '19px' }}>
                  <span style={{ width: '190px', fontSize: '13.5px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>BATCH</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: '16.5px', fontWeight: '800', color: '#334155' }}>{batch}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '19px' }}>
                  <span style={{ width: '190px', fontSize: '13.5px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>VALIDITY</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: '15.5px', fontWeight: '700', color: '#475569' }}>{issueDate} - {expiryDate}</span>
                </div>

              </div>

              {/* Photo Frame (FIXED 180px × 220px PASSPORT PROPORTIONS) */}
              <div style={{ width: '185px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '175px', height: '215px', borderRadius: '20px', padding: '4px', background: 'linear-gradient(135deg, #0284C7, #0F2C59)', boxSizing: 'border-box', boxShadow: '0 10px 20px rgba(15,44,89,0.18)', flexShrink: 0 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt={studentName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${photoOffset}%` }}
                      />
                    ) : (
                      <div style={{ fontSize: '48px', color: '#0284C7', fontWeight: '900' }}>{studentName.charAt(0)}</div>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: '900', letterSpacing: '2.5px', color: '#059669', textTransform: 'uppercase', marginTop: '6px' }}>
                  ★ VERIFIED ★
                </div>
              </div>

            </div>

            {/* Bottom Bar: Barcode (Left on White) + Single Signature (Right on White) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(15,44,89,0.12)', paddingTop: '8px' }}>
              {/* Barcode */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '2px', height: '26px', alignItems: 'center' }}>
                  {barcodePattern.map((w, i) => (
                    <span key={i} style={{ width: `${w * 2}px`, height: '100%', background: '#0F2C59', display: 'inline-block', borderRadius: '1px' }} />
                  ))}
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: '#0F2C59', letterSpacing: '3px', marginTop: '2px' }}>{studentId}</span>
              </div>

              {/* Single Signature */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '21px', fontWeight: '900', fontStyle: 'italic', color: '#0F2C59', fontFamily: 'Georgia, serif' }}>
                  Directed by Anusha Sabir
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* EXACT BACK SIDE (1012px × 638px) */}
        <div
          id="pdf-render-back"
          style={{
            width: '1012px',
            height: '638px',
            background: '#ffffff',
            border: '4px solid #0284C7',
            boxSizing: 'border-box',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#0F2C59',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Wavy SVG */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '140px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 140" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,0 L1000,0 L1000,75 C750,125 500,45 250,85 C120,105 0,60 0,60 Z" fill="#0284C7" opacity="0.9" />
              <path d="M0,0 L1000,0 L1000,50 C700,100 400,35 180,70 C80,85 0,35 0,35 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Bottom Wavy SVG */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 55" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,28 C250,8 500,42 750,22 C880,12 1000,32 1000,32 L1000,55 L0,55 Z" fill="#0284C7" opacity="0.85" />
              <path d="M0,38 C300,18 600,45 820,32 C920,25 1000,45 1000,45 L1000,55 L0,55 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Foreground Content */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '22px 38px 18px', boxSizing: 'border-box' }}>

            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(15,44,89,0.12)', paddingBottom: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                ATTENDANCE & IDENTITY PASS
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#bae6fd', textTransform: 'uppercase' }}>
                NextGen LMS
              </div>
            </div>

            {/* Middle: QR Code + Terms */}
            <div style={{ display: 'flex', gap: '34px', alignItems: 'center', flex: 1, padding: '12px 0' }}>
              {/* QR Code */}
              <div style={{ width: '190px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(15,44,89,0.15)', border: '2px solid #0284C7' }}>
                  <QRCodeSVG
                    value={qrPayload}
                    size={140}
                    level="H"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#0F2C59"
                  />
                </div>
                <div style={{ fontSize: '11px', fontWeight: '900', color: '#0284C7', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '8px' }}>
                  SCAN FOR ATTENDANCE
                </div>
              </div>

              {/* Terms */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Official NextGen Identity Terms & Guidelines:
                </div>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.55' }}>
                  • This ID card is strictly non-transferable and remains official property of NextGen LMS.
                </div>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.55' }}>
                  • Must be scanned for physical & online class attendance, AI evaluation, and certification.
                </div>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.55' }}>
                  • Report lost, damaged, or stolen cards immediately to NextGen student administration.
                </div>
              </div>
            </div>

            {/* Bottom Bar: Verification URL + Authorized Officer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(15,44,89,0.12)', paddingTop: '8px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>Online Card Verification:</div>
                <div style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '900', color: '#0284C7', marginTop: '2px' }}>nextgen-lms.edu/verify/{studentId}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '21px', fontWeight: '900', fontStyle: 'italic', color: '#0F2C59', fontFamily: 'Georgia, serif' }}>
                  Directed by Anusha Sabir
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Info Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center text-[#0284C7] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Print Standard</span>
            <p className="text-xs font-black text-white">CR80 (85.6mm × 53.98mm) 300 DPI</p>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Mobile & Laptop</span>
            <p className="text-xs font-black text-white">Instant File Save</p>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#0284C7]/40 transition-colors" onClick={copyStudentId}>
          <div className="w-10 h-10 rounded-xl bg-[#50BED9]/10 border border-[#50BED9]/20 flex items-center justify-center text-[#50BED9] shrink-0">
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
