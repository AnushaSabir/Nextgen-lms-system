'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, LogIn, UserPlus, GraduationCap, ChevronRight, 
  Sparkles, Zap, Star, ArrowUpRight, Award 
} from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const navLinks = [
    { name: 'Explore', href: '/#explore', icon: Sparkles },
    { name: 'Courses', href: '/courses', icon: Zap },
    { name: 'For Institutions', href: '/for-institutions', icon: ArrowUpRight },
    { name: 'Certifications', href: '/certification', icon: Award },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-2px) rotate(1deg);
          }
          75% {
            transform: translateY(2px) rotate(-1deg);
          }
        }
        
        @keyframes borderGlow {
          0%, 100% {
            border-color: rgba(26, 107, 46, 0.1);
          }
          50% {
            border-color: rgba(26, 107, 46, 0.3);
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes gradientShift {
          0% {
            background: linear-gradient(135deg, #159BD7 0%, #159BD7 50%, #159BD7 100%);
          }
          50% {
            background: linear-gradient(135deg, #159BD7 0%, #159BD7 50%, #159BD7 100%);
          }
          100% {
            background: linear-gradient(135deg, #159BD7 0%, #159BD7 50%, #159BD7 100%);
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 132, 255, 0.1) 25%,
            rgba(56, 189, 248, 0.3) 50%,
            rgba(0, 132, 255, 0.1) 75%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .nav-link-active-indicator::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: #50BED9;
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        
        .nav-link-active-indicator.active::after {
          width: 60%;
        }
        
        .nav-link-active-indicator:hover::after {
          width: 80%;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(80, 190, 217, 0.3);
          }
          50% {
            box-shadow: 0 0 25px rgba(80, 190, 217, 0.6);
          }
        }
        
        .login-btn-glow {
          animation: pulse-glow 3s infinite;
        }
      `}</style>

      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || mobileMenuOpen 
            ? 'bg-[#151515]/90 backdrop-blur-md border-b border-white/10 py-1.5 lg:py-2.5' 
            : 'bg-transparent py-2 lg:py-5'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div 
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(0, 132, 255, 0.1), transparent 70%)`
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
          <Link 
            href="/" 
            className="flex min-w-0 items-center group relative py-1"
            onMouseEnter={() => setHoveredLink('logo')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <div className="relative h-12 sm:h-14 lg:h-16 w-44 sm:w-56 lg:w-64 flex items-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="NEXTGEN Studio"
                fill
                sizes="(max-width: 768px) 200px, 260px"
                priority
                className="object-contain object-left filter drop-shadow-lg"
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredLink === link.name;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`nav-link-active-indicator relative group px-3 xl:px-5 py-2.5 text-sm font-bold tracking-tight transition-all duration-300 rounded-xl ${
                    isActive 
                      ? 'text-white active bg-[#50BED9]/5 shadow-sm' 
                      : 'text-[#50BED9] hover:text-white hover:bg-[#50BED9]/10'
                  } ${isHovered ? 'scale-105' : ''}`}
                >
                  <span className="flex items-center space-x-1.5">
                    {Icon && (
                      <Icon className={`w-3.5 h-3.5 transition-all duration-300 ${
                        isHovered ? 'scale-110 rotate-12' : ''
                      } ${isActive ? 'text-white' : 'text-[#50BED9] group-hover:text-white'}`} 
                      />
                    )}
                    <span>{link.name}</span>
                  </span>
                  
                  {isActive && (
                    <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                      <span className="w-1 h-1 bg-[#50BED9] rounded-full animate-pulse" />
                    </span>
                  )}
                  
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#50BED9]/0 via-[#50BED9]/5 to-[#50BED9]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : ''
                  }`} />
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <Link
              href="/login"
              className="relative group flex items-center space-x-2 px-4 xl:px-6 py-2.5 text-sm font-bold text-[#50BED9] hover:text-white transition-all duration-300 rounded-xl hover:bg-[#50BED9]/10 magnetic-button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#50BED9]/0 via-[#50BED9]/5 to-[#50BED9]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <LogIn className="w-4 h-4 transition-all duration-300 group-hover:-translate-x-1 group-hover:scale-110" />
              <span className="relative z-10">Login</span>
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#50BED9]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
            
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            
            <div className="relative" 
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r from-[#50BED9] to-[#4B5946] rounded-xl blur-md transition-all duration-500 ${
                isButtonHovered ? 'opacity-40 scale-105' : 'opacity-20 scale-100'
              }`} />
              
              <Link
                href="/login?mode=signup"
                className="ripple-effect relative flex items-center space-x-2 px-5 xl:px-7 py-3 bg-gradient-to-r from-[#50BED9] to-[#50BED9] text-white text-sm font-black rounded-xl transition-all duration-500 shadow-lg shadow-[#50BED9]/30 hover:shadow-[#50BED9]/50 transform hover:scale-105 active:scale-95 group overflow-hidden border border-[#50BED9]/50"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                </div>
                
                <UserPlus className="w-4 h-4 relative z-10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="relative z-10">Join Now</span>
                <ChevronRight className="w-4 h-4 relative z-10 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
              </Link>
            </div>
          </div>

          <button 
            className="lg:hidden relative p-2.5 -mr-2 transition-all duration-300 rounded-xl active:scale-95 group ripple-effect"
            style={{
              background: 'linear-gradient(135deg, #50BED9, #159BD7)',
              boxShadow: '0 4px 18px rgba(80,190,217,0.45)',
              border: '1px solid rgba(80,190,217,0.5)',
            }}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6 sm:w-7 sm:h-7">
              <div className={`absolute inset-0 transition-all duration-500 transform ${
                mobileMenuOpen ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}>
                <Menu className="w-full h-full text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className={`absolute inset-0 transition-all duration-500 transform ${
                mobileMenuOpen ? 'rotate-0 scale-100 opacity-100' : 'rotate-180 scale-0 opacity-0'
              }`}>
                <X className="w-full h-full text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[60px] sm:top-[76px] z-40"
          style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0"
            onClick={closeMobileMenu}
            style={{
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          />
          
          <aside
            className="relative z-50 h-full w-[min(22rem,calc(100vw-1rem))] ml-2 overflow-hidden border-r border-[#50BED9]/30 bg-[#101010] shadow-2xl rounded-r-3xl"
            style={{
              animation: 'fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) both',
              boxShadow: '10px 0 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#50BED9]/15 via-[#50BED9]/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#50BED9]/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative p-4 sm:p-6 flex flex-col space-y-2 overflow-y-auto max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-76px)]">
              <div className="pb-4 mb-2 border-b border-[#353638]">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center">
                  <div className="relative h-11 w-44 flex items-center">
                    <Image 
                      src="/logo.png" 
                      alt="NextGen Learning Management System" 
                      fill
                      sizes="176px"
                      className="object-contain object-left filter drop-shadow-md"
                    />
                  </div>
                </Link>
              </div>
              
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`mobile-menu-item group relative flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'text-white bg-[#50BED9]/15 border border-[#50BED9]/40 font-bold shadow-md shadow-[#50BED9]/10' 
                        : 'text-[#D0D3D6] hover:text-white hover:bg-[#151515] border border-transparent hover:border-[#353638] font-medium'
                    }`}
                    style={{
                      animationDelay: `${index * 60}ms`,
                      animation: 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both'
                    }}
                  >
                    <span className="flex items-center space-x-3">
                      {Icon && (
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-br from-[#50BED9] to-[#159BD7] text-[#101010] shadow-md shadow-[#50BED9]/30' 
                            : 'bg-[#151515] text-[#50BED9] border border-[#353638] group-hover:bg-[#50BED9] group-hover:text-[#101010] group-hover:border-[#50BED9]'
                        }`}>
                          <Icon className="w-4 h-4 transition-all duration-300 group-hover:scale-110" />
                        </div>
                      )}
                      <span className="text-sm tracking-tight leading-snug font-semibold">{link.name}</span>
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? 'text-[#50BED9] translate-x-1' : 'text-[#D0D3D6]/50 group-hover:text-[#50BED9] group-hover:translate-x-1'
                      }`} />
                    </div>
                  </Link>
                );
              })}
              
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#353638]"></div>
                </div>
              </div>
              
              <div className="space-y-2.5 pt-1">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center space-x-2.5 px-6 py-3 bg-[#151515] hover:bg-[#353638] border border-[#353638] hover:border-[#50BED9]/40 text-white font-bold text-sm rounded-xl transition-all duration-300 active:scale-[0.98] group relative overflow-hidden"
                  style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both' }}
                >
                  <LogIn className="w-4 h-4 text-[#50BED9] transition-all duration-300 group-hover:-translate-x-1" />
                  <span>Login to Account</span>
                </Link>
                
                <Link
                  href="/login?mode=signup"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-[#50BED9] to-[#159BD7] text-[#101010] font-black text-sm rounded-xl transition-all duration-500 shadow-lg shadow-[#50BED9]/30 active:scale-[0.98] group relative overflow-hidden hover:brightness-110"
                  style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both' }}
                >
                  <UserPlus className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span className="text-sm">Join Now — Free</span>
                  <Sparkles className="w-4 h-4 transition-all duration-300 group-hover:scale-125 animate-pulse" />
                </Link>
              </div>
              
              <div className="mt-auto pt-6 pb-2">
                <div className="bg-[#151515] rounded-xl p-3.5 border border-[#353638]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#33C6B6] rounded-full animate-pulse shadow-sm shadow-[#33C6B6]" />
                      <p className="text-[11px] font-bold text-[#D0D3D6]">NextGen Live LMS</p>
                    </div>
                    <span className="text-[10px] font-black text-[#50BED9] bg-[#50BED9]/10 px-2 py-0.5 rounded-md border border-[#50BED9]/20">v2.0</span>
                  </div>
                  <p className="text-[10px] text-center text-[#D0D3D6]/60 mt-2">
                    © 2026 NextGen LMS • Learning Management System
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
      
      <div className="h-16 sm:h-[5.5rem] lg:h-[6.5rem]" />
    </>
  );
};

export default Navbar;
