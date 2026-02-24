const Button = ({ children, className = '', variant = 'primary', type = 'button', icon: Icon, disabled, ...props }) => {
  const base =
    "group relative inline-flex transform-gpu items-center justify-center gap-2 overflow-hidden rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 motion-safe:hover:shadow-md motion-safe:active:scale-[0.97] motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-200 motion-safe:hover:before:opacity-100"
  const styles =
    variant === 'secondary'
      ? 'bg-zinc-100/90 text-zinc-900 shadow-[0_10px_25px_-18px_rgba(15,23,42,0.25)] hover:bg-zinc-100 focus:ring-zinc-400/40 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-900/80'
      : variant === 'danger'
        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-950/60 dark:text-red-200 dark:hover:bg-red-950/75 dark:ring-1 dark:ring-red-900/40'
        : 'bg-zinc-900 text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35)] hover:bg-zinc-800 focus:ring-[#ff5349]/30 dark:bg-[#ff5349]/18 dark:text-white dark:hover:bg-[#ff5349]/24'
  return (
    <button type={type} disabled={disabled} className={`${base} ${styles} ${className}`} {...props}>
      {Icon && <Icon className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:scale-110" />}
      <span className="relative z-10">{children}</span>
      {/* Ripple effect origin point */}
      <span className="absolute inset-0 -z-10 opacity-0 motion-safe:group-active:opacity-100 transition-opacity duration-100">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full bg-white/20 motion-safe:group-active:w-full motion-safe:group-active:h-full motion-safe:group-active:transition-all motion-safe:group-active:duration-300" />
      </span>
    </button>
  )
}

export default Button

