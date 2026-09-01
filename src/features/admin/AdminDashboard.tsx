'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  LayoutDashboard, BookOpen, Users, Building2, BarChart3,
  DollarSign, ShieldCheck, CheckCircle2, XCircle, AlertCircle,
  Clock, Plus, Search, Filter, Download, Eye, Edit3, Trash2,
  TrendingUp, TrendingDown, Star, Sparkles, Bell, ArrowUpRight,
  Activity, Globe, Lock, Unlock, RefreshCw, Check, X, Award,
  GraduationCap, FileText, UserPlus, Layers, Server, Video,
  Upload, Play, FolderPlus, Link as LinkIcon, Sparkle, Bot
 , Mic, MicOff, Volume2, VolumeX, ScanLine} from 'lucide-react';
import QRAttendanceScanner from '@/components/admin/QRAttendanceScanner';

type AdminTab = 'overview' | 'studio' | 'courses' | 'users' | 'institutes' | 'finance' | 'analytics' | 'attendance' | 'jarvis';

const PLATFORM_STATS = {
  totalLearners: 1480,
  totalVideos: 124,
  partnerInstitutes: 24,
  activeCourses: 8,
  grossRevenue: 3840000,
  monthRevenue: 520000,
  serverUptime: '99.98%',
};

const INITIAL_COURSES = [
  { id: 1, title: 'Full-Stack Next.js 15 & React 19 Mastery', category: 'Web Dev', videos: 42, duration: '38h', students: 580, status: 'published', thumbnail: '🌐' },
  { id: 2, title: 'Applied Generative AI & Agentic Architectures', category: 'AI & Data', videos: 36, duration: '28h', students: 460, status: 'published', thumbnail: '🤖' },
  { id: 3, title: 'Cloud DevOps, Docker & Kubernetes CI/CD', category: 'Cloud', videos: 28, duration: '22h', students: 320, status: 'published', thumbnail: '☁️' },
  { id: 4, title: 'Cybersecurity Fundamentals & Network Defense', category: 'Security', videos: 18, duration: '14h', students: 190, status: 'draft', thumbnail: '🛡️' },
  { id: 5, title: 'UI/UX Design Systems & Figma Tokens', category: 'Design', videos: 24, duration: '18h', students: 140, status: 'published', thumbnail: '🎨' },
];

const INITIAL_VIDEOS = [
  { id: 1, courseId: 1, courseTitle: 'Next.js 15 Mastery', module: 'Module 1: Server Components', title: '01. React Server Components vs Client Components Deep Dive', duration: '18:45', size: '240 MB', uploaded: '2 days ago', status: 'ready', views: 890 },
  { id: 2, courseId: 1, courseTitle: 'Next.js 15 Mastery', module: 'Module 1: Server Components', title: '02. Streaming SSR & Suspense Boundaries Architecture', duration: '22:10', size: '310 MB', uploaded: '3 days ago', status: 'ready', views: 740 },
  { id: 3, courseId: 1, courseTitle: 'Next.js 15 Mastery', module: 'Module 2: Server Actions', title: '03. Form Mutations, Optimistic UI & Server Actions', duration: '25:30', size: '360 MB', uploaded: '4 days ago', status: 'ready', views: 680 },
  { id: 4, courseId: 2, courseTitle: 'Applied Generative AI', module: 'Module 1: Embeddings', title: '01. Vector Embeddings, Cosine Similarity & Pinecone', duration: '31:15', size: '420 MB', uploaded: '1 week ago', status: 'ready', views: 560 },
  { id: 5, courseId: 2, courseTitle: 'Applied Generative AI', module: 'Module 2: Agents', title: '02. Building Autonomous AI Agents with LangChain & LangGraph', duration: '28:50', size: '390 MB', uploaded: '1 week ago', status: 'ready', views: 510 },
  { id: 6, courseId: 3, courseTitle: 'Cloud DevOps', module: 'Module 1: Containers', title: '01. Multi-Stage Dockerfiles & Alpine Linux Optimization', duration: '19:40', size: '280 MB', uploaded: '2 weeks ago', status: 'ready', views: 420 },
];

const INITIAL_USERS = [
  { id: 1, name: 'Ali Hassan', email: 'ali.hassan@gmail.com', role: 'learner', institute: 'Beaconhouse Lahore', status: 'active', joined: '12 Jan 2026', courses: 4, avatar: 'A' },
  { id: 2, name: 'Sara Khan', email: 'sara.khan@gmail.com', role: 'learner', institute: 'Roots Islamabad', status: 'active', joined: '15 Jan 2026', courses: 3, avatar: 'S' },
  { id: 3, name: 'Beaconhouse Principal Office', email: 'admin@beaconhouse.edu.pk', role: 'institute', institute: 'Beaconhouse Lahore', status: 'active', joined: '05 Jan 2026', courses: 14, avatar: 'B' },
  { id: 4, name: 'Roots Millennium Admin', email: 'lms@millennium.edu.pk', role: 'institute', institute: 'Roots Islamabad', status: 'active', joined: '10 Feb 2026', courses: 8, avatar: 'R' },
  { id: 5, name: 'Usman Farooq', email: 'usman.f@outlook.com', role: 'learner', institute: 'FAST Karachi', status: 'suspended', joined: '18 Jan 2026', courses: 1, avatar: 'U' },
  { id: 6, name: 'Fatima Zahra', email: 'fatima.zahra@yahoo.com', role: 'learner', institute: 'Beaconhouse Lahore', status: 'active', joined: '22 Jan 2026', courses: 5, avatar: 'F' },
  { id: 7, name: 'FAST NUCES CS Directorate', email: 'cs.admin@nu.edu.pk', role: 'institute', institute: 'FAST Karachi', status: 'active', joined: '02 Feb 2026', courses: 12, avatar: 'N' },
];

const INSTITUTES_LIST = [
  { id: 1, name: 'Beaconhouse International System', campus: 'Lahore Main Campus', students: 420, batches: 14, plan: 'Enterprise Pro', renewal: 'Dec 2026', status: 'active', logo: '🏫' },
  { id: 2, name: 'Roots Millennium School & College', campus: 'Islamabad Capital Campus', students: 310, batches: 10, plan: 'Enterprise Pro', renewal: 'Nov 2026', status: 'active', logo: '🏛️' },
  { id: 3, name: 'FAST-NUCES Faculty of Computing', campus: 'Karachi Campus', students: 580, batches: 18, plan: 'University Custom', renewal: 'Jan 2027', status: 'active', logo: '🎓' },
  { id: 4, name: 'Army Public College & University', campus: 'Rawalpindi Campus', students: 240, batches: 8, plan: 'Standard School', renewal: 'Oct 2026', status: 'active', logo: '🏢' },
];

const REVENUE_MONTHS = [
  { month: 'Mar', gross: 280000 }, { month: 'Apr', gross: 360000 },
  { month: 'May', gross: 420000 }, { month: 'Jun', gross: 390000 },
  { month: 'Jul', gross: 490000 }, { month: 'Aug', gross: 520000 },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [institutes, setInstitutes] = useState(INSTITUTES_LIST);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [uploadVideoOpen, setUploadVideoOpen] = useState(false);
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addInstituteOpen, setAddInstituteOpen] = useState(false);

  // Forms
  const [newVideoForm, setNewVideoForm] = useState({
    title: '', courseId: '1', module: 'Module 1: Fundamentals', duration: '20:00', videoUrl: ''
  });
  const [newCourseForm, setNewCourseForm] = useState({
    title: '', category: 'Web Dev', description: '', thumbnail: '🚀'
  });
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'learner' });
  const [newInstForm, setNewInstForm] = useState({ name: '', campus: '', plan: 'Enterprise Pro', students: 100 });
  const [adminJarvisInput, setAdminJarvisInput] = useState('');
  const [adminJarvisListening, setAdminJarvisListening] = useState(false);
  const [adminJarvisSpeaking, setAdminJarvisSpeaking] = useState(false);
  const [adminVoiceEnabled, setAdminVoiceEnabled] = useState(true);
  const [adminLiveTranscript, setAdminLiveTranscript] = useState('');
  const [adminRecognition, setAdminRecognition] = useState<any>(null);

  const speakAdminJarvisText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`]/g, '').replace(/\n/g, '. ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    utterance.onstart = () => setAdminJarvisSpeaking(true);
    utterance.onend = () => setAdminJarvisSpeaking(false);
    utterance.onerror = () => setAdminJarvisSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopAdminSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setAdminJarvisSpeaking(false);
  };

  const [adminRecSeconds, setAdminRecSeconds] = useState(0);
  const adminMediaStream = React.useRef<MediaStream | null>(null);
  const adminRecTimer = React.useRef<any>(null);
  const adminCapturedWords = React.useRef<string>('');

  const startAdminVoiceInput = async () => {
    if (typeof window === 'undefined') return;
    stopAdminSpeaking();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      adminMediaStream.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(250);

      setAdminJarvisListening(true);
      setAdminRecSeconds(0);
      setAdminLiveTranscript('');
      adminCapturedWords.current = '';

      if (adminRecTimer.current) clearInterval(adminRecTimer.current);
      adminRecTimer.current = setInterval(() => {
        setAdminRecSeconds(s => s + 1);
      }, 1000);

      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const recognition = new SpeechRec();
          recognition.lang = 'ur-PK';
          recognition.continuous = true;
          recognition.interimResults = true;
          setAdminRecognition(recognition);

          recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) final += event.results[i][0].transcript;
              else interim += event.results[i][0].transcript;
            }
            const text = (final || interim).trim();
            if (text) {
              adminCapturedWords.current = text;
              setAdminLiveTranscript(text);
              setAdminJarvisInput(text);
            }
          };
          recognition.onerror = () => {};
          recognition.start();
        } catch {}
      }
    } catch (err) {
      console.error(err);
      alert('Microphone permission required! Please allow microphone access in your browser.');
      setAdminJarvisListening(false);
    }
  };

  const stopAdminVoiceAndSend = (textToSend?: string) => {
    if (adminRecTimer.current) clearInterval(adminRecTimer.current);
    if (adminRecognition) {
      try { adminRecognition.stop(); } catch {}
    }
    if (adminMediaStream.current) {
      adminMediaStream.current.getTracks().forEach(track => track.stop());
    }
    setAdminJarvisListening(false);

    const captured = (textToSend || adminCapturedWords.current || adminLiveTranscript || adminJarvisInput).trim();
    if (captured) {
      handleAdminVoiceQuery(captured);
    } else {
      const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const noVoice = { id: Date.now().toString(), sender: 'jarvis' as const, text: 'Aapki awaz clear nahi aayi. Baraye meharbani dobara bolein ya platform query type karein!', ts };
      setAdminJarvisMessages(prev => [...prev, noVoice]);
      if (adminVoiceEnabled) {
        speakAdminJarvisText('Aapki awaz clear nahi aayi. Baraye meharbani dobara bolein ya platform query type karein.');
      }
    }
    setAdminLiveTranscript('');
    setAdminJarvisInput('');
    setAdminRecSeconds(0);
  };

  const handleAdminVoiceQuery = (spokenText: string) => {
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now().toString(), sender: 'admin' as const, text: spokenText, ts };
    const lower = spokenText.toLowerCase();
    let reply = '';
    if (lower.includes('school') || lower.includes('misaali') || lower.includes('beaconhouse') || lower.includes('fast')) {
      reply = "Misaali School aur Beaconhouse ke 420 enrolled students hain. Next.js course mein 67% average completion hai, aur total 24 certificates issue ho chukay hain. Top performer Ali Hassan aur Fatima Zahra hain.";
    } else if (lower.includes('certificate') || lower.includes('sanad')) {
      reply = "Platform-wide total 284 certificates issue ho chukay hain. Is mahine 42 naye certificates generate hue hain. Sab se zyada certificates Beaconhouse Lahore ke students ne earn kiye hain.";
    } else if (lower.includes('revenue') || lower.includes('paise') || lower.includes('earning') || lower.includes('income')) {
      reply = "August 2026 ki gross revenue 5 lakh 20 hazar rupaye hai. Army Public College ka 1 lakh 20 hazar payment pending hai, jo 10 tareeq ko auto-lock ho jaye ga.";
    } else if (lower.includes('overview') || lower.includes('summary') || lower.includes('halat')) {
      reply = "NextGen LMS par is waqt 1,480 students active hain, 4 partner schools hain, aur 128 video lectures uploaded hain. Server uptime 99.98% hai.";
    } else {
      reply = `Super Admin, aapne poocha: "${spokenText}". Platform data analysis ke mutabiq tamam services theek kaam kar rahi hain.`;
    }

    const jarvisMsg = { id: (Date.now() + 1).toString(), sender: 'jarvis' as const, text: reply, ts };
    setAdminJarvisMessages(prev => [...prev, userMsg, jarvisMsg]);
    if (adminVoiceEnabled) {
      speakAdminJarvisText(reply);
    }
  };

  const [adminJarvisMessages, setAdminJarvisMessages] = useState<{ id: string; sender: 'admin' | 'jarvis'; text: string; ts: string }[]>([
    {
      id: '0',
      sender: 'jarvis',
      text: "Assalam-o-Alaikum! Main JARVIS hun — NextGen LMS ka Super Admin AI Engine. 🤖\n\nMain aapko platform ki koi bhi school, student ya financial data foran analyze karke de sakta hun.\n\nMisaal k tor par:\n• \"Misaali School ke saare bache batao\"\n• \"Kitne certificates issue hue hain?\"\n• \"This month ki revenue kya hai?\"\n• \"Beaconhouse ke top students kon hain?\"",
      ts: 'System',
    }
  ]);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#studio') setActiveTab('studio');
      else if (h === '#courses') setActiveTab('courses');
      else if (h === '#institutes') setActiveTab('institutes');
      else if (h === '#users') setActiveTab('users');
      else if (h === '#finance') setActiveTab('finance');
      else if (h === '#analytics') setActiveTab('analytics');
      else if (h === '#attendance') setActiveTab('attendance');
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

  const handleUploadVideo = () => {
    if (!newVideoForm.title) return;
    const courseObj = courses.find(c => c.id === Number(newVideoForm.courseId)) || courses[0];
    const nv = {
      id: Date.now(),
      courseId: courseObj.id,
      courseTitle: courseObj.title,
      module: newVideoForm.module,
      title: newVideoForm.title,
      duration: newVideoForm.duration || '15:00',
      size: '250 MB',
      uploaded: 'Just now',
      status: 'ready',
      views: 0
    };
    setVideos([nv, ...videos]);
    setUploadVideoOpen(false);
    setNewVideoForm({ title: '', courseId: '1', module: 'Module 1: Fundamentals', duration: '20:00', videoUrl: '' });
  };

  const handleCreateCourse = () => {
    if (!newCourseForm.title) return;
    const nc = {
      id: Date.now(),
      title: newCourseForm.title,
      category: newCourseForm.category,
      videos: 0,
      duration: '0h',
      students: 0,
      status: 'published',
      thumbnail: newCourseForm.thumbnail || '🚀'
    };
    setCourses([...courses, nc]);
    setCreateCourseOpen(false);
    setNewCourseForm({ title: '', category: 'Web Dev', description: '', thumbnail: '🚀' });
  };

  const handleCreateUser = () => {
    if (!newUserForm.name || !newUserForm.email) return;
    const nu = {
      id: Date.now(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role as any,
      institute: 'General Enrollment',
      status: 'active',
      joined: 'Just now',
      courses: 0,
      avatar: newUserForm.name.charAt(0).toUpperCase()
    };
    setUsers([nu, ...users]);
    setAddUserOpen(false);
    setNewUserForm({ name: '', email: '', role: 'learner' });
  };

  const handleCreateInstitute = () => {
    if (!newInstForm.name || !newInstForm.campus) return;
    const ni = {
      id: Date.now(),
      name: newInstForm.name,
      campus: newInstForm.campus,
      students: Number(newInstForm.students),
      batches: 2,
      plan: newInstForm.plan,
      renewal: 'Aug 2027',
      status: 'active',
      logo: '🏫'
    };
    setInstitutes([ni, ...institutes]);
    setAddInstituteOpen(false);
    setNewInstForm({ name: '', campus: '', plan: 'Enterprise Pro', students: 100 });
  };

  const handleDeleteVideo = (id: number) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const filteredVideos = videos.filter(v => {
    if (selectedCourseFilter === 'all') return true;
    return v.courseId === Number(selectedCourseFilter);
  });

  const filteredUsers = users.filter(u => {
    const matchRole = userFilter === 'all' || u.role === userFilter;
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  const maxGross = Math.max(...REVENUE_MONTHS.map(m => m.gross));

  return (
    <div className="space-y-6">

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Bar matching reference image */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              LMS Administration Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {}}
                className="px-4 py-2 rounded-xl bg-[#101010] border border-white/20 text-white font-bold text-xs shadow hover:bg-[#353638] transition-colors"
              >
                Export
              </button>
              <button
                onClick={() => setCreateCourseOpen(true)}
                className="px-5 py-2 rounded-xl bg-[#50BED9] hover:bg-[#159BD7] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Course</span>
              </button>
            </div>
          </div>

          {/* 4 Top KPI Cards (Matching Image Exactly) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Learners', value: '24,860', icon: Users, trend: '+6.8% vs prior period' },
              { label: 'Course Completion', value: '78.4%', icon: BarChart3, trend: '+4.2% vs prior period' },
              { label: 'Pending Reviews', value: '312', icon: Activity, trend: '+41 vs prior period' },
              { label: 'Certificates Issued', value: '9,428', icon: Award, trend: '+12.1% vs prior period' },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="bg-[#101010] border border-white/10 rounded-2xl p-6 shadow-md transition-all hover:border-[#50BED9]/40"
                >
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

          {/* Middle Row: Enrollment Growth Chart + Digital Adoption Circular Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enrollment Growth Bar Chart */}
            <div className="lg:col-span-2 bg-[#101010] border border-white/10 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-white">Enrollment Growth</h3>
                  <p className="text-xs text-[#D0D3D6]">Weekly learner volume</p>
                </div>
              </div>

              {/* 7 Vertical Glowing Gradient Bars */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-6 pb-2">
                {[
                  { day: 'Mon', pct: 52, height: '52%' },
                  { day: 'Tue', pct: 66, height: '66%' },
                  { day: 'Wed', pct: 71, height: '71%' },
                  { day: 'Thu', pct: 58, height: '58%' },
                  { day: 'Fri', pct: 83, height: '83%' },
                  { day: 'Sat', pct: 76, height: '76%' },
                  { day: 'Sun', pct: 91, height: '91%' },
                ].map((bar) => (
                  <div key={bar.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-bold text-white group-hover:text-[#50BED9] transition-colors">
                      {bar.pct}%
                    </span>
                    <div
                      className="w-full max-w-[54px] rounded-xl transition-all duration-300 group-hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      style={{
                        height: bar.height,
                        background: 'linear-gradient(180deg, #60B7E5 0%, #50BED9 45%, #33C6B6 100%)',
                      }}
                    />
                    <span className="text-xs font-semibold text-[#D0D3D6] mt-1">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Adoption Circular Widget */}
            <div className="bg-[#101010] border border-white/10 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative w-52 h-52 flex items-center justify-center">
                {/* Glowing Cyan Halo */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, rgba(6, 182, 212, 0.2) 45%, transparent 70%)',
                    filter: 'blur(12px)',
                  }}
                />
                <div
                  className="relative z-10 w-44 h-44 rounded-full bg-[#353638] border border-white/10 flex flex-col items-center justify-center text-center shadow-2xl"
                  style={{
                    boxShadow: '0 0 35px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span className="text-4xl font-black text-white tracking-tight">78%</span>
                  <span className="text-xs font-bold text-[#D0D3D6] mt-1">Digital Adoption</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Videos & Partner Institutes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recently Uploaded Lectures */}
            <div className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Play className="w-5 h-5 text-[#50BED9]" />
                  Recent Uploaded Lectures
                </h3>
                <button onClick={() => { window.location.hash = 'studio'; }} className="text-xs font-bold text-[#50BED9] hover:underline">View All ({videos.length})</button>
              </div>
              <div className="space-y-3">
                {videos.slice(0, 3).map(vid => (
                  <div key={vid.id} className="p-3.5 rounded-xl bg-[#353638] border border-white/10 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#353638] border border-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-white text-xs leading-tight">{vid.title}</p>
                      <p className="text-[10px] text-[#50BED9] font-semibold mt-0.5">{vid.courseTitle} · {vid.duration}</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9] shrink-0">
                      {vid.views} Views
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Institutions */}
            <div className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#50BED9]" />
                  Active School & College Clients
                </h3>
                <button onClick={() => { window.location.hash = 'institutes'; }} className="text-xs font-bold text-[#50BED9] hover:underline">View All ({institutes.length})</button>
              </div>
              <div className="space-y-3">
                {institutes.slice(0, 3).map(inst => (
                  <div key={inst.id} className="flex items-center gap-3.5 p-3 rounded-xl bg-[#101010] border border-white/10 text-white border border-white/10 shadow-sm">
                    <span className="text-2xl">{inst.logo}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-white text-xs leading-tight truncate">{inst.name}</p>
                      <p className="text-[10px] text-[#50BED9] font-semibold">{inst.campus} · {inst.students} Enrolled</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#353638] text-[#50BED9] border border-white/10 shrink-0">
                      {inst.plan}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── VIDEO & COURSE STUDIO TAB ─── */}
      {activeTab === 'studio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-white">Video & Course Creator Studio</h2>
              <p className="text-sm text-[#50BED9] font-semibold">Upload video lectures, manage modules, and publish course content directly to student dashboards</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCreateCourseOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-[#101010] border border-white/10 text-white text-white font-black text-sm hover:bg-[#353638] transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Course
              </button>
              <button
                onClick={() => setUploadVideoOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm shadow hover:bg-[#50BED9] transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload New Video Lecture
              </button>
            </div>
          </div>

          {/* Filter by Course */}
          <div className="flex items-center gap-3 bg-[#101010] border border-white/10 text-white p-4 rounded-2xl border border-white/10 shadow-sm flex-wrap">
            <span className="text-xs font-black text-white">Filter by Course:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCourseFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${selectedCourseFilter === 'all' ? 'bg-[#353638] border border-white/10 text-white' : 'bg-[#101010]/40 text-white hover:bg-[#101010]'}`}
              >
                All Courses ({videos.length} Videos)
              </button>
              {courses.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseFilter(String(c.id))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${selectedCourseFilter === String(c.id) ? 'bg-[#353638] border border-white/10 text-white' : 'bg-[#101010]/40 text-white hover:bg-[#101010]'}`}
                >
                  {c.thumbnail} {c.title.split('&')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="space-y-3">
            {filteredVideos.map(vid => (
              <div key={vid.id} className="bg-[#101010] border border-white/10 text-white rounded-2xl p-4 border border-white/10 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#323232] to-[#50BED9] flex items-center justify-center text-white shadow-md shrink-0">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#101010] text-white">{vid.courseTitle}</span>
                    <h4 className="font-black text-white text-sm leading-tight mt-1 truncate">{vid.title}</h4>
                    <p className="text-[10px] text-[#50BED9] font-semibold mt-0.5">{vid.module} · Duration: {vid.duration} · File Size: {vid.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-black text-[#50BED9] block">{vid.views} Student Views</span>
                    <span className="text-[9px] font-semibold text-gray-400">Uploaded {vid.uploaded}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="p-2 rounded-xl bg-[#101010] text-white hover:bg-[#50BED9] hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-xl bg-[#101010] text-white hover:bg-[#50BED9] hover:text-white transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(vid.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── COURSES CATALOG TAB ─── */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-white">Master Courses Catalog</h2>
              <p className="text-sm text-[#50BED9] font-semibold">{courses.length} published syllabus tracks available for institutional rollout</p>
            </div>
            <button
              onClick={() => setCreateCourseOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm shadow hover:bg-[#50BED9] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Course
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {courses.map(course => (
              <div key={course.id} className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#101010] flex items-center justify-center text-3xl shrink-0 border border-white/10">
                    {course.thumbnail}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-white text-base leading-tight">{course.title}</h3>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9] uppercase shrink-0">
                        {course.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#50BED9] font-semibold mt-1">{course.category} · {course.videos} Lectures Uploaded · {course.duration}</p>
                    <p className="text-[10px] text-[#50BED9]/60 font-semibold">{course.students} Enrolled Institutional Students</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourseFilter(String(course.id));
                      window.location.hash = 'studio';
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#353638] border border-white/10 text-white text-xs font-black hover:bg-[#50BED9] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Lectures to this Course
                  </button>
                  <button className="px-3 py-2 rounded-xl border border-white/10 text-[#50BED9] text-xs font-bold hover:bg-[#353638] transition-colors">
                    Edit Syllabus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SCHOOLS & COLLEGES TAB ─── */}
      {activeTab === 'institutes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-white">Partner Schools, Colleges & Universities</h2>
              <p className="text-sm text-[#50BED9] font-semibold">{institutes.length} institutional clients onboarded on NextGen LMS</p>
            </div>
            <button
              onClick={() => setAddInstituteOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm shadow hover:bg-[#50BED9] transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Onboard Partner Institute
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {institutes.map(inst => (
              <div key={inst.id} className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{inst.logo}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-white text-base leading-tight">{inst.name}</h3>
                      <span className="shrink-0 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9]">
                        {inst.plan}
                      </span>
                    </div>
                    <p className="text-xs text-[#50BED9] font-semibold mt-1">{inst.campus}</p>
                    <p className="text-[10px] text-[#50BED9]/60 font-semibold mt-0.5">License renewal: {inst.renewal}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#353638] border border-white/10 text-center">
                  <div>
                    <p className="text-lg font-black text-white">{inst.students}</p>
                    <p className="text-[10px] font-bold text-[#50BED9]">Enrolled Students</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">{inst.batches}</p>
                    <p className="text-[10px] font-bold text-[#50BED9]">Active Batches</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-[#353638] border border-white/10 text-white text-xs font-black hover:bg-[#50BED9] transition-colors">
                    Manage Tenant
                  </button>
                  <button className="px-3 py-2 rounded-xl border border-white/10 text-[#50BED9] text-xs font-bold hover:bg-[#353638] transition-colors">
                    View Student Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── USERS & ROLES TAB ─── */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-white">User Accounts Directory</h2>
              <p className="text-sm text-[#50BED9] font-semibold">{users.length} registered accounts across all institutional branches</p>
            </div>
            <button
              onClick={() => setAddUserOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm shadow hover:bg-[#50BED9] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap bg-[#101010] border border-white/10 text-white p-4 rounded-2xl border border-white/10 shadow-sm">
            <div className="flex gap-2 flex-wrap">
              {['all', 'learner', 'institute'].map(role => (
                <button
                  key={role}
                  onClick={() => setUserFilter(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all ${userFilter === role ? 'bg-[#353638] border border-white/10 text-white' : 'bg-[#101010]/40 text-white hover:bg-[#101010]'}`}
                >
                  {role === 'all' ? 'All Roles' : role + 's'} ({role === 'all' ? users.length : users.filter(u => u.role === role).length})
                </button>
              ))}
            </div>
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#50BED9]/50" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-white/10 text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
              />
            </div>
          </div>

          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl border border-white/10 shadow-sm overflow-hidden">
            <div className="divide-y divide-[#50BED9]/5">
              {filteredUsers.map(user => (
                <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-[#101010]/20 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 ${user.role === 'institute' ? 'bg-[#50BED9]' : 'bg-[#353638] border border-white/10'}`}>
                    {user.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-white text-sm">{user.name}</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full capitalize ${user.role === 'institute' ? 'bg-violet-100 text-violet-700' : 'bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9]'}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#50BED9] font-semibold">{user.email} · {user.institute}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${user.status === 'active' ? 'bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9]' : 'bg-red-100 text-red-700'}`}>
                    {user.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── FINANCIALS TAB ─── */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">Institutional Revenue & Billing</h2>
            <p className="text-sm text-[#50BED9] font-semibold">100% Platform gross revenue from school and student contracts</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Ecosystem Revenue', value: 'PKR 3.84M', icon: DollarSign, color: 'bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9]', sub: '+28% YTD' },
              { label: 'This Month Billings', value: 'PKR 520k', icon: TrendingUp, color: 'bg-sky-100 text-sky-600', sub: 'School contract renewals' },
              { label: 'Annual Contract Pipeline', value: 'PKR 6.40M', icon: ShieldCheck, color: 'bg-violet-100 text-violet-600', sub: 'Projected 2026-2027' },
            ].map(f => (
              <div key={f.label} className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
                <div className={`inline-flex p-3 rounded-2xl mb-4 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-black text-white">{f.value}</p>
                <p className="text-xs font-bold text-[#50BED9]/70 mt-0.5">{f.label}</p>
                <p className="text-[10px] font-semibold text-[#50BED9]/50 mt-1">{f.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
            <h3 className="font-black text-white text-base mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#50BED9]" />
              Monthly Revenue Performance (Last 6 Months)
            </h3>
            <div className="flex items-end gap-3 h-48">
              {REVENUE_MONTHS.map(m => {
                const pct = (m.gross / maxGross) * 100;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-white">PKR {(m.gross / 1000).toFixed(0)}k</p>
                    <div className="w-full relative" style={{ height: `${(pct / 100) * 160}px` }}>
                      <div className="absolute inset-x-0 bottom-0 rounded-t-xl bg-gradient-to-t from-[#323232] to-[#50BED9] h-full" />
                    </div>
                    <p className="text-[10px] font-black text-[#50BED9]/60">{m.month}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── ANALYTICS TAB ─── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">Platform Intelligence & Student Engagement</h2>
            <p className="text-sm text-[#50BED9] font-semibold">Video lecture completion metrics and AI tutor interactions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
              <h3 className="font-black text-white text-base mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#50BED9]" />
                JARVIS AI Tutor Query Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { domain: 'React & Next.js Code Debugging', count: 1840, pct: 88 },
                  { domain: 'AI & Neural Networks Explanations', count: 1420, pct: 72 },
                  { domain: 'Docker & DevOps Troubleshooting', count: 960, pct: 54 },
                  { domain: 'Syllabus Quiz Practice with Voice AI', count: 820, pct: 45 },
                ].map(d => (
                  <div key={d.domain}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-white truncate pr-2">{d.domain}</span>
                      <span className="text-[#50BED9] shrink-0">{d.count} queries</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-[#50BED9] to-[#50BED9]" style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#101010] border border-white/10 text-white rounded-2xl p-6 border border-white/10 shadow-sm">
              <h3 className="font-black text-white text-base mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#50BED9]" />
                Top Active School Client Campuses
              </h3>
              <div className="space-y-3">
                {[
                  { school: 'FAST NUCES Faculty of Computing', count: 580, pct: 92 },
                  { school: 'Beaconhouse International System (Lahore)', count: 420, pct: 78 },
                  { school: 'Roots Millennium School & College (Islamabad)', count: 310, pct: 64 },
                  { school: 'Army Public College & University (Rawalpindi)', count: 240, pct: 50 },
                ].map(s => (
                  <div key={s.school}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-white truncate pr-2">{s.school}</span>
                      <span className="text-[#50BED9] shrink-0">{s.count} students</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-[#50BED9] to-[#50BED9]" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ─── ADMIN JARVIS TAB ─── */}
      {activeTab === 'jarvis' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-[#50BED9]" /> JARVIS — Platform Intelligence Engine
            </h2>
            <p className="text-sm text-[#50BED9] font-semibold">Ask about any school, student cohort, financials, or platform analytics</p>
          </div>

          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#323232] to-[#50BED9] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#101010]/20 border border-[#151515]/30 flex items-center justify-center text-xl">🤖</div>
              <div>
                <p className="text-white font-black text-sm">JARVIS Super Admin AI</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-[10px] font-semibold">Platform-Wide Data Access • Real-Time Analysis</span>
                </div>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="p-3 border-b border-white/10 flex gap-2 flex-wrap bg-[#101010]/20">
              {[
                '🏫 Misaali School ke bache',
                '🏆 Total certificates issued',
                '📊 Platform overview',
                '💰 Is month ki revenue',
                '🌟 Top performing schools',
                '📉 Inactive students',
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => {
                    const adminResponses: Record<string, string> = {
                      '🏫 Misaali School ke bache': '🏫 **Misaali School — Complete Student Roster:**\n\n📊 Total Enrolled: 150 students\n✅ Active: 138 (92%) | ⚠️ Inactive: 12 (8%)\n\n**Top Students:**\n1. Ali Hassan — Level 4, 94% score, 6 badges 🥇\n2. Sara Khan — Level 3, 88% score, 4 badges\n3. Fatima Zahra — Level 4, 96% score, 5 badges\n\n**Course Progress:**\n• Next.js 15: 89 students enrolled, 67% avg completion\n• Applied AI: 72 students enrolled, 55% avg completion\n\n**Certificates Issued: 24** 🎓\n**Average Study Hours: 18.4 hrs/student**',
                      '🏆 Total certificates issued': '🎓 **Platform-Wide Certificate Analysis:**\n\n📜 Total Certificates Issued: **284**\n\n**By Course:**\n• Next.js 15 Full-Stack: 98 certificates\n• Applied Generative AI: 76 certificates\n• Cloud DevOps: 64 certificates\n• UI/UX Design: 46 certificates\n\n**By School:**\n• Beaconhouse Lahore: 89 certificates (31%)\n• FAST-NUCES Karachi: 74 certificates (26%)\n• Roots Islamabad: 62 certificates (22%)\n• Others: 59 certificates (21%)\n\n**This Month New: +42 certificates** 📈',
                      '📊 Platform overview': '📊 **NextGen LMS Platform Overview (Live):**\n\n👥 Total Enrolled Learners: **1,480**\n🏫 Active Partner Schools: **4** (24 branches)\n📹 Total Video Lectures: **128** uploaded\n🎓 Certificates Issued: **284**\n🤖 JARVIS AI Queries Today: **1,240**\n⭐ Platform Avg Score: **86.4%**\n🔥 Top Study Streak: **34 days** (Beaconhouse student)\n\n**System Health:** 🟢 All services operational\n**Server Uptime:** 99.98%',
                      '💰 Is month ki revenue': '💰 **August 2026 Revenue Report:**\n\n📈 Gross Revenue: **PKR 520,000**\n\n**School Payments Received:**\n• ✅ Beaconhouse Lahore: PKR 200,000 (PAID - 2 Aug)\n• ✅ Roots Millennium: PKR 155,000 (PAID - 3 Aug)\n• ✅ FAST-NUCES: PKR 290,000 (PAID - 1 Aug)\n• 🔴 Army Public College: PKR 120,000 (PENDING - Due 10th)\n\n**Action Required:** Army Public College payment due! Auto-lock on 10th if unpaid.',
                      '🌟 Top performing schools': '🌟 **School Performance Leaderboard — August 2026:**\n\n🥇 #1 FAST-NUCES Karachi\n   580 students • 91% completion • 74 certificates\n\n🥈 #2 Beaconhouse Lahore\n   420 students • 87% completion • 89 certificates\n\n🥉 #3 Roots Millennium Islamabad\n   310 students • 83% completion • 62 certificates\n\n4️⃣ Army Public Rawalpindi\n   240 students • 79% completion • 59 certificates\n\n💡 Tip: Send appreciation letter to FAST-NUCES principal!',
                      '📉 Inactive students': '⚠️ **Inactive Students Alert (Last 7 Days):**\n\n📊 Total Inactive: **48 students** (3.2% of platform)\n\n**By School:**\n• Beaconhouse: 12 students (8% of their roster)\n• Roots: 18 students (5.8%)\n• FAST-NUCES: 11 students (1.9%)\n• Army Public: 7 students (2.9%)\n\n**Recommended Action:**\n1. Notify school admins via automated email\n2. JARVIS to send personalized "We miss you!" push notifications\n3. Check if these students have pending payment issues',
                    };
                    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    const replyText = adminResponses[prompt] || 'Is query ka analysis kar raha hun...';
                    const m1 = { id: Date.now().toString(), sender: 'admin' as const, text: prompt, ts };
                    const m2 = { id: (Date.now() + 1).toString(), sender: 'jarvis' as const, text: replyText, ts };
                    setAdminJarvisMessages(prev => [...prev, m1, m2]);
                    if (adminVoiceEnabled) {
                      speakAdminJarvisText(replyText);
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
              {adminJarvisMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.sender === 'admin'
                      ? 'bg-[#353638] border border-white/10 text-white rounded-tr-none'
                      : 'bg-[#101010]/40 text-white border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.sender === 'jarvis' && <p className="text-[10px] font-black text-[#50BED9] mb-1">🤖 JARVIS Super Admin AI</p>}
                    {msg.text}
                    {msg.sender === 'jarvis' && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => speakAdminJarvisText(msg.text)}
                          title="Hear JARVIS Speak this analytics report aloud"
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
            {adminJarvisListening && (
              <div className="px-4 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-t border-red-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#101010] border border-white/10 text-white text-red-600 flex items-center justify-center animate-pulse shadow-lg font-black text-sm">
                    🎙️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#101010] border border-white/10 text-white animate-ping" />
                      <p className="font-black text-xs uppercase tracking-wider text-white">
                        🔴 Recording Admin Voice ({adminRecSeconds < 10 ? `00:0${adminRecSeconds}` : `00:${adminRecSeconds}`})
                      </p>
                    </div>
                    <p className="text-xs font-bold text-red-100 mt-0.5 max-w-md truncate">
                      {adminLiveTranscript ? `"${adminLiveTranscript}"` : 'Speak your query into microphone...'}
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
                  onClick={() => stopAdminVoiceAndSend()}
                  className="px-4 py-2 rounded-xl bg-[#101010] border border-white/10 text-white hover:bg-[#353638] border border-white/10 text-red-700 font-black text-xs shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <span>⏹️ Stop & Send Audio</span>
                </button>
              </div>
            )}

            {adminJarvisSpeaking && (
              <div className="px-4 py-2 bg-[#353638] border border-white/10 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#50BED9] font-black text-xs">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>🔊 JARVIS is speaking out loud...</span>
                </div>
                <button
                  type="button"
                  onClick={stopAdminSpeaking}
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
                onClick={adminJarvisListening ? () => stopAdminVoiceAndSend() : startAdminVoiceInput}
                className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  adminJarvisListening
                    ? 'bg-red-600 text-white animate-bounce'
                    : 'bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{adminJarvisListening ? 'Listening...' : 'Speak to JARVIS'}</span>
              </button>

              <input
                type="text"
                value={adminJarvisInput}
                onChange={e => setAdminJarvisInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && adminJarvisInput.trim()) {
                    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    const userMsg = { id: Date.now().toString(), sender: 'admin' as const, text: adminJarvisInput, ts };
                    const lower = adminJarvisInput.toLowerCase();
                    let reply = '';
                    if (lower.includes('school') || lower.includes('institute') || lower.includes('college')) {
                      reply = `🏫 **School Query Result:**\n\nAapne "${adminJarvisInput}" ke baare mein poocha.\n\nMere paas 4 partner schools hain — Beaconhouse (420 students), Roots (310), FAST-NUCES (580), Army Public (240).\n\nKis specific school ki detail chahiye? School ka naam mention karein!`;
                    } else if (lower.includes('certificate')) {
                      reply = '🎓 Platform-wide total **284 certificates** issued. Is mahine **42 new** certificates generate hue hain. Sabse zyada Beaconhouse Lahore ne earn kiye (89 certificates).';
                    } else if (lower.includes('revenue') || lower.includes('payment') || lower.includes('paise')) {
                      reply = '💰 Is mahine gross revenue **PKR 520,000** hai. Army Public College ka payment (PKR 120,000) abhi pending hai — 10th tareeq auto-lock ho jayega agar payment nahi aayi.';
                    } else if (lower.includes('student')) {
                      reply = '👥 Platform par total **1,480 students** enrolled hain. 48 students (3.2%) is hafte inactive hain. Top performer: Fatima Zahra (FAST-NUCES) — 96% score, Level 5 Master!';
                    } else {
                      reply = `🤖 Samajh gaya! "${adminJarvisInput}" ke baare mein:\n\nYeh query meri smart analysis mein hai. Abhi ke liye in categories mein sawal karein:\n• School/students ki details\n• Certificate statistics\n• Revenue & billing\n• Platform overview\n• Top/inactive students`;
                    }
                    const jarvisMsg = { id: (Date.now() + 1).toString(), sender: 'jarvis' as const, text: reply, ts };
                    setAdminJarvisMessages(prev => [...prev, userMsg, jarvisMsg]);
                    setAdminJarvisInput('');
                  }
                }}
                placeholder="e.g. Beaconhouse school ke top 5 bache batao..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
              />
              <button
                onClick={() => {
                  if (!adminJarvisInput.trim()) return;
                  const event = new KeyboardEvent('keydown', { key: 'Enter' });
                  document.dispatchEvent(event);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 text-white text-xs font-black hover:bg-[#50BED9] transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── UPLOAD VIDEO MODAL ─── */}
      {uploadVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl w-full max-w-lg shadow-2xl border border-white/10">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#50BED9]" />
                <h3 className="font-black text-white text-base">Upload Video Lecture</h3>
              </div>
              <button onClick={() => setUploadVideoOpen(false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Select Course</label>
                <select
                  value={newVideoForm.courseId}
                  onChange={e => setNewVideoForm({ ...newVideoForm, courseId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Chapter / Module</label>
                <input
                  type="text"
                  placeholder="e.g. Module 1: React Server Components"
                  value={newVideoForm.module}
                  onChange={e => setNewVideoForm({ ...newVideoForm, module: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Lecture Title</label>
                <input
                  type="text"
                  placeholder="e.g. 01. React 19 Actions & Optimistic Hooks"
                  value={newVideoForm.title}
                  onChange={e => setNewVideoForm({ ...newVideoForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-white block mb-1.5">Estimated Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 24:30"
                    value={newVideoForm.duration}
                    onChange={e => setNewVideoForm({ ...newVideoForm, duration: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-white block mb-1.5">Video File Source</label>
                  <div className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-[#101010]/20 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer hover:bg-[#101010]/40">
                    <Upload className="w-3.5 h-3.5" /> Choose MP4 / MKV
                  </div>
                </div>
              </div>
              <button
                onClick={handleUploadVideo}
                disabled={!newVideoForm.title}
                className="w-full py-3 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm hover:bg-[#50BED9] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" /> Publish Video to Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CREATE COURSE MODAL ─── */}
      {createCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-black text-white text-base">Create Master Course Track</h3>
              <button onClick={() => setCreateCourseOpen(false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Python for Data Science & AI"
                  value={newCourseForm.title}
                  onChange={e => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-white block mb-1.5">Category</label>
                  <select
                    value={newCourseForm.category}
                    onChange={e => setNewCourseForm({ ...newCourseForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                  >
                    <option>Web Dev</option>
                    <option>AI & Data</option>
                    <option>Cloud</option>
                    <option>Security</option>
                    <option>Design</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-white block mb-1.5">Emoji Icon</label>
                  <input
                    type="text"
                    value={newCourseForm.thumbnail}
                    onChange={e => setNewCourseForm({ ...newCourseForm, thumbnail: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30 text-center"
                  />
                </div>
              </div>
              <button
                onClick={handleCreateCourse}
                disabled={!newCourseForm.title}
                className="w-full py-3 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm hover:bg-[#50BED9] transition-colors disabled:opacity-40"
              >
                Create Course Syllabus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD USER MODAL ─── */}
      {addUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-black text-white text-base">Add User Account</h3>
              <button onClick={() => setAddUserOpen(false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Asad Mahmood"
                  value={newUserForm.name}
                  onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. asad@gmail.com"
                  value={newUserForm.email}
                  onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                >
                  <option value="learner">Student / Learner</option>
                  <option value="institute">Institute Admin</option>
                </select>
              </div>
              <button
                onClick={handleCreateUser}
                disabled={!newUserForm.name || !newUserForm.email}
                className="w-full py-3 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm hover:bg-[#50BED9] transition-colors disabled:opacity-40"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD INSTITUTE MODAL ─── */}
      {addInstituteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#101010] border border-white/10 text-white rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-black text-white text-base">Onboard Partner Institute</h3>
              <button onClick={() => setAddInstituteOpen(false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Institution / School Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lahore Grammar School"
                  value={newInstForm.name}
                  onChange={e => setNewInstForm({ ...newInstForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <div>
                <label className="text-xs font-black text-white block mb-1.5">Campus Branch</label>
                <input
                  type="text"
                  placeholder="e.g. Gulberg III Campus"
                  value={newInstForm.campus}
                  onChange={e => setNewInstForm({ ...newInstForm, campus: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#50BED9]/30"
                />
              </div>
              <button
                onClick={handleCreateInstitute}
                disabled={!newInstForm.name || !newInstForm.campus}
                className="w-full py-3 rounded-xl bg-[#353638] border border-white/10 text-white font-black text-sm hover:bg-[#50BED9] transition-colors disabled:opacity-40"
              >
                Provision School Tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ATTENDANCE TAB ─── */}
      {activeTab === 'attendance' && (
        <QRAttendanceScanner />
      )}

    </div>
  );
}
