import { TrendingUp } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

export const StatCard = ({ icon: Icon, label, value, description, trend, gradient, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])
  const g = String(gradient || '')
  const tint = g.includes('emerald') || g.includes('green')
    ? 'dark:bg-emerald-500/10 dark:text-emerald-200'
    : g.includes('amber') || g.includes('yellow')
      ? 'dark:bg-amber-500/20 dark:text-amber-200'
      : g.includes('purple') || g.includes('pink') || g.includes('violet')
        ? 'dark:bg-violet-500/10 dark:text-violet-200'
        : g.includes('orange') || g.includes('red')
          ? 'dark:bg-orange-500/10 dark:text-orange-200'
          : g.includes('blue') || g.includes('cyan') || g.includes('sky')
            ? 'dark:bg-sky-500/10 dark:text-sky-200'
            : 'dark:bg-white/10 dark:text-zinc-200'

  return (
    <div 
      ref={cardRef}
      className={`group transform-gpu rounded-xl bg-white/92 p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_42px_-14px_rgba(15,23,42,0.18)] dark:bg-zinc-900/80 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.60)] dark:motion-safe:hover:shadow-[0_16px_48px_-18px_rgba(0,0,0,0.70)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
      style={{ transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p 
            className={`mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            {value}
          </p>
          {description && (
            <p 
              className={`mt-1 text-sm text-slate-600 dark:text-slate-400 transition-all duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '0.4s' }}
            >
              {description}
            </p>
          )}
        </div>
        {Icon && (
          <div 
            className={`rounded-lg bg-zinc-100 p-2.5 transition-all duration-500 group-hover:bg-zinc-200 dark:group-hover:bg-white/10 ${
              isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-12'
            } ${tint}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <Icon className="h-6 w-6 text-zinc-700 dark:text-current transition-transform duration-300 motion-safe:group-hover:scale-110" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="font-semibold text-green-600 dark:text-green-400">{trend}</span>
        </div>
      )}
    </div>
  )
}
