export const PageHeader = ({ title, description, actions, className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
