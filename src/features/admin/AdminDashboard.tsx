'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { analyticsApi, coursesApi, usersApi } from '@/lib/api';
import type { Course, User } from '@/types/domain';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  UserCheck, 
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Star,
  Activity,
  TrendingUp
} from 'lucide-react';

export function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  async function load() {
    try {
      setIsLoading(true);
      setError('');
      const [courseRows, userRows, overview] = await Promise.all([
        coursesApi.adminList(),
        usersApi.list(),
        analyticsApi.overview()
      ]);
      setCourses(courseRows);
      setUsers(userRows);
      setAnalytics(overview);
    } catch (err: any) {
      setError(err?.message || 'Unable to load admin dashboard');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function reviewCourse(courseId: string, status: 'approved' | 'rejected') {
    try {
      await coursesApi.adminReview(courseId, status);
      await load();
    } catch (err: any) {
      setError(err?.message || 'Failed to review course');
    }
  }

  const pendingCount = courses.filter((c: any) => c.status === 'pending').length;
  const trainerCount = users.filter((u: any) => u.role === 'trainer').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-800 border border-gray-700 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-sky-500/30 bg-gray-800 p-4 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400 flex-1">{error}</p>
          <button 
            onClick={() => setError('')} 
            className="text-[#1a6b2e] hover:text-[#0f3d1a] transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f3d1a] tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-[#1a6b2e] mt-1">Monitor platform metrics and manage course approvals</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a6b2e]" />
            <input 
              type="text" 
              placeholder="Search users or courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-[#0f3d1a] placeholder-gray-500 focus:outline-none focus:border-sky-500/50 transition-colors w-64"
            />
          </div>
          <Button variant="ghost" className="border border-gray-700 hover:bg-gray-800 text-[#1a6b2e]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="ghost" className="border border-gray-700 hover:bg-gray-800 text-[#1a6b2e]">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <section id="analytics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10">
                    <Users className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-sm font-medium text-[#1a6b2e]">Total Learners</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-[#0f3d1a]">{(analytics.learners ?? 0).toLocaleString()}</p>
                  <span className="flex items-center text-xs font-medium text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +12%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10">
                    <GraduationCap className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-sm font-medium text-[#1a6b2e]">Active Trainers</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-[#0f3d1a]">{(analytics.trainers ?? 0).toLocaleString()}</p>
                  <span className="flex items-center text-xs font-medium text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10">
                    <Building2 className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-sm font-medium text-[#1a6b2e]">Institutes</p>
                </div>
                <p className="text-3xl font-bold text-[#0f3d1a]">{(analytics.institutes ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-sm font-medium text-[#1a6b2e]">Total Courses</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-[#0f3d1a]">{(analytics.courses ?? 0).toLocaleString()}</p>
                  <span className="flex items-center text-xs font-medium text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +18%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10">
                    <UserCheck className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-sm font-medium text-[#1a6b2e]">Enrollments</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-[#0f3d1a]">{(analytics.enrollments ?? 0).toLocaleString()}</p>
                  <span className="flex items-center text-xs font-medium text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +24%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10">
                    <Award className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-sm font-medium text-[#1a6b2e]">Certificates</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-[#0f3d1a]">{(analytics.certificates ?? 0).toLocaleString()}</p>
                  <span className="flex items-center text-xs font-medium text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +8%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Course Approval System */}
          <Card id="courses">
            <div className="flex items-center justify-between mb-6">
              <CardTitle 
                title="Course Approval System" 
                caption="Review trainer-submitted courses before publication." 
              />
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {pendingCount} Pending
              </span>
            </div>
            
            <div className="space-y-4">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div 
                    key={course.id} 
                    className="rounded-xl border border-gray-700 bg-gray-800 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-500/5 flex items-center justify-center border border-sky-500/20">
                            <BookOpen className="w-5 h-5 text-sky-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[#0f3d1a] truncate">{course.title}</h3>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-500/20 text-amber-300 border-amber-500/30">
                                {(course as any).status || 'pending'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#1a6b2e]">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" />
                                {course.level}
                              </span>
                              <span className="flex items-center gap-1">
                                <GraduationCap className="w-3.5 h-3.5" />
                                {course.trainer?.name ?? 'Unknown Trainer'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Pending Review
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {(course as any).status === 'pending' ? (
                        <div className="flex items-center gap-2 lg:flex-shrink-0">
                          <Button 
                            onClick={() => reviewCourse(course.id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-[#0f3d1a]"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => reviewCourse(course.id, 'rejected')}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="lg:flex-shrink-0">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState 
                  title="No courses to review" 
                  detail="Trainer course submissions will appear here for your approval." 
                />
              )}
            </div>
          </Card>

          {/* User Management Table */}
          <Card id="users">
            <div className="flex items-center justify-between mb-6">
              <CardTitle 
                title="User Management" 
                caption="Complete overview of all platform users and their roles." 
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#1a6b2e]">{users.length} total users</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-[#1a6b2e] uppercase">User</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-[#1a6b2e] uppercase">Role</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-[#1a6b2e] uppercase">Category</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-[#1a6b2e] uppercase">Marketplace</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-[#1a6b2e] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm font-medium text-[#0f3d1a] border border-gray-500/30">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-[#0f3d1a]">{user.name}</p>
                              <p className="text-xs text-[#1a6b2e]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {(user as any).role || 'learner'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-[#1a6b2e]">
                          {(user as any).learnerCategory || (user as any).trainerLevel || 'Portal'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 text-sm ${(user as any).marketplaceGigAccess ? 'text-emerald-400' : 'text-[#7dab52]'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${(user as any).marketplaceGigAccess ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                            {(user as any).marketplaceGigAccess ? 'Enabled' : 'Locked'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12">
                        <EmptyState 
                          title="No users found" 
                          detail="Users will appear here once they register on the platform." 
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Platform Activity */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-sky-400" />
              <h3 className="font-semibold text-[#0f3d1a]">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-700">
                <div className="w-2 h-2 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#0f3d1a]">New course submitted for review</p>
                  <p className="text-xs text-[#1a6b2e] mt-1">1h ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-700">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#0f3d1a]">Course "React Masters" approved</p>
                  <p className="text-xs text-[#1a6b2e] mt-1">2h ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-700">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#0f3d1a]">New trainer registration</p>
                  <p className="text-xs text-[#1a6b2e] mt-1">4h ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#0f3d1a]">50 new learners enrolled</p>
                  <p className="text-xs text-[#1a6b2e] mt-1">6h ago</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Platform Health */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h3 className="font-semibold text-[#0f3d1a]">Platform Health</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#1a6b2e]">Course Approval Rate</span>
                  <span className="text-emerald-400 font-medium">94%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#1a6b2e]">User Engagement</span>
                  <span className="text-sky-400 font-medium">78%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-amber-500 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Trainer Verification Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <CardTitle 
            title="Trainer Verification" 
            caption="Portfolio, teaching experience, and joining reason during registration." 
          />
          <span className="text-sm text-[#1a6b2e]">
            {trainerCount} Trainers
          </span>
        </div>
        
        {trainerCount > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.filter((u: any) => u.role === 'trainer').map((trainer: any) => (
              <div 
                key={trainer.id} 
                className="group rounded-xl border border-gray-700 bg-gray-800 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 hover:border-sky-500/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center border border-sky-500/20">
                    <span className="text-xl font-bold text-sky-400">
                      {trainer.name?.charAt(0)?.toUpperCase() || 'T'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0f3d1a] truncate">{trainer.name}</h3>
                    <p className="text-sm text-[#1a6b2e] truncate mt-0.5">{trainer.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs text-[#1a6b2e]">
                        <Star className="w-3 h-3 text-amber-400" />
                        {trainer.trainerLevel || 'New Trainer'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No trainers registered yet" 
            detail="Verified trainer profiles will appear here once they complete registration." 
          />
        )}
      </Card>
    </div>
  );
}