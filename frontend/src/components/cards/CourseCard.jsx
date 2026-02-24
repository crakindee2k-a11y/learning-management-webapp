import Button from '../common/Button'
import { Play, User, Clock, Star, ArrowRight } from 'lucide-react'
import { Badge } from '../../ui/Badge'

const CourseCard = ({ course, actionLabel, onAction }) => {
  if (!course) return null
  const hasImagePreview =
    Boolean(course.thumbnail) && !/\.(mp4|webm|ogg)(\?.*)?$/i.test(course.thumbnail)
  const thumbnailUrl = hasImagePreview ? course.thumbnail : null

  return (
    <div className="group relative flex transform-gpu flex-col overflow-hidden rounded-2xl bg-white/95 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0 motion-safe:hover:shadow-[0_16px_48px_-16px_rgba(15,23,42,0.20)] dark:bg-zinc-900/85 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.60)] dark:motion-safe:hover:shadow-[0_20px_56px_-20px_rgba(0,0,0,0.75)]">
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-zinc-100 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900">
        {thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              alt={`${course.title} thumbnail`}
              className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
              <Play className="h-8 w-8 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Preview Coming Soon</p>
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff5349] to-[#ff7a6d] shadow-[0_8px_24px_rgba(255,83,73,0.35)] transition-transform duration-200 motion-safe:group-hover:scale-105">
            <Play className="h-7 w-7 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
        
        {/* Price Badge */}
        <div className="absolute right-3 top-3">
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff5349] to-[#ff7a6d] shadow-[0_4px_12px_rgba(255,83,73,0.28)]">
            <span className="text-sm font-bold text-white">${course.price}</span>
          </div>
        </div>
        
        {/* Progress indicator on hover - subtle cue */}
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#ff5349] to-[#ff7a6d] transition-all duration-300 group-hover:w-full" />
      </div>
      <div className="relative flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-2 dark:text-slate-100">{course.title}</h3>
          <p className="text-sm leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">{course.description}</p>
        </div>
        
        {/* Instructor & Meta Info */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
          {course.instructor && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-700">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="line-clamp-1">{course.instructor.name || course.instructor.fullName || 'Unknown'}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">4.8</span>
            </div>
          </div>
        </div>
        
        {actionLabel && (
          <div className="relative mt-2">
            <Button className="w-full group/btn" onClick={onAction}>
              <span className="flex items-center justify-center gap-2">
                {actionLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover/btn:translate-x-1" />
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseCard

