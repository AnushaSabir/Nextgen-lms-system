"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { coursesApi } from "@/services/api";
import CertificatePreview from '@/components/public/CertificatePreview';
import {
  Search,
  Star,
  Users,
  ArrowRight,
  CheckCircle2,
  Filter,
  BookOpen,
  Briefcase,
  Award,
  Play,
  Pause,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  ChevronRight,
  Layers,
  Target,
  Calendar,
  MessageCircle,
  Code,
  Palette,
  Megaphone,
  Video,
  Bot,
  ShoppingBag,
  FileText,
  Trophy,
  Globe,
  Headphones,
  ThumbsUp,
  Eye,
  Rocket,
  Heart,
  GitBranch,
  LineChart,
  Settings,
  UserPlus,
  Mail,
  Crown,
  Flame,
  Compass,
  GraduationCap,
  Building2,
  Users2,
  VideoIcon,
  FileCheck,
  MessageSquare,
  Download,
  Share2,
  BookMarked,
  FolderKanban,
  BarChart,
  LifeBuoy,
  LayoutDashboard,
  CircleDot,
  Mic,
} from "lucide-react";

const MOCK_COURSES = [
  {
    id: 1,
    title: "The Complete Web Development Bootcamp",
    level: "Beginner",
    trainer_name: "Usama Akbar",
    students: "2.4k",
    rating: "4.9",
    total_students: "2.4k",
    duration: "45 hours",
    lectures: 287,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Graphic Design Masterclass - Learn Photoshop, Illustrator",
    level: "Intermediate",
    trainer_name: "USAMA JUTT",
    students: "1.8k",
    rating: "4.8",
    total_students: "1.8k",
    duration: "32 hours",
    lectures: 156,
    thumbnail:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "The Digital Marketing Complete Course",
    level: "All Levels",
    trainer_name: "Kiran Sundhu",
    students: "3.1k",
    rating: "4.7",
    total_students: "3.1k",
    duration: "28 hours",
    lectures: 189,
    thumbnail:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Artificial Intelligence A-Z 2024",
    level: "Advanced",
    trainer_name: "Kirill Eremenko",
    students: "900",
    rating: "4.9",
    total_students: "900",
    duration: "52 hours",
    lectures: 324,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "UI/UX Design Specialization",
    level: "Intermediate",
    trainer_name: "Brad Frost",
    students: "1.5k",
    rating: "4.8",
    total_students: "1.5k",
    duration: "38 hours",
    lectures: 198,
    thumbnail:
      "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    title: "Python for Data Science and Machine Learning",
    level: "Intermediate",
    trainer_name: "Jose Portilla",
    students: "2.9k",
    rating: "4.9",
    total_students: "2.9k",
    duration: "42 hours",
    lectures: 267,
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80",
  },
];

const CoursesPage = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    level: "All",
    category: "All",
    sort: "Most Popular",
    search: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await coursesApi.getAll(filters);
      if (data && data.length > 0) {
        setCourses(data);
      } else if (
        filters.search ||
        filters.level !== "All" ||
        filters.category !== "All"
      ) {
        setCourses([]);
      } else {
        setCourses(MOCK_COURSES);
      }
    };
    fetchCourses();
  }, [filters]);

  const categories = [
    "All",
    "Development",
    "Design",
    "Marketing",
    "AI",
    "Business",
    "Photography",
  ];

  return (
    <div className="relative min-h-screen bg-[#c8e6c9] text-[#0f3d1a] overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-primaryBlue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-48 w-96 h-96 bg-primaryBlue/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero Image Background */}
      <div className="absolute top-0 inset-x-0 h-[500px] sm:h-[600px] pointer-events-none overflow-hidden z-0">
        <img
          src="/images/course_hero_student.jpg"
          alt="Student studying on NextGen LMS"
          className="absolute inset-0 w-full h-full object-cover opacity-80 z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/80 to-[#c8e6c9] z-20" />
      </div>

      <div className="pt-28 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-bold uppercase tracking-widest backdrop-blur-sm hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-default">
              <Sparkles className="w-3.5 h-3.5" /> Start Learning Today
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0f3d1a] tracking-tight leading-tight">
              Master the Skills that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryBlue to-[#C6D6C0]">
                Drive Careers Forward
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#1a6b2e] max-w-2xl mx-auto text-left sm:text-center">
              Join millions of learners worldwide. Learn from industry experts
              with real-world projects and certificates.
            </p>
          </div>

          {/* Search Bar */}
         <div className="max-w-3xl mx-auto mb-16">
  <div className="relative group">
    {/* Search Icon - FIXED: properly centered on all screen sizes */}
    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1a6b2e] w-5 h-5 group-hover:scale-110 group-hover:text-primaryBlue transition-all duration-300 z-10" />
    <input
      type="text"
      placeholder="Search for any skill..."
      className="w-full bg-[#1a6b2e]/5 backdrop-blur-sm border border-[#1a6b2e]/20 rounded-2xl sm:rounded-full py-4 pl-12 pr-4 sm:pr-28 text-[#0f3d1a] focus:outline-none focus:border-primaryBlue/50 focus:shadow-[0_0_25px_rgba(240,89,31,0.15)] transition-all text-sm sm:text-base"
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
    />
    {/* Desktop button - hidden on mobile, shown on sm and up */}
    <button className="hidden sm:block absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primaryBlue rounded-full text-sm font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_10px_20px_rgba(240,89,31,0.3)]">
      Search
    </button>
  </div>
  {/* Mobile button - shown only below sm breakpoint, full width below input */}
  <button className="mt-3 w-full sm:hidden px-5 py-2 bg-primaryBlue rounded-full text-sm font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-[1.02] active:scale-95">
    Search
  </button>
  <div className="flex flex-wrap justify-center gap-2 mt-4">
    {[
      "Python",
      "UI/UX",
      "Marketing",
      "Data Science",
      "Business",
      "Photography",
    ].map((tag) => (
      <button
        key={tag}
        className="px-3 py-1.5 rounded-full bg-[#1a6b2e]/5 border border-[#1a6b2e]/10 text-xs text-[#1a6b2e] hover:bg-primaryBlue/10 hover:border-primaryBlue/20 hover:text-[#0f3d1a] hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300"
      >
        {tag}
      </button>
    ))}
  </div>
</div>

          {/* Trust Bar */}
          <div className="bg-[#0f172a]/50 backdrop-blur-md border border-[#1a6b2e]/10 rounded-2xl p-4 sm:p-5 mb-16 hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10 text-sm text-[#1a6b2e]">
              {[
                { icon: Users2, text: "25M+ learners" },
                { icon: VideoIcon, text: "75+ languages" },
                { icon: Award, text: "Industry certificates" },
                { icon: Building2, text: "10K+ enterprise clients" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 group cursor-default text-center"
                >
                  <item.icon className="w-4 h-4 text-primaryBlue group-hover:scale-150 group-hover:rotate-12 group-hover:-translate-y-1 transition-all duration-300" />
                  <span className="font-medium group-hover:text-[#0f3d1a] transition-colors">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Strip */}
          <div className="mb-12 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat.toLowerCase())}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap hover:-translate-y-1 hover:shadow-lg ${
                    activeCategory === cat.toLowerCase()
                      ? "bg-primaryBlue text-[#0f3d1a] shadow-lg shadow-primaryBlue/25 scale-105 hover:scale-110"
                      : "bg-[#1a6b2e]/5 text-[#1a6b2e] hover:bg-white/10 border border-[#1a6b2e]/10 hover:border-[#1a6b2e]/20 hover:scale-105"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Courses Section - Bento Layout with 3D */}
          <div className="mb-24">
            {/* Header Section - Cleaner Design */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f3d1a] tracking-tight mb-2">
                  Featured Courses <span className="text-[#0f3d1a]">&</span> Capabilities
                </h2>
                <p className="text-sm sm:text-base text-[#1a6b2e] leading-relaxed">
                  Discover our most popular courses designed with cutting-edge learning features. Every course includes AI-assisted learning, practical assignments, and interactive modules to help you master new skills effectively.
                </p>
              </div>
              <Link
                href="/courses"
                className="text-[#0f3d1a] text-sm font-semibold hover:underline flex items-center gap-1 group transition-all duration-300 hover:gap-2"
              >
                View all{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Main Featured Card - Larger and Clearer */}
              <div className="lg:col-span-3 relative rounded-xl overflow-hidden bg-gray-900 group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#d94d19]/10 transition-all duration-500 border border-[#d94d19]/30">
                {/* Image Container with fixed aspect ratio */}
                <div className="relative w-full pt-[56.25%] overflow-hidden">
                  <img
                    src={courses[0].thumbnail}
                    alt={courses[0].title}
                    className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                {/* Badge */}
                <div className="absolute top-5 left-5 px-3 py-1.5 rounded-lg bg-[#d94d19] text-[#0f3d1a] text-xs font-bold shadow-lg z-10">
                  Bestseller
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10">
                  <div className="space-y-2 sm:space-y-3">
                    <span className="text-xs font-semibold text-[#0f3d1a] uppercase tracking-wider">
                      {courses[0].level} • {courses[0].duration}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0f3d1a] leading-tight group-hover:text-[#0f3d1a] transition-colors duration-300 line-clamp-2">
                      {courses[0].title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-[#0f3d1a]">
                          {courses[0].rating}
                        </span>
                      </div>
                      <span className="text-[#1a6b2e]">
                        ({courses[0].students} students)
                      </span>
                      <span className="text-[#1a6b2e]">
                        • {courses[0].trainer_name}
                      </span>
                    </div>
                    <button className="mt-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#d94d19] hover:bg-orange-600 rounded-lg text-[#0f3d1a] font-semibold transition-all duration-300 shadow-lg shadow-[#d94d19]/25 hover:shadow-[#d94d19]/40 hover:scale-105 active:scale-95 text-sm sm:text-base">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Right side cards container */}
              <div className="lg:col-span-2 space-y-5">
                {/* Course Card 1 - Clean Horizontal Design */}
                <div className="flex flex-row bg-navy-900 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl hover:shadow-[#d94d19]/10 transition-all duration-300 hover:-translate-y-1 border border-[#d94d19]/30">
                  <div className="w-2/5 relative overflow-hidden">
                    <div className="relative w-full pt-[100%]">
                      <img
                        src={courses[1].thumbnail}
                        alt={courses[1].title}
                        className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="w-3/5 p-3 sm:p-4 md:p-5 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-[#0f3d1a] uppercase tracking-wider mb-1">
                      {courses[1].level}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1 line-clamp-2 group-hover:text-[#0f3d1a] transition-colors">
                      {courses[1].title}
                    </h3>
                    <p className="text-xs text-white/80 mb-2 truncate">
                      {courses[1].trainer_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-white">
                        {courses[1].rating}
                      </span>
                      <span className="text-xs text-white/80">
                        ({courses[1].students})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Card 2 - Clean Horizontal Design */}
                <div className="flex flex-row bg-navy-900 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl hover:shadow-[#d94d19]/10 transition-all duration-300 hover:-translate-y-1 border border-[#d94d19]/30">
                  <div className="w-2/5 relative overflow-hidden">
                    <div className="relative w-full pt-[100%]">
                      <img
                        src={courses[2].thumbnail}
                        alt={courses[2].title}
                        className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="w-3/5 p-3 sm:p-4 md:p-5 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-[#0f3d1a] uppercase tracking-wider mb-1">
                      {courses[2].level}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1 line-clamp-2 group-hover:text-[#0f3d1a] transition-colors">
                      {courses[2].title}
                    </h3>
                    <p className="text-xs text-white/80 mb-2 truncate">
                      {courses[2].trainer_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-white">
                        {courses[2].rating}
                      </span>
                      <span className="text-xs text-white/80">
                        ({courses[2].students})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Paths - Split Layout + Dashboard UI */}
          <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f3d1a] tracking-tight">
                Curated{" "}
                <span className="text-primaryBlue">Learning Paths</span>
              </h2>
              <p className="text-[#1a6b2e] text-base leading-relaxed">
                From beginner to professional, follow structured paths designed
                by industry experts to get job-ready faster.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  {
                    title: "Web Developer",
                    icon: Code,
                    courses: 12,
                    level: "Beginner to Advanced",
                  },
                  {
                    title: "Data Scientist",
                    icon: BarChart,
                    courses: 8,
                    level: "Intermediate",
                  },
                  {
                    title: "UI/UX Designer",
                    icon: Palette,
                    courses: 10,
                    level: "All Levels",
                  },
                  {
                    title: "Digital Marketer",
                    icon: Megaphone,
                    courses: 9,
                    level: "Beginner Friendly",
                  },
                ].map((path) => {
                  const IconComp = path.icon;
                  return (
                    <div
                      key={path.title}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-[#1a6b2e]/10 hover:border-primaryBlue/30 hover:bg-[#1a6b2e]/5 transition-all duration-300 group cursor-pointer hover:scale-[1.03] hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_20px_40px_-10px_rgba(240,89,31,0.2)]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#1a6b2e]/5 group-hover:bg-primaryBlue text-[#0f3d1a]/60 group-hover:text-[#0f3d1a] flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-[0_0_15px_rgba(240,89,31,0.3)]">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-[#0f3d1a] mb-0.5">
                          {path.title}
                        </h3>
                        <p className="text-xs text-[#1a6b2e]">
                          {path.level} • {path.courses} Courses
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#1a6b2e] group-hover:text-primaryBlue group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mock Dashboard UI */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-bl from-primaryBlue/10 to-transparent rounded-3xl blur-2xl opacity-40 pointer-events-none group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-[#0f172a] border border-[#1a6b2e]/10 rounded-2xl p-5 shadow-2xl space-y-4 hover:scale-[1.02] hover:-translate-y-4 hover:rotate-1 hover:shadow-[0_30px_60px_-15px_rgba(240,89,31,0.3)] transition-all duration-500">
                <div className="flex items-center justify-between pb-3 border-b border-[#1a6b2e]/10">
                  <div className="flex items-center gap-2 group/icon cursor-default">
                    <LayoutDashboard className="w-4 h-4 text-primaryBlue group-hover/icon:scale-125 group-hover/icon:rotate-12 transition-transform duration-300" />
                    <span className="text-xs font-semibold text-white">
                      My Learning Path
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold group-hover/icon:scale-110 transition-transform duration-300">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#1a6b2e]/5 flex items-center justify-center text-primaryBlue group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primaryBlue/20 transition-all duration-300">
                    <Code className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Full-Stack Web Development
                    </p>
                    <p className="text-xs text-white/80">
                      7 of 12 Courses Completed
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/80">Overall Progress</span>
                      <span className="text-white font-medium">58%</span>
                    </div>
                    <div className="h-2 bg-[#1a6b2e]/5 rounded-full overflow-hidden">
                      <div className="h-full w-[58%] bg-gradient-to-r from-primaryBlue to-[#d94d19] rounded-full group-hover:w-[70%] transition-all duration-1000"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/80">Projects Built</span>
                      <span className="text-white font-medium">4/6</span>
                    </div>
                    <div className="h-2 bg-[#1a6b2e]/5 rounded-full overflow-hidden">
                      <div className="h-full w-[66%] bg-white/30 rounded-full group-hover:w-[80%] transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-2 py-2.5 bg-primaryBlue/10 text-primaryBlue text-sm font-semibold rounded-lg hover:bg-primaryBlue hover:text-[#0f3d1a] transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:scale-105 hover:shadow-lg active:scale-95">
                  Continue Learning{" "}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Recommended Courses - Horizontal Scroll with 3D */}
          <div className="mb-24">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f3d1a]">
                  Recommended for you
                </h2>
                <p className="text-sm text-[#1a6b2e] mt-1">
                  Based on your interests
                </p>
              </div>
              <Link
                href="/recommended"
                className="text-primaryBlue text-sm font-semibold hover:underline flex items-center gap-1 group hover:scale-110 transition-transform duration-300"
              >
                View all{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {courses.slice(3, 6).map((course) => (
                <div
                  key={course.id}
                  className="min-w-[min(18rem,calc(100vw-2rem))] w-[min(20rem,calc(100vw-2rem))] rounded-2xl overflow-hidden bg-[#0f172a] border border-[#1a6b2e]/10 group cursor-pointer hover:scale-[1.05] hover:-translate-y-6 hover:rotate-1 hover:shadow-[0_30px_60px_-15px_rgba(240,89,31,0.4)] transition-all duration-500 ease-out flex-shrink-0"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs font-semibold text-[#0f3d1a] flex items-center gap-1 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <Clock className="w-3 h-3 text-primaryBlue" />{" "}
                      {course.duration}
                    </div>
                  </div>
                  <div className="p-5 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-primaryBlue font-bold bg-primaryBlue/10 px-2 py-0.5 rounded group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 inline-block">
                        {course.level}
                      </span>
                      <span className="text-xs text-white/80">
                        {course.lectures} lectures
                      </span>
                    </div>
                    <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primaryBlue transition-colors h-12">
                      {course.title}
                    </h3>
                    <p className="text-sm text-white/80 mb-4">
                      {course.trainer_name}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-sm font-bold text-white">
                          {course.rating}
                        </span>
                        <span className="text-xs text-white/80">
                          ({course.students})
                        </span>
                      </div>
                      <button className="text-xs font-semibold text-primaryBlue hover:text-[#0f3d1a] hover:bg-primaryBlue px-3 py-1.5 rounded-lg border border-primaryBlue/30 hover:border-primaryBlue transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-[0_10px_20px_rgba(240,89,31,0.3)]">
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate Preview Section */}
          <div className="mb-24 bg-white/50 backdrop-blur-sm border border-[#1a6b2e]/10 rounded-[3rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primaryBlue/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#0f3d1a] text-sm font-bold uppercase tracking-wider border border-orange-100">
                  <Award className="w-4 h-4" />
                  Official Certification
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f3d1a] leading-tight">
                  Get Your <span className="text-[#0f3d1a]">Certificate</span> <br/>
                  Upon Course Completion
                </h2>
                
                <div className="space-y-4 text-base sm:text-lg text-[#1a6b2e] leading-relaxed">
                  <p>
                    Every course you successfully complete on NextGen LMS comes with a verified, industry-recognized certificate. 
                  </p>
                  <p>
                    This is your proof of expertise. Add it to your resume, showcase it on your LinkedIn profile, and instantly stand out to top employers worldwide.
                  </p>
                  <ul className="space-y-3 mt-6">
                    {['Verify your skills with employers', 'Instantly shareable on social media', 'Downloadable high-resolution format', 'Integrated with your freelance profile'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0f3d1a]" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4">
                  <button className="px-8 py-4 bg-[#d94d19] text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300">
                    Explore Eligible Courses
                  </button>
                </div>
              </div>
              
              <div className="w-full relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-primaryBlue rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <CertificatePreview />
              </div>
            </div>
          </div>

          {/* Student Success Stats - Modern 3D Cards */}

          <div className="mb-24">
            {/* Header Section - Cleaner Design */}
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f3d1a] tracking-tight">
                Trusted by learners globally
              </h2>
              <p className="text-sm text-[#1a6b2e] mt-2">
                Real numbers, real impact.
              </p>
            </div>

            {/* Stats Grid - Modern Clean Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
              {[
                {
                  number: "25M+",
                  label: "Active Learners",
                  icon: Users2,
                  trend: "+12%",
                  trendColor: "text-green-500",
                },
                {
                  number: "1,800+",
                  label: "Expert Courses",
                  icon: BookOpen,
                  trend: "+45",
                  trendColor: "text-[#0f3d1a]",
                },
                {
                  number: "75+",
                  label: "Languages",
                  icon: Globe,
                  trend: "+8",
                  trendColor: "text-green-500",
                },
                {
                  number: "85%",
                  label: "Career Impact",
                  icon: TrendingUp,
                  trend: "+23%",
                  trendColor: "text-purple-500",
                },
              ].map((stat) => {
                const IconComp = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="group relative p-6 rounded-2xl bg-navy-900 border border-[#d94d19]/30 shadow-sm hover:shadow-lg hover:shadow-[#d94d19]/5 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Icon Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#d94d19]/10 flex items-center justify-center group-hover:bg-[#d94d19] transition-colors duration-300">
                        <IconComp className="w-6 h-6 text-[#0f3d1a] group-hover:text-[#0f3d1a] transition-colors duration-300" />
                      </div>
                      {/* Trend Indicator */}
                      <span
                        className={`text-xs font-semibold ${stat.trendColor} bg-green-500/10 px-2 py-1 rounded-full`}
                      >
                        {stat.trend}
                      </span>
                    </div>

                    {/* Stats Numbers */}
                    <div>
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-1 group-hover:text-[#0f3d1a] transition-colors duration-300">
                        {stat.number}
                      </div>
                      <p className="text-sm text-white/80 font-medium">
                        {stat.label}
                      </p>
                    </div>

                    {/* Subtle Progress Bar */}
                    <div className="mt-4 h-0.5 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-gradient-to-r from-[#d94d19] to-[#d94d19] rounded-full group-hover:w-full transition-all duration-700" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Instructor CTA - Glassmorphism & 3D */}

          <div className="relative mb-16 rounded-2xl overflow-hidden bg-navy-900 border border-[#d94d19]/30 shadow-lg hover:shadow-xl transition-all duration-500 group">
            {/* Decorative elements - subtle and clean */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#d94d19]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#d94d19]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid md:grid-cols-2 gap-8 sm:gap-10 p-6 sm:p-8 md:p-12 items-center">
              {/* Left side - Content */}
              <div className="space-y-5 text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-[#d94d19]/10 border border-orange-200 dark:border-[#d94d19]/20 text-orange-600 dark:text-[#0f3d1a] text-xs font-bold uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5 text-[#0f3d1a]" />
                  Become an Instructor
                </div>

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Teach what you <span className="text-[#0f3d1a]">love</span>
                </h2>

                {/* Description */}
                <p className="text-white/80 text-base leading-relaxed">
                  Share your expertise with millions of learners worldwide. Join
                  our community of instructors and earn money doing what you
                  enjoy.
                </p>

                {/* CTA Button */}
                <button className="group/btn px-6 py-3 bg-[#d94d19] hover:bg-orange-600 rounded-xl text-[#0f3d1a] font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#d94d19]/25 flex items-center gap-2 w-fit">
                  Start Teaching Today
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Right side - Clean Stats Display */}
              <div className="relative flex flex-col items-center justify-center py-8">
                {/* Main Stat Circle */}
                <div className="relative mb-6">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#d94d19] to-orange-600 flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#0f3d1a]">5K+</div>
                      <div className="text-xs text-orange-100 mt-1">
                        Instructors
                      </div>
                    </div>
                  </div>

                  {/* Orbiting elements - icons with navy blue background */}
                  <div className="absolute -top-6 -right-6 w-14 h-14 rounded-xl bg-navy-900 shadow-md border border-[#d94d19]/30 flex items-center justify-center">
                    <Video className="w-6 h-6 text-[#0f3d1a]" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-14 h-14 rounded-xl bg-navy-900 shadow-md border border-[#d94d19]/30 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-[#0f3d1a]" />
                  </div>
                  <div className="absolute top-1/2 -right-10 -translate-y-1/2 w-12 h-12 rounded-lg bg-navy-900 shadow-md border border-[#d94d19]/30 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-[#0f3d1a]" />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-6 mt-4 pt-4 border-t border-[#d94d19]/20">
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#0f3d1a]">$3.2M+</div>
                    <div className="text-xs text-[#1a6b2e]">Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#0f3d1a]">150+</div>
                    <div className="text-xs text-[#1a6b2e]">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
