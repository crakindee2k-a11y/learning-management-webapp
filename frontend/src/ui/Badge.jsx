export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default:
      'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
    primary:
      'bg-[#ff5349]/15 text-[#a52e27] dark:bg-[#ff5349]/18 dark:text-[#ffcec7]',
    success:
      'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
    warning:
      'bg-[#ff5349]/12 text-[#b02f28] dark:bg-[#ff5349]/20 dark:text-[#ffcec7]',
    error:
      'bg-red-500/10 text-red-800 dark:bg-red-500/20 dark:text-red-200',
    info:
      'bg-sky-100/70 text-sky-900 dark:bg-sky-500/10 dark:text-sky-200',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
