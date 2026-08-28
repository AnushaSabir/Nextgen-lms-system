import React from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Sarah Khan', quote: 'NextGen LMS transformed the way I learn online. The platform is fast, interactive, and easy to use.', role: 'Student' },
  { name: 'Ali Ahmed', quote: 'The AI learning tools helped me understand complex topics much faster.', role: 'Learner' },
  { name: 'Fatima Noor', quote: 'I love the course quality and progress tracking features. Highly recommended.', role: 'Professional' },
];

export default function ExploreCareersSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#070b1a] relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* About Section */}
        <div className="text-center mb-16 sm:mb-24 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6 text-3d">
            Learn Without <span className="text-white text-3d-orange">Limits</span>
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-base sm:text-lg text-[#50BED9] font-medium leading-relaxed">
            <p>
              NextGen LMS is a next-generation learning platform designed to simplify online education. Our platform combines modern technology, artificial intelligence, and an intuitive learning experience to help students achieve their goals while enabling educators to deliver engaging and effective courses.
            </p>
            <p>
              Whether you're learning a new skill, preparing for exams, or managing an educational institution, NextGen LMS provides all the tools you need in one place.
            </p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12 sm:mb-16 reveal">
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-3d">
            What Our Students Say
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-[#101010]/40 border border-white/10 border border-white/10 rounded-3xl p-8 relative hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-[#50BED9]/5">
              <Quote className="w-10 h-10 text-white/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-white fill-violet-400 text-[#50BED9]" />)}
              </div>
              <p className="text-[#50BED9] font-medium mb-8 leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#50BED9]/10 flex items-center justify-center font-bold text-[#50BED9]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <span className="text-sm text-[#50BED9]/80">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
