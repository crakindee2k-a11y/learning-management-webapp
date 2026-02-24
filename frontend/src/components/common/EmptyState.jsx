import { Inbox } from 'lucide-react'

const EmptyState = ({ title = 'Nothing to show', description, icon: Icon = Inbox }) => (
  <div className="flex transform-gpu flex-col items-center justify-center gap-4 rounded-xl bg-white/92 p-8 text-center shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:bg-[radial-gradient(900px_circle_at_0%_0%,rgba(15,23,42,0.04),transparent_60%)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] after:bg-[radial-gradient(850px_circle_at_100%_100%,rgba(0,0,0,0.03),transparent_58%)] dark:bg-zinc-900/82 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.60)] dark:before:bg-[radial-gradient(900px_circle_at_0%_0%,rgba(245,158,11,0.06),transparent_60%)] dark:after:bg-[radial-gradient(850px_circle_at_100%_100%,rgba(0,0,0,0.20),transparent_62%)]">
    <div className="relative z-10 flex flex-col items-center justify-center">
      <div className="rounded-full bg-zinc-100 p-4 shadow-sm shadow-black/5 dark:bg-zinc-900/70 dark:shadow-black/40">
        <Icon className="h-8 w-8 text-zinc-400 dark:text-zinc-400" />
      </div>
      <p className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  </div>
)

export default EmptyState

