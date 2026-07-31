'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useToastStore } from '@/store/toast-store';

export function Toast() {
  const { isOpen, message, type, hideToast } = useToastStore();
  const [render, setRender] = useState(false);

  // Handle mounting and unmounting animations
  useEffect(() => {
    if (isOpen) {
      setRender(true);
    } else if (render) {
      const timer = setTimeout(() => setRender(false), 300); // Wait for fade-out animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, render]);

  if (!render) return null;

  const typeStyles = {
    error: {
      bg: 'bg-gray-900',
      border: 'border-sky-500/50',
      icon: <AlertCircle className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />,
      shadow: 'shadow-[0_8px_30px_-4px_rgba(249,115,22,0.15)]',
    },
    success: {
      bg: 'bg-gray-900',
      border: 'border-emerald-500/50',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
      shadow: 'shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)]',
    },
    info: {
      bg: 'bg-gray-900',
      border: 'border-blue-500/50',
      icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
      shadow: 'shadow-[0_8px_30px_-4px_rgba(59,130,246,0.15)]',
    },
  };

  const currentStyle = typeStyles[type] || typeStyles.error;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-start pointer-events-none w-full max-w-sm px-4">
      <div
        className={`w-full pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${currentStyle.border} ${currentStyle.bg} ${currentStyle.shadow} backdrop-blur-xl transition-all duration-300 transform-gpu ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-4 scale-95'
        }`}
      >
        {currentStyle.icon}
        <div className="flex-1 text-sm font-medium text-[#0f3d1a] pt-0.5 leading-snug">
          {message}
        </div>
        <button
          onClick={hideToast}
          className="shrink-0 p-1 rounded-md text-[#1a6b2e] hover:text-[#0f3d1a] hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
