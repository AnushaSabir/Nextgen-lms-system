import React from 'react';

export default function CertificatePreview() {
  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#f8f9fa] shadow-2xl overflow-hidden border border-gray-200" style={{ aspectRatio: '1.414/1' }}>
      
      {/* Background SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 707" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top Left Gold */}
        <path d="M0,0 L450,0 C200,80 80,250 0,550 Z" fill="#d4af37" opacity="0.8"/>
        {/* Top Left Black */}
        <path d="M0,0 L400,0 C150,50 50,200 0,450 Z" fill="#1c1c1e"/>
        
        {/* Bottom Right Gold */}
        <path d="M1000,707 L550,707 C800,627 920,457 1000,157 Z" fill="#d4af37" opacity="0.8"/>
        {/* Bottom Right Black */}
        <path d="M1000,707 L600,707 C850,657 950,507 1000,257 Z" fill="#1c1c1e"/>
      </svg>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 tracking-widest mb-1 sm:mb-2 uppercase" style={{ fontFamily: 'Georgia, serif' }}>Certificate</h1>
        <h2 className="text-xs sm:text-base md:text-xl font-bold text-gray-800 tracking-[0.2em] uppercase mb-8 md:mb-12">Of Appreciation</h2>
        
        <p className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-600 uppercase tracking-widest mb-4 sm:mb-6">Proudly Presented To</p>
        
        <div className="w-full max-w-[60%] mx-auto border-b border-gray-400 pb-1 sm:pb-2 mb-6 sm:mb-8 text-center">
          <p className="text-3xl sm:text-4xl md:text-6xl text-gray-900 capitalize" style={{ fontFamily: "'Great Vibes', 'Brush Script MT', cursive" }}>Your Name</p>
        </div>
        
        <p className="text-[9px] sm:text-[11px] md:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-16 text-center px-4">
          This certificate is proudly awarded to recognize your successful completion of the comprehensive training program. You have demonstrated exceptional dedication, skill mastery, and outstanding performance throughout your learning journey at NextGen LMS.
        </p>
        
        <div className="w-full flex justify-between items-end px-4 sm:px-16 mt-auto pb-4">
          <div className="flex flex-col items-center w-24 sm:w-40">
            <div className="w-full border-b border-gray-400 mb-2"></div>
            <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Date</span>
          </div>
          
          <div className="relative -mb-6 sm:-mb-10 z-30">
            {/* Gold Seal */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#f9d976] via-[#e9b645] to-[#f9d976] rounded-full flex items-center justify-center shadow-lg border-2 sm:border-4 border-white relative">
              <div className="w-[85%] h-[85%] bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] rounded-full border border-[#e9b645] flex items-center justify-center shadow-inner">
                 <span className="text-[#e9b645] font-serif font-bold text-lg sm:text-3xl">N</span>
              </div>
              {/* Ribbon */}
              <div className="absolute -bottom-6 sm:-bottom-10 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 -z-10">
                <div className="w-4 h-8 sm:w-5 sm:h-12 bg-[#1c1c1e] clip-ribbon-left"></div>
                <div className="w-4 h-8 sm:w-5 sm:h-12 bg-[#1c1c1e] clip-ribbon-right"></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-24 sm:w-40">
            <div className="w-full border-b border-gray-400 mb-2 relative flex justify-center">
               <span className="absolute bottom-1 font-signature text-lg sm:text-2xl text-gray-700 whitespace-nowrap" style={{ fontFamily: "'Great Vibes', 'Brush Script MT', cursive" }}>NextGen LMS</span>
            </div>
            <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Signature</span>
          </div>
        </div>
      </div>
      
      {/* CSS for ribbons and fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        .clip-ribbon-left { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); }
        .clip-ribbon-right { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); }
      `}} />
    </div>
  );
}
