import Button from '../common/Button'
import { Play, CheckCircle } from 'lucide-react'
import { Badge } from '../../ui/Badge'
import { useEffect, useState, useRef } from 'react'

const EnrolledCourseCard = ({ course, onOpen }) => {
  const isCompleted = course.progress_percentage >= 100
  const [animatedProgress, setAnimatedProgress] = useState(0)
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
      { threshold: 0.3 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const duration = 800
      const steps = 60
      const increment = course.progress_percentage / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= course.progress_percentage) {
          setAnimatedProgress(course.progress_percentage)
          clearInterval(timer)
        } else {
          setAnimatedProgress(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isVisible, course.progress_percentage])
  
  return (
    <div 
      ref={cardRef}
      className="flex transform-gpu items-start justify-between gap-4 rounded-xl bg-white p-5 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_42px_-14px_rgba(15,23,42,0.18)] dark:bg-zinc-900 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.60)] dark:motion-safe:hover:shadow-[0_16px_48px_-18px_rgba(0,0,0,0.70)]"
    >
      <div className="flex-1">
        <div className="flex items-start gap-3">
          <h4 className="flex-1 text-lg font-bold text-slate-900 dark:text-slate-100">{course.title}</h4>
          <Badge 
            variant={isCompleted ? 'success' : 'info'}
            className={`transition-all duration-300 ${
              isCompleted ? 'motion-safe:animate-scale-in' : ''
            }`}
          >
            {animatedProgress}%
          </Badge>
        </div>
        <p className="mt-1 text-sm text-slate-600 line-clamp-2 dark:text-slate-400">{course.description}</p>
        <div className="mt-3 flex items-center gap-2">
          {isCompleted && (
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 motion-safe:animate-scale-in" />
          )}
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Status: {course.status}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div 
            className={`h-full rounded-full transition-all duration-800 ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-200 dark:to-zinc-400'
            }`}
            style={{ 
              width: `${animatedProgress}%`,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </div>
      <Button onClick={onOpen} icon={Play} className="flex-shrink-0">
        Continue
      </Button>
    </div>
  )
}

export default EnrolledCourseCard

