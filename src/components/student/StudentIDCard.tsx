'use client';

import React, { useState } from 'react';
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Student Details with real registered user data
  const studentName = user?.name || 'NextGen Student';
  const studentEmail = user?.email || 'student@nextgen.lms';
  const studentId = user?.studentId || user?.rollNo || `NXG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const enrolledCourse = user?.enrolledCourse || 'Artificial Intelligence (AI) Advance';
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
   * Mobile & Desktop Cross-Platform Reliable File Downloader
   */
  const saveBlobFile = (blob: Blob, fileName: string) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 1500);
  };

  /**
   * High-Precision PDF Download (CR80 Standard 85.6mm x 53.98mm at 300 DPI)
   * Saves directly to device Downloads / Files on both Mobile & Laptop
   */
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    showToast('Generating official ID Card PDF for Mobile & Laptop...', 'info');

    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;

      const frontEl = document.getElementById('pdf-export-front');
      const backEl = document.getElementById('pdf-export-back');

      if (!frontEl || !backEl) throw new Error('Export elements not ready');

      // CR80 standard credit card size: 85.60 mm x 53.98 mm (Landscape)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98],
        compress: true,
      });

      // 1. Capture Front Canvas
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
      pdf.addImage(frontImg, 'JPEG', 0, 0, 85.6, 53.98, undefined, 'FAST');

      // 2. Capture Back Canvas (Page 2)
      pdf.addPage([85.6, 53.98], 'landscape');
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
      pdf.addImage(backImg, 'JPEG', 0, 0, 85.6, 53.98, undefined, 'FAST');

      const fileName = `${studentName.replace(/\s+/g, '_')}_${studentId}_NextGen_StudentID.pdf`;
      const pdfBlob = pdf.output('blob');
      saveBlobFile(pdfBlob, fileName);

      showToast('✅ ID Card PDF saved to your device files!', 'success');
    } catch (error) {
      console.error('PDF error:', error);
      showToast('Generating PNG image fallback...', 'info');
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
      const targetId = isFlipped ? 'pdf-export-back' : 'pdf-export-front';
      const targetEl = document.getElementById(targetId);
      if (!targetEl) throw new Error('Element not found');

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

      canvas.toBlob((blob) => {
        if (blob) {
          saveBlobFile(blob, fileName);
          showToast(`✅ ID Card (${side}) image saved to photos!`, 'success');
        }
      }, 'image/png');
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
            className="relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-2xl text-[#0F2C59] flex flex-col justify-between select-none bg-white border-2 border-[#0284C7]/30"
            style={{
              aspectRatio: '85.6 / 53.98',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 35px rgba(2,132,199,0.2)',
            }}
          >
            {/* TOP WAVY HEADER RIBBON */}
            <div className="absolute top-0 left-0 right-0 h-[24%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 120" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 L500,0 L500,60 C380,95 240,40 120,70 C60,85 0,50 0,50 Z" fill="#0284C7" opacity="0.9" />
                <path d="M0,0 L500,0 L500,40 C350,75 200,30 90,55 C40,65 0,30 0,30 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* BOTTOM WAVY FOOTER RIBBON (Thin background accent at very bottom) */}
            <div className="absolute bottom-0 left-0 right-0 h-[10%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,25 C120,5 260,35 380,18 C440,10 500,28 500,28 L500,50 L0,50 Z" fill="#0284C7" opacity="0.85" />
                <path d="M0,35 C150,15 300,38 410,25 C460,20 500,38 500,38 L500,50 L0,50 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* CARD CONTENT */}
            <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5">

              {/* TOP: Logo (Higher Left) + Title & Year (White text in top-right blue wave) */}
              <div className="flex items-start justify-between">
                {/* Logo & Subtitle */}
                <div className="flex flex-col">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="NextGen LMS" className="h-6 sm:h-7 object-contain object-left drop-shadow-sm" />
                  <span className="text-[6.5px] sm:text-[8px] font-black text-[#0F2C59] tracking-wider uppercase mt-0.5">
                    LEARNING MANAGEMENT SYSTEM
                  </span>
                </div>

                {/* Header text on top of blue wave */}
                <div className="text-right pr-1">
                  <span className="block text-[10px] sm:text-[12px] font-black uppercase tracking-wider text-white drop-shadow">
                    STUDENT CARD
                  </span>
                  <span className="block text-[7px] sm:text-[8.5px] font-bold text-sky-200">
                    Academic Year {new Date().getFullYear()}
                  </span>
                </div>
              </div>

              {/* MIDDLE: Info Table (Left) + Student Photo (Right) */}
              <div className="flex items-center justify-between gap-3 my-auto py-1">

                {/* Left Side: Detail Rows with aligned colons */}
                <div className="flex-1 space-y-1 sm:space-y-1.5 text-[8.5px] sm:text-[11px] font-bold text-[#0F2C59]">
                  <div className="flex items-start">
                    <span className="w-24 sm:w-32 uppercase text-[7px] sm:text-[9.5px] font-black text-[#0F2C59] tracking-wider shrink-0">STUDENT NAME</span>
                    <span className="mx-1 text-[#0284C7] font-black">:</span>
                    <span className="font-black text-[#0F2C59] text-[9px] sm:text-[12px] truncate leading-tight">{studentName}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-24 sm:w-32 uppercase text-[7px] sm:text-[9.5px] font-black text-[#0F2C59] tracking-wider shrink-0">STUDENT ID</span>
                    <span className="mx-1 text-[#0284C7] font-black">:</span>
                    <span className="font-black font-mono text-[#0284C7] text-[8.5px] sm:text-[11px] leading-tight">{studentId}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-24 sm:w-32 uppercase text-[7px] sm:text-[9.5px] font-black text-[#0F2C59] tracking-wider shrink-0">COURSE TRACK</span>
                    <span className="mx-1 text-[#0284C7] font-black">:</span>
                    <span className="font-bold text-[#0F2C59] text-[8px] sm:text-[10.5px] leading-tight break-words">{enrolledCourse}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-24 sm:w-32 uppercase text-[7px] sm:text-[9.5px] font-black text-[#0F2C59] tracking-wider shrink-0">BATCH</span>
                    <span className="mx-1 text-[#0284C7] font-black">:</span>
                    <span className="font-bold text-slate-700 text-[8px] sm:text-[10px] leading-tight">{batch}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-24 sm:w-32 uppercase text-[7px] sm:text-[9.5px] font-black text-[#0F2C59] tracking-wider shrink-0">VALIDITY</span>
                    <span className="mx-1 text-[#0284C7] font-black">:</span>
                    <span className="font-semibold text-slate-600 text-[7.5px] sm:text-[9.5px] leading-tight">{issueDate} - {expiryDate}</span>
                  </div>
                </div>

                {/* Right Side: Student Photo */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-20 h-24 sm:w-28 sm:h-32 rounded-2xl p-[3px] bg-gradient-to-b from-[#0284C7] to-[#0F2C59] shadow-lg">
                    <div className="w-full h-full rounded-[13px] overflow-hidden bg-slate-100 flex items-center justify-center relative">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={studentName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-[#0284C7]">
                          <User className="w-10 h-10" />
                          <span className="text-[7px] font-black text-slate-600 uppercase mt-0.5">Photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[7px] sm:text-[8px] font-black tracking-widest text-emerald-600 uppercase mt-1">
                    ★ VERIFIED ★
                  </span>
                </div>
              </div>

              {/* BOTTOM: Barcode (Left on White Area) + Single Signature (Right on White Area) */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-200/80 mb-1 z-10">
                {/* Barcode */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-[1px] h-3.5 sm:h-4.5">
                    {barcodePattern.map((w, i) => (
                      <span key={i} className="bg-[#0F2C59] h-full inline-block rounded-[0.5px]" style={{ width: `${w}px` }} />
                    ))}
                  </div>
                  <span className="text-[5.5px] sm:text-[7px] font-mono font-bold text-[#0F2C59] tracking-widest mt-0.5">{studentId}</span>
                </div>

                {/* Single Directed by Signature */}
                <div className="text-right">
                  <p className="text-[9.5px] sm:text-[12px] font-black italic text-[#0F2C59] font-serif">
                    Directed by Anusha Sabir
                  </p>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* BACK SIDE */
          <div
            className="relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-2xl text-[#0F2C59] flex flex-col justify-between select-none bg-white border-2 border-[#0284C7]/30"
            style={{
              aspectRatio: '85.6 / 53.98',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 35px rgba(2,132,199,0.2)',
            }}
          >
            {/* Top wave */}
            <div className="absolute top-0 left-0 right-0 h-[24%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 120" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 L500,0 L500,60 C380,95 240,40 120,70 C60,85 0,50 0,50 Z" fill="#0284C7" opacity="0.9" />
                <path d="M0,0 L500,0 L500,40 C350,75 200,30 90,55 C40,65 0,30 0,30 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0 h-[10%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,25 C120,5 260,35 380,18 C440,10 500,28 500,28 L500,50 L0,50 Z" fill="#0284C7" opacity="0.85" />
                <path d="M0,35 C150,15 300,38 410,25 C460,20 500,38 500,50 L0,50 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5">

              {/* Top Header */}
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] sm:text-[11.5px] font-black text-white uppercase tracking-wider drop-shadow">
                  ATTENDANCE & IDENTITY PASS
                </span>
                <span className="text-[7.5px] sm:text-[9px] font-bold text-sky-200">
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
                      size={80}
                      level="H"
                      includeMargin={false}
                      bgColor="#ffffff"
                      fgColor="#0F2C59"
                    />
                  </div>
                  <span className="text-[6.5px] sm:text-[7.5px] font-black text-[#0284C7] mt-1 text-center uppercase tracking-wider">
                    SCAN FOR ATTENDANCE
                  </span>
                </div>

                {/* Terms */}
                <div className="flex-1 space-y-1 text-[7px] sm:text-[8.5px] text-[#0F2C59]">
                  <p className="font-black text-[#0F2C59] uppercase text-[7.5px] sm:text-[9px]">Official NextGen Identity Terms:</p>
                  <p className="text-slate-700">• This card is non-transferable and remains property of NextGen LMS.</p>
                  <p className="text-slate-700">• Required for live lectures, attendance scanning, and exam validation.</p>
                  <p className="text-slate-700">• In case of loss or inquiry, contact administration immediately.</p>
                </div>
              </div>

              {/* Bottom: Verification Link + Auth Officer */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-200/80 mb-1 z-10">
                <div>
                  <span className="block text-[6px] sm:text-[7px] font-bold text-slate-500">Online Verification:</span>
                  <p className="text-[7.5px] sm:text-[9px] font-mono font-bold text-[#0284C7]">nextgen-lms.edu/verify/{studentId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9.5px] sm:text-[12px] font-black italic text-[#0F2C59] font-serif">
                    Directed by Anusha Sabir
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ── 100% ACCURATE 1012x638 PIXEL-PERFECT EXPORT TEMPLATES (OFFSCREEN) ── */}
      <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -100, pointerEvents: 'none' }}>
        
        {/* EXACT FRONT SIDE EXPORT (1012px × 638px) */}
        <div
          id="pdf-export-front"
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
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '145px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 145" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,0 L1000,0 L1000,80 C750,130 500,50 250,90 C120,110 0,65 0,65 Z" fill="#0284C7" opacity="0.9" />
              <path d="M0,0 L1000,0 L1000,55 C700,105 400,40 180,75 C80,90 0,40 0,40 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Bottom Wavy SVG (Thin Accent) */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,30 C250,10 500,45 750,25 C880,15 1000,35 1000,35 L1000,60 L0,60 Z" fill="#0284C7" opacity="0.85" />
              <path d="M0,42 C300,20 600,48 820,35 C920,28 1000,48 1000,48 L1000,60 L0,60 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Foreground Content */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '30px 42px', boxSizing: 'border-box' }}>

            {/* Top Bar: Logo (Higher Left) + Header (White in top-right blue wave) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid rgba(15,44,89,0.15)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="NextGen LMS" style={{ height: '42px', objectFit: 'contain', objectPosition: 'left' }} />
                <div style={{ fontSize: '11px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '3px' }}>
                  LEARNING MANAGEMENT SYSTEM
                </div>
              </div>

              <div style={{ textAlign: 'right', paddingRight: '4px' }}>
                <div style={{ fontSize: '21px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#ffffff' }}>
                  STUDENT CARD
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#bae6fd', marginTop: '2px' }}>
                  Academic Year {new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* Middle: Details (Left) + Photo (Right) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px', flex: 1, padding: '12px 0' }}>

              {/* Details List */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <div style={{ display: 'flex', alignItems: 'baseline', fontSize: '18px' }}>
                  <span style={{ width: '190px', fontSize: '13px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>STUDENT NAME</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: '24px', fontWeight: '900', color: '#0F2C59', letterSpacing: '-0.5px' }}>{studentName}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
                  <span style={{ width: '190px', fontSize: '13px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>STUDENT ID</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: '19px', fontWeight: '900', color: '#0284C7', fontFamily: 'monospace' }}>{studentId}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', fontSize: '18px' }}>
                  <span style={{ width: '190px', fontSize: '13px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>COURSE TRACK</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: enrolledCourse.length > 32 ? '15px' : '17px', fontWeight: '800', color: '#0F2C59', lineHeight: '1.25' }}>{enrolledCourse}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
                  <span style={{ width: '190px', fontSize: '13px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>BATCH</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#334155' }}>{batch}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
                  <span style={{ width: '190px', fontSize: '13px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>VALIDITY</span>
                  <span style={{ color: '#0284C7', fontWeight: '900', margin: '0 8px' }}>:</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#475569' }}>{issueDate} - {expiryDate}</span>
                </div>

              </div>

              {/* Photo Frame */}
              <div style={{ width: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '175px', height: '210px', borderRadius: '22px', padding: '4px', background: 'linear-gradient(135deg, #0284C7, #0F2C59)', boxSizing: 'border-box', boxShadow: '0 12px 24px rgba(15,44,89,0.2)' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt={studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: '48px', color: '#0284C7', fontWeight: '900' }}>{studentName.charAt(0)}</div>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '2.5px', color: '#059669', textTransform: 'uppercase', marginTop: '8px' }}>
                  ★ VERIFIED ★
                </div>
              </div>

            </div>

            {/* Bottom Bar: Barcode (Left on White) + Single Signature (Right on White) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(15,44,89,0.15)', paddingTop: '10px', marginBottom: '8px' }}>
              {/* Barcode */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '2px', height: '26px', alignItems: 'center' }}>
                  {barcodePattern.map((w, i) => (
                    <span key={i} style={{ width: `${w * 2}px`, height: '100%', background: '#0F2C59', display: 'inline-block', borderRadius: '1px' }} />
                  ))}
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: '#0F2C59', letterSpacing: '3px', marginTop: '3px' }}>{studentId}</span>
              </div>

              {/* Single Signature */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '900', fontStyle: 'italic', color: '#0F2C59', fontFamily: 'Georgia, serif' }}>
                  Directed by Anusha Sabir
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* EXACT BACK SIDE EXPORT (1012px × 638px) */}
        <div
          id="pdf-export-back"
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
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '145px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 145" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,0 L1000,0 L1000,80 C750,130 500,50 250,90 C120,110 0,65 0,65 Z" fill="#0284C7" opacity="0.9" />
              <path d="M0,0 L1000,0 L1000,55 C700,105 400,40 180,75 C80,90 0,40 0,40 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Bottom Wavy SVG */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,30 C250,10 500,45 750,25 C880,15 1000,35 1000,35 L1000,60 L0,60 Z" fill="#0284C7" opacity="0.85" />
              <path d="M0,42 C300,20 600,48 820,35 C920,28 1000,48 1000,48 L1000,60 L0,60 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Foreground Content */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '30px 42px', boxSizing: 'border-box' }}>

            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(15,44,89,0.15)', paddingBottom: '10px' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                ATTENDANCE & IDENTITY PASS
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#bae6fd', textTransform: 'uppercase' }}>
                NextGen LMS
              </div>
            </div>

            {/* Middle: QR Code + Terms */}
            <div style={{ display: 'flex', gap: '36px', alignItems: 'center', flex: 1, padding: '14px 0' }}>
              {/* QR Code */}
              <div style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '18px', boxShadow: '0 10px 25px rgba(15,44,89,0.2)', border: '2px solid #0284C7' }}>
                  <QRCodeSVG
                    value={qrPayload}
                    size={150}
                    level="H"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#0F2C59"
                  />
                </div>
                <div style={{ fontSize: '11px', fontWeight: '900', color: '#0284C7', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '10px' }}>
                  SCAN FOR ATTENDANCE
                </div>
              </div>

              {/* Terms */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Official NextGen Identity Terms & Guidelines:
                </div>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                  • This ID card is strictly non-transferable and remains official property of NextGen LMS.
                </div>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                  • Must be scanned for physical & online class attendance, AI evaluation, and certification.
                </div>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                  • Report lost, damaged, or stolen cards immediately to NextGen student administration.
                </div>
              </div>
            </div>

            {/* Bottom Bar: Verification URL + Authorized Officer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(15,44,89,0.15)', paddingTop: '10px', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>Online Card Verification:</div>
                <div style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '900', color: '#0284C7', marginTop: '2px' }}>nextgen-lms.edu/verify/{studentId}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '900', fontStyle: 'italic', color: '#0F2C59', fontFamily: 'Georgia, serif' }}>
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
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Mobile Ready</span>
            <p className="text-xs font-black text-white">Auto-Saves to Device Files</p>
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
