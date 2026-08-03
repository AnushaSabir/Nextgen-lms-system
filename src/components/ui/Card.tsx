import type { HTMLAttributes, ReactNode } from 'react';

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section className={`theme-card min-w-0 rounded-[40px] p-8 sm:p-10 transition-all duration-700 transform-style-3d hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_20px_60px_rgba(240,89,31,0.2)] hover:border-sky-500/30 bg-white/[0.02] backdrop-blur-3xl border border-[#1a6b2e]/20 relative overflow-hidden ${className}`} {...props}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none opacity-50" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function CardTitle({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold leading-snug text-white">{title}</h2>
      {caption ? <p className="mt-1.5 text-sm leading-relaxed text-[#c8e6c9]">{caption}</p> : null}
    </div>
  );
}
