'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Download, QrCode, ShieldCheck, CheckCircle2, RotateCw,
  User, Award, Copy, IdCard, Printer, Zap, FileText, Smartphone
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
   * Designed to save directly to Mobile Files / Downloads folder and Laptop
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

      // Save PDF via robust blob stream for Mobile & Laptop
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

        {/* FRONT SIDE (MATCHING REFERENCE DESIGN WITH WAVES) */}
        {!isFlipped ? (
          <div
            className="relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-2xl text-[#0F2C59] flex flex-col justify-between select-none bg-white border-2 border-[#0284C7]/30"
            style={{
              aspectRatio: '85.6 / 53.98',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 35px rgba(2,132,199,0.2)',
            }}
          >
            {/* TOP WAVY HEADER RIBBON */}
            <div className="absolute top-0 left-0 right-0 h-[22%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 110" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 L500,0 L500,65 C380,105 240,40 120,75 C60,90 0,55 0,55 Z" fill="#0284C7" opacity="0.85" />
                <path d="M0,0 L500,0 L500,45 C350,85 200,35 90,60 C40,70 0,35 0,35 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* BOTTOM WAVY FOOTER RIBBON */}
            <div className="absolute bottom-0 left-0 right-0 h-[20%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,45 C120,10 260,75 380,35 C440,20 500,55 500,55 L500,100 L0,100 Z" fill="#0284C7" opacity="0.85" />
                <path d="M0,65 C150,25 300,75 410,50 C460,40 500,75 500,75 L500,100 L0,100 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* CARD CONTENT */}
            <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5">

              {/* TOP: Centered Logo + Title */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="NextGen LMS" className="h-6 sm:h-7 object-contain" />
                  <div>
                    <span className="block text-[8px] sm:text-[10px] font-black tracking-widest text-[#0F2C59] uppercase leading-none">
                      NEXTGEN LMS
                    </span>
                    <span className="block text-[6px] sm:text-[7px] font-bold text-[#0284C7] uppercase tracking-wider">
                      Learning Management System
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-[#0F2C59]">
                    STUDENT CARD
                  </span>
                  <span className="block text-[6.5px] sm:text-[8px] font-bold text-slate-500">
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

              {/* BOTTOM: Barcode (Left) + Signature (Right) */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-200">
                {/* Barcode */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-[1px] h-3.5 sm:h-4.5">
                    {barcodePattern.map((w, i) => (
                      <span key={i} className="bg-[#0F2C59] h-full inline-block rounded-[0.5px]" style={{ width: `${w}px` }} />
                    ))}
                  </div>
                  <span className="text-[5px] sm:text-[6.5px] font-mono text-slate-600 tracking-widest mt-0.5">{studentId}</span>
                </div>

                {/* Director Signature */}
                <div className="text-right">
                  <p className="text-[9px] sm:text-[11px] font-black italic text-[#0F2C59] font-serif">Anusha Sabir</p>
                  <p className="text-[5.5px] sm:text-[7px] uppercase font-bold text-slate-500 tracking-wider">DIRECTED BY ANUSHA SABIR</p>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* BACK SIDE (WITH QR CODE & MATCHING WAVES) */
          <div
            className="relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-2xl text-[#0F2C59] flex flex-col justify-between select-none bg-white border-2 border-[#0284C7]/30"
            style={{
              aspectRatio: '85.6 / 53.98',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 35px rgba(2,132,199,0.2)',
            }}
          >
            {/* Top wave */}
            <div className="absolute top-0 left-0 right-0 h-[22%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 110" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 L500,0 L500,65 C380,105 240,40 120,75 C60,90 0,55 0,55 Z" fill="#0284C7" opacity="0.85" />
                <path d="M0,0 L500,0 L500,45 C350,85 200,35 90,60 C40,70 0,35 0,35 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0 h-[20%] pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,45 C120,10 260,75 380,35 C440,20 500,55 500,55 L500,100 L0,100 Z" fill="#0284C7" opacity="0.85" />
                <path d="M0,65 C150,25 300,75 410,50 C460,40 500,75 500,75 L500,100 L0,100 Z" fill="#0F2C59" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5">

              {/* Top Header */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] sm:text-[11px] font-black text-[#0F2C59] uppercase tracking-wider">
                  STUDENT ATTENDANCE & VERIFICATION PASS
                </span>
                <span className="text-[6.5px] sm:text-[8px] font-bold text-[#0284C7]">
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
                <div className="flex-1 space-y-1 text-[7px] sm:text-[8.5px] text-slate-700">
                  <p className="font-black text-[#0F2C59] uppercase text-[7.5px] sm:text-[9px]">Official NextGen Identity Terms:</p>
                  <p>• This card is non-transferable and remains property of NextGen LMS.</p>
                  <p>• Required for live lectures, attendance scanning, and exam validation.</p>
                  <p>• In case of loss or inquiry, contact administration immediately.</p>
                </div>
              </div>

              {/* Bottom: Verification Link + Auth Officer */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-200">
                <div>
                  <span className="block text-[6px] sm:text-[7px] font-bold text-slate-500">Online Verification:</span>
                  <p className="text-[7.5px] sm:text-[9px] font-mono font-bold text-[#0284C7]">nextgen-lms.edu/verify/{studentId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] sm:text-[11px] font-black italic text-[#0F2C59] font-serif">Anusha Sabir</p>
                  <p className="text-[5.5px] sm:text-[7px] uppercase font-bold text-slate-500 tracking-wider">AUTHORIZED OFFICER</p>
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
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '140px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 140" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,0 L1000,0 L1000,85 C750,135 500,50 250,95 C120,115 0,70 0,70 Z" fill="#0284C7" opacity="0.85" />
              <path d="M0,0 L1000,0 L1000,60 C700,110 400,45 180,80 C80,95 0,45 0,45 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Bottom Wavy SVG */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '130px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 130" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,60 C250,15 500,95 750,50 C880,30 1000,70 1000,70 L1000,130 L0,130 Z" fill="#0284C7" opacity="0.85" />
              <path d="M0,85 C300,35 600,95 820,70 C920,55 1000,95 1000,95 L1000,130 L0,130 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Foreground Content */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '32px 42px', boxSizing: 'border-box' }}>

            {/* Top Bar: Logo + Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(15,44,89,0.15)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="NextGen LMS" style={{ height: '42px', objectFit: 'contain' }} />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#0F2C59', letterSpacing: '2px', textTransform: 'uppercase', lineHeight: '1.1' }}>
                    NEXTGEN LMS
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#0284C7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Learning Management System
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#0F2C59' }}>
                  STUDENT CARD
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginTop: '2px' }}>
                  Academic Year {new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* Middle: Details (Left) + Photo (Right) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px', flex: 1, padding: '14px 0' }}>

              {/* Details List */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '11px' }}>

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

            {/* Bottom Bar: Barcode (Left) + Director Signature (Right) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(15,44,89,0.15)', paddingTop: '12px' }}>
              {/* Barcode */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '2px', height: '26px', alignItems: 'center' }}>
                  {barcodePattern.map((w, i) => (
                    <span key={i} style={{ width: `${w * 2}px`, height: '100%', background: '#0F2C59', display: 'inline-block', borderRadius: '1px' }} />
                  ))}
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', letterSpacing: '3px', marginTop: '3px' }}>{studentId}</span>
              </div>

              {/* Signature */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '900', fontStyle: 'italic', color: '#0F2C59', fontFamily: 'Georgia, serif' }}>Anusha Sabir</div>
                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>DIRECTED BY ANUSHA SABIR</div>
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
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '140px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 140" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,0 L1000,0 L1000,85 C750,135 500,50 250,95 C120,115 0,70 0,70 Z" fill="#0284C7" opacity="0.85" />
              <path d="M0,0 L1000,0 L1000,60 C700,110 400,45 180,80 C80,95 0,45 0,45 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Bottom Wavy SVG */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '130px', zIndex: 0 }}>
            <svg viewBox="0 0 1000 130" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,60 C250,15 500,95 750,50 C880,30 1000,70 1000,70 L1000,130 L0,130 Z" fill="#0284C7" opacity="0.85" />
              <path d="M0,85 C300,35 600,95 820,70 C920,55 1000,95 1000,95 L1000,130 L0,130 Z" fill="#0F2C59" />
            </svg>
          </div>

          {/* Foreground Content */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '32px 42px', boxSizing: 'border-box' }}>

            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(15,44,89,0.15)', paddingBottom: '12px' }}>
              <div style={{ fontSize: '17px', fontWeight: '900', color: '#0F2C59', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                STUDENT ATTENDANCE & VERIFICATION PASS
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0284C7', textTransform: 'uppercase' }}>
                NextGen LMS Official
              </div>
            </div>

            {/* Middle: QR Code + Terms */}
            <div style={{ display: 'flex', gap: '36px', alignItems: 'center', flex: 1, padding: '16px 0' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(15,44,89,0.15)', paddingTop: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>Online Card Verification:</div>
                <div style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '900', color: '#0284C7', marginTop: '2px' }}>nextgen-lms.edu/verify/{studentId}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', fontStyle: 'italic', color: '#0F2C59', fontFamily: 'Georgia, serif' }}>Anusha Sabir</div>
                <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>AUTHORIZED OFFICER</div>
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
