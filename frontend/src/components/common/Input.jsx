import { useState } from 'react'

const Input = ({ label, error, className = '', ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <label className="group flex w-full flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
      {label && (
        <span 
          className={`text-slate-900 dark:text-slate-100 transition-all duration-200 ${
            isFocused ? 'translate-x-0.5 text-amber-600 dark:text-amber-400' : ''
          }`}
        >
          {label}
        </span>
      )}
      <div className="relative">
        <input
          className={`w-full transform-gpu rounded-md bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.10)] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:shadow-[0_8px_24px_-10px_rgba(15,23,42,0.16)] focus:bg-white dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.50)] dark:focus:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.65)] dark:focus:bg-zinc-900/90 ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {/* Focus indicator line */}
        <div 
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-300 ${
            isFocused ? 'w-full opacity-100' : 'w-0 opacity-0'
          }`}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-red-600 dark:text-red-400 motion-safe:animate-fade-in">
          {error}
        </span>
      )}
    </label>
  )
}

export default Input

