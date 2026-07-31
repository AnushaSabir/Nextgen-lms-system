import React from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Sarah Khan', quote: 'I enrolled in the Web Development course and within 3 months I landed my first freelance client. NextGen LMS doesn\'t just teach you \u2014 it prepares you for the real world.', role: 'Freelance Web Developer' },
  { name: 'Ali Ahmed', quote: 'The AI tools inside the platform are genuinely helpful. It felt like having a personal tutor available 24/7. I completed my Data Science course in half the expected time.', role: 'Data Science Student' },
  { name: 'Fatima Noor', quote: 'As a teacher, I love how easy it is to create and manage courses. My students are more engaged than ever, and the progress tracking gives me full visibility into who needs extra support.', role: 'Online Course Instructor' },
];

export default function ExploreCareersSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#c8e6c9] relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* About Section */}
        <div className="text-center mb-16 sm:mb-24 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] tracking-tight mb-6 text-3d">
            Education Without <span className="text-[#d94d19] text-3d-orange">Boundaries</span>
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-base sm:text-lg text-[#1a6b2e] font-medium leading-relaxed">
            <p>
              NextGen LMS was built with one belief: that great education should be accessible to everyone, not just a privileged few. We've combined the best of modern technology, artificial intelligence, and expert instruction to create a platform where learning is engaging, effective, and genuinely enjoyable.
            </p>
            <p>
              Whether you're a student taking your first steps, a professional upskilling for the future, or an institution looking to deliver world-class training — NextGen LMS gives you everything you need to succeed, all in one place.
            </p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12 sm:mb-16 reveal">
          <h3 className="text-2xl sm:text-3xl font-black text-[#0f3d1a] tracking-tight text-3d">
            What Our Students Say
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white/40 border border-[#1a6b2e]/10 rounded-3xl p-8 relative hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-[#1a6b2e]/5">
              <Quote className="w-10 h-10 text-[#d94d19]/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#d94d19] fill-[#d94d19]" />)}
              </div>
              <p className="text-[#1a6b2e] font-medium mb-8 leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1a6b2e]/10 flex items-center justify-center font-bold text-[#1a6b2e]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[#0f3d1a]">{t.name}</h4>
                  <span className="text-sm text-[#1a6b2e]/80">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
