export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`group relative transform-gpu rounded-xl bg-white/95 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] transition-all before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:bg-[radial-gradient(900px_circle_at_0%_0%,rgba(15,23,42,0.04),transparent_60%)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] after:bg-[radial-gradient(850px_circle_at_100%_100%,rgba(0,0,0,0.03),transparent_58%)] dark:bg-zinc-900/85 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.60)] dark:before:bg-[radial-gradient(900px_circle_at_0%_0%,rgba(245,158,11,0.06),transparent_60%)] dark:after:bg-[radial-gradient(850px_circle_at_100%_100%,rgba(0,0,0,0.20),transparent_62%)] ${
        hover ? 'motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[0_12px_42px_-14px_rgba(15,23,42,0.18)] motion-safe:active:translate-y-0 motion-safe:active:scale-[0.995] dark:motion-safe:hover:shadow-[0_16px_48px_-18px_rgba(0,0,0,0.70)]' : ''
      } ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div
      className={`px-6 py-4 ${className}`}
    >
      {children}
    </div>
  )
}

export const CardBody = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div
      className={`px-6 py-4 ${className}`}
    >
      {children}
    </div>
  )
}
