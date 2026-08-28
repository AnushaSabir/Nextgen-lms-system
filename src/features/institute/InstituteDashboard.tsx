'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  LayoutDashboard, Users, Building2, GraduationCap, FileText,
  CheckCircle2, Plus, Search, Filter, Download, Eye, Edit3,
  Calendar, Award, Star, TrendingUp, TrendingDown, Bell,
  Sparkles, Clock, AlertCircle, Video, BookOpen, Layers,
  Printer, X, Send, UserPlus, Check, ChevronRight, Activity
, Mic, MicOff, Volume2, VolumeX} from 'lucide-react';

type InstituteTab = 'overview' | 'students' | 'groups' | 'trainers' | 'reports' | 'exams' | 'jarvis';

const INSTITUTE_DATA = {
  name: 'Beaconhouse International System',
  campus: 'Lahore Main Campus (Gulberg Sector)',
  code: 'LHR-PK-092',
  academicYear: 'Academic Session 2025-2026',
  totalStudents: 420,
  activeBatches: 14,
  assignedTrainers: 18,
  classAverage: 86.4,
  avatar: 'B',
};

const INITIAL_STUDENTS = [
  { id: 1, rollNo: 'BH-2026-001', name: 'Ali Hassan', batch: 'Batch 2026-A: Full-Stack Web', attendance: 96, gpa: 3.85, score: 91, status: 'excellent', avatar: 'A' },
  { id: 2, rollNo: 'BH-2026-002', name: 'Sara Khan', batch: 'Batch 2026-B: Applied AI', attendance: 92, gpa: 3.70, score: 84, status: 'good', avatar: 'S' },
  { id: 3, rollNo: 'BH-2026-003', name: 'Usman Malik', batch: 'Batch 2026-A: Full-Stack Web', attendance: 84, gpa: 3.20, score: 76, status: 'average', avatar: 'U' },
  { id: 4, rollNo: 'BH-2026-004', name: 'Fatima Zahra', batch: 'Batch 2026-C: Cloud DevOps', attendance: 98, gpa: 3.95, score: 96, status: 'excellent', avatar: 'F' },
  { id: 5, rollNo: 'BH-2026-005', name: 'Bilal Ahmed', batch: 'Batch 2026-B: Applied AI', attendance: 78, gpa: 2.80, score: 62, status: 'needs-help', avatar: 'B' },
  { id: 6, rollNo: 'BH-2026-006', name: 'Zara Noor', batch: 'Batch 2026-D: UI/UX Design', attendance: 74, gpa: 2.65, score: 58, status: 'needs-help', avatar: 'Z' },
  { id: 7, rollNo: 'BH-2026-007', name: 'Hamza Tariq', batch: 'Batch 2026-A: Full-Stack Web', attendance: 88, gpa: 3.45, score: 82, status: 'good', avatar: 'H' },
  { id: 8, rollNo: 'BH-2026-008', name: 'Mahnoor Raza', batch: 'Batch 2026-C: Cloud DevOps', attendance: 94, gpa: 3.75, score: 89, status: 'good', avatar: 'M' },
];

const BATCHES_LIST = [
  { id: 1, code: 'BATCH-2026-A', name: 'Full-Stack Next.js & React 19', trainer: 'Engr. Sarah Tariq', students: 32, maxSeats: 35, progress: 78, room: 'Lab 04 / Live Stream', time: 'Mon, Wed 10:00 AM' },
  { id: 2, code: 'BATCH-2026-B', name: 'Generative AI & Machine Learning', trainer: 'Dr. Hamza Malik', students: 28, maxSeats: 30, progress: 65, room: 'AI Research Lab 01', time: 'Tue, Thu 02:00 PM' },
  { id: 3, code: 'BATCH-2026-C', name: 'Cloud Architecture & DevOps CI/CD', trainer: 'Engr. Zubair Khan', students: 24, maxSeats: 25, progress: 52, room: 'Cloud Computing Lab', time: 'Mon, Fri 04:00 PM' },
  { id: 4, code: 'BATCH-2026-D', name: 'UI/UX Design Systems & Figma', trainer: 'Ayesha Siddiqui', students: 18, maxSeats: 20, progress: 34, room: 'Design Studio 02', time: 'Wed, Sat 11:30 AM' },
];

const TRAINERS_LIST = [
  { id: 1, name: 'Engr. Sarah Tariq', subject: 'Full-Stack Next.js 15 & Cloud React', rating: 4.9, activeBatches: 2, hoursWeekly: 12, avatar: 'S' },
  { id: 2, name: 'Dr. Hamza Malik', subject: 'Generative AI, LLMs & Machine Learning', rating: 4.95, activeBatches: 2, hoursWeekly: 10, avatar: 'H' },
  { id: 3, name: 'Engr. Zubair Khan', subject: 'Docker, Kubernetes & AWS Cloud DevOps', rating: 4.8, activeBatches: 1, hoursWeekly: 8, avatar: 'Z' },
  { id: 4, name: 'Ayesha Siddiqui', subject: 'UI/UX Design Systems, Wireframing & Figma', rating: 4.75, activeBatches: 1, hoursWeekly: 6, avatar: 'A' },
];

const EXAMS_LIST = [
  { id: 1, title: 'Next.js 15 Full-Stack Final Project Defense', batch: 'Batch 2026-A', date: '28 Aug 2026', time: '10:00 AM - 01:00 PM', venue: 'Main Auditorium & GitHub Lab', supervisor: 'Engr. Sarah Tariq', passingCriteria: '75%' },
  { id: 2, title: 'Applied AI Neural Networks Mid-Term Quiz', batch: 'Batch 2026-B', date: '02 Sep 2026', time: '02:00 PM - 04:00 PM', venue: 'AI Lab Terminal 1-30', supervisor: 'Dr. Hamza Malik', passingCriteria: '70%' },
  { id: 3, title: 'Docker Containerization & Kubernetes Exam', batch: 'Batch 2026-C', date: '05 Sep 2026', time: '04:00 PM - 06:00 PM', venue: 'Cloud Lab / AWS Sandbox', supervisor: 'Engr. Zubair Khan', passingCriteria: '75%' },
];

export function InstituteDashboard() {
  const [activeTab, setActiveTab] = useState<InstituteTab>('overview');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [batches, setBatches] = useState(BATCHES_LIST);
  const [searchStudent, setSearchStudent] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [enrollStudentOpen, setEnrollStudentOpen] = useState(false);
  const [createBatchOpen, setCreateBatchOpen] = useState(false);
  const [selectedStudentReport, setSelectedStudentReport] = useState<typeof INITIAL_STUDENTS[0] | null>(null);

  const [newStudentForm, setNewStudentForm] = useState({ name: '', rollNo: '', batch: 'Batch 2026-A: Full-Stack Web' });
  const [newBatchForm, setNewBatchForm] = useState({ name: '', code: '', trainer: 'Engr. Sarah Tariq', maxSeats: 30, room: 'Lab 03', time: 'Mon, Wed 11:00 AM' });
  const [instJarvisInput, setInstJarvisInput] = useState('');
  const [instJarvisListening, setInstJarvisListening] = useState(false);
  const [instJarvisSpeaking, setInstJarvisSpeaking] = useState(false);
  const [instVoiceEnabled, setInstVoiceEnabled] = useState(true);
  const [instLiveTranscript, setInstLiveTranscript] = useState('');
  const [instRecognition, setInstRecognition] = useState<any>(null);

  const speakInstJarvisText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`]/g, '').replace(/\n/g, '. ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setInstJarvisSpeaking(true);
    utterance.onend = () => setInstJarvisSpeaking(false);
    utterance.onerror = () => setInstJarvisSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopInstSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setInstJarvisSpeaking(false);
  };

  const [instRecSeconds, setInstRecSeconds] = useState(0);
  const instMediaStream = React.useRef<MediaStream | null>(null);
  const instRecTimer = React.useRef<any>(null);
  const instCapturedWords = React.useRef<string>('');

  const startInstVoiceInput = async () => {
    if (typeof window === 'undefined') return;
    stopInstSpeaking();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      instMediaStream.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(250);

      setInstJarvisListening(true);
      setInstRecSeconds(0);
      setInstLiveTranscript('');
      instCapturedWords.current = '';

      if (instRecTimer.current) clearInterval(instRecTimer.current);
      instRecTimer.current = setInterval(() => {
        setInstRecSeconds(s => s + 1);
      }, 1000);

      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const recognition = new SpeechRec();
          recognition.lang = 'ur-PK';
          recognition.continuous = true;
          recognition.interimResults = true;
          setInstRecognition(recognition);

          recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) final += event.results[i][0].transcript;
              else interim += event.results[i][0].transcript;
            }
            const text = (final || interim).trim();
            if (text) {
              instCapturedWords.current = text;
              setInstLiveTranscript(text);
              setInstJarvisInput(text);
            }
          };
          recognition.onerror = () => {};
          recognition.start();
        } catch {}
      }
    } catch (err) {
      console.error(err);
      alert('Microphone permission required! Please allow microphone access in your browser.');
      setInstJarvisListening(false);
    }
  };

  const stopInstVoiceAndSend = (textToSend?: string) => {
    if (instRecTimer.current) clearInterval(instRecTimer.current);
    if (instRecognition) {
      try { instRecognition.stop(); } catch {}
    }
    if (instMediaStream.current) {
      instMediaStream.current.getTracks().forEach(track => track.stop());
    }
    setInstJarvisListening(false);

    const captured = (textToSend || instCapturedWords.current || instLiveTranscript || instJarvisInput).trim();
    if (captured) {
      handleInstVoiceQuery(captured);
    } else {
      const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const noVoice = { id: Date.now().toString(), sender: 'jarvis' as const, text: 'Aapki awaz clear nahi aayi. Baraye meharbani kisi student ka naam dobara bolein ya type karein!', ts };
      setInstJarvisMessages(prev => [...prev, noVoice]);
      if (instVoiceEnabled) {
        speakInstJarvisText('Aapki awaz clear nahi aayi. Baraye meharbani kisi student ka naam dobara bolein ya type karein.');
      }
    }
    setInstLiveTranscript('');
    setInstJarvisInput('');
    setInstRecSeconds(0);
  };

  const handleInstVoiceQuery = (spokenText: string) => {
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now().toString(), sender: 'admin' as const, text: spokenText, ts };
    const lower = spokenText.toLowerCase();
    let reply = '';
    if (lower.includes('ali') || lower.includes('hassan')) {
      reply = "Ali Hassan Grade 11 ke student hain. Unho ne Next.js course mein 34 ghantay study kiya hai, 94% exam score ke sath 6 badges aur 2 certificates earn kiye hain. Unki performance Excellent hai.";
    } else if (lower.includes('fatima') || lower.includes('zahra')) {
      reply = "Fatima Zahra Class Topper hain. Unka score 96% hai, Level 5 Master par hain, aur unho ne 41 ghantay study time complete kiya hai 21-day study streak ke sath!";
    } else if (lower.includes('bilal') || lower.includes('ahmed')) {
      reply = "Bilal Ahmed pichlay 5 din se inactive hain. Unka quiz score 62% hai aur unho ne sirf 8.5 ghantay study kiya hai. Inke parents ko foran report card bhejni chahiye.";
    } else if (lower.includes('top') || lower.includes('best') || lower.includes('laeq')) {
      reply = "Beaconhouse ke top students: Fatima Zahra 96%, Ali Hassan 94%, Sara Khan 88%, Hamza Tariq 84%, aur Mahnoor Raza 81% hain.";
    } else if (lower.includes('inactive') || lower.includes('parh nahi rahe')) {
      reply = "Is hafte 12 students inactive hain. Bilal Ahmed aur Zara Noor sab se zyada inactive hain. Inke parents ko WhatsApp alert bheja ja sakta hai.";
    } else if (lower.includes('certificate') || lower.includes('sanad')) {
      reply = "Beaconhouse mein abhi tak total 89 certificates issue ho chukay hain. 23 students ne videos complete kar li hain aur exam ke muntazir hain.";
    } else {
      reply = `Principal Sahab, aapne poocha: "${spokenText}". Main Beaconhouse ka AI Advisor hun. Kisi bhi student ka naam bolen ya "Top students" bolen, main mukammal report bol kar bataunga.`;
    }

    const jarvisMsg = { id: (Date.now() + 1).toString(), sender: 'jarvis' as const, text: reply, ts };
    setInstJarvisMessages(prev => [...prev, userMsg, jarvisMsg]);
    if (instVoiceEnabled) {
      speakInstJarvisText(reply);
    }
  };

  const [instJarvisMessages, setInstJarvisMessages] = useState<{ id: string; sender: 'admin' | 'jarvis'; text: string; ts: string }[]>([
    {
      id: '0',
      sender: 'jarvis',
      text: "Assalam-o-Alaikum! Main JARVIS hun — Beaconhouse International System ka AI Academic Advisor. 🏫\n\nMain aapke school ke kisi bhi student ki complete LMS report foran generate kar sakta hun.\n\nMisaal k tor par:\n• \"Ali Hassan ki complete report batao\"\n• \"Kaun se bache inactive hain?\"\n• \"Kitne certificates earn hue hain?\"\n• \"Top 5 bache kaun hain?\"\n• \"Is mahine attendance kya rahi?\"",
      ts: 'System',
    }
  ]);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#students') setActiveTab('students');
      else if (h === '#groups') setActiveTab('groups');
      else if (h === '#trainers') setActiveTab('trainers');
      else if (h === '#reports') setActiveTab('reports');
      else if (h === '#exams') setActiveTab('exams');
      else if (h === '#jarvis') setActiveTab('jarvis');
      else setActiveTab('overview');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const handleEnrollStudent = () => {
    if (!newStudentForm.name || !newStudentForm.rollNo) return;
    const ns = {
      id: Date.now(),
      rollNo: newStudentForm.rollNo,
      name: newStudentForm.name,
      batch: newStudentForm.batch,
      attendance: 100,
      gpa: 4.0,
      score: 100,
      status: 'excellent',
      avatar: newStudentForm.name.charAt(0).toUpperCase()
    };
    setStudents([ns, ...students]);
    setEnrollStudentOpen(false);
    setNewStudentForm({ name: '', rollNo: '', batch: 'Batch 2026-A: Full-Stack Web' });
  };

  const handleCreateBatch = () => {
    if (!newBatchForm.name || !newBatchForm.code) return;
    const nb = {
      id: Date.now(),
      code: newBatchForm.code,
      name: newBatchForm.name,
      trainer: newBatchForm.trainer,
      students: 0,
      maxSeats: Number(newBatchForm.maxSeats),
      progress: 0,
      room: newBatchForm.room,
      time: newBatchForm.time
    };
    setBatches([...batches, nb]);
    setCreateBatchOpen(false);
    setNewBatchForm({ name: '', code: '', trainer: 'Engr. Sarah Tariq', maxSeats: 30, room: 'Lab 03', time: 'Mon, Wed 11:00 AM' });
  };

  const filteredStudents = students.filter(s => {
    const matchBatch = batchFilter === 'all' || s.batch.includes(batchFilter);
    const matchSearch = s.name.toLowerCase().includes(searchStudent.toLowerCase()) || s.rollNo.toLowerCase().includes(searchStudent.toLowerCase());
    return matchBatch && matchSearch;
  });

  return (
    <div className="space-y-6">

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <>
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {INSTITUTE_DATA.name}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {}}
                className="px-4 py-2 rounded-xl bg-[#101010] border border-white/20 text-white font-bold text-xs shadow hover:bg-[#353638] transition-colors"
              >
                Export
              </button>
              <button
                onClick={() => setEnrollStudentOpen(true)}
                className="px-5 py-2 rounded-xl bg-[#50BED9] hover:bg-[#159BD7] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Enroll Student</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Enrolled Students', value: INSTITUTE_DATA.totalStudents, icon: Users, trend: '+28 new admissions' },
              { label: 'Active Batches', value: INSTITUTE_DATA.activeBatches, icon: Layers, trend: '4 labs running now' },
              { label: 'Assigned Trainers', value: INSTITUTE_DATA.assignedTrainers, icon: GraduationCap, trend: '100% faculty active' },
              { label: 'Campus Average', value: `${INSTITUTE_DATA.classAverage}%`, icon: Award, trend: '+3.2% vs last term' },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-[#101010] border border-white/10 rounded-2xl p-6 shadow-md transition-all hover:border-[#50BED9]/40">
                  <div className="w-10 h-10 rounded-xl bg-[#353638] border border-white/10 flex items-center justify-center mb-4 text-[#50BED9]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-[#D0D3D6]">{kpi.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{kpi.value}</p>
                  <p className="text-xs font-bold text-[#50BED9] mt-2">{kpi.trend}</p>
                </div>
              );
            })}
          </div>

          {/* Academic Performance Index & Campus Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
              <h3 className="font-black text-white text-base mb-5 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#50BED9]" />
                Institutional Academic Performance Index
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {[
                  { label: 'Avg Attendance', value: 94.2, max: 100, color: '#10b981', suffix: '%', icon: '📋' },
                  { label: 'Task Submission', value: 88.5, max: 100, color: '#50BED9', suffix: '%', icon: '📑' },
                  { label: 'Quiz Passing Rate', value: 91.0, max: 100, color: '#8b5cf6', suffix: '%', icon: '🎯' },
                  { label: 'Project Readiness', value: 85.4, max: 100, color: '#f59e0b', suffix: '%', icon: '🚀' },
                ].map((m) => {
                  const pct = (m.value / m.max) * 100;
                  const r = 38; const circ = 2 * Math.PI * r;
                  return (
                    <div key={m.label} className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
                          <circle cx="48" cy="48" r={r} fill="none" stroke={m.color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(pct/100)*circ} ${circ}`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-base">{m.icon}</span>
                          <span className="text-xs font-black text-white">{m.value}{m.suffix}</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-[#50BED9]/80 text-center mt-1 leading-tight">{m.label}</p>
                      <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                        <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: m.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gradient-to-r from-[#151515] to-[#b2dfdb] rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-black text-sm">Beaconhouse AI Advisory: Distinction Grade</p>
                  <p className="text-[#50BED9] text-xs font-semibold">Your campus holds the #1 position in curriculum completion across the Lahore district. 89% students eligible for NextGen Verified Industry Certificate.</p>
                </div>
              </div>
            </div>

            {/* Upcoming Exam Timetable */}
            <div className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#50BED9]" />
                  Upcoming Exams
                </h3>
                <button onClick={() => { window.location.hash = 'exams'; }} className="text-xs font-bold text-[#50BED9] hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {EXAMS_LIST.slice(0, 2).map(exam => (
                  <div key={exam.id} className="p-3.5 rounded-xl bg-[#353638] border border-white/10">
                    <p className="text-xs font-black text-white leading-tight">{exam.title}</p>
                    <p className="text-[10px] text-[#50BED9] font-semibold mt-0.5">{exam.batch} · {exam.date}</p>
                    <p className="text-[9px] text-[#50BED9]/70 font-semibold">{exam.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Batches & Top Students Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Batches Overview */}
            <div className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#50BED9]" />
                  Active Batches
                </h3>
                <button onClick={() => { window.location.hash = 'groups'; }} className="text-xs font-bold text-[#50BED9] hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {batches.slice(0, 3).map(batch => (
                  <div key={batch.id} className="p-3.5 rounded-xl bg-[#101010] border border-white/10 text-white border border-white/10 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#101010] text-white">{batch.code}</span>
                        <h4 className="font-black text-xs text-white mt-1">{batch.name}</h4>
                        <p className="text-[10px] text-[#50BED9] font-semibold">Lead: {batch.trainer}</p>
                      </div>
                      <span className="text-xs font-black text-white shrink-0">{batch.students}/{batch.maxSeats} Seats</span>
                    </div>
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[9px] font-bold text-[#50BED9] mb-1">
                        <span>Curriculum Progress</span>
                        <span>{batch.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-[#50BED9] to-[#50BED9]" style={{ width: `${batch.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Students Roster */}
            <div className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Honor Roll Students
                </h3>
                <button onClick={() => { window.location.hash = 'students'; }} className="text-xs font-bold text-[#50BED9] hover:underline">Full Roster</button>
              </div>
              <div className="space-y-3">
                {students.filter(s => s.status === 'excellent').slice(0, 3).map((stu, i) => (
                  <div key={stu.id} className="flex items-center gap-3.5 p-3 rounded-xl bg-[#353638] border border-white/10 border border-white/10">
                    <div className="w-9 h-9 rounded-xl bg-[#353638] border border-white/10 flex items-center justify-center text-white font-black text-xs shrink-0">
                      {stu.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-white text-xs">{stu.name}</p>
                      <p className="text-[10px] text-[#50BED9] font-semibold truncate">{stu.batch}</p>
                      <p className="text-[9px] text-[#50BED9]/60 font-semibold">{stu.rollNo} · {stu.attendance}% Attendance</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-[#50BED9]">{stu.score}%</p>
                      <p className="text-[10px] font-bold text-white">GPA {stu.gpa}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── STUDENTS TAB ─── */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-white">Student Enrolment Roster</h2>
              <p className="text-sm text-[#50BED9] font-semibold">{students.length} students enrolled across all campus batches</p>
            </div>
            <button
              onClick={() => setEnrollStudentOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm shadow hover:bg-[#50BED9] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Enroll New Student
            </button>
          </div>

          {/* Search & Batch Filter */}
          <div className="flex items-center justify-between gap-3 flex-wrap bg-[#101010] border border-white/10 text-white p-4 rounded-2xl border border-white/10 shadow-sm">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#50BED9]/50" />
              <input
                type="text"
                placeholder="Search by name or Roll No..."
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-white/10 text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'Full-Stack Web', 'Applied AI', 'Cloud DevOps', 'UI/UX Design'].map(b => (
                <button
                  key={b}
                  onClick={() => setBatchFilter(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all ${batchFilter === b ? 'bg-[#353638] border border-white/10 text-white' : 'bg-[#101010]/40 text-white hover:bg-[#101010]'}`}
                >
                  {b === 'all' ? 'All Batches' : b}
                </button>
              ))}
            </div>
          </div>

          {/* Student Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStudents.map(stu => (
              <div key={stu.id} className="bg-[#101010] border border-white/10 text-white rounded-2xl p-5 border border-white/10 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 ${stu.status === 'excellent' ? 'bg-[#50BED9]' : stu.status === 'good' ? 'bg-sky-600' : stu.status === 'average' ? 'bg-amber-500' : 'bg-red-500'}`}>
                    {stu.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-white text-sm">{stu.name}</h3>
                        <p className="text-[10px] font-bold text-[#50BED9]">{stu.rollNo}</p>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full capitalize ${stu.status === 'excellent' ? 'bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9]' : stu.status === 'good' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                        {stu.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#50BED9] font-semibold truncate mt-1">{stu.batch}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2 p-2 rounded-xl bg-[#353638] text-center text-[10px] font-bold">
                      <div>
                        <p className="text-white font-black">{stu.attendance}%</p>
                        <p className="text-[#50BED9]/70">Attendance</p>
                      </div>
                      <div>
                        <p className="text-white font-black">{stu.score}%</p>
                        <p className="text-[#50BED9]/70">Exam Score</p>
                      </div>
                      <div>
                        <p className="text-white font-black">{stu.gpa}</p>
                        <p className="text-[#50BED9]/70">GPA</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudentReport(stu)}
                      className="mt-3 w-full py-1.5 rounded-lg border border-white/10 text-white text-xs font-bold hover:bg-[#353638] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#50BED9]" />
                      Generate Official Report Card
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── BATCHES & GROUPS TAB ─── */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-white">Academic Batches & Lab Groups</h2>
              <p className="text-sm text-[#50BED9] font-semibold">{batches.length} official class cohorts scheduled for Session 2026</p>
            </div>
            <button
              onClick={() => setCreateBatchOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm shadow hover:bg-[#50BED9] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Batch
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {batches.map(batch => (
              <div key={batch.id} className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#101010] text-white">{batch.code}</span>
                  <span className="text-xs font-black text-white">{batch.students} / {batch.maxSeats} Students Enrolled</span>
                </div>
                <h3 className="font-black text-white text-base">{batch.name}</h3>
                <p className="text-xs text-[#50BED9] font-semibold mt-1">Lead Instructor: {batch.trainer}</p>
                <p className="text-[10px] text-[#50BED9]/70 font-semibold">{batch.room} · {batch.time}</p>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold text-[#50BED9] mb-1">
                    <span>Curriculum Syllabus Progress</span>
                    <span>{batch.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-[#50BED9] to-[#50BED9]" style={{ width: `${batch.progress}%` }} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-[#353638] border border-white/10 text-white text-xs font-black hover:bg-[#50BED9] transition-colors">
                    Manage Batch Cohort
                  </button>
                  <button className="px-3 py-2 rounded-xl border border-white/10 text-[#50BED9] text-xs font-bold hover:bg-[#353638] transition-colors">
                    Attendance Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── ASSIGNED TRAINERS TAB ─── */}
      {activeTab === 'trainers' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">Assigned Faculty & Mentors</h2>
            <p className="text-sm text-[#50BED9] font-semibold">Specialist trainers and engineering mentors leading campus cohorts</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {TRAINERS_LIST.map(trainer => (
              <div key={trainer.id} className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#323232] to-[#50BED9] flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md">
                  {trainer.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-white text-sm">{trainer.name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-white">{trainer.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#50BED9] font-semibold mt-0.5">{trainer.subject}</p>
                  <p className="text-[10px] text-[#50BED9]/60 font-semibold mt-1">{trainer.activeBatches} Active Batches · {trainer.hoursWeekly} Hours/Week</p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg bg-[#353638] border border-white/10 text-white text-[10px] font-black hover:bg-[#50BED9] transition-colors">
                      View Schedule
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-white/10 text-white text-[10px] font-bold hover:bg-[#353638] transition-colors">
                      Send Notice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PERFORMANCE REPORTS TAB ─── */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-white">Academic Performance Audits & Transcripts</h2>
              <p className="text-sm text-[#50BED9] font-semibold">Official institutional transcripts and evaluation statements</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm shadow hover:bg-[#50BED9] transition-colors">
              <Download className="w-4 h-4" />
              Export Full Campus Audit (CSV)
            </button>
          </div>

          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
            <h3 className="font-black text-white text-base mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#50BED9]" />
              Batch Term Performance Matrix
            </h3>
            <div className="space-y-4">
              {batches.map(batch => (
                <div key={batch.id} className="p-4 rounded-xl bg-[#353638] border border-white/10 flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-black text-xs text-white">{batch.code}: {batch.name}</p>
                    <p className="text-[10px] text-[#50BED9] font-semibold">Instructor: {batch.trainer} · {batch.students} Students</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-white bg-[#101010] border border-white/10 text-white px-3 py-1 rounded-lg border border-white/10">
                      Avg Score: 87.2%
                    </span>
                    <button
                      onClick={() => setSelectedStudentReport(students[0])}
                      className="px-3 py-1.5 rounded-xl bg-[#353638] border border-white/10 text-white text-xs font-black hover:bg-[#50BED9] transition-colors flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Reports
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── EXAMS & ATTENDANCE TAB ─── */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-white">Examinations & Final Evaluations</h2>
              <p className="text-sm text-[#50BED9] font-semibold">Scheduled practical evaluations, assessments and invigilation plans</p>
            </div>
          </div>

          <div className="space-y-4">
            {EXAMS_LIST.map(exam => (
              <div key={exam.id} className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#101010] text-white">{exam.batch}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9]">Pass Req: {exam.passingCriteria}</span>
                  </div>
                  <h3 className="font-black text-white text-base">{exam.title}</h3>
                  <p className="text-xs text-[#50BED9] font-semibold mt-1">Supervisor: {exam.supervisor} · Venue: {exam.venue}</p>
                  <p className="text-[10px] text-[#50BED9]/70 font-semibold">{exam.date} · {exam.time}</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-[#353638] border border-white/10 text-white text-xs font-black hover:bg-[#50BED9] transition-colors">
                  Examination Roster
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ─── SCHOOL ADMIN JARVIS TAB ─── */}
      {activeTab === 'jarvis' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>🤖</span> JARVIS — School Academic Intelligence
            </h2>
            <p className="text-sm text-[#50BED9] font-semibold">Ask about any student by name — JARVIS will show their complete LMS report card instantly</p>
          </div>

          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col" style={{ height: '560px' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#323232] to-[#50BED9] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#101010]/20 border border-[#151515]/30 flex items-center justify-center text-xl">🤖</div>
              <div>
                <p className="text-white font-black text-sm">JARVIS — Beaconhouse School AI</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-[10px] font-semibold">420 Students Data Access • Parent Report Ready</span>
                </div>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="p-3 border-b border-white/10 flex gap-2 flex-wrap bg-[#101010]/20">
              {[
                '👤 Ali Hassan ki report',
                '👤 Fatima Zahra ki report',
                '👤 Bilal Ahmed ki report',
                '🏆 Top 5 bache',
                '⚠️ Inactive students',
                '🎓 Certificates issued',
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => {
                    const schoolResponses: Record<string, string> = {
                      '👤 Ali Hassan ki report': '📋 **ALI HASSAN — Complete LMS Report Card**\n🏫 Beaconhouse International System (Roll #: BH-2026-089)\n📚 Grade 11 ICS\n\n**📹 Video Lectures:**\n• Next.js 15: 38/42 videos watched (90%)\n• Applied AI: 22/36 videos watched (61%)\n• Total Watch Time: **34 hours**\n\n**🎯 AI Exam Results:**\n• Next.js Final Exam: 94% ✅ PASSED (1st attempt)\n• Cloud DevOps Quiz: 88% ✅ PASSED\n• AI/ML Mid-Term: Pending\n\n**🏆 Badges Earned: 6**\n🥇 Next.js 15 Master | 🤖 AI Pioneer | ☁️ Cloud Explorer | 🔥 14-Day Streak | ⚡ Speed Demon | 🛡️ Security Defender\n\n**📜 Certificates: 2** (Next.js 15 & Cloud DevOps)\n**⭐ Level: 4 — Full-Stack Architect**\n**🔥 Study Streak: 14 Days**\n\n🟢 **Status: EXCELLENT — Top 1% of class**',
                      '👤 Fatima Zahra ki report': '📋 **FATIMA ZAHRA — Complete LMS Report Card**\n🏫 Beaconhouse International System (Roll #: BH-2026-004)\n📚 Grade 11 FSc Pre-Engineering\n\n**📹 Video Lectures:**\n• Cloud DevOps: 28/28 videos watched (100%) ⭐\n• Applied AI: 31/36 videos watched (86%)\n• Total Watch Time: **41 hours**\n\n**🎯 AI Exam Results:**\n• Cloud DevOps Final: 96% ✅ PASSED (1st attempt)\n• AI/ML Midterm: 91% ✅ PASSED\n\n**🏆 Badges Earned: 5**\n☁️ Cloud Master | 🤖 AI Scholar | 🔥 21-Day Streak | ⭐ Perfect Score | 🎯 Consistent Learner\n\n**📜 Certificates: 2** (Cloud DevOps & AI Fundamentals)\n**⭐ Level: 5 — Tech Master** (Highest Level!)\n**🔥 Study Streak: 21 Days**\n\n🟢 **Status: OUTSTANDING — Class Topper**',
                      '👤 Bilal Ahmed ki report': '📋 **BILAL AHMED — Complete LMS Report Card**\n🏫 Beaconhouse International System (Roll #: BH-2026-005)\n📚 Grade 11 ICS\n\n**📹 Video Lectures:**\n• Applied AI: 14/36 videos watched (39%)\n• Next.js: 8/42 videos watched (19%)\n• Total Watch Time: **8.5 hours**\n\n**🎯 AI Exam Results:**\n• AI/ML Quiz 1: 62% ❌ FAILED (needs re-attempt)\n• Next.js Quiz 1: Not attempted\n\n**🏆 Badges Earned: 0**\n\n**📜 Certificates: 0**\n**⭐ Level: 1 — Beginner**\n**🔥 Study Streak: Broken (2 days inactive)**\n\n🔴 **Status: NEEDS ATTENTION — Immediate parent notification recommended**\n\n💡 JARVIS Recommendation: Please contact Bilal\'s parents. He needs motivation and structured study schedule.',
                      '🏆 Top 5 bache': '🏆 **BEACONHOUSE TOP 5 STUDENTS — August 2026:**\n\n🥇 1. Fatima Zahra (BH-2026-004)\n   Level 5 | Score: 96% | 2 Certificates | 21-day streak\n\n🥈 2. Ali Hassan (BH-2026-001)\n   Level 4 | Score: 94% | 2 Certificates | 14-day streak\n\n🥉 3. Sara Khan (BH-2026-002)\n   Level 3 | Score: 88% | 1 Certificate | 8-day streak\n\n4️⃣ 4. Hamza Tariq (BH-2026-007)\n   Level 3 | Score: 84% | 1 Certificate\n\n5️⃣ 5. Mahnoor Raza (BH-2026-008)\n   Level 3 | Score: 81% | 1 Certificate\n\n💡 These 5 students are eligible for **Distinction Award** this semester!',
                      '⚠️ Inactive students': '⚠️ **INACTIVE STUDENTS ALERT — Last 7 Days:**\n\n📊 Inactive Count: **12 students** (2.9% of 420)\n\n**Students who haven\'t logged in:**\n• Bilal Ahmed (BH-2026-005) — 5 days inactive 🔴\n• Zara Noor (BH-2026-006) — 4 days inactive 🔴\n• Usman Malik (BH-2026-003) — 3 days inactive 🟡\n• [+ 9 more students]\n\n**JARVIS Recommended Actions:**\n1. 📱 Send WhatsApp reminder to parents of 🔴 students\n2. 🏫 Speak with class teacher to check physical attendance\n3. 🔑 Check if their school passcode is still valid\n\n📄 **1-Click Parent Notification** available in Students tab!',
                      '🎓 Certificates issued': '🎓 **BEACONHOUSE CERTIFICATES REPORT:**\n\n📜 Total Certificates Issued: **89**\n\n**By Course:**\n• Next.js 15 Full-Stack: **34 certificates**\n• Cloud DevOps & Docker: **28 certificates**\n• Applied AI & ML: **18 certificates**\n• UI/UX Design: **9 certificates**\n\n**This Month New: +14 certificates** 📈\n\n**Eligible but pending exam:**\n• 23 students completed all videos but haven\'t attempted final AI exam\n\n💡 JARVIS Tip: Remind these 23 students to appear in final exam — they can earn certificates this week!',
                    };
                    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    const replyText = schoolResponses[prompt] || 'Query analyze ho rahi hai...';
                    const m1 = { id: Date.now().toString(), sender: 'admin' as const, text: prompt, ts };
                    const m2 = { id: (Date.now() + 1).toString(), sender: 'jarvis' as const, text: replyText, ts };
                    setInstJarvisMessages(prev => [...prev, m1, m2]);
                    if (instVoiceEnabled) {
                      speakInstJarvisText(replyText);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#101010] border border-white/10 text-white border border-white/10 text-white text-xs font-bold hover:bg-[#101010] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {instJarvisMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.sender === 'admin'
                      ? 'bg-[#353638] border border-white/10 text-white rounded-tr-none'
                      : 'bg-[#101010]/40 text-white border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.sender === 'jarvis' && <p className="text-[10px] font-black text-[#50BED9] mb-1">🤖 JARVIS School AI</p>}
                    {msg.text}
                    {msg.sender === 'jarvis' && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => speakInstJarvisText(msg.text)}
                          title="Hear JARVIS Speak this report aloud"
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#353638] text-[#50BED9] border border-white/10 hover:bg-emerald-200 text-[#50BED9] text-[10px] font-black transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#50BED9]" />
                          <span>Play Voice 🔊</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Active Audio Recording Bar with Waveform & Live Timer */}
            {instJarvisListening && (
              <div className="px-4 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-t border-red-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#101010] border border-white/10 text-white text-red-600 flex items-center justify-center animate-pulse shadow-lg font-black text-sm">
                    🎙️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#101010] border border-white/10 text-white animate-ping" />
                      <p className="font-black text-xs uppercase tracking-wider text-white">
                        🔴 Recording Principal/Admin Voice ({instRecSeconds < 10 ? `00:0${instRecSeconds}` : `00:${instRecSeconds}`})
                      </p>
                    </div>
                    <p className="text-xs font-bold text-red-100 mt-0.5 max-w-md truncate">
                      {instLiveTranscript ? `"${instLiveTranscript}"` : 'Speak student name or query into microphone...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-1 bg-[#101010] border border-white/10 text-white h-4 animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 bg-[#101010] border border-white/10 text-white h-7 animate-pulse" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1 bg-[#101010] border border-white/10 text-white h-5 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 bg-[#101010] border border-white/10 text-white h-8 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>

                <button
                  type="button"
                  onClick={() => stopInstVoiceAndSend()}
                  className="px-4 py-2 rounded-xl bg-[#101010] border border-white/10 text-white hover:bg-[#353638] border border-white/10 text-red-700 font-black text-xs shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <span>⏹️ Stop & Send Audio</span>
                </button>
              </div>
            )}

            {instJarvisSpeaking && (
              <div className="px-4 py-2 bg-[#353638] border border-white/10 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#50BED9] font-black text-xs">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>🔊 JARVIS is speaking out loud...</span>
                </div>
                <button
                  type="button"
                  onClick={stopInstSpeaking}
                  className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] font-black"
                >
                  Stop Voice ⏹️
                </button>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/10 flex gap-2 bg-[#101010] border border-white/10 text-white items-center">
              <button
                type="button"
                onClick={instJarvisListening ? () => stopInstVoiceAndSend() : startInstVoiceInput}
                className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  instJarvisListening
                    ? 'bg-red-600 text-white animate-bounce'
                    : 'bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{instJarvisListening ? 'Listening...' : 'Speak to JARVIS'}</span>
              </button>

              <input
                type="text"
                value={instJarvisInput}
                onChange={e => setInstJarvisInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && instJarvisInput.trim()) {
                    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    const userMsg = { id: Date.now().toString(), sender: 'admin' as const, text: instJarvisInput, ts };
                    const lower = instJarvisInput.toLowerCase();
                    let reply = '';
                    if (lower.includes('ali') || lower.includes('hassan')) {
                      reply = '📋 **Ali Hassan (BH-2026-089):** Level 4, 94% score, 34 hrs study time, 6 badges, 2 certificates. 14-day streak. Status: EXCELLENT 🟢';
                    } else if (lower.includes('fatima') || lower.includes('zahra')) {
                      reply = '📋 **Fatima Zahra (BH-2026-004):** Level 5 Master, 96% score, 41 hrs study time, 5 badges, 2 certificates. 21-day streak. Class Topper! 🥇';
                    } else if (lower.includes('bilal') || lower.includes('ahmed')) {
                      reply = '📋 **Bilal Ahmed (BH-2026-005):** Level 1, 62% score, 8.5 hrs study time, 0 badges. INACTIVE 5 days. Parent notification recommended. 🔴';
                    } else if (lower.includes('sara') || lower.includes('khan')) {
                      reply = '📋 **Sara Khan (BH-2026-002):** Level 3, 88% score, 22 hrs study time, 4 badges, 1 certificate. Status: GOOD 🟢';
                    } else if (lower.includes('certificate') || lower.includes('sanad')) {
                      reply = '🎓 Beaconhouse mein abhi tak **89 certificates** issued hue hain. Is mahine **14 new** certificates generate hue. 23 students eligible hain lekin final exam nahi diya.';
                    } else if (lower.includes('inactive') || lower.includes('active nahi')) {
                      reply = '⚠️ Is hafte **12 students** inactive hain. Bilal Ahmed (5 days) aur Zara Noor (4 days) sabse zyada inactive hain. Parent notification bhejni chahiye.';
                    } else if (lower.includes('top') || lower.includes('best')) {
                      reply = '🏆 Top Students: 1. Fatima Zahra (96%) 2. Ali Hassan (94%) 3. Sara Khan (88%) 4. Hamza Tariq (84%) 5. Mahnoor Raza (81%)';
                    } else {
                      reply = `🤖 "${instJarvisInput}" ke baare mein:\n\nStudent ka naam likh kar unki full report mangwayein! Jaise:\n• "Ali Hassan ki report"\n• "Sara Khan ki details"\n\nYa general queries:\n• "Top students", "Inactive students", "Certificates"`;
                    }
                    const jarvisMsg = { id: (Date.now() + 1).toString(), sender: 'jarvis' as const, text: reply, ts };
                    setInstJarvisMessages(prev => [...prev, userMsg, jarvisMsg]);
                    setInstJarvisInput('');
                  }
                }}
                placeholder='e.g. "Ali Hassan ki complete report batao" ya "Top 5 students"'
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
              />
              <button
                className="px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 text-white text-xs font-black hover:bg-[#50BED9] transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ENROLL STUDENT MODAL ─── */}
      {enrollStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-black text-white text-base">Enroll Student</h3>
              <button onClick={() => setEnrollStudentOpen(false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Zaid Khan"
                  value={newStudentForm.name}
                  onChange={e => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. BH-2026-009"
                  value={newStudentForm.rollNo}
                  onChange={e => setNewStudentForm({ ...newStudentForm, rollNo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Assign Batch</label>
                <select
                  value={newStudentForm.batch}
                  onChange={e => setNewStudentForm({ ...newStudentForm, batch: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.name}>{b.code}: {b.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleEnrollStudent}
                disabled={!newStudentForm.name || !newStudentForm.rollNo}
                className="w-full py-3 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm hover:bg-[#50BED9] transition-colors disabled:opacity-40"
              >
                Enroll Student in Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CREATE BATCH MODAL ─── */}
      {createBatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-black text-white text-base">Create Cohort Batch</h3>
              <button onClick={() => setCreateBatchOpen(false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Batch Name</label>
                <input
                  type="text"
                  placeholder="e.g. Full-Stack Web Development 2026"
                  value={newBatchForm.name}
                  onChange={e => setNewBatchForm({ ...newBatchForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-white block mb-1.5">Batch Code</label>
                  <input
                    type="text"
                    placeholder="e.g. BATCH-2026-E"
                    value={newBatchForm.code}
                    onChange={e => setNewBatchForm({ ...newBatchForm, code: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-white block mb-1.5">Max Capacity</label>
                  <input
                    type="number"
                    value={newBatchForm.maxSeats}
                    onChange={e => setNewBatchForm({ ...newBatchForm, maxSeats: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Lead Instructor</label>
                <select
                  value={newBatchForm.trainer}
                  onChange={e => setNewBatchForm({ ...newBatchForm, trainer: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                >
                  {TRAINERS_LIST.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCreateBatch}
                disabled={!newBatchForm.name || !newBatchForm.code}
                className="w-full py-3 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm hover:bg-[#50BED9] transition-colors disabled:opacity-40"
              >
                Provision Batch & Assign Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── OFFICIAL REPORT CARD MODAL ─── */}
      {selectedStudentReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#101010] border border-white/10 text-white rounded-3xl w-full max-w-lg shadow-2xl border-4 border-white/10 p-6 relative">
            <button
              onClick={() => setSelectedStudentReport(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Certificate / Transcript Header */}
            <div className="text-center pb-4 border-b-2 border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#353638] border border-white/10 flex items-center justify-center text-white font-black text-xl mx-auto mb-2 shadow-md">
                B
              </div>
              <h3 className="font-black text-white text-lg">{INSTITUTE_DATA.name}</h3>
              <p className="text-xs font-bold text-[#50BED9]">{INSTITUTE_DATA.campus} · Official Academic Transcript</p>
            </div>

            <div className="my-5 space-y-3">
              <div className="flex justify-between text-xs font-bold py-1 border-b border-gray-100">
                <span className="text-slate-400">Student Name:</span>
                <span className="text-white font-black">{selectedStudentReport.name}</span>
              </div>
              <div className="flex justify-between text-xs font-bold py-1 border-b border-gray-100">
                <span className="text-slate-400">Roll Number:</span>
                <span className="text-white">{selectedStudentReport.rollNo}</span>
              </div>
              <div className="flex justify-between text-xs font-bold py-1 border-b border-gray-100">
                <span className="text-slate-400">Enrolled Batch:</span>
                <span className="text-white">{selectedStudentReport.batch}</span>
              </div>
              <div className="flex justify-between text-xs font-bold py-1 border-b border-gray-100">
                <span className="text-slate-400">Attendance Log:</span>
                <span className="text-[#50BED9] font-black">{selectedStudentReport.attendance}% Attended</span>
              </div>
              <div className="flex justify-between text-xs font-bold py-1 border-b border-gray-100">
                <span className="text-slate-400">Evaluation Score:</span>
                <span className="text-[#50BED9] font-black">{selectedStudentReport.score}% (Grade A+)</span>
              </div>
              <div className="flex justify-between text-xs font-bold py-1 border-b border-gray-100">
                <span className="text-slate-400">Cumulative GPA:</span>
                <span className="text-white font-black">{selectedStudentReport.gpa} / 4.0</span>
              </div>
            </div>

            <div className="p-3 bg-[#101010]/40 rounded-xl text-center mb-5">
              <p className="text-[11px] font-bold text-white">
                Verified by NextGen LMS Credential Engine · Seal ID: NG-BHS-2026-X8
              </p>
            </div>

            <button
              onClick={() => {
                alert('Academic Transcript downloaded as verified PDF.');
                setSelectedStudentReport(null);
              }}
              className="w-full py-3 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm hover:bg-[#50BED9] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Official PDF Transcript
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
