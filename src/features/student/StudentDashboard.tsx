'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, SelectInput, TextArea } from '@/components/ui/Field';
import { assessmentApi, certificatesApi, coursesApi, groupsApi, submissionsApi } from '@/lib/api';
import type { Certificate, Course, Enrollment, ProgressiveTest } from '@/types/domain';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Lock,
  Trophy,
  MessageSquare,
  Users,
  FileText,
  AlertCircle,
  Zap,
  Calendar,
  Clock
} from 'lucide-react';

export function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeEnrollment, setActiveEnrollment] = useState<Enrollment | null>(null);
  const [progress, setProgress] = useState<{ enrollment: Enrollment; videos: Course['videos'] } | null>(null);
  const [test, setTest] = useState<ProgressiveTest | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [homework, setHomework] = useState('');
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    const [courseRows, certRows] = await Promise.all([coursesApi.list(), certificatesApi.mine().catch(() => [])]);
    setCourses(courseRows);
    setCertificates(certRows);
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  async function enroll(courseId: string) {
    const enrollment = await coursesApi.enroll(courseId);
    setActiveEnrollment(enrollment);
    setProgress(await coursesApi.progress(enrollment.id));
    setMessage('Enrollment active. Video 1 is unlocked.');
  }

  async function openTest(position: number) {
    if (!activeEnrollment) return;
    const built = await assessmentApi.build(activeEnrollment.id, position);
    setTest(built);
    setAnswers({});
  }

  async function submitTest(event: FormEvent) {
    event.preventDefault();
    if (!test) return;
    const attempt = await assessmentApi.submit(test.enrollmentId, test.afterVideoPosition, test.assessmentSetIds, answers);
    setMessage(attempt.passed ? 'Passed. The next video is unlocked.' : 'Failed. Retry will use a different question set when available.');
    setProgress(await coursesApi.progress(test.enrollmentId));
    setTest(null);
  }

  async function submitHomework(videoId: string) {
    if (!activeEnrollment) return;
    await submissionsApi.submitHomework({ enrollmentId: activeEnrollment.id, videoId, textAnswer: homework });
    setHomework('');
    setMessage('Homework submitted. Trainer has been notified.');
  }

  async function askTrainer(trainerId?: string) {
    if (!trainerId || !question) return;
    await groupsApi.askTrainer(trainerId, question);
    setQuestion('');
    setMessage('Question sent to trainer.');
  }

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {message && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 transition-all duration-300 ${
          message.includes('Passed') || message.includes('submitted') || message.includes('sent') || message.includes('joined')
            ? 'border-emerald-500/30 bg-emerald-500/10'
            : 'border-blue-500/30 bg-blue-500/10'
        }`}>
          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            message.includes('Passed') || message.includes('submitted') || message.includes('sent') || message.includes('joined')
              ? 'text-emerald-400'
              : 'text-blue-400'
          }`} />
          <p className={`text-sm flex-1 ${
            message.includes('Passed') || message.includes('submitted') || message.includes('sent') || message.includes('joined')
              ? 'text-emerald-200'
              : 'text-blue-200'
          }`}>{message}</p>
        </div>
      )}

      {/* Page Header */}
      {activeEnrollment ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0f3d1a] tracking-tight">My Learning Journey</h1>
            <p className="text-sm text-[#1a6b2e] mt-1">Complete structured courses with video lessons and assessments</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-sm font-medium text-orange-300">Active Learning</span>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-[#0f3d1a] tracking-tight">Available Courses</h1>
          <p className="text-sm text-[#1a6b2e] mt-1">Choose a course and start your learning journey</p>
        </div>
      )}

      {/* Available Courses Section */}
      {!activeEnrollment && (
        <Card id="courses" className="border-[#c8e6c9]/10">
          <CardTitle 
            title="Browse Courses" 
            caption="Enroll in a course to start learning with progressive video unlocking." 
          />
          
          {courses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className="group rounded-xl border border-[#c8e6c9]/10 bg-[#0f3d1a] shadow-lg shadow-black/20 hover:shadow-xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 hover:border-sky-500/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-500/5 flex items-center justify-center border border-sky-500/20">
                      <BookOpen className="w-5 h-5 text-sky-400" />
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {course.level}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-white text-lg mb-1 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-[#c8e6c9] mb-3 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-[#c8e6c9] mb-4">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.trainer?.name ?? 'Expert Trainer'}
                  </div>
                  
                  <Button 
                    onClick={() => enroll(course.id)}
                    className="w-full bg-[#c8e6c9] hover:bg-white text-[#0f3d1a] font-bold transition-all duration-200"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Enroll Now
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No courses available" 
              detail="Check back soon for new courses matching your level." 
            />
          )}
        </Card>
      )}

      {/* Active Learning Section */}
      {activeEnrollment && progress ? (
        <>
          {/* Progress Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-[#0f3d1a] to-[#1a6b2e] border-[#c8e6c9]/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#c8e6c9] mb-2">Current Course</p>
                  <p className="text-lg font-semibold text-white">{progress.enrollment.course?.title ?? 'Active'}</p>
                  <p className="text-xs text-[#c8e6c9] mt-2">{progress.enrollment.course?.level}</p>
                </div>
                <BookOpen className="w-8 h-8 text-sky-400/30" />
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#0f3d1a] to-[#1a6b2e] border-[#c8e6c9]/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#c8e6c9] mb-2">Trainer</p>
                  <p className="text-lg font-semibold text-white">{progress.enrollment.course?.trainer?.name ?? 'Your Trainer'}</p>
                  <p className="text-xs text-emerald-400 mt-2">Connected</p>
                </div>
                <Users className="w-8 h-8 text-blue-400/30" />
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#0f3d1a] to-[#1a6b2e] border-[#c8e6c9]/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#c8e6c9] mb-2">Unlocked</p>
                  <p className="text-lg font-semibold text-white">
                    {progress.videos?.filter(v => !v.locked).length}/{progress.videos?.length}
                  </p>
                  <p className="text-xs text-[#c8e6c9] mt-2">lessons</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-400/30" />
              </div>
            </Card>
          </div>

          {/* Video Lessons */}
          <Card id="testing" className="border-[#c8e6c9]/10">
            <div className="flex items-center justify-between mb-6">
              <CardTitle 
                title="Video Lessons" 
                caption="Complete each lesson and pass the test to unlock the next one." 
              />
              <span className="text-sm text-[#c8e6c9]">
                {progress.videos?.length} lessons
              </span>
            </div>
            
            {progress.videos && progress.videos.length > 0 ? (
              <div className="space-y-4">
                {progress.videos.map((video, index) => (
                  <div 
                    key={video.id} 
                    className={`rounded-xl border transition-all duration-300 ${
                      video.locked
                        ? 'border-[#c8e6c9]/10 bg-[#0f3d1a] shadow-lg shadow-black/20 hover:shadow-xl/50'
                        : 'border-[#c8e6c9]/10 bg-[#0f3d1a] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-lg hover:shadow-sky-500/5 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border ${
                          video.locked
                            ? 'bg-[#0f3d1a] shadow-lg shadow-black/20 hover:shadow-xl/50 border-[#c8e6c9]/10 text-[#7dab52]'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}>
                          {video.locked ? (
                            <Lock className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0f3d1a] shadow-lg shadow-black/20 hover:shadow-xl text-xs font-semibold text-[#c8e6c9]">
                              {index + 1}
                            </span>
                            <h3 className={`font-semibold ${video.locked ? 'text-[#c8e6c9]' : 'text-white'}`}>
                              {video.title}
                            </h3>
                            {!video.locked && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className={`text-sm ${video.locked ? 'text-[#7dab52]' : 'text-[#c8e6c9]'}`}>
                            {video.locked ? 'Complete the previous lesson first' : video.summary || 'Lesson ready'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      {!video.locked && (
                        <div className="mt-4 space-y-4">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button 
                              onClick={() => window.open(video.videoUrl, '_blank')}
                              className="flex-1 bg-[#c8e6c9] hover:bg-white text-[#0f3d1a] font-bold"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Watch Video
                            </Button>
                            <Button 
                              onClick={() => openTest(video.position)}
                              variant="ghost"
                              className="flex-1"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Take Test
                            </Button>
                          </div>

                          {/* Homework */}
                          <div className="pt-3 border-t border-[#c8e6c9]/10">
                            <label className="block text-sm font-medium text-[#c8e6c9] mb-2">
                              <FileText className="w-4 h-4 inline mr-2" />
                              Homework
                            </label>
                            <TextArea 
                              value={homework} 
                              onChange={(event) => setHomework(event.target.value)} 
                              placeholder="Submit your homework notes or project link..." 
                              className="text-sm mb-2"
                            />
                            <Button 
                              variant="ghost" 
                              onClick={() => submitHomework(video.id)}
                              className="w-full border-[#c8e6c9]/10 hover:bg-[#0f3d1a] shadow-lg shadow-black/20 hover:shadow-xl text-[#c8e6c9]"
                            >
                              Submit Homework
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No videos yet" 
                detail="Start learning by enrolling in a course." 
              />
            )}
          </Card>

          {/* Chat with Trainer */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card id="chat" className="border-[#c8e6c9]/10">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-sky-400" />
                <CardTitle title="Ask Trainer" caption="Get help with course content." />
              </div>
              <div className="space-y-3">
                <Field label="">
                  <TextArea 
                    value={question} 
                    onChange={(event) => setQuestion(event.target.value)} 
                    placeholder="Ask your question here..." 
                    className="min-h-[120px]"
                  />
                </Field>
                <Button 
                  className="w-full bg-[#c8e6c9] hover:bg-white text-[#0f3d1a] font-bold"
                  onClick={() => askTrainer(activeEnrollment?.course?.trainer?.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Question
                </Button>
              </div>
            </Card>

            <Card className="border-[#c8e6c9]/10">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">Community</h3>
              </div>
              <p className="text-sm text-[#c8e6c9] mb-4">Join the NextGen-LMS community to connect with other learners and discuss course topics.</p>
              <Button 
                className="w-full"
                variant="ghost"
                onClick={() => groupsApi.joinGlobal().then(() => setMessage('Successfully joined NextGen-LMS Community!'))}
              >
                <Users className="w-4 h-4 mr-2" />
                Join Group
              </Button>
            </Card>
          </div>
        </>
      ) : null}

      {/* Test Modal */}
      {test ? (
        <Card id="test-modal" className="border-sky-500/30 bg-gradient-to-br from-[#0f3d1a] to-[#1a6b2e]">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-sky-400" />
            <CardTitle 
              title={`Assessment: Video ${test.afterVideoPosition}`} 
              caption="Answer all questions to progress. You can retake with different questions if needed." 
            />
          </div>
          <form className="space-y-6" onSubmit={submitTest}>
            {test.questions.map((questionItem, qIndex) => (
              <div key={questionItem.id} className="pb-4 border-b border-[#c8e6c9]/10 last:pb-0 last:border-0">
                <div className="flex items-start gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 text-xs font-semibold text-sky-400 flex-shrink-0">
                    {qIndex + 1}
                  </span>
                  <label className="text-sm font-medium text-white">
                    {questionItem.prompt}
                  </label>
                </div>
                {questionItem.options?.length ? (
                  <SelectInput 
                    value={answers[questionItem.id] ?? ''} 
                    onChange={(event) => setAnswers({ ...answers, [questionItem.id]: event.target.value })} 
                    required
                  >
                    <option value="">Select your answer...</option>
                    {questionItem.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </SelectInput>
                ) : (
                  <TextArea 
                    value={answers[questionItem.id] ?? ''} 
                    onChange={(event) => setAnswers({ ...answers, [questionItem.id]: event.target.value })} 
                    placeholder="Type your answer..."
                    required 
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                variant="ghost"
                onClick={() => setTest(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-[#1a6b2e] hover:bg-[#0f3d1a] text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Test
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {/* Certificates */}
      <Card id="certificates" className="border-[#c8e6c9]/10">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-sky-400" />
          <CardTitle 
            title="My Certificates" 
            caption="Certificates awarded after completing courses and passing assessments." 
          />
        </div>
        
        {certificates && certificates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <a 
                key={certificate.id} 
                href={certificate.certificateUrl} 
                download="nextgen-lms-certificate.pdf"
                className="group rounded-xl border border-[#c8e6c9]/10 bg-gradient-to-br from-[#0f3d1a] to-[#1a6b2e] p-5 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 hover:border-sky-500/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <Trophy className="w-6 h-6 text-sky-400" />
                  <span className="text-xs text-[#c8e6c9]">PDF Download</span>
                </div>
                <h3 className="font-semibold text-white mb-1">{certificate.badge}</h3>
                <p className="text-xs text-[#c8e6c9]">
                  {new Date(certificate.certificationDate).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No certificates yet" 
            detail="Complete courses to earn certificates." 
          />
        )}
      </Card>
    </div>
  );
}
