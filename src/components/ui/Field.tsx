import { useState, type InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2.5 block text-sm font-medium leading-snug text-[#1a6b2e]">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'theme-focus min-h-11 w-full min-w-0 rounded-lg border border-gray-700 bg-gray-800 px-3.5 text-sm text-[#0f3d1a] placeholder-gray-500 transition-all duration-200 focus:border-sky-500/50 focus:bg-gray-800/80 focus:outline-none focus:ring-1 focus:ring-sky-500/20';

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === 'password';

  if (!isPassword) {
    return <input className={`${inputClass} ${className || ''}`} {...props} />;
  }

  return (
    <div className="relative group">
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={`${inputClass} pr-10 ${className || ''}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7dab52] hover:text-[#1a6b2e] transition-colors focus:outline-none"
      >
        {showPassword ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        )}
      </button>
    </div>
  );
}

export function SelectInput({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select 
      className={`${inputClass} appearance-none cursor-pointer [&>option]:bg-gray-800 [&>option]:text-[#0f3d1a] [&>option:hover]:bg-gray-700 ${className || ''}`} 
      {...props} 
    />
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputClass} min-h-24 py-2.5 resize-vertical ${className || ''}`} {...props} />;
}
