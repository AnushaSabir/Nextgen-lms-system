import type { HTMLAttributes, ReactNode } from 'react';
import { ChevronRight, Check } from 'lucide-react';

interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: string; // e.g. "from-purple-500", "from-emerald-500"
  iconBgColor?: string; // e.g. "bg-purple-500", "bg-emerald-500"
  icon?: ReactNode;
  value: string | number;
  label: string;
  items?: { label: string; done?: boolean }[];
}

export function GlowCard({ 
  glowColor = "from-purple-500", 
  iconBgColor = "bg-purple-500",
  icon, 
  value, 
  label, 
  items = [], 
  className = '', 
  ...props 
}: GlowCardProps) {
  return (
    <div className={`group relative rounded-[20px] bg-[#111318] border border-white/[0.08] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/[0.12] ${className}`} {...props}>
      {/* Top Header */}
      <div className="flex justify-between items-start mb-12 relative z-10">
        <h2 className="text-4xl font-medium text-[#0f3d1a] tracking-tight">{value}</h2>
        {icon && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[#0f3d1a] shadow-lg ${iconBgColor}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Label and Glow Container */}
      <div className={`relative pb-6 z-10 ${items.length > 0 ? 'border-b border-white/[0.08]' : ''}`}>
        <p className="text-sm font-medium text-[#1a6b2e]">{label}</p>
        
        {/* Hover Glow Effect */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${glowColor} to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-2xl translate-y-1/2 pointer-events-none`} />
        {/* Base Glow Effect (subtle) */}
        <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${glowColor} to-transparent opacity-10 blur-xl translate-y-1/2 pointer-events-none`} />
      </div>

      {/* Items List (if any) */}
      {items.length > 0 && (
        <div className="mt-4 space-y-1 relative z-10">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-white/[0.02] group/item cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors ${item.done ? `${iconBgColor} text-[#0f3d1a]` : 'border border-white/20 text-transparent group-hover/item:border-white/40'}`}>
                  {item.done && <Check className="w-3 h-3" />}
                </div>
                <span className={`text-sm transition-colors ${item.done ? 'text-[#7dab52] line-through' : 'text-[#1a6b2e] group-hover/item:text-[#0f3d1a]'}`}>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover/item:text-[#1a6b2e] transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
