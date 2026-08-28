import React from 'react';
import Image from 'next/image';
import { Cpu, Users, MonitorPlay, LineChart, Laptop, Award } from 'lucide-react';

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#070b1a]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 text-3d">
            Why <span className="text-white text-3d-orange">Choose Us</span>
          </h2>
          <p className="text-base sm:text-lg text-[#50BED9] max-w-2xl mx-auto font-medium">
            Everything you need to go from absolute beginner to certified professional, all in one ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              title: 'AI-Powered Learning',
              badge: 'SMART ASSISTANCE',
              desc: 'Personalized recommendations and smart learning assistance.',
              icon: <Cpu className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />,
              num: '01',
              delay: 0,
              image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=90',
              stat: 'Smart AI Tools'
            },
            {
              title: 'Expert Instructors',
              badge: 'INDUSTRY PROS',
              desc: 'Learn from experienced educators and industry professionals.',
              icon: <Users className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />,
              num: '02',
              delay: 150,
              image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=90',
              stat: 'Top Rated Experts'
            },
            {
              title: 'Interactive Courses',
              badge: 'ENGAGING CONTENT',
              desc: 'Engaging video lessons, quizzes, assignments, and projects.',
              icon: <MonitorPlay className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />,
              num: '03',
              delay: 300,
              image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=90',
              stat: 'Practical Projects'
            },
            {
              title: 'Track Your Progress',
              badge: 'DETAILED ANALYTICS',
              desc: 'Monitor your learning journey with detailed analytics and reports.',
              icon: <LineChart className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />,
              num: '04',
              delay: 450,
              image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=90',
              stat: 'Real-time Tracking'
            },
            {
              title: 'Flexible Learning',
              badge: 'STUDY ANYWHERE',
              desc: 'Access your courses anytime, anywhere, on any device.',
              icon: <Laptop className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />,
              num: '05',
              delay: 600,
              image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=90',
              stat: '24/7 Access'
            },
            {
              title: 'Certificates',
              badge: 'GET CERTIFIED',
              desc: 'Earn certificates after successfully completing your courses.',
              icon: <Award className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />,
              num: '06',
              delay: 750,
              image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=90',
              stat: 'Verified Badges'
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative rounded-3xl flex flex-col justify-between items-start text-left reveal overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_rgba(240,89,31,0.2)] hover:-translate-y-3 transition-all duration-500"
              style={{ transitionDelay: `${f.delay}ms` }}
            >
              <Image 
                src={f.image} 
                alt={f.title} 
                fill
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-all duration-700" 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#323232] via-[#323232]/90 to-[#323232]/70 z-10 group-hover:via-[#323232]/85 transition-all duration-500" />
              
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#8b5cf6]/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none z-20" />
              <div className="absolute inset-[1px] rounded-[22px] bg-transparent pointer-events-none z-20" />

              <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-[#8b5cf6]/10 blur-3xl group-hover:bg-[#8b5cf6]/20 transition-all duration-700 pointer-events-none z-0" />
              <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none z-0" />

              <div className="relative z-30 w-full p-6 sm:p-8 md:p-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#101010]/80 border border-white/10 text-white/[0.05] border border-white/15 flex items-center justify-center transition-all duration-500 group-hover:border-[#8b5cf6]/50 group-hover:bg-[#8b5cf6]/10 group-hover:shadow-[0_0_20px_rgba(240,89,31,0.3)] group-hover:scale-110 group-hover:-translate-y-1">
                    {f.icon}
                  </div>
                  <span className="font-mono text-3xl font-black tracking-widest text-white/10 group-hover:text-white/40 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    {f.num}
                  </span>
                </div>

                <span className="text-[10px] font-black tracking-widest text-white bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 px-2.5 py-0.5 rounded-full inline-block mb-3.5 group-hover:scale-105 group-hover:-translate-y-0.5 transition-all duration-300">
                  {f.badge}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-white transition-all duration-500">
                  {f.title}
                </h3>

                <p className="text-white/70 font-medium text-sm leading-relaxed mt-2.5 group-hover:text-white/90 transition-colors duration-500">
                  {f.desc}
                </p>

                <div className="mt-5 pt-4 border-t border-white/10 group-hover:border-[#8b5cf6]/30 transition-all duration-500">
                  <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] group-hover:scale-150 transition-all duration-300" />
                    <span className="text-xs font-semibold text-white group-hover:text-white tracking-wide">
                      {f.stat}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
