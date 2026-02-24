const Loader = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-3 py-8 text-zinc-700 dark:text-zinc-200">
    <div className="relative h-8 w-8">
      <span className="absolute inset-0 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-700 dark:border-zinc-700 dark:border-t-zinc-200" />
    </div>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
  </div>
)

export default Loader

