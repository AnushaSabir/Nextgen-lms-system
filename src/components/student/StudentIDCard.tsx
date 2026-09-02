'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Download, QrCode, ShieldCheck, CheckCircle2, RotateCw,
  User, Award, Copy, IdCard, Printer, Zap, FileText, Sparkles
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
    for (let i = 0; i < Math.min(chars.length * 3, 50); i++) {
      const charCode = chars.charCodeAt(i % chars.length);
      pattern.push((charCode % 3) + 1);
    }
    return pattern;
  };

  const barcodePattern = generateBarcodePattern(studentId);

  /**
   * Mobile-Friendly High-Precision PDF Download
   * Uses Blob URL to guarantee direct file saving on mobile and desktop
   */
  const handleDownloadPDF = async (mode: 'both' | 'front' | 'back' = 'both') => {
    setIsDownloading(true);
    showToast('Preparing your Student ID Card PDF...', 'info');

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

      if (mode === 'both' || mode === 'front') {
        const frontCanvas = await html2canvas(frontEl, {
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 1012,
          height: 638,
        });
        const frontImg = frontCanvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(frontImg, 'JPEG', 0, 0, 85.6, 53.98, undefined, 'FAST');
      }

      if (mode === 'both') {
        pdf.addPage([85.6, 53.98], 'landscape');
      }

      if (mode === 'both' || mode === 'back') {
        const backCanvas = await html2canvas(backEl, {
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 1012,
          height: 638,
        });
        const backImg = backCanvas.toDataURL('image/jpeg', 0.98);
        if (mode === 'back') {
          pdf.addImage(backImg, 'JPEG', 0, 0, 85.6, 53.98, undefined, 'FAST');
        } else {
          pdf.addImage(backImg, 'JPEG', 0, 0, 85.6, 53.98, undefined, 'FAST');
        }
      }

      // Universal Mobile & Desktop Blob Download
      const fileName = `${studentName.replace(/\s+/g, '_')}_${studentId}_NextGen_StudentID.pdf`;
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      downloadLink.target = '_blank';
      document.body.appendChild(downloadLink);
      downloadLink.click();

      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobUrl);
      }, 3000);

      showToast('✅ ID Card PDF saved to your device Downloads/Files!', 'success');
    } catch (error) {
      console.error('PDF download error:', error);
      showToast('Generating PNG image fallback...', 'info');
      await handleDownloadPNG();
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * PNG Image Download (Mobile Compatible)
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
        scale: 2.5,
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
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 3000);
        showToast(`✅ ID Card (${side}) saved to your device!`, 'success');
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0a2540] to-[#159BD7] border border-[#50BED9]/40 flex items-center justify-center text-white shadow-lg shadow-[#159BD7]/25 shrink-0">
            <IdCard className="w-6 h-6 text-[#50BED9]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-white">NextGen Official Student ID Card</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#50BED9]/10 border border-[#50BED9]/30 text-[#50BED9] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#50BED9] animate-pulse" />
                CR80 Official Edition
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
            <span>{isFlipped ? 'View Front Side' : 'View Back (QR)'}</span>
          </button>

          <button
            onClick={() => handleDownloadPDF('both')}
            disabled={isDownloading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#50BED9] to-[#159BD7] hover:brightness-110 text-[#101010] text-xs font-black transition-all shadow-lg shadow-[#50BED9]/25 disabled:opacity-60"
          >
            {isDownloading ? (
              <span className="w-4 h-4 border-2 border-[#101010] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Save to Phone / PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            title="Download PNG Image"
            className="p-2.5 rounded-xl bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE ON-SCREEN CARD PREVIEW (MODERN CLEAN NAVY/WHITE DESIGN) ── */}
      <div className="flex justify-center items-center py-2">

        {/* FRONT SIDE (ON SCREEN) */}
        {!isFlipped ? (
          <div
            className="relative w-full max-w-[560px] rounded-[1.75rem] overflow-hidden shadow-2xl flex flex-col justify-between select-none bg-white border border-[#0a2540]/20"
            style={{
              aspectRatio: '85.6 / 53.98',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 35px rgba(21,155,215,0.2)',
              padding: '4.5% 5%',
            }}
          >
            {/* Top Left Modern Wavy Header Curves */}
            <svg className="absolute top-0 left-0 w-[55%] h-[32%] pointer-events-none z-0" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path d="M 0,0 L 300,0 C 230,50 140,20 0,90 Z" fill="#0a2540" />
              <path d="M 0,0 L 260,0 C 190,45 110,15 0,75 Z" fill="#159BD7" opacity="0.8" />
              <path d="M 0,0 L 210,0 C 150,35 80,10 0,55 Z" fill="#50BED9" opacity="0.9" />
            </svg>

            {/* Bottom Right Modern Wavy Curves */}
            <svg className="absolute bottom-0 right-0 w-[55%] h-[28%] pointer-events-none z-0" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path d="M 300,100 L 0,100 C 70,50 160,80 300,10 Z" fill="#0a2540" />
              <path d="M 300,100 L 40,100 C 110,55 190,85 300,25 Z" fill="#159BD7" opacity="0.8" />
              <path d="M 300,100 L 90,100 C 150,65 220,90 300,45 Z" fill="#50BED9" opacity="0.9" />
            </svg>

            {/* Top Right Punch Hole / Lanyard Slot Indicator */}
            <div className="absolute top-3 right-4 w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400/80 shadow-inner flex items-center justify-center border border-gray-400 z-10 opacity-70" />

            {/* TOP HEADER */}
            <div className="relative z-10 flex items-center justify-center pt-1 pb-1">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-6 sm:h-7 w-32 sm:w-40">
                  <Image src="/logo.png" alt="NextGen LMS" fill sizes="200px" className="object-contain" />
                </div>
                <span className="text-[7.5px] sm:text-[9px] font-black uppercase tracking-[2px] text-[#0a2540] mt-0.5">
                  LEARNING MANAGEMENT SYSTEM
                </span>
              </div>
            </div>

            {/* CARD TITLE */}
            <div className="relative z-10 pl-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[1.5px] text-[#0a2540]">
                STUDENT CARD
              </h3>
            </div>

            {/* MIDDLE BODY: Details on Left + Photo on Right */}
            <div className="relative z-10 flex items-center justify-between gap-3 px-2 flex-1 py-1">

              {/* Left Details */}
              <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5 text-[8px] sm:text-[10.5px]">
                <div className="flex items-baseline gap-2">
                  <span className="w-24 sm:w-28 font-black uppercase text-[#0a2540] shrink-0">STUDENT NAME</span>
                  <span className="font-bold text-[#0a2540]">:</span>
                  <span className="font-black text-[#0a2540] uppercase truncate">{studentName}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="w-24 sm:w-28 font-black uppercase text-[#0a2540] shrink-0">STUDENT ID</span>
                  <span className="font-bold text-[#0a2540]">:</span>
                  <span className="font-black font-mono text-[#159BD7]">{studentId}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="w-24 sm:w-28 font-black uppercase text-[#0a2540] shrink-0">COURSE</span>
                  <span className="font-bold text-[#0a2540]">:</span>
                  <span className="font-bold text-[#0a2540] leading-tight break-words">{enrolledCourse}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="w-24 sm:w-28 font-black uppercase text-[#0a2540] shrink-0">BATCH</span>
                  <span className="font-bold text-[#0a2540]">:</span>
                  <span className="font-bold text-gray-700">{batch}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="w-24 sm:w-28 font-black uppercase text-[#0a2540] shrink-0">VALID THRU</span>
                  <span className="font-bold text-[#0a2540]">:</span>
                  <span className="font-bold text-gray-700">{expiryDate}</span>
                </div>
              </div>

              {/* Right Photo (Curved Rounded Frame matching reference image) */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-20 sm:w-28 aspect-[3/3.8] rounded-2xl p-[3px] bg-gradient-to-br from-[#0a2540] via-[#159BD7] to-[#0a2540] shadow-xl">
                  <div className="w-full h-full rounded-[13px] overflow-hidden bg-gray-100 flex items-center justify-center relative">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt={studentName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0a2540] text-white">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER BAR: Barcode on Left + Signature on Right */}
            <div className="relative z-10 flex items-end justify-between px-2 pt-1">
              {/* Barcode */}
              <div className="flex flex-col">
                <div className="flex items-center gap-[1px] h-3 sm:h-4">
                  {barcodePattern.map((w, i) => (
                    <span key={i} className="bg-[#0a2540] h-full inline-block rounded-[0.5px]" style={{ width: `${w}px` }} />
                  ))}
                </div>
                <span className="text-[5.5px] sm:text-[6.5px] font-mono font-bold text-gray-600 tracking-widest mt-0.5">{studentId}</span>
              </div>

              {/* Signature */}
              <div className="text-right">
                <p className="text-[8px] sm:text-[10px] font-black italic text-[#0a2540] font-serif">Anusha Sabir</p>
                <p className="text-[5.5px] sm:text-[6.5px] uppercase font-black text-gray-600">Directed by Anusha Sabir</p>
              </div>
            </div>
          </div>
        ) : (
          /* BACK SIDE (ON SCREEN) */
          <div
            className="relative w-full max-w-[560px] rounded-[1.75rem] overflow-hidden shadow-2xl flex flex-col justify-between select-none bg-white border border-[#0a2540]/20"
            style={{
              aspectRatio: '85.6 / 53.98',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 35px rgba(21,155,215,0.15)',
              padding: '4.5% 5%',
            }}
          >
            {/* Magnetic Stripe */}
            <div className="absolute top-[8%] left-0 right-0 h-[17%] bg-[#0a2540] border-y border-[#159BD7]/30 pointer-events-none" />

            {/* Top and Bottom Wavy Curves */}
            <svg className="absolute bottom-0 left-0 w-[50%] h-[25%] pointer-events-none z-0" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path d="M 0,100 L 300,100 C 230,50 140,80 0,10 Z" fill="#0a2540" />
              <path d="M 0,100 L 260,100 C 190,55 110,85 0,25 Z" fill="#159BD7" opacity="0.8" />
            </svg>

            {/* Content below stripe */}
            <div className="relative z-10 flex h-full pt-[22%] gap-4 items-center">

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center shrink-0 w-24 sm:w-28">
                <div className="p-2 bg-white rounded-xl shadow-xl border-2 border-[#0a2540]">
                  <QRCodeSVG
                    value={qrPayload}
                    size={80}
                    level="H"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#0a2540"
                  />
                </div>
                <span className="text-[7px] sm:text-[8px] font-black text-[#0a2540] mt-1 text-center uppercase tracking-wide">
                  SCAN FOR ATTENDANCE
                </span>
              </div>

              {/* Terms & Verification Info */}
              <div className="flex-1 flex flex-col justify-between h-full py-1 space-y-1">
                <div className="space-y-1 text-gray-800">
                  <span className="block text-[7.5px] sm:text-[8.5px] font-black uppercase text-[#0a2540] tracking-wider">
                    NextGen Official Student Pass
                  </span>
                  <p className="text-[6.5px] sm:text-[7.5px] text-gray-600 leading-relaxed">
                    • This ID card is property of NextGen LMS and non-transferable.
                  </p>
                  <p className="text-[6.5px] sm:text-[7.5px] text-gray-600 leading-relaxed">
                    • Required for online attendance, lab access, and examinations.
                  </p>
                  <p className="text-[6.5px] sm:text-[7.5px] text-gray-600 leading-relaxed">
                    • In case of loss, report immediately to student administration.
                  </p>
                </div>

                <div className="pt-1 border-t border-gray-300 flex items-end justify-between">
                  <div>
                    <span className="block text-[6px] sm:text-[7px] font-bold text-gray-500">Online Verification:</span>
                    <p className="text-[7px] sm:text-[8px] font-mono font-bold text-[#159BD7]">nextgen-lms.edu/verify/{studentId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] sm:text-[8px] font-serif font-black italic text-[#0a2540]">Anusha Sabir</p>
                    <p className="text-[5.5px] sm:text-[6.5px] text-gray-500 uppercase font-bold">Authorized Officer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── 100% ACCURATE 1012x638 PIXEL-PERFECT EXPORT TEMPLATES (OFFSCREEN) ── */}
      <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -100, pointerEvents: 'none' }}>
        
        {/* EXACT FRONT SIDE (1012px × 638px - Clean Modern Navy/White Edition) */}
        <div
          id="pdf-export-front"
          style={{
            width: '1012px',
            height: '638px',
            background: '#ffffff',
            boxSizing: 'border-box',
            padding: '36px 44px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#0a2540',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Left Wavy SVG Curves */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '450px', height: '140px', pointerEvents: 'none' }} viewBox="0 0 450 140" preserveAspectRatio="none">
            <path d="M 0,0 L 450,0 C 330,80 180,30 0,130 Z" fill="#0a2540" />
            <path d="M 0,0 L 390,0 C 280,70 140,25 0,110 Z" fill="#159BD7" opacity="0.85" />
            <path d="M 0,0 L 320,0 C 220,55 100,20 0,85 Z" fill="#50BED9" opacity="0.9" />
          </svg>

          {/* Bottom Right Wavy SVG Curves */}
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '450px', height: '130px', pointerEvents: 'none' }} viewBox="0 0 450 130" preserveAspectRatio="none">
            <path d="M 450,130 L 0,130 C 120,60 270,110 450,15 Z" fill="#0a2540" />
            <path d="M 450,130 L 60,130 C 170,70 310,115 450,35 Z" fill="#159BD7" opacity="0.85" />
            <path d="M 450,130 L 130,130 C 230,85 350,120 450,60 Z" fill="#50BED9" opacity="0.9" />
          </svg>

          {/* Punch Hole */}
          <div style={{ position: 'absolute', top: '24px', right: '36px', width: '32px', height: '32px', borderRadius: '50%', background: '#d1d5db', border: '2px solid #9ca3af', opacity: 0.6 }} />

          {/* Top Bar Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="NextGen LMS" style={{ height: '44px', objectFit: 'contain' }} />
            <div style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#0a2540', marginTop: '2px' }}>
              LEARNING MANAGEMENT SYSTEM
            </div>
          </div>

          {/* Card Heading */}
          <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', color: '#0a2540', zIndex: 10, marginTop: '2px' }}>
            STUDENT CARD
          </div>

          {/* Middle Body */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flex: 1, padding: '12px 0', zIndex: 10 }}>
            {/* Left Info Table */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                <span style={{ width: '170px', fontWeight: '900', textTransform: 'uppercase', color: '#0a2540', letterSpacing: '0.5px' }}>STUDENT NAME</span>
                <span style={{ fontWeight: '900', color: '#0a2540' }}>:</span>
                <span style={{ fontWeight: '900', color: '#0a2540', fontSize: '22px', letterSpacing: '-0.5px' }}>{studentName}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                <span style={{ width: '170px', fontWeight: '900', textTransform: 'uppercase', color: '#0a2540', letterSpacing: '0.5px' }}>STUDENT ID</span>
                <span style={{ fontWeight: '900', color: '#0a2540' }}>:</span>
                <span style={{ fontWeight: '900', fontFamily: 'monospace', color: '#159BD7', fontSize: '19px' }}>{studentId}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                <span style={{ width: '170px', fontWeight: '900', textTransform: 'uppercase', color: '#0a2540', letterSpacing: '0.5px' }}>COURSE</span>
                <span style={{ fontWeight: '900', color: '#0a2540' }}>:</span>
                <span style={{ fontWeight: '800', color: '#0a2540', fontSize: enrolledCourse.length > 32 ? '15px' : '17px', lineHeight: '1.25' }}>{enrolledCourse}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                <span style={{ width: '170px', fontWeight: '900', textTransform: 'uppercase', color: '#0a2540', letterSpacing: '0.5px' }}>BATCH</span>
                <span style={{ fontWeight: '900', color: '#0a2540' }}>:</span>
                <span style={{ fontWeight: '700', color: '#374151' }}>{batch}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                <span style={{ width: '170px', fontWeight: '900', textTransform: 'uppercase', color: '#0a2540', letterSpacing: '0.5px' }}>VALID THRU</span>
                <span style={{ fontWeight: '900', color: '#0a2540' }}>:</span>
                <span style={{ fontWeight: '700', color: '#374151' }}>{expiryDate}</span>
              </div>
            </div>

            {/* Right Photo Frame (Curved border like reference image) */}
            <div style={{ width: '200px', height: '240px', borderRadius: '26px', padding: '4px', background: 'linear-gradient(135deg, #0a2540, #159BD7, #0a2540)', boxSizing: 'border-box', flexShrink: 0, boxShadow: '0 12px 28px rgba(0,0,0,0.2)' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '22px', overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '64px', color: '#0a2540', fontWeight: '900' }}>{studentName.charAt(0)}</div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10, paddingTop: '10px' }}>
            {/* Barcode */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '2px', height: '28px', alignItems: 'center' }}>
                {barcodePattern.map((w, i) => (
                  <span key={i} style={{ width: `${w * 2}px`, height: '100%', background: '#0a2540', display: 'inline-block', borderRadius: '1px' }} />
                ))}
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#4b5563', letterSpacing: '3px', marginTop: '3px' }}>{studentId}</span>
            </div>

            {/* Signature */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: '900', fontStyle: 'italic', color: '#0a2540', fontFamily: 'Georgia, serif' }}>Anusha Sabir</div>
              <div style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#4b5563', letterSpacing: '1px' }}>Directed by Anusha Sabir</div>
            </div>
          </div>
        </div>

        {/* EXACT BACK SIDE (1012px × 638px - Matching Clean Edition) */}
        <div
          id="pdf-export-back"
          style={{
            width: '1012px',
            height: '638px',
            background: '#ffffff',
            boxSizing: 'border-box',
            padding: '36px 44px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#0a2540',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Magnetic Stripe */}
          <div style={{ position: 'absolute', top: '34px', left: 0, right: 0, height: '90px', background: '#0a2540', borderTop: '2px solid #159BD7', borderBottom: '2px solid #159BD7' }} />

          {/* Top spacer */}
          <div style={{ height: '90px' }} />

          {/* Bottom Wavy Curves */}
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '450px', height: '130px', pointerEvents: 'none' }} viewBox="0 0 450 130" preserveAspectRatio="none">
            <path d="M 0,130 L 450,130 C 330,60 180,110 0,15 Z" fill="#0a2540" />
            <path d="M 0,130 L 390,130 C 280,70 140,115 0,35 Z" fill="#159BD7" opacity="0.85" />
          </svg>

          {/* Content Area */}
          <div style={{ display: 'flex', gap: '36px', alignItems: 'center', flex: 1, paddingTop: '20px', zIndex: 10 }}>
            {/* QR Code */}
            <div style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '18px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '3px solid #0a2540' }}>
                <QRCodeSVG
                  value={qrPayload}
                  size={150}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#0a2540"
                />
              </div>
              <div style={{ fontSize: '12px', fontWeight: '900', color: '#0a2540', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '10px' }}>
                SCAN FOR ATTENDANCE
              </div>
            </div>

            {/* Terms & Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '8px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#0a2540', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  NextGen LMS Official Student Pass
                </div>
                <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                  • This ID card is property of NextGen LMS and non-transferable.
                </div>
                <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                  • Required for live lectures, online attendance, and examinations.
                </div>
                <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                  • In case of loss, report immediately to student administration.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280' }}>Online Verification:</div>
                  <div style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '900', color: '#159BD7', marginTop: '2px' }}>nextgen-lms.edu/verify/{studentId}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', fontStyle: 'italic', color: '#0a2540', fontFamily: 'Georgia, serif' }}>Anusha Sabir</div>
                  <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#6b7280' }}>Authorized Officer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Info strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#50BED9]/10 border border-[#50BED9]/20 flex items-center justify-center text-[#50BED9] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Print Standard</span>
            <p className="text-xs font-black text-white">CR80 (85.6mm × 53.98mm) 300 DPI</p>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#33C6B6]/10 border border-[#33C6B6]/20 flex items-center justify-center text-[#33C6B6] shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">QR Attendance</span>
            <p className="text-xs font-black text-white">Encrypted per Student ID</p>
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
