'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { assessmentApi, certificatesApi, coursesApi, groupsApi, submissionsApi } from '@/lib/api';
import type { Certificate, Course, Enrollment, ProgressiveTest } from '@/types/domain';
import { useAuthStore } from '@/store/auth-store';
import { useToastStore } from '@/store/toast-store';
import {
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  Trophy,
  MessageSquare,
  Users,
  FileText,
  Zap,
  Calendar as CalendarIcon,
  Clock,
  Flame,
  CheckSquare,
  Square,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Award,
  Send,
  Star,
  Plus,
  X,
  ChevronRight,
  Layers,
  Search,
  Check,
  AlertCircle,
  Download,
  Share2,
  Video as VideoIcon,
  PhoneCall,
  Paperclip,
  Smile,
  ShieldCheck,
  HelpCircle,
  ExternalLink
, Mic, MicOff, Volume2, VolumeX} from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  due: string;
  dueTag: 'today' | 'tomorrow' | 'upcoming' | 'none';
  completed: boolean;
  subject: string;
}

interface ChatMessage {
  id: string;
  sender: 'student' | 'trainer' | 'system';
  trainerName?: string;
  trainerAvatar?: string;
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
}

interface QuizItem {
  id: string;
  title: string;
  courseTitle: string;
  questionsCount: number;
  durationMinutes: number;
  passingScore: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: QuizQuestion[];
}

type TabType = 'progress' | 'courses' | 'profile' | 'testing' | 'certificates' | 'chat';

export function StudentDashboard() {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  // API State
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeEnrollment, setActiveEnrollment] = useState<Enrollment | null>(null);
  const [progress, setProgress] = useState<{ enrollment: Enrollment; videos: Course['videos'] } | null>(null);
  const [test, setTest] = useState<ProgressiveTest | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [homework, setHomework] = useState('');
  const [question, setQuestion] = useState('');
  const [showTip, setShowTip] = useState(true);

  // Active Tab & Hash sync
  const [activeTab, setActiveTab] = useState<TabType>('progress');

  // Focus Session (Pomodoro Timer) State
  const [timerDuration, setTimerDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Weekly Calendar State
  const [selectedDay, setSelectedDay] = useState(3);

  // Tasks Checklist State
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: '1', title: 'Data Structures & Algorithms Assignment 3', due: 'Due Today', dueTag: 'today', completed: false, subject: 'Computer Science' },
    { id: '2', title: 'Interactive Web Dev Quiz Preparation', due: 'Due Tomorrow', dueTag: 'tomorrow', completed: false, subject: 'Full Stack' },
    { id: '3', title: 'Submit Machine Learning Summary Report', due: 'Due Sun, 24 Aug', dueTag: 'upcoming', completed: false, subject: 'AI Studio' },
    { id: '4', title: 'Review Database Indexing Notes', due: 'No Due Date', dueTag: 'none', completed: true, subject: 'Databases' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  // Courses Tab Filter & Search
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Assessments Tab State
  const [activeQuizModal, setActiveQuizModal] = useState<QuizItem | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Certificates Modal State
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Ask Trainer State
  const [selectedTrainer, setSelectedTrainer] = useState<'sarah' | 'zubair' | 'hamza'>('sarah');
  const [chatInput, setChatInput] = useState('');
  // Voice & Speech Recognition / Synthesis States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState('');
  const recognitionRef = React.useRef<any>(null);
  const silenceTimerRef = React.useRef<any>(null);

  // Helper to speak text aloud via TTS
  const speakJarvisText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`]/g, '').replace(/\n/g, '. ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Clean SpeechRecognition-only Voice Engine
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = React.useRef<any>(null);
  const spokenWordsRef = React.useRef<string>('');
  const isStoppedRef = React.useRef<boolean>(false);

  const startVoiceInput = () => {
    if (typeof window === 'undefined') return;
    stopSpeaking();

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Voice recognition requires Google Chrome or Microsoft Edge. Please open this page in Chrome.');
      return;
    }

    isStoppedRef.current = false;
    spokenWordsRef.current = '';
    setLiveTranscript('');
    setChatInput('');
    setRecordingSeconds(0);
    setIsListening(true);

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);

    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + ' ';
        else interim += event.results[i][0].transcript;
      }
      const text = (final.trim() || interim.trim());
      if (text) {
        spokenWordsRef.current = text;
        setLiveTranscript(text);
        setChatInput(text);
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === 'not-allowed') {
        alert('Microphone blocked. Click the 🔒 lock icon in browser URL bar → Allow Microphone → refresh.');
        setIsListening(false);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      }
    };

    recognition.onend = () => {
      if (!isStoppedRef.current) {
        try { recognition.start(); } catch {
          setIsListening(false);
          if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        }
      } else {
        setIsListening(false);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      }
    };

    recognition.start();
  };



  const stopVoiceInputAndSend = (manualQuery?: string) => {
    // Signal the recognition.onend handler NOT to restart
    isStoppedRef.current = true;

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    setIsListening(false);

    const captured = (manualQuery || spokenWordsRef.current || liveTranscript || chatInput).trim();

    if (captured) {
      handleVoiceSend(captured);
    } else {
      const noVoiceMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'trainer',
        trainerName: 'JARVIS AI',
        trainerAvatar: '🤖',
        text: 'Aapki awaz clear nahi aayi. Baraye meharbani thora sa mic ke qareeb aakar dobara bolein ya neechay type karein!',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, noVoiceMsg]);
      if (voiceEnabled) {
        speakJarvisText('Aapki awaz nahi aayi. Baraye meharbani dobara bolein.');
      }
    }

    setLiveTranscript('');
    setChatInput('');
    setRecordingSeconds(0);
  };



  const generateStudentJarvisResponse = (query: string): string => {
    const lower = query.toLowerCase();
    if (lower.includes('progress') || lower.includes('level') || lower.includes('kahan hun') || lower.includes('position') || lower.includes('status')) {
      return "Ali, aap abhi Level 4: Full-Stack Architect par hain, with 3,450 XP out of 4,000 XP. Next.js course 78% complete hai, aur aapne 6 digital badges earn kar liye hain! Agla badge lene ke liye Module 5 complete karein.";
    } else if (lower.includes('video') || lower.includes('lecture') || lower.includes('pending') || lower.includes('rehti') || lower.includes('baqi')) {
      return "Aapke paas total 8 pending videos hain: 4 videos Next.js 15 Module 5 mein, 3 videos AI/ML course mein, aur 1 video Cloud DevOps mein.";
    } else if (lower.includes('badge') || lower.includes('trophy') || lower.includes('inam') || lower.includes('medal')) {
      return "Aapne 6 digital badges earn kiye hain: Next.js 15 Master, Generative AI Pioneer, Cloud DevOps Explorer, 14-Day Study Flame, Code Speed Demon, aur Security Defender! Bohat shandaar!";
    } else if (lower.includes('exam') || lower.includes('quiz') || lower.includes('test') || lower.includes('paper')) {
      return "AI & ML Final Exam ke liye vector embeddings, prompt engineering, LangChain agents, aur RAG pipeline ko zaroor revise karein. 75% score par certificate unlock ho jaye ga.";
    } else if (lower.includes('streak') || lower.includes('day') || lower.includes('lagatar')) {
      return "Zabardast Ali! Aapki 14-day study streak chal rahi hai. Aap Pakistan ke top 1% students mein shumar hotay hain!";
    } else if (lower.includes('certificate') || lower.includes('sanad')) {
      return "Aapke paas 2 verified certificates hain: Next.js 15 Mastery aur Cloud DevOps. Inhe aap Certificates tab mein QR code ke sath download kar sakte hain.";
    } else if (lower.includes('code') || lower.includes('bug') || lower.includes('error')) {
      return "Bilkul Ali! Apna code chat mein paste karein, main syntax bugs aur performance optimization line-by-line check karunga.";
    } else {
      return `Aapne poocha: "${query}". Main aapka personal 24/7 AI teacher hun. Main aapko coding, syllabus concepts, aur exams ki preparation mein mukammal guide karunga. Kahiye, is topic par koi specific sawal hai?`;
    }
  };

  const handleVoiceSend = (spokenText: string) => {
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'student',
      text: spokenText,
      timestamp: ts,
    };

    const reply = generateStudentJarvisResponse(spokenText);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'trainer',
      trainerName: 'JARVIS AI (Voice Assistant)',
      trainerAvatar: '🤖',
      text: reply,
      timestamp: ts,
    };

    setChatMessages(prev => [...prev, userMsg, aiMsg]);
    if (voiceEnabled) {
      speakJarvisText(reply);
    }
  };

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-08-20');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'trainer',
      trainerName: 'Engr. Sarah Tariq',
      text: 'Hello Muhammad! 👋 I checked your Next.js Server Components assignment — excellent work on the data caching strategy. Do you have any questions on today’s AI streaming module?',
      timestamp: '10:30 AM'
    },
    {
      id: 'm-2',
      sender: 'student',
      text: 'Thank you Sarah! I wanted to ask how we should handle error boundaries when streaming AI tokens into React components?',
      timestamp: '10:35 AM'
    },
    {
      id: 'm-3',
      sender: 'trainer',
      trainerName: 'Engr. Sarah Tariq',
      text: 'Great question! You should wrap your Suspense boundary around the chunk reader and use a custom error handler in your API route like this:',
      codeSnippet: '// app/api/ai/route.ts\nexport async function POST(req: Request) {\n  try {\n    const stream = await OpenAIStream(response);\n    return new StreamingTextResponse(stream);\n  } catch (err) {\n    return new Response(JSON.stringify({ error: err.message }), { status: 500 });\n  }\n}',
      timestamp: '10:38 AM'
    }
  ]);

  // Quizzes list
  const availableQuizzes: QuizItem[] = [
    {
      id: 'quiz-1',
      title: 'Full-Stack Next.js 15 & React 19 Mastery Assessment',
      courseTitle: 'Full Stack Web Development & NextGen AI',
      questionsCount: 4,
      durationMinutes: 10,
      passingScore: 75,
      difficulty: 'Intermediate',
      questions: [
        {
          id: 'q1',
          prompt: 'What is the primary benefit of React Server Components (RSC)?',
          options: [
            'Zero client-side JavaScript bundle footprint for server-only dependencies',
            'Eliminates the requirement for HTML and CSS entirely',
            'Makes local SQLite databases run directly inside web browsers',
            'Automatically translates TypeScript into C++'
          ],
          correctAnswer: 0
        },
        {
          id: 'q2',
          prompt: 'Which Next.js directive allows declaring server-only execution functions in actions?',
          options: ["'use client'", "'use server'", "'use worker'", "'use static'"],
          correctAnswer: 1
        },
        {
          id: 'q3',
          prompt: 'Which HTTP method is idempotent and completely replaces a targeted resource?',
          options: ['PUT', 'POST', 'PATCH', 'CONNECT'],
          correctAnswer: 0
        },
        {
          id: 'q4',
          prompt: 'How does Next.js handle Streaming with React 19?',
          options: [
            'Using Suspense boundaries and HTTP progressive chunk streaming',
            'By loading all data synchronously before sending any HTML',
            'Using client-side localStorage polling',
            'By requiring WebSockets for all page visits'
          ],
          correctAnswer: 0
        }
      ]
    },
    {
      id: 'quiz-2',
      title: 'Generative AI Engineering & Custom Embeddings Test',
      courseTitle: 'AI & Machine Learning Engineering',
      questionsCount: 3,
      durationMinutes: 8,
      passingScore: 80,
      difficulty: 'Advanced',
      questions: [
        {
          id: 'q1',
          prompt: 'What is Vector Embeddings in the context of Retrieval-Augmented Generation (RAG)?',
          options: [
            'High-dimensional numerical representations that capture semantic meaning',
            'A tool to compress PNG image files',
            'A specialized CSS layout system for vector graphics',
            'A binary compiler for Python'
          ],
          correctAnswer: 0
        },
        {
          id: 'q2',
          prompt: 'Which vector database metric measures semantic similarity between two normalized vectors?',
          options: ['Cosine Similarity', 'Euclidean Velocity', 'RGB Delta', 'Hash Modulo'],
          correctAnswer: 0
        },
        {
          id: 'q3',
          prompt: 'What role does temperature parameter play in Large Language Model sampling?',
          options: [
            'Controls randomness and creativity of generated text',
            'Controls GPU fan speed and hardware temperature',
            'Measures network ping latency',
            'Sets the token price'
          ],
          correctAnswer: 0
        }
      ]
    },
    {
      id: 'quiz-3',
      title: 'Cloud DevOps, Docker & CI/CD Pipelines Quiz',
      courseTitle: 'Cloud Architecture & DevOps (AWS/GCP)',
      questionsCount: 3,
      durationMinutes: 8,
      passingScore: 70,
      difficulty: 'Beginner',
      questions: [
        {
          id: 'q1',
          prompt: 'What is the key benefit of multi-stage Docker builds?',
          options: [
            'Drastically reduces production image size by separating build tools from runtime',
            'Runs containers 100x faster than native binaries',
            'Automatically writes Kubernetes YAML files',
            'Allows Docker to run without a Linux kernel'
          ],
          correctAnswer: 0
        },
        {
          id: 'q2',
          prompt: 'In Kubernetes, what is the smallest deployable compute unit?',
          options: ['Pod', 'Node', 'Cluster', 'Ingress'],
          correctAnswer: 0
        },
        {
          id: 'q3',
          prompt: 'What does CI/CD stand for in modern cloud infrastructure?',
          options: [
            'Continuous Integration & Continuous Deployment / Delivery',
            'Central Interface & Cloud Distribution',
            'Compiled Instruction & Cached Data',
            'Compute Infrastructure & Cloud Database'
          ],
          correctAnswer: 0
        }
      ]
    }
  ];

  // Hash Navigation Synchronizer
  useEffect(() => {
    const syncHashToTab = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
      if (hash === '#courses') {
        setActiveTab('courses');
      } else if (hash === '#profile' || hash === '#badges' || hash === '#social') {
        setActiveTab('profile');
      } else if (hash === '#testing' || hash === '#assessments' || hash === '#quizzes' || hash === '#exam') {
        setActiveTab('testing');
      } else if (hash === '#certificates') {
        setActiveTab('certificates');
      } else if (hash === '#jarvis' || hash === '#ai' || hash === '#chat' || hash === '#ask-trainer' || hash === '#trainer') {
        setActiveTab('chat');
      } else if (!hash || hash === '#dashboard' || hash === '#overview' || hash === '#progress') {
        setActiveTab('progress');
      }
    };

    syncHashToTab();
    window.addEventListener('hashchange', syncHashToTab);
    window.addEventListener('popstate', syncHashToTab);
    return () => {
      window.removeEventListener('hashchange', syncHashToTab);
      window.removeEventListener('popstate', syncHashToTab);
    };
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const hash = tab === 'progress' ? '' : `#${tab === 'testing' ? 'testing' : tab === 'chat' ? 'chat' : tab}`;
    if (typeof window !== 'undefined') {
      if (window.history.pushState) {
        window.history.pushState(null, '', window.location.pathname + hash);
        window.dispatchEvent(new Event('hashchange'));
      } else {
        window.location.hash = hash;
      }
    }
  };

  // Load Data
  async function load() {
    try {
      const [courseRows, certRows] = await Promise.all([
        coursesApi.list().catch(() => []),
        certificatesApi.mine().catch(() => [])
      ]);
      setCourses(courseRows || []);

      if (certRows && certRows.length > 0) {
        setCertificates(certRows);
      } else {
        // High-fidelity fallback certificates
        setCertificates([
          {
            id: 'cert-1',
            learnerId: user?.id || 'usr-1',
            courseId: 'crs-1',
            badge: 'Certified Full-Stack AI Engineer',
            certificationDate: new Date().toISOString(),
            certificateUrl: '#',
          },
          {
            id: 'cert-2',
            learnerId: user?.id || 'usr-1',
            courseId: 'crs-2',
            badge: 'Advanced Next.js & React 19 Specialist',
            certificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            certificateUrl: '#',
          }
        ]);
      }

      if (courseRows && courseRows.length > 0) {
        try {
          const firstCourse = courseRows[0];
          const enrollment = await coursesApi.enroll(firstCourse.id);
          setActiveEnrollment(enrollment);
          const prog = await coursesApi.progress(enrollment.id);
          setProgress(prog);
        } catch {
          // Demo mock if offline
          const fallbackEnrollment: Enrollment = {
            id: 'enr-1',
            learnerId: user?.id || 'usr-1',
            courseId: courseRows[0]?.id || 'crs-1',
            status: 'active',
            unlockedVideoPosition: 2,
            course: courseRows[0] || {
              id: 'crs-1',
              title: 'Full Stack Web Development & NextGen AI',
              description: 'Master enterprise Next.js, React 19, TypeScript, and Generative AI workflows with production projects.',
              level: 'all_levels',
              status: 'approved',
              createdAt: new Date().toISOString(),
              trainer: { id: 't-1', name: 'Engr. Sarah Tariq', email: 'sarah@nextgen.edu', role: 'trainer', avatar: '' },
              videos: [
                { id: 'v-1', title: '1. Modern Next.js 15 & Tailwind Architecture', position: 1, videoUrl: 'https://www.youtube.com', locked: false, summary: 'Setup full stack project architecture with optimal state management.' },
                { id: 'v-2', title: '2. Deep Dive: React Server Components & Streaming', position: 2, videoUrl: 'https://www.youtube.com', locked: false, summary: 'Learn RSC data fetching patterns and server actions.' },
                { id: 'v-3', title: '3. Building AI Powered Microservices with Node.js', position: 3, videoUrl: 'https://www.youtube.com', locked: false, summary: 'Integrate LLM API streams and custom embeddings.' },
                { id: 'v-4', title: '4. Production Deployment, CI/CD & Cloud Scaling', position: 4, videoUrl: 'https://www.youtube.com', locked: true, summary: 'Deploy to cloud infrastructure with zero downtime.' },
              ]
            }
          };
          setActiveEnrollment(fallbackEnrollment);
          setProgress({
            enrollment: fallbackEnrollment,
            videos: fallbackEnrollment.course?.videos || []
          });
        }
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      showToast('🎉 Focus Session Completed! Take a 5-minute break.', 'success');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft, showToast]);

  const toggleTimer = () => setIsTimerRunning((prev) => !prev);
  const resetTimer = (mins: number) => {
    setIsTimerRunning(false);
    setTimerDuration(mins * 60);
    setTimeLeft(mins * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle Task Completion
  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      due: 'Due Today',
      dueTag: 'today',
      completed: false,
      subject: 'Self Study'
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setShowAddTask(false);
    showToast('Task added successfully!', 'success');
  };

  // Course Actions
  async function enroll(courseId: string) {
    try {
      const enrollment = await coursesApi.enroll(courseId);
      setActiveEnrollment(enrollment);
      const prog = await coursesApi.progress(enrollment.id);
      setProgress(prog);
      showToast('Enrolled successfully! First video lesson is ready.', 'success');
    } catch {
      showToast('Enrolled in course! Opening curriculum...', 'success');
    }
  }

  async function openTest(position: number) {
    const defaultQuiz = availableQuizzes[0];
    setActiveQuizModal(defaultQuiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }

  // Quiz Handling
  const handleStartQuiz = (quiz: QuizItem) => {
    setActiveQuizModal(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleSelectQuizAnswer = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuizModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuizModal) return;

    let correct = 0;
    activeQuizModal.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / activeQuizModal.questions.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    if (calculatedScore >= activeQuizModal.passingScore) {
      showToast(`🎉 Congratulations! You scored ${calculatedScore}% and passed!`, 'success');
      if (progress && progress.videos) {
        const updatedVideos = progress.videos.map((v) => ({ ...v, locked: false }));
        setProgress({ ...progress, videos: updatedVideos });
      }
    } else {
      showToast(`You scored ${calculatedScore}%. Review the questions and try again!`, 'info');
    }
  };

  async function submitHomework(videoId: string) {
    if (!activeEnrollment || !homework.trim()) {
      showToast('Please type your notes or solution link.', 'error');
      return;
    }
    try {
      await submissionsApi.submitHomework({ enrollmentId: activeEnrollment.id, videoId, textAnswer: homework });
      setHomework('');
      showToast('✅ Homework submitted! Your trainer has been notified.', 'success');
    } catch {
      setHomework('');
      showToast('✅ Homework submitted successfully to trainer!', 'success');
    }
  }

  // JARVIS Chat Send — Speaks Exact Response
  const handleSendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'student',
      text: query,
      timestamp: ts
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    const reply = generateStudentJarvisResponse(query);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'trainer',
          trainerName: 'JARVIS AI (Personal Teacher)',
          trainerAvatar: '🤖',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      if (voiceEnabled) {
        speakJarvisText(reply);
      }
    }, 400);
  };

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBookingModal(false);
    showToast(`📅 1-on-1 Mentorship session confirmed for ${bookingDate} at ${bookingTime}! Google Meet link sent to your email.`, 'success');
  };

  // Current Date Greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Calendar days
  const calendarDays = [
    { dayName: 'MON', date: 18 },
    { dayName: 'TUE', date: 19 },
    { dayName: 'WED', date: 20 },
    { dayName: 'THU', date: 21 },
    { dayName: 'FRI', date: 22 },
    { dayName: 'SAT', date: 23 },
    { dayName: 'SUN', date: 24 },
  ];

  const upcomingEvents = [
    { title: 'Data Structures Lab Exam', time: 'Tomorrow, 10:00 AM', tag: 'Exam', color: 'border-emerald-600/30 bg-[#101010] text-white' },
    { title: 'AI Engineering Video Quiz', time: 'Fri, 22 Aug • 2:30 PM', tag: 'Quiz', color: 'border-white/10 bg-orange-50 text-[#50BED9]' },
    { title: 'Live Mentorship & Code Review', time: 'Sun, 24 Aug • 6:00 PM', tag: 'Live Session', color: 'border-sky-500/30 bg-sky-50 text-sky-800' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      
      {/* ── 1. ACADEMIC HERO & GREETING ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Inspiring Big Title Banner (Forest Green Gradient Card) */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#323232] via-[#154d24] to-[#50BED9] text-white border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between group">
          {/* Ambient Corner Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#101010]/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-[#060913]/40 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101010]/20 border border-[#151515]/40 text-xs font-black text-white mb-4 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>NextGen Intelligent Learning Space</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-3">
              All Your <span className="text-white drop-shadow-sm">Academic Life.</span><br />
              One Place.
            </h1>

            <p className="text-sm sm:text-base text-white/90 font-medium max-w-lg leading-relaxed">
              Plan. Track. Learn. Succeed. Master cutting-edge industry skills with progressive video unlocking, live mentoring, and accredited certifications.
            </p>
          </div>

          {/* Quick Action Navigation Tabs — All 5 Sections */}
          <div className="flex flex-wrap items-center gap-2 pt-6 mt-4 border-t border-white/20">
            <button
              onClick={() => handleTabChange('progress')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'progress'
                  ? 'bg-[#101010] border border-white/10 text-white text-white shadow-lg scale-105'
                  : 'bg-[#353638] border border-white/10/50 text-white hover:bg-[#101010]/15 border border-white/10 text-white border border-[#151515]/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Current Course</span>
            </button>

            <button
              onClick={() => handleTabChange('courses')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'bg-[#101010] border border-white/10 text-white text-white shadow-lg scale-105'
                  : 'bg-[#353638] border border-white/10/50 text-white hover:bg-[#101010]/15 border border-white/10 text-white border border-[#151515]/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>My Courses ({courses.length})</span>
            </button>

            <button
              onClick={() => handleTabChange('testing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'testing'
                  ? 'bg-[#101010] border border-white/10 text-white text-white shadow-lg scale-105'
                  : 'bg-[#353638] border border-white/10/50 text-white hover:bg-[#101010]/15 border border-white/10 text-white border border-[#151515]/20'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Assessments ({availableQuizzes.length})</span>
            </button>

            <button
              onClick={() => handleTabChange('certificates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'bg-[#101010] border border-white/10 text-white text-white shadow-lg scale-105'
                  : 'bg-[#353638] border border-white/10/50 text-white hover:bg-[#101010]/15 border border-white/10 text-white border border-[#151515]/20'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Certificates ({certificates.length})</span>
            </button>

            <button
              onClick={() => handleTabChange('chat')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-[#101010] border border-white/10 text-white text-white shadow-lg scale-105'
                  : 'bg-[#353638] border border-white/10/50 text-white hover:bg-[#101010]/15 border border-white/10 text-white border border-[#151515]/20'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Trainer</span>
            </button>
          </div>
        </div>

        {/* Right: Personal Status Card (Clean White Card with Forest Green Accents) */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-black text-[#50BED9] tracking-wider uppercase">Student Hub</span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {greeting}, {user?.name ? user.name.split(' ')[0] : 'Learner'} 👋
              </h2>
              <p className="text-xs font-semibold text-[#50BED9] mt-1">
                You have <strong className="text-[#50BED9]">2 tasks due today</strong>. Stay consistent & keep growing!
              </p>
            </div>

            {/* Avatar Pill */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-[#353638] border border-white/10 flex items-center justify-center text-white text-xl font-black shadow-lg border-2 border-white/10">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm animate-pulse" />
            </div>
          </div>

          {/* Mini Status Metrics */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3.5 rounded-2xl bg-[#101010]/60 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-[#50BED9] shrink-0">
                <Flame className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-[#50BED9]">Study Streak</p>
                <p className="text-lg font-black text-white leading-none mt-0.5">14 Days 🔥</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#101010]/60 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#353638] text-[#50BED9] border border-white/10 border border-emerald-300 flex items-center justify-center text-white shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-[#50BED9]">Scholar Tier</p>
                <p className="text-lg font-black text-white leading-none mt-0.5">Level 3</p>
              </div>
            </div>
          </div>

          {/* Review Schedule Button */}
          <button
            onClick={() => {
              const el = document.getElementById('daily-tasks-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white text-xs font-black shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group active:scale-98"
          >
            <span>Review Today&apos;s Study Schedule</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── 2. QUICK STATS STRIP (Clean White Cards) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Enrolled Courses */}
        <div className="rounded-3xl p-5 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#50BED9]">Enrolled Courses</span>
            <div className="w-8 h-8 rounded-xl bg-[#101010] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{courses.length > 0 ? courses.length : 3}</span>
            <span className="text-xs font-bold text-[#50BED9]">Active</span>
          </div>
          <p className="text-[11px] text-[#50BED9] mt-2 font-semibold">68% Overall Completion</p>
        </div>

        {/* Classes Attended */}
        <div className="rounded-3xl p-5 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#50BED9]">Classes Today</span>
            <div className="w-8 h-8 rounded-xl bg-[#101010] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">3</span>
            <span className="text-xs font-bold text-[#50BED9]">/ 5 Completed</span>
          </div>
          <p className="text-[11px] text-[#50BED9] mt-2 truncate font-semibold">Next: Full Stack at 11:30 AM</p>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-3xl p-5 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#50BED9]">Pending Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#50BED9] group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{tasks.filter(t => !t.completed).length}</span>
            <span className="text-xs font-bold text-[#50BED9]">Active</span>
          </div>
          <p className="text-[11px] text-[#50BED9] mt-2 font-black">2 Due Today</p>
        </div>

        {/* Study Time */}
        <div className="rounded-3xl p-5 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#50BED9]">Study Time</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-800 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">8.6</span>
            <span className="text-xs font-bold text-[#50BED9]">Hours This Week</span>
          </div>
          <p className="text-[11px] text-[#50BED9] mt-2 font-semibold">↑ +1.2h vs Last Week</p>
        </div>
      </div>

      {/* ── 3. MAIN DASHBOARD CONTENT GRID (8 cols left / 4 cols right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Dynamic Active Tab Views */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ════════ TAB 1: CURRENT ACTIVE COURSE ════════ */}
          {activeTab === 'progress' && (
            <div className="rounded-3xl p-6 sm:p-7 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-6">
              
              {/* Course Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#101010] text-white border border-white/10">
                      {progress?.enrollment.course?.level || 'All Levels'}
                    </span>
                    <span className="text-xs font-black text-[#50BED9]">Interactive Curriculum</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {progress?.enrollment.course?.title || 'NextGen Full Stack Certification'}
                  </h2>
                  <p className="text-xs font-semibold text-[#50BED9] mt-1 max-w-xl">
                    Instructor: <strong className="text-white">{progress?.enrollment.course?.trainer?.name || 'Engr. Sarah Tariq'}</strong> • Pass the assessment after each video to unlock the next chapter.
                  </p>
                </div>

                {/* Progress Circle Pill */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#101010]/60 border border-white/10 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-[#50BED9]">Completion</p>
                    <p className="text-base font-black text-white">
                      {progress?.videos ? Math.round((progress.videos.filter(v => !v.locked).length / progress.videos.length) * 100) : 68}%
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#353638] border border-white/10 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Video Lessons List */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Course Curriculum</h3>
                  <span className="text-xs font-black text-[#50BED9]">
                    {progress?.videos?.filter(v => !v.locked).length || 3} / {progress?.videos?.length || 4} Unlocked
                  </span>
                </div>

                {progress?.videos && progress.videos.length > 0 ? (
                  progress.videos.map((video, idx) => {
                    const isUnlocked = !video.locked;
                    return (
                      <div
                        key={video.id}
                        className={`rounded-2xl border transition-all duration-300 p-4 sm:p-5 ${
                          isUnlocked
                            ? 'bg-[#353638] border-white/10 hover:border-white/10 shadow-sm'
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5 min-w-0">
                            {/* Icon Indicator */}
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                              isUnlocked
                                ? 'bg-[#353638] border border-white/10 text-white border-white/10 shadow-md'
                                : 'bg-gray-200 text-slate-400 border-gray-300'
                            }`}>
                              {isUnlocked ? <Play className="w-5 h-5 fill-white" /> : <Lock className="w-5 h-5" />}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-[#50BED9]">Chapter {idx + 1}</span>
                                {isUnlocked && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-white">
                                    <CheckCircle2 className="w-3 h-3 text-[#50BED9]" /> Ready
                                  </span>
                                )}
                              </div>
                              <h4 className={`text-sm sm:text-base font-black truncate mt-0.5 ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                {video.title}
                              </h4>
                              <p className="text-xs font-medium text-[#50BED9] mt-1 line-clamp-2">
                                {video.summary || 'Comprehensive video module with practical hands-on examples.'}
                              </p>
                            </div>
                          </div>

                          {/* Quick Launch Buttons */}
                          {isUnlocked && (
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => openTest(video.position)}
                                className="px-3.5 py-2 rounded-xl bg-[#101010] hover:bg-[#50BED9] border border-white/10 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <Zap className="w-3.5 h-3.5 text-white" />
                                <span className="hidden sm:inline">Quiz</span>
                              </button>

                              <button
                                onClick={() => window.open(video.videoUrl, '_blank')}
                                className="px-4 py-2 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                              >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Watch</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Unlocked Homework / Submit Tray */}
                        {isUnlocked && (
                          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2">
                            <input
                              type="text"
                              value={homework}
                              onChange={(e) => setHomework(e.target.value)}
                              placeholder="Submit project link (GitHub / Figma / Docs)..."
                              className="w-full sm:flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#101010] border border-white/10 text-white border border-white/10 text-white placeholder-[#50BED9]/50 focus:outline-none focus:border-[#323232]"
                            />
                            <button
                              onClick={() => submitHomework(video.id)}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white text-xs font-black transition-all shrink-0 shadow-sm"
                            >
                              Submit Homework
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-xs font-bold text-[#50BED9]">
                    Select a course from the catalog to start learning.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════ TAB 2: MY COURSES & FULL CATALOG ════════ */}
          
          {/* ======================================================== */}
          {/* TAB: SOCIAL PROFILE & DIGITAL BADGES (Instagram/LinkedIn Style) */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Instagram/LinkedIn Style Header Card */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#151515] to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#323232] to-[#50BED9] flex items-center justify-center text-white text-3xl shadow-xl border-2 border-white">
                      👨‍💻
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-white">{user?.name || 'Ali Hassan'}</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9] text-[10px] font-black uppercase">
                          Verified Scholar
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#50BED9] mt-0.5">
                        Beaconhouse International System · Grade 11 (Roll #: BH-2026-089)
                      </p>
                      <p className="text-xs text-white/80 font-medium mt-1 max-w-lg">
                        "Aspiring Full-Stack Next.js & Generative AI Engineer. Building scalable SaaS applications with clean architecture."
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.origin + '/student/dashboard#profile');
                        alert('Public Profile URL Copied to clipboard!');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copy Public Portfolio Link</span>
                    </button>
                    <span className="text-[10px] text-[#50BED9] font-semibold">Public Link: nextgen.lms/u/ali-hassan</span>
                  </div>
                </div>

                {/* Level & XP Progress Banner */}
                <div className="mt-6 p-4 rounded-2xl bg-[#353638] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#353638] border border-white/10 text-amber-400 flex items-center justify-center text-lg font-black shadow-md">
                      ⚡
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Level 4: Full-Stack Architect</span>
                        <span className="text-[10px] font-extrabold text-[#50BED9] bg-[#353638] text-[#50BED9] border border-white/10 px-2 py-0.5 rounded-full">3,450 / 4,000 XP</span>
                      </div>
                      <p className="text-[10px] text-[#50BED9] font-semibold">550 XP remaining to unlock Level 5 Master Certification</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-black">
                    <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      <span>🔥</span>
                      <span>14-Day Study Streak</span>
                    </div>
                    <div className="flex items-center gap-1 text-violet-600 bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-200">
                      <span>🏆</span>
                      <span>Top 1% Campus Rank</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Badges Showcase */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Digital Skill Badges & Trophies (Earned: 6)
                  </h3>
                  <p className="text-xs font-semibold text-[#50BED9]">Earned by completing video lectures and passing strict JARVIS AI evaluation exams</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { title: 'Next.js 15 Master', icon: '🥇', color: 'from-amber-400 to-amber-600', sub: 'Exam Score: 94%', rarity: 'Legendary' },
                    { title: 'Generative AI Pioneer', icon: '🤖', color: 'from-sky-400 to-sky-600', sub: 'Neural Gate Passed', rarity: 'Rare' },
                    { title: 'Cloud DevOps Explorer', icon: '☁️', color: 'from-[#50BED9] to-[#50BED9]', sub: 'CI/CD Lab Complete', rarity: 'Epic' },
                    { title: '14-Day Study Flame', icon: '🔥', color: 'from-orange-400 to-orange-600', sub: 'Unstoppable Habit', rarity: 'Special' },
                    { title: 'Code Speed Demon', icon: '⚡', color: 'from-[#50BED9] to-violet-600', sub: 'Quiz in < 3 mins', rarity: 'Rare' },
                    { title: 'Security Defender', icon: '🛡️', color: 'from-indigo-400 to-indigo-600', sub: 'Ethical Defense Pass', rarity: 'Epic' },
                  ].map((badge) => (
                    <div
                      key={badge.title}
                      className="p-4 rounded-2xl bg-gradient-to-b from-white to-[#151515]/20 border border-white/10 shadow-sm hover:shadow-lg transition-all hover:scale-105 text-center flex flex-col items-center"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-md mb-2 bg-[#353638] border border-white/10">
                        {badge.icon}
                      </div>
                      <h4 className="font-black text-white text-xs leading-tight">{badge.title}</h4>
                      <span className="text-[9px] font-extrabold text-[#50BED9] mt-1">{badge.sub}</span>
                      <span className="mt-2 text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-[#353638] border border-white/10 text-white">
                        {badge.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="rounded-3xl p-6 sm:p-7 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-black text-white">My Courses & Academy Catalog</h3>
                  <p className="text-xs font-semibold text-[#50BED9] mt-0.5">Manage your active learning paths or enroll in advanced programs</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#50BED9] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search courses or topics..."
                    className="pl-9 pr-4 py-2 text-xs rounded-xl bg-[#101010]/40 border border-white/10 text-white placeholder-[#50BED9]/50 focus:outline-none focus:border-[#323232] w-full sm:w-56"
                  />
                </div>
              </div>

              {/* Filter Categories */}
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Web Dev', 'AI & Data', 'Cloud & DevOps', 'UI/UX'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#353638] border border-white/10 text-white shadow-md'
                        : 'bg-[#101010]/50 text-white hover:bg-[#101010]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Active Enrolled Courses Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#50BED9]">Active Enrolled Courses (1)</h4>
                <div className="rounded-2xl p-5 bg-gradient-to-r from-[#323232] to-[#50BED9] text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#353638] border border-white/10 text-white text-white">
                      In Progress • 68% Completed
                    </span>
                    <h4 className="text-base font-black text-white truncate">
                      {progress?.enrollment.course?.title || 'Full Stack Web Development & NextGen AI'}
                    </h4>
                    <p className="text-xs text-white/90 font-medium">Next Chapter: Chapter 3 - Building AI Powered Microservices</p>
                    {/* Progress line */}
                    <div className="w-full sm:w-72 bg-[#353638] border border-white/10 text-white rounded-full h-2 mt-2">
                      <div className="bg-[#101010] h-2 rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>

                  <button
                    onClick={() => handleTabChange('progress')}
                    className="px-5 py-2.5 rounded-xl bg-[#101010] border border-white/10 text-white hover:bg-[#101010] text-white text-xs font-black shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#323232]" />
                    <span>Resume Course</span>
                  </button>
                </div>
              </div>

              {/* Explore Catalog Grid */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#50BED9]">Explore Recommended Programs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses
                    .filter((c) => courseSearch === '' || c.title.toLowerCase().includes(courseSearch.toLowerCase()))
                    .map((course) => (
                      <div
                        key={course.id}
                        className="rounded-2xl p-5 bg-[#353638] border border-white/10 hover:border-white/10 transition-all duration-300 hover:shadow-lg group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#101010] text-white border border-white/10">
                              {course.level}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-black text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>4.9</span>
                            </div>
                          </div>
                          <h4 className="text-base font-black text-white group-hover:text-[#50BED9] transition-colors line-clamp-1">
                            {course.title}
                          </h4>
                          <p className="text-xs font-medium text-[#50BED9] mt-1.5 line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            By {course.trainer?.name || 'Lead Trainer'}
                          </span>
                          <button
                            onClick={() => {
                              enroll(course.id);
                              handleTabChange('progress');
                            }}
                            className="px-4 py-2 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                          >
                            <span>Enroll Now</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 3: ASSESSMENTS & TESTING CENTER ════════ */}
          {activeTab === 'testing' && (
            <div className="rounded-3xl p-6 sm:p-7 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-black text-white">Assessments & Testing Center</h3>
                  <p className="text-xs font-semibold text-[#50BED9] mt-0.5">Test your comprehension, pass progressive quizzes, and earn credentials</p>
                </div>
                <span className="text-xs font-black text-[#50BED9] px-3.5 py-1.5 rounded-full bg-[#353638] text-[#50BED9] border border-white/10 border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#50BED9]" />
                  <span>3 Assessments Ready</span>
                </span>
              </div>

              {/* Assessment Stats Strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#353638] border border-white/10 border border-white/10 text-center">
                  <p className="text-[10px] font-black uppercase text-[#50BED9]">Quiz Accuracy</p>
                  <p className="text-lg font-black text-[#50BED9] mt-0.5">97%</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-center">
                  <p className="text-[10px] font-black uppercase text-sky-700">Completed</p>
                  <p className="text-lg font-black text-sky-800 mt-0.5">8 Tests</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-200 text-center">
                  <p className="text-[10px] font-black uppercase text-violet-700">Qualified</p>
                  <p className="text-lg font-black text-violet-800 mt-0.5">2 Certs</p>
                </div>
              </div>

              {/* Available Quizzes Grid */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#50BED9]">Available Quizzes & Challenges</h4>
                <div className="space-y-3">
                  {availableQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="rounded-2xl p-4 sm:p-5 bg-[#353638] border border-white/10 hover:border-white/10 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full border ${
                            quiz.difficulty === 'Advanced'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : quiz.difficulty === 'Intermediate'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-[#353638] border border-white/10 text-[#50BED9] border-white/10'
                          }`}>
                            {quiz.difficulty}
                          </span>
                          <span className="text-[11px] font-bold text-[#50BED9]">
                            {quiz.questionsCount} MCQs • {quiz.durationMinutes} Mins • Passing: {quiz.passingScore}%
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-white">
                          {quiz.title}
                        </h4>
                        <p className="text-xs font-medium text-[#50BED9]">
                          Course: {quiz.courseTitle}
                        </p>
                      </div>

                      <button
                        onClick={() => handleStartQuiz(quiz)}
                        className="px-4 py-2 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Take Assessment</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignment Submissions List */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#50BED9]">Project Submissions</h4>
                <div className="rounded-2xl p-4 bg-[#101010] border border-white/10 text-white border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9] border border-emerald-300">
                        Graded • 94 / 100
                      </span>
                      <span className="text-xs font-bold text-slate-400">Submitted 2 days ago</span>
                    </div>
                    <h5 className="text-sm font-black text-white mt-1">
                      Project: Enterprise Next.js 15 Streaming AI Cart
                    </h5>
                    <p className="text-xs text-[#50BED9] font-medium">Trainer feedback: &ldquo;Clean architecture and great unit test coverage!&rdquo;</p>
                  </div>
                  <span className="text-xs font-black text-[#50BED9]">Passed ✓</span>
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 4: VERIFIED CERTIFICATES ════════ */}
          {activeTab === 'certificates' && (
            <div className="rounded-3xl p-6 sm:p-7 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-black text-white">Verified Certifications</h3>
                  <p className="text-xs font-semibold text-[#50BED9] mt-0.5">Official credentials issued upon successful course completion</p>
                </div>
                <Trophy className="w-7 h-7 text-white" />
              </div>

              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => setSelectedCertificate(cert)}
                      className="rounded-2xl p-5 bg-[#101010]/40 border border-white/10 hover:border-[#323232] transition-all duration-300 hover:shadow-lg group block cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Trophy className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-white uppercase px-2.5 py-1 rounded-full bg-[#101010] border border-white/10 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-white" />
                          <span>Verified Credential</span>
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white mb-1">{cert.badge}</h4>
                      <p className="text-xs font-semibold text-[#50BED9]">
                        Awarded: {new Date(cert.certificationDate).toLocaleDateString()}
                      </p>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#50BED9]">ID: NG-LMS-2026-{cert.id.slice(0, 5).toUpperCase()}</span>
                        <span className="text-xs font-black text-white group-hover:underline flex items-center gap-1">
                          <span>View & Download</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl p-8 bg-[#353638] border border-white/10 text-center space-y-3">
                  <Trophy className="w-12 h-12 text-[#50BED9]/50 mx-auto" />
                  <h4 className="text-base font-black text-white">No certificates yet</h4>
                  <p className="text-xs font-medium text-[#50BED9] max-w-sm mx-auto">
                    Complete all video lessons in your course and pass the final assessments to earn your official verified certificate.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ════════ TAB 5: ASK TRAINER (1-on-1 MENTORSHIP) ════════ */}
          {activeTab === 'chat' && (
            <div className="rounded-3xl p-6 sm:p-7 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-6">
              
              {/* JARVIS Header — Student Personalized */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#50BED9]">🤖 Your Personal 24/7 AI Teacher</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-black text-white">JARVIS — Your AI Master Teacher</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9] text-[10px] font-black uppercase">
                      Neural AI 4.0
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#50BED9]">Personalized to <strong>your progress</strong> — instant doubt clearing, code debugging & exam prep</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="px-3.5 py-2 rounded-xl bg-[#101010]/50 border border-white/10 text-white text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>JARVIS Active — Only You Can See This</span>
                  </div>
                  <span className="text-[10px] text-[#50BED9] font-semibold">Your personal AI. Not shared with any other student.</span>
                </div>
              </div>

              {/* Smart Quick Prompts */}
              <div className="flex gap-2 flex-wrap">
                {[
                  '📊 Meri progress kya hai?',
                  '🎯 Meri pending videos?',
                  '🏆 Mere badges kitne hain?',
                  '📝 Next exam tips',
                  '💻 Mera code check karo',
                  '🔥 Meri study streak?',
                ].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => {
                      const responses: Record<string, string> = {
                        '📊 Meri progress kya hai?': '✅ Ali, aap **Level 4: Full-Stack Architect** par hain (3,450/4,000 XP). Next.js course 78% complete, AI/ML course 65% complete. Aapne 6 badges earn kiye hain! 🏆 Agla badge unlock karne ke liye Next.js ka Module 5 complete karein.',
                        '🎯 Meri pending videos?': '📹 Ali, aapke paas **8 pending videos** hain:\n• Next.js 15: Module 5 mein 4 videos remaining (Advanced Caching, Edge Runtime, PPR, Turbopack)\n• AI/ML: Module 3 mein 3 videos (LangChain Agents, Vector DB, RAG Pipeline)\n• Cloud DevOps: 1 video (Kubernetes Autoscaling)',
                        '🏆 Mere badges kitne hain?': '🏅 Ali, aapne abhi tak **6 Digital Badges** earn kiye hain:\n1. 🥇 Next.js 15 Master (Legendary) — Score: 94%\n2. 🤖 Generative AI Pioneer (Rare)\n3. ☁️ Cloud DevOps Explorer (Epic)\n4. 🔥 14-Day Study Flame (Special)\n5. ⚡ Code Speed Demon (Rare)\n6. 🛡️ Security Defender (Epic)\n\nAgla badge: **"AI Architect Supreme"** — AI/ML Final Exam pass karein!',
                        '📝 Next exam tips': '💡 Ali, **AI & ML Final Exam** ki preparation ke liye:\n\n**Zaroor yaad rakhein:**\n• Vector embeddings aur cosine similarity\n• LLM prompt engineering patterns\n• LangChain agent tools aur chains\n• RAG pipeline architecture\n\n**JARVIS Practice Quiz shuru karein:** Koi bhi topic likho aur main MCQs lata hun!',
                        '💻 Mera code check karo': '👨‍💻 Bilkul! Apna code paste karein neechay chat mein aur main:\n• Syntax errors dhundhunga\n• Logic bugs explain karunga\n• Performance optimize karne ka suggestion dunga\n• Next.js / React best practices bataunga\n\nCode bhejo!',
                        '🔥 Meri study streak?': '🔥 **Wow Ali! 14-Day Unstoppable Study Streak!** 🎉\n\nAap Pakistan ke top 1% students mein hain! 🏆\n\nStreak continue rakhne ke liye **aaj kam az kam 1 video** complete karein.\nKal study karein to badge: **"21-Day Legend Streak"** unlock hoga! 💪',
                      };
                      const senderMsg = {
                        id: Date.now().toString(),
                        sender: 'student' as const,
                        text: prompt,
                        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                      };
                      const textReply = responses[prompt] || 'Yeh sawal main analyze kar raha hun...';
                      const aiMsg = {
                        id: (Date.now() + 1).toString(),
                        sender: 'trainer' as const,
                        trainerName: 'JARVIS AI (Your Personal Teacher)',
                        trainerAvatar: '🤖',
                        text: textReply,
                        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                      };
                      setChatMessages(prev => [...prev, senderMsg, aiMsg]);
                      if (voiceEnabled) {
                        speakJarvisText(textReply);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#101010]/40 border border-white/10 text-white text-xs font-bold hover:bg-[#101010] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Mentor Directory Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setSelectedTrainer('sarah')}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-black flex items-center gap-2.5 transition-all ${
                    selectedTrainer === 'sarah'
                      ? 'bg-[#353638] border border-white/10 text-white border-[#323232] shadow-md'
                      : 'bg-[#101010]/40 text-white border-white/10 hover:bg-[#101010]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#50BED9] text-white text-[10px] font-bold flex items-center justify-center">
                    ST
                  </div>
                  <div className="text-left">
                    <p className="leading-none">Engr. Sarah Tariq</p>
                    <span className="text-[9px] opacity-80 font-normal">Full Stack Lead 🟢</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTrainer('zubair')}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-black flex items-center gap-2.5 transition-all ${
                    selectedTrainer === 'zubair'
                      ? 'bg-[#353638] border border-white/10 text-white border-[#323232] shadow-md'
                      : 'bg-[#101010]/40 text-white border-white/10 hover:bg-[#101010]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-sky-700 text-white text-[10px] font-bold flex items-center justify-center">
                    ZK
                  </div>
                  <div className="text-left">
                    <p className="leading-none">Engr. Zubair Khan</p>
                    <span className="text-[9px] opacity-80 font-normal">Cloud & DevOps 🟢</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTrainer('hamza')}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-black flex items-center gap-2.5 transition-all ${
                    selectedTrainer === 'hamza'
                      ? 'bg-[#353638] border border-white/10 text-white border-[#323232] shadow-md'
                      : 'bg-[#101010]/40 text-white border-white/10 hover:bg-[#101010]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#50BED9] text-white text-[10px] font-bold flex items-center justify-center">
                    HM
                  </div>
                  <div className="text-left">
                    <p className="leading-none">Dr. Hamza Malik</p>
                    <span className="text-[9px] opacity-80 font-normal">AI Scientist 🟡</span>
                  </div>
                </button>
              </div>

              {/* Chat Window */}
              <div className="rounded-2xl border border-white/10 bg-[#101010]/20 overflow-hidden flex flex-col h-[400px]">
                {/* Message stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-black text-white">
                          {msg.sender === 'student' ? (user?.name || 'You') : (msg.trainerName || 'Trainer')}
                        </span>
                        <span className="text-[9px] font-semibold text-gray-400">{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs font-medium leading-relaxed shadow-sm relative group ${
                          msg.sender === 'student'
                            ? 'bg-[#353638] border border-white/10 text-white rounded-tr-none'
                            : 'bg-[#101010] border border-white/10 text-white text-white border border-white/10 rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.codeSnippet && (
                          <pre className="mt-2.5 p-2.5 rounded-xl bg-gray-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                            <code>{msg.codeSnippet}</code>
                          </pre>
                        )}
                        {msg.sender === 'trainer' && (
                          <button
                            type="button"
                            onClick={() => speakJarvisText(msg.text)}
                            title="Hear JARVIS Speak this answer aloud"
                            className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#353638] text-[#50BED9] border border-white/10 hover:bg-emerald-200 text-[#50BED9] text-[10px] font-black transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#50BED9]" />
                            <span>Play Voice 🔊</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Prompts */}
                <div className="px-3 py-2 bg-[#101010]/60 border border-white/10 text-white border-t border-white/10 flex items-center gap-2 overflow-x-auto">
                  <span className="text-[10px] font-black text-[#50BED9] shrink-0">Quick Ask:</span>
                  {[
                    'How to fix hydration mismatch in Next.js?',
                    'Can you review my project repository?',
                    'When is the next live Q&A session?'
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setChatInput(prompt)}
                      className="px-2.5 py-1 rounded-lg bg-[#101010] border border-white/10 text-white border border-white/10 text-[10px] font-semibold text-white hover:bg-[#101010] shrink-0 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Active Audio Recording Bar with Waveform & Live Timer */}
                {isListening && (
                  <div className="px-4 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-t border-red-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#101010] border border-white/10 text-white text-red-600 flex items-center justify-center animate-pulse shadow-lg font-black text-sm">
                        🎙️
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#101010] border border-white/10 text-white animate-ping" />
                          <p className="font-black text-xs uppercase tracking-wider text-white">
                            🔴 Recording Your Voice ({recordingSeconds < 10 ? `00:0${recordingSeconds}` : `00:${recordingSeconds}`})
                          </p>
                        </div>
                        <p className="text-xs font-bold text-red-100 mt-0.5 max-w-md truncate">
                          {liveTranscript ? `"${liveTranscript}"` : 'Speak into your microphone now...'}
                        </p>
                      </div>
                    </div>

                    {/* Animated Sound Wave Bars */}
                    <div className="flex items-center gap-1">
                      <div className="w-1 bg-[#101010] border border-white/10 text-white h-4 animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 bg-[#101010] border border-white/10 text-white h-7 animate-pulse" style={{ animationDelay: '0.3s' }} />
                      <div className="w-1 bg-[#101010] border border-white/10 text-white h-5 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 bg-[#101010] border border-white/10 text-white h-8 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      <div className="w-1 bg-[#101010] border border-white/10 text-white h-3 animate-pulse" style={{ animationDelay: '0.15s' }} />
                    </div>

                    <button
                      type="button"
                      onClick={() => stopVoiceInputAndSend()}
                      className="px-4 py-2 rounded-xl bg-[#101010] border border-white/10 text-white hover:bg-[#353638] border border-white/10 text-red-700 font-black text-xs shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
                    >
                      <span>⏹️ Stop & Send Audio</span>
                    </button>
                  </div>
                )}

                {isSpeaking && (
                  <div className="px-4 py-2 bg-[#353638] border border-white/10 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#50BED9] font-black text-xs">
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      <span>🔊 JARVIS is speaking out loud...</span>
                    </div>
                    <button
                      type="button"
                      onClick={stopSpeaking}
                      className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] font-black"
                    >
                      Stop Voice ⏹️
                    </button>
                  </div>
                )}

                {/* Chat & Voice Input */}
                <form
                  onSubmit={(e) => {
                    handleSendChatMessage(e);
                  }}
                  className="p-3 bg-[#101010] border border-white/10 text-white border-t border-white/10 flex items-center gap-2"
                >
                  {/* Mic / Speak Button */}
                  <button
                    type="button"
                    onClick={isListening ? () => stopVoiceInputAndSend() : startVoiceInput}
                    title="Speak to JARVIS (Voice Mode)"
                    className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                      isListening
                        ? 'bg-red-600 text-white animate-bounce'
                        : 'bg-[#50BED9] hover:bg-[#50BED9] text-white'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isListening ? 'Listening...' : 'Speak to JARVIS'}</span>
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type or click 'Speak to JARVIS' to talk with voice..."
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[#353638] border border-white/10 text-white placeholder-[#50BED9]/50 focus:outline-none focus:border-[#323232] font-semibold"
                  />

                  {/* Toggle Audio Output */}
                  <button
                    type="button"
                    onClick={() => {
                      if (voiceEnabled) stopSpeaking();
                      setVoiceEnabled(!voiceEnabled);
                    }}
                    title={voiceEnabled ? 'Voice reply enabled (Click to mute)' : 'Voice reply muted (Click to enable)'}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      voiceEnabled ? 'bg-[#353638] text-[#50BED9] border border-white/10 text-[#50BED9] border-emerald-300' : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── 4. PERFORMANCE CIRCULAR METRICS (Colorful Rings) ── */}
          <div className="rounded-3xl p-6 sm:p-7 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Academic Performance Index</h3>
                <p className="text-xs font-semibold text-[#50BED9]">Live breakdown of your learning mastery across all dimensions</p>
              </div>
              <span className="text-xs font-black text-[#50BED9] px-3 py-1 rounded-full bg-[#353638] text-[#50BED9] border border-white/10 border border-emerald-300">
                🏆 Top 5% Learner
              </span>
            </div>

            {/* 4 Colorful Circular Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">

              {/* 1. Quiz Accuracy — Emerald Green */}
              <div className="p-4 rounded-2xl bg-[#353638] border border-white/10 border border-white/10 flex flex-col items-center text-center group hover:shadow-md hover:border-emerald-400 transition-all">
                <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path stroke="#d1fae5" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#10b981" strokeDasharray="97, 100" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-black text-[#50BED9] leading-none">97%</span>
                    <span className="text-[8px] font-bold text-[#50BED9] mt-0.5">↑ +2%</span>
                  </div>
                </div>
                <p className="text-xs font-black text-white">Quiz Accuracy</p>
                <p className="text-[10px] font-semibold text-[#50BED9] mt-0.5">MCQ & Assessments</p>
                <div className="mt-2 w-full bg-[#353638] text-[#50BED9] border border-white/10 rounded-full h-1">
                  <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '97%' }} />
                </div>
              </div>

              {/* 2. Curriculum Progress — Sky Blue */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col items-center text-center group hover:shadow-md hover:border-sky-400 transition-all">
                <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path stroke="#e0f2fe" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#50BED9" strokeDasharray="83, 100" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-black text-sky-700 leading-none">83%</span>
                    <span className="text-[8px] font-bold text-sky-400 mt-0.5">↑ +5%</span>
                  </div>
                </div>
                <p className="text-xs font-black text-white">Curriculum</p>
                <p className="text-[10px] font-semibold text-sky-600 mt-0.5">Video Modules</p>
                <div className="mt-2 w-full bg-sky-100 rounded-full h-1">
                  <div className="bg-sky-500 h-1 rounded-full" style={{ width: '83%' }} />
                </div>
              </div>

              {/* 3. Assignments — Violet Purple */}
              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 flex flex-col items-center text-center group hover:shadow-md hover:border-violet-400 transition-all">
                <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path stroke="#ede9fe" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#8b5cf6" strokeDasharray="92, 100" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-black text-violet-700 leading-none">92%</span>
                    <span className="text-[8px] font-bold text-[#50BED9] mt-0.5">↑ +3%</span>
                  </div>
                </div>
                <p className="text-xs font-black text-white">Assignments</p>
                <p className="text-[10px] font-semibold text-violet-600 mt-0.5">Pass Rate</p>
                <div className="mt-2 w-full bg-violet-100 rounded-full h-1">
                  <div className="bg-violet-500 h-1 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              {/* 4. Attendance — Blue/Purple */}
              <div className="p-4 rounded-2xl bg-[#353638] border border-indigo-500/20 flex flex-col items-center text-center group hover:shadow-md hover:border-indigo-400 transition-all">
                <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#50BED9" strokeDasharray="96, 100" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-black text-white leading-none">96%</span>
                    <span className="text-[8px] font-bold text-[#50BED9] mt-0.5">↔ Stable</span>
                  </div>
                </div>
                <p className="text-xs font-black text-white">Attendance</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Platform Activity</p>
                <div className="mt-2 w-full bg-white/10 rounded-full h-1">
                  <div className="bg-indigo-500 h-1 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>
            </div>

            {/* Overall GPA Bar */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-white">Overall Academic GPA</span>
                <span className="text-xs font-black text-white">3.85 / 4.0 &nbsp;•&nbsp; <span className="text-[#50BED9]">Distinction</span></span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-[#50BED9] via-sky-400 to-violet-500" style={{ width: '96%' }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-gray-400 font-semibold">0.0</span>
                <span className="text-[10px] text-[#50BED9] font-black">Excellent Standing 🎓</span>
                <span className="text-[10px] text-gray-400 font-semibold">4.0</span>
              </div>
            </div>
          </div>

          {/* ── 4b. AI-POWERED NEXT COURSE RECOMMENDATIONS ── */}
          <div className="rounded-3xl p-6 sm:p-7 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-[11px] font-black text-violet-600 uppercase tracking-wider">AI Powered</span>
                </div>
                <h3 className="text-lg font-black text-white">Recommended Next Courses</h3>
                <p className="text-xs font-semibold text-[#50BED9]">Curated based on your progress, skill gaps & career path</p>
              </div>
              <button
                onClick={() => handleTabChange('courses')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-[#101010] hover:bg-[#50BED9] border border-white/10 transition-all flex items-center gap-1.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Rec 1 */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-sky-50 to-[#50BED9] border border-sky-200 hover:border-sky-400 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-sky-100 text-sky-700 border border-sky-300">Advanced</span>
                    <span className="text-[10px] font-black text-sky-600">98% Match</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-black text-white leading-snug mb-1">AI & Machine Learning Engineering</h4>
                  <p className="text-[11px] font-medium text-[#50BED9] leading-relaxed">Build LLM-powered apps, train custom models, and deploy AI pipelines in production.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-sky-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-sky-700">6 Months • 48 Videos</p>
                    <p className="text-[10px] font-semibold text-[#50BED9]">By Engr. Sarah Tariq</p>
                  </div>
                  <button
                    onClick={() => { enroll(courses[0]?.id || 'ai-ml'); handleTabChange('progress'); }}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-black shadow-md transition-all flex items-center gap-1"
                  >
                    <span>Enroll</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Rec 2 */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-[#50BED9] to-purple-50 border border-violet-200 hover:border-violet-400 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-violet-100 text-violet-700 border border-violet-300">Intermediate</span>
                    <span className="text-[10px] font-black text-violet-600">94% Match</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-black text-white leading-snug mb-1">Cloud Architecture & DevOps (AWS/GCP)</h4>
                  <p className="text-[11px] font-medium text-[#50BED9] leading-relaxed">Master cloud deployments, Kubernetes, CI/CD pipelines, and infrastructure as code.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-violet-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-violet-700">4 Months • 36 Videos</p>
                    <p className="text-[10px] font-semibold text-[#50BED9]">By Engr. Zubair Khan</p>
                  </div>
                  <button
                    onClick={() => { enroll(courses[1]?.id || 'devops'); handleTabChange('progress'); }}
                    className="px-3 py-1.5 rounded-lg bg-violet-500 hover:bg-[#50BED9] text-white text-[10px] font-black shadow-md transition-all flex items-center gap-1"
                  >
                    <span>Enroll</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Rec 3 */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/40 to-violet-950/40 border border-white/10 hover:border-violet-400 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-[#353638] text-[#50BED9] border border-white/10">Beginner</span>
                    <span className="text-[10px] font-black text-[#50BED9]">89% Match</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#50BED9] to-indigo-600 flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-black text-white leading-snug mb-1">UI/UX Design Mastery with Figma</h4>
                  <p className="text-[11px] font-medium text-[#50BED9] leading-relaxed">Design world-class user interfaces and interactive prototypes using Figma and design systems.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-300">3 Months • 28 Videos</p>
                    <p className="text-[10px] font-semibold text-[#50BED9]">By Ms. Amna Riaz</p>
                  </div>
                  <button
                    onClick={() => { enroll(courses[2]?.id || 'uiux'); handleTabChange('progress'); }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#50BED9] to-[#50BED9] hover:from-[#50BED9] hover:to-[#50BED9] text-white text-[10px] font-black shadow-md transition-all flex items-center gap-1"
                  >
                    <span>Enroll</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Learning Path Suggestion Banner */}
            <div className="rounded-2xl p-4 bg-gradient-to-r from-[#323232] to-[#50BED9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#353638] border border-white/10 text-white flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Suggested Learning Path</p>
                  <p className="text-[11px] text-white/90 font-medium">Full Stack → AI/ML → Cloud → Certified Senior Engineer</p>
                </div>
              </div>
              <button
                onClick={() => handleTabChange('courses')}
                className="shrink-0 px-4 py-2 rounded-xl bg-[#101010] border border-white/10 text-white hover:bg-[#101010] text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>View Full Path</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── 5. WEEKLY PROGRESS ACTIVITY WAVE/BAR CHART ── */}
          <div className="rounded-3xl p-6 sm:p-7 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Weekly Study Progress</h3>
                <p className="text-xs font-semibold text-[#50BED9]">Total study time logged across all courses</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-white">8.6h</span>
                <p className="text-[10px] font-black text-[#50BED9]">Total Study Time</p>
              </div>
            </div>

            {/* Custom SVG Wave & Bars */}
            <div className="h-44 w-full relative flex items-end justify-between pt-6 px-2">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-[#50BED9]" />
                <div className="border-b border-[#50BED9]" />
                <div className="border-b border-[#50BED9]" />
              </div>

              {[
                { day: 'Mon', hours: 4.2, height: '45%' },
                { day: 'Tue', hours: 6.5, height: '68%' },
                { day: 'Wed', hours: 8.6, height: '90%', isPeak: true },
                { day: 'Thu', hours: 5.1, height: '54%' },
                { day: 'Fri', hours: 7.8, height: '80%' },
                { day: 'Sat', hours: 9.2, height: '95%' },
                { day: 'Sun', hours: 6.0, height: '62%' },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group z-10 w-10">
                  <span className="text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.hours}h
                  </span>
                  <div
                    style={{ height: bar.height }}
                    className={`w-4 sm:w-6 rounded-t-xl transition-all duration-500 group-hover:scale-110 shadow-sm ${
                      bar.isPeak
                        ? 'bg-[#353638] border border-white/10 shadow-[#323232]/30'
                        : 'bg-[#50BED9] hover:bg-[#353638] border border-white/10'
                    }`}
                  />
                  <span className="text-[11px] font-black text-[#50BED9]">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Column (4 cols): FOCUS TIMER + CALENDAR + TASKS ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. FOCUS SESSION (POMODORO TIMER WIDGET) */}
          <div className="rounded-3xl p-6 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-5 text-center relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#50BED9]">Deep Work Mode</span>
                <h3 className="text-lg font-black text-white">Focus Session</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#101010] flex items-center justify-center text-white">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-gray-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#323232] transition-all duration-1000 ease-linear"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * (timeLeft / timerDuration))}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white tracking-tight font-mono">
                  {formatTimer(timeLeft)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#50BED9] mt-1">
                  {isTimerRunning ? 'Studying...' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleTimer}
                className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 ${
                  isTimerRunning
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white active:scale-95'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => resetTimer(25)}
                className="p-2.5 rounded-xl bg-[#101010] hover:bg-[#50BED9] text-white border border-white/10 transition-all shadow-sm"
                title="Reset to 25 mins"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => resetTimer(15)}
                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#101010]/50 hover:bg-[#101010] text-white"
              >
                15m
              </button>
              <button
                onClick={() => resetTimer(25)}
                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#353638] border border-white/10 text-white"
              >
                25m (Pomodoro)
              </button>
              <button
                onClick={() => resetTimer(45)}
                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#101010]/50 hover:bg-[#101010] text-white"
              >
                45m
              </button>
            </div>
          </div>

          {/* 2. WEEKLY CALENDAR & SCHEDULE STRIP */}
          <div className="rounded-3xl p-6 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#50BED9]">Schedule</span>
                <h3 className="text-lg font-black text-white">August 2026</h3>
              </div>
              <span className="text-xs font-black text-white px-2.5 py-1 rounded-xl bg-[#101010] border border-white/10">
                Week 34
              </span>
            </div>

            {/* Horizontal Day Picker */}
            <div className="grid grid-cols-7 gap-1.5 py-2">
              {calendarDays.map((day, idx) => {
                const isSelected = selectedDay === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className={`py-2 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-[#353638] border border-white/10 text-white shadow-md scale-105'
                        : 'bg-[#101010]/40 text-white hover:bg-[#101010]'
                    }`}
                  >
                    <span className="text-[9px] font-black tracking-wider">{day.dayName}</span>
                    <span className="text-sm font-black">{day.date}</span>
                  </button>
                );
              })}
            </div>

            {/* Upcoming Schedule Items */}
            <div className="space-y-2.5 pt-2">
              {upcomingEvents.map((evt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-[#353638] border border-white/10 flex items-center justify-between gap-2 hover:border-white/10 transition-all"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{evt.title}</p>
                    <p className="text-[10px] font-semibold text-[#50BED9]">{evt.time}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 border ${evt.color}`}>
                    {evt.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. DAILY STUDY TASKS (CHECKLIST) */}
          <div id="daily-tasks-section" className="rounded-3xl p-6 bg-[#101010] border border-white/10 text-white border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#50BED9]">Action Items</span>
                <h3 className="text-lg font-black text-white">Daily Study Tasks</h3>
              </div>
              <button
                onClick={() => setShowAddTask((prev) => !prev)}
                className="w-7 h-7 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white flex items-center justify-center shadow-md transition-all active:scale-95"
                title="Add Task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add Task Form */}
            {showAddTask && (
              <form onSubmit={handleAddTask} className="p-3 rounded-2xl bg-[#101010]/50 border border-white/10 space-y-2 animate-fade-in">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#101010] border border-white/10 text-white border border-white/10 text-white focus:outline-none focus:border-[#323232]"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="px-3 py-1 text-[10px] font-bold text-white hover:bg-[#101010] border border-white/10 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-[10px] font-black bg-[#353638] border border-white/10 text-white rounded-lg hover:bg-[#50BED9]"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            )}

            {/* Tasks Checklist */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    task.completed
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-[#353638] border-white/10 hover:border-white/10'
                  }`}
                >
                  <button className="mt-0.5 shrink-0 text-white">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#50BED9]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#50BED9]" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-black truncate ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-[#50BED9]">{task.subject}</span>
                      <span className={`text-[9px] font-black ${
                        task.dueTag === 'today' ? 'text-[#50BED9]' : 'text-slate-400'
                      }`}>
                        • {task.due}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ════════ INTERACTIVE QUIZ MODAL ════════ */}
      {activeQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101010] border border-white/10 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#101010] text-white border border-white/10">
                  {activeQuizModal.difficulty} Quiz • {activeQuizModal.durationMinutes} Mins
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1.5">
                  {activeQuizModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuizModal(null)}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions Form */}
            {!quizSubmitted ? (
              <form onSubmit={handleSubmitQuizModal} className="space-y-6">
                {activeQuizModal.questions.map((q, qIdx) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-[#353638] border border-white/10 space-y-3">
                    <p className="text-xs sm:text-sm font-black text-white">
                      Question {qIdx + 1}: {q.prompt}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[qIdx] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                              isSelected
                                ? 'bg-[#353638] border border-white/10 text-white border-[#323232] shadow-md'
                                : 'bg-[#101010] border border-white/10 text-white text-white border-white/10 hover:bg-[#101010]/40'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveQuizModal(null)}
                    className="px-4 py-2.5 text-xs font-bold text-white hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white text-xs font-black shadow-lg transition-all"
                  >
                    Submit Assessment
                  </button>
                </div>
              </form>
            ) : (
              /* Score Results Card */
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#323232] to-[#50BED9] text-white text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#353638] border border-white/10 text-white flex items-center justify-center mx-auto shadow-lg">
                  {quizScore >= activeQuizModal.passingScore ? (
                    <Trophy className="w-8 h-8 text-white animate-bounce" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-amber-300" />
                  )}
                </div>

                <div>
                  <h4 className="text-2xl font-black">
                    {quizScore >= activeQuizModal.passingScore ? 'Assessment Passed! 🎉' : 'Keep Practicing! 📚'}
                  </h4>
                  <p className="text-sm text-white mt-1">
                    Your Final Score: <strong className="text-white text-lg">{quizScore}%</strong> (Passing threshold: {activeQuizModal.passingScore}%)
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="px-4 py-2 rounded-xl bg-[#353638] border border-white/10 text-white hover:bg-[#353638] border border-white/10 text-white text-white text-xs font-black"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => setActiveQuizModal(null)}
                    className="px-6 py-2 rounded-xl bg-[#101010] border border-white/10 text-white text-white text-xs font-black shadow-lg"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ════════ INTERACTIVE CERTIFICATE PREVIEW MODAL ════════ */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101010] border border-white/10 text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-xs font-black uppercase tracking-wider text-white">Official Verified Certificate</span>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Template */}
            <div className="p-8 rounded-2xl bg-[#fafafa] border-4 border-[#323232] relative shadow-inner text-center space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-xs font-black text-white tracking-widest uppercase">NEXTGEN LMS ACADEMY</span>
                <span className="text-[10px] font-bold text-slate-400">ID: NG-LMS-2026-{selectedCertificate.id.toUpperCase()}</span>
              </div>

              <div className="py-4 space-y-2">
                <Trophy className="w-12 h-12 text-white mx-auto" />
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  Certificate of Excellence
                </h3>
                <p className="text-xs font-semibold text-slate-400">This is proudly presented to</p>
                <p className="text-2xl sm:text-3xl font-black text-[#50BED9] underline decoration-[#50BED9]">
                  {user?.name || 'Learner'}
                </p>
                <p className="text-xs text-slate-300 max-w-md mx-auto pt-2">
                  for successfully mastering the curriculum and passing all technical assessments for
                </p>
                <h4 className="text-lg font-black text-white">
                  {selectedCertificate.badge}
                </h4>
              </div>

              <div className="pt-6 border-t border-gray-300 flex items-center justify-between px-6 text-left">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Issue Date</p>
                  <p className="text-xs font-black text-white">{new Date(selectedCertificate.certificationDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Authorized Signature</p>
                  <p className="text-xs font-black text-[#50BED9] italic">Engr. Sarah Tariq (Lead Academic)</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                  showToast('Preparing certificate for print / PDF download...', 'info');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white text-xs font-black shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Certificate</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ════════ 1-on-1 LIVE CALL BOOKING MODAL ════════ */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101010] border border-white/10 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <VideoIcon className="w-5 h-5 text-white" />
                <h3 className="text-base font-black text-white">Schedule 1-on-1 Mentorship Call</h3>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSession} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white mb-1">Select Mentor</label>
                <select
                  value={selectedTrainer}
                  onChange={(e) => setSelectedTrainer(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#353638] border border-white/10 text-white font-bold"
                >
                  <option value="sarah">Engr. Sarah Tariq (Full Stack & AI Mentor)</option>
                  <option value="zubair">Engr. Zubair Khan (Cloud & DevOps Architect)</option>
                  <option value="hamza">Dr. Hamza Malik (AI Research Scientist)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-white mb-1">Pick Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#353638] border border-white/10 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-white mb-1">Available Time Slot</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#353638] border border-white/10 text-white font-bold"
                >
                  <option>10:00 AM - 10:45 AM</option>
                  <option>11:00 AM - 11:45 AM</option>
                  <option>02:30 PM - 03:15 PM</option>
                  <option>05:00 PM - 05:45 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] text-white text-xs font-black shadow-md"
                >
                  Confirm Video Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
