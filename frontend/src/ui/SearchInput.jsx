import { Search } from 'lucide-react'

export const SearchInput = ({ placeholder = 'Search...', value, onChange, className = '' }) => {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 -translate-x-[120%] motion-safe:group-hover:opacity-100 motion-safe:group-hover:animate-[sheen_1.05s_ease-out] dark:via-white/10" />
      <Search className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
      <input
        type="text"
        className="relative z-10 w-full transform-gpu rounded-md bg-white/90 py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.10)] transition-[box-shadow,background-color] duration-300 placeholder:text-slate-400 focus:outline-none focus:shadow-[0_6px_20px_-10px_rgba(15,23,42,0.14)] dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.50)] dark:focus:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.60)]"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
