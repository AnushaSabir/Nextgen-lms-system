'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  QrCode, Camera, CameraOff, CheckCircle2, XCircle, Clock,
  Users, AlertCircle, Download, RefreshCw, Play, Square,
  UserCheck, BarChart3, CalendarCheck, Zap, Search, X,
  Plus, Timer, Eye
} from 'lucide-react';
import {
  createAttendanceSession,
  markAttendance,
  decodeQRPayload,
  getAllSessions,
  getActiveSessions,
  closeSession,
  type AttendanceSession,
  type AttendanceRecord,
  type QRPayload,
} from '@/lib/attendance-store';
import { useToastStore } from '@/store/toast-store';

// ─── Main Component ────────────────────────────────────────────────────────────

export default function QRAttendanceScanner() {
  const { showToast } = useToastStore();

  // State
  const [activeView, setActiveView] = useState<'scanner' | 'sessions' | 'history'>('scanner');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [lastScan, setLastScan] = useState<{ payload: QRPayload; result: { success: boolean; message: string; record?: AttendanceRecord } } | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({ title: '', course: '', batch: 'Batch 2026-A' });
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef(false);

  // Load sessions
  useEffect(() => {
    setSessions(getAllSessions());
    const activeSessions = getActiveSessions();
    if (activeSessions.length > 0) {
      setCurrentSession(activeSessions[0]);
    }
  }, []);

  // ─── Camera Controls ───────────────────────────────────────────────────────

  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      startScanning();
    } catch (err: any) {
      setCameraError(err.message || 'Camera access denied. Please allow camera permissions.');
      setIsCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  // ─── QR Scanning Loop using jsQR ──────────────────────────────────────────

  const startScanning = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = setInterval(async () => {
      if (cooldownRef.current) return;
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      try {
        const jsQR = (await import('jsqr')).default;
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });

        if (code && code.data) {
          handleQRDetected(code.data);
        }
      } catch {
        // jsQR not available, silently continue
      }
    }, 300); // Scan every 300ms
  };

  // ─── Handle QR Detection ──────────────────────────────────────────────────

  const handleQRDetected = (qrData: string) => {
    if (cooldownRef.current) return;

    const payload = decodeQRPayload(qrData);
    if (!payload) {
      showToast('Invalid QR code — not a NextGen student card.', 'error');
      return;
    }

    if (!currentSession) {
      showToast('No active session! Create an attendance session first.', 'error');
      return;
    }

    // 2-second cooldown to prevent duplicate scans
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 2000);

    const result = markAttendance(currentSession.id, payload, 'Admin QR Scanner');
    setLastScan({ payload, result });
    setScanCount(prev => prev + 1);

    // Refresh sessions data
    setSessions(getAllSessions());
    setCurrentSession(getActiveSessions()[0] || null);

    if (result.success) {
      showToast(result.message, 'success');
      // Play success beep
      try {
        const audioCtx = new AudioContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch { /* audio not available */ }
    } else {
      showToast(result.message, 'error');
    }
  };

  // ─── Manual QR Input (for testing without camera) ─────────────────────────

  const [manualInput, setManualInput] = useState('');

  const handleManualScan = () => {
    if (!manualInput.trim()) return;
    handleQRDetected(manualInput.trim());
    setManualInput('');
  };

  // ─── Create Session ───────────────────────────────────────────────────────

  const handleCreateSession = () => {
    if (!sessionForm.title || !sessionForm.course) {
      showToast('Please fill in session title and course.', 'error');
      return;
    }
    const session = createAttendanceSession({
      title: sessionForm.title,
      course: sessionForm.course,
      batch: sessionForm.batch,
    });
    setCurrentSession(session);
    setSessions(getAllSessions());
    setShowCreateSession(false);
    setSessionForm({ title: '', course: '', batch: 'Batch 2026-A' });
    showToast(`✅ Session "${session.title}" is now LIVE!`, 'success');
  };

  // ─── Close Session ────────────────────────────────────────────────────────

  const handleCloseSession = (sessionId: string) => {
    closeSession(sessionId);
    setSessions(getAllSessions());
    const active = getActiveSessions();
    setCurrentSession(active.length > 0 ? active[0] : null);
    showToast('Session closed.', 'info');
  };

  // ─── Export CSV ───────────────────────────────────────────────────────────

  const exportSessionCSV = (session: AttendanceSession) => {
    const header = 'Student ID,Student Name,Email,Course,Batch,Status,Scanned At\n';
    const rows = session.records
      .map(r => `${r.studentId},${r.studentName},${r.studentEmail},${r.enrolledCourse},${r.batch},${r.status},${r.scannedAt}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${session.title.replace(/\s/g, '_')}_${new Date(session.date).toLocaleDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported!', 'success');
  };

  // Selected session for history view
  const viewSession = selectedSessionId ? sessions.find(s => s.id === selectedSessionId) : null;

  return (
    <div className="space-y-6">

      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#50BED9] to-[#159BD7] flex items-center justify-center text-[#101010] shadow-lg shadow-[#50BED9]/30">
              <QrCode className="w-5 h-5" />
            </span>
            QR Attendance System
          </h1>
          <p className="text-sm text-[#D0D3D6]/60 mt-1 ml-[52px]">
            Scan student ID cards to mark attendance in real-time
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 bg-[#151515] border border-[#353638] rounded-2xl p-1.5">
          {[
            { id: 'scanner' as const, label: 'Live Scanner', icon: Camera },
            { id: 'sessions' as const, label: 'Sessions', icon: CalendarCheck },
            { id: 'history' as const, label: 'History', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === tab.id
                  ? 'bg-gradient-to-r from-[#50BED9] to-[#159BD7] text-[#101010] shadow-lg'
                  : 'text-[#D0D3D6]/60 hover:text-white hover:bg-[#353638]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── STATS BAR ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Today</span>
            <p className="text-lg font-black text-white">{currentSession?.records.length || 0}</p>
          </div>
        </div>
        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#50BED9]/10 border border-[#50BED9]/20 flex items-center justify-center text-[#50BED9]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Scans</span>
            <p className="text-lg font-black text-white">{scanCount}</p>
          </div>
        </div>
        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Late</span>
            <p className="text-lg font-black text-white">{currentSession?.records.filter(r => r.status === 'late').length || 0}</p>
          </div>
        </div>
        <div className="bg-[#151515] border border-[#353638] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D0D3D6]/60 uppercase block">Sessions</span>
            <p className="text-lg font-black text-white">{sessions.length}</p>
          </div>
        </div>
      </div>

      {/* ─── ACTIVE SESSION INDICATOR ─── */}
      {currentSession ? (
        <div className="bg-gradient-to-r from-emerald-500/5 to-[#50BED9]/5 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <div>
              <p className="text-sm font-black text-white">{currentSession.title}</p>
              <p className="text-xs text-[#D0D3D6]/60">
                {currentSession.course} · {currentSession.batch} · {currentSession.records.length} students marked
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportSessionCSV(currentSession)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white text-xs font-bold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={() => handleCloseSession(currentSession.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all"
            >
              <Square className="w-3 h-3" />
              End Session
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#151515] border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-sm font-black text-amber-300">No Active Session</p>
              <p className="text-xs text-[#D0D3D6]/60">Create a session before scanning QR codes</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateSession(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#50BED9] to-[#159BD7] text-[#101010] text-xs font-black transition-all shadow-lg shadow-[#50BED9]/25 hover:brightness-110"
          >
            <Plus className="w-4 h-4" />
            Create Session
          </button>
        </div>
      )}

      {/* ─── CREATE SESSION MODAL ─── */}
      {showCreateSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowCreateSession(false)}>
          <div className="bg-[#151515] border border-[#353638] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#50BED9]" />
                New Attendance Session
              </h3>
              <button onClick={() => setShowCreateSession(false)} className="text-[#D0D3D6]/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g. Python Week 3 - Lecture 1"
                  value={sessionForm.title}
                  onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101010] border border-[#353638] text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Course</label>
                <select
                  value={sessionForm.course}
                  onChange={e => setSessionForm({ ...sessionForm, course: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101010] border border-[#353638] text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                >
                  <option value="">Select Course</option>
                  <option value="Artificial Intelligence (AI) Advance">Artificial Intelligence (AI) Advance</option>
                  <option value="Python for Data Science, Analytics & AI">Python for Data Science</option>
                  <option value="Next.js 15 & React 19 Full-Stack Mastery">Web Development</option>
                  <option value="Prompt Engineering & Generative AI">Prompt Engineering & AI</option>
                  <option value="Graphic Design Mastery">Graphic Design</option>
                  <option value="Digital Marketing & Social Growth">Digital Marketing</option>
                  <option value="Data Science with Python & Power BI">Data Science</option>
                  <option value="Cloud Architecture & DevOps CI/CD">Cloud & DevOps</option>
                  <option value="Cybersecurity Analyst Bootcamp">Cybersecurity</option>
                  <option value="UI/UX Design Systems">UI/UX Design</option>
                  <option value="Mobile App Development (React Native)">Mobile App Dev</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Batch</label>
                <input
                  type="text"
                  value={sessionForm.batch}
                  onChange={e => setSessionForm({ ...sessionForm, batch: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101010] border border-[#353638] text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
            </div>

            <button
              onClick={handleCreateSession}
              disabled={!sessionForm.title || !sessionForm.course}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#50BED9] to-[#159BD7] text-[#101010] font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-[#50BED9]/25 disabled:opacity-40"
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Start Live Session
            </button>
          </div>
        </div>
      )}

      {/* ─── SCANNER VIEW ─── */}
      {activeView === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Camera Area */}
          <div className="lg:col-span-2 bg-[#151515] border border-[#353638] rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-[#353638] flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#50BED9]" />
                QR Code Scanner
              </h3>
              <div className="flex items-center gap-2">
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    disabled={!currentSession}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#50BED9] to-[#159BD7] text-[#101010] text-xs font-black transition-all disabled:opacity-40"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Start Camera
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold"
                  >
                    <CameraOff className="w-3.5 h-3.5" />
                    Stop
                  </button>
                )}
              </div>
            </div>

            {/* Video Feed */}
            <div className="relative bg-black aspect-video flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#101010]/90 gap-4">
                  <div className="w-24 h-24 rounded-3xl bg-[#353638] flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-[#50BED9]/40" />
                  </div>
                  <p className="text-sm text-[#D0D3D6]/40 font-semibold text-center px-4">
                    {!currentSession
                      ? 'Create an attendance session first, then start the camera'
                      : cameraError || 'Click "Start Camera" to begin scanning student QR codes'}
                  </p>
                </div>
              )}

              {/* Scanning overlay */}
              {isCameraActive && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner brackets */}
                  <div className="absolute top-[15%] left-[15%] w-16 h-16 border-t-2 border-l-2 border-[#50BED9] rounded-tl-xl" />
                  <div className="absolute top-[15%] right-[15%] w-16 h-16 border-t-2 border-r-2 border-[#50BED9] rounded-tr-xl" />
                  <div className="absolute bottom-[15%] left-[15%] w-16 h-16 border-b-2 border-l-2 border-[#50BED9] rounded-bl-xl" />
                  <div className="absolute bottom-[15%] right-[15%] w-16 h-16 border-b-2 border-r-2 border-[#50BED9] rounded-br-xl" />
                  {/* Scan line animation */}
                  <div className="absolute left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-[#50BED9] to-transparent animate-bounce" style={{ top: '50%' }} />
                  {/* Status text */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <span className="px-4 py-1.5 rounded-full bg-[#101010]/80 text-[#50BED9] text-xs font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#50BED9] animate-pulse" />
                      Scanning... Point camera at Student ID Card QR
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Manual input for testing */}
            <div className="p-4 border-t border-[#353638]">
              <label className="text-xs font-bold text-[#D0D3D6]/50 block mb-2">
                📋 Paste QR Data (for manual/testing):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  placeholder='Paste student QR JSON data...'
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#101010] border border-[#353638] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
                <button
                  onClick={handleManualScan}
                  disabled={!manualInput.trim() || !currentSession}
                  className="px-4 py-2.5 rounded-xl bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white text-xs font-bold transition-all disabled:opacity-40"
                >
                  Mark
                </button>
              </div>
            </div>
          </div>

          {/* Scan Results Panel */}
          <div className="space-y-4">

            {/* Last Scan Result */}
            {lastScan && (
              <div className={`rounded-2xl p-4 border ${
                lastScan.result.success
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-red-500/5 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {lastScan.result.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`text-sm font-black ${lastScan.result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {lastScan.result.success ? 'ATTENDANCE MARKED' : 'SCAN FAILED'}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#50BED9] to-[#159BD7] flex items-center justify-center text-[#101010] text-lg font-black shrink-0">
                    {lastScan.payload.studentName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white truncate">{lastScan.payload.studentName}</p>
                    <p className="text-[10px] font-bold text-[#50BED9] font-mono">{lastScan.payload.studentId}</p>
                    <p className="text-[10px] text-[#D0D3D6]/60 truncate">{lastScan.payload.enrolledCourse}</p>
                  </div>
                </div>

                {lastScan.result.record && (
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <Clock className="w-3 h-3 text-[#D0D3D6]/40" />
                    <span className="text-[#D0D3D6]/60">{new Date(lastScan.result.record.scannedAt).toLocaleTimeString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      lastScan.result.record.status === 'present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {lastScan.result.record.status}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Today's Attendance List */}
            <div className="bg-[#151515] border border-[#353638] rounded-2xl overflow-hidden">
              <div className="p-3 border-b border-[#353638] flex items-center justify-between">
                <h4 className="text-xs font-black text-white flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#50BED9]" />
                  Marked Students ({currentSession?.records.length || 0})
                </h4>
                {currentSession && currentSession.records.length > 0 && (
                  <button onClick={() => setShowCreateSession(true)} className="text-[10px] text-[#50BED9] font-bold hover:underline">
                    New Session
                  </button>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto divide-y divide-[#353638]/50">
                {currentSession?.records.length === 0 && (
                  <div className="p-6 text-center text-xs text-[#D0D3D6]/40">
                    No students scanned yet. Point camera at a student&apos;s ID card QR code.
                  </div>
                )}
                {currentSession?.records.map((record, i) => (
                  <div key={record.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#353638]/20 transition-colors">
                    <span className="text-[10px] font-mono text-[#D0D3D6]/30 w-4">{i + 1}</span>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#50BED9]/20 to-[#159BD7]/20 border border-[#50BED9]/30 flex items-center justify-center text-[#50BED9] text-xs font-black shrink-0">
                      {record.studentName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{record.studentName}</p>
                      <p className="text-[10px] text-[#D0D3D6]/50 font-mono">{record.studentId}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        record.status === 'present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {record.status}
                      </span>
                      <span className="text-[10px] text-[#D0D3D6]/40">{new Date(record.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SESSIONS VIEW ─── */}
      {activeView === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">All Sessions</h3>
            <button
              onClick={() => setShowCreateSession(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#50BED9] to-[#159BD7] text-[#101010] text-xs font-black transition-all shadow-lg shadow-[#50BED9]/25 hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
              New Session
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-[#151515] border border-[#353638] rounded-2xl p-12 text-center">
              <QrCode className="w-12 h-12 text-[#50BED9]/20 mx-auto mb-3" />
              <p className="text-sm font-bold text-[#D0D3D6]/40">No sessions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`bg-[#151515] border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    session.isActive ? 'border-emerald-500/30' : 'border-[#353638]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {session.isActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-black text-white">{session.title}</p>
                      <p className="text-xs text-[#D0D3D6]/60">{session.course} · {session.batch} · {new Date(session.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#353638] text-[10px] font-bold text-white">{session.records.length} students</span>
                    {session.isActive && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase">LIVE</span>
                    )}
                    <button
                      onClick={() => exportSessionCSV(session)}
                      className="p-2 rounded-lg bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setSelectedSessionId(session.id); setActiveView('history'); }}
                      className="p-2 rounded-lg bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── HISTORY VIEW ─── */}
      {activeView === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">
              {viewSession ? `Session: ${viewSession.title}` : 'Attendance History'}
            </h3>
            {viewSession && (
              <button
                onClick={() => setSelectedSessionId(null)}
                className="text-xs font-bold text-[#50BED9] hover:underline"
              >
                ← All Sessions
              </button>
            )}
          </div>

          {viewSession ? (
            <div className="bg-[#151515] border border-[#353638] rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-[#353638] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[#D0D3D6]/60">{viewSession.course} · {viewSession.batch}</p>
                  <p className="text-xs text-[#D0D3D6]/40">{new Date(viewSession.date).toLocaleDateString()} · {viewSession.records.length} students</p>
                </div>
                <button
                  onClick={() => exportSessionCSV(viewSession)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#353638] hover:bg-[#50BED9] hover:text-[#101010] text-white text-xs font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101010] text-[#D0D3D6]/50 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#353638]/50">
                    {viewSession.records.map((r, i) => (
                      <tr key={r.id} className="hover:bg-[#353638]/20 transition-colors">
                        <td className="px-4 py-3 text-[#D0D3D6]/40 font-mono">{i + 1}</td>
                        <td className="px-4 py-3 font-bold text-white">{r.studentName}</td>
                        <td className="px-4 py-3 font-mono text-[#50BED9]">{r.studentId}</td>
                        <td className="px-4 py-3 text-[#D0D3D6]/60 truncate max-w-[200px]">{r.enrolledCourse}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.status === 'present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#D0D3D6]/50">{new Date(r.scannedAt).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {viewSession.records.length === 0 && (
                  <div className="p-8 text-center text-sm text-[#D0D3D6]/40">
                    No attendance records in this session.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <div className="bg-[#151515] border border-[#353638] rounded-2xl p-12 text-center">
                  <BarChart3 className="w-12 h-12 text-[#50BED9]/20 mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#D0D3D6]/40">No attendance history yet</p>
                </div>
              ) : (
                sessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className="w-full bg-[#151515] border border-[#353638] hover:border-[#50BED9]/30 rounded-2xl p-4 text-left flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{session.title}</p>
                      <p className="text-xs text-[#D0D3D6]/50">{session.course} · {new Date(session.date).toLocaleDateString()} · {session.records.length} students</p>
                    </div>
                    <Eye className="w-4 h-4 text-[#50BED9]/40" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
