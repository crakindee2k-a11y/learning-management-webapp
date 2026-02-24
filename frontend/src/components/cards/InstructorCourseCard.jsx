import Button from '../common/Button'
import { Users, DollarSign, Settings, Eye } from 'lucide-react'
import { Badge } from '../../ui/Badge'

const InstructorCourseCard = ({ course, onView, onManage }) => (
  <div className="flex transform-gpu items-start justify-between gap-4 rounded-xl bg-white/92 p-5 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] transition-all motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.995] motion-safe:hover:shadow-[0_12px_42px_-14px_rgba(15,23,42,0.18)] dark:bg-zinc-900/82 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.60)] dark:motion-safe:hover:shadow-[0_16px_48px_-18px_rgba(0,0,0,0.70)]">
    <div className="flex-1">
      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{course.title}</h4>
      <div className="mt-3 flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <Users className="h-4 w-4" />
          <span className="font-medium">{course.studentsEnrolled}</span>
          <span className="text-slate-500 dark:text-slate-500">students</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">${course.earningsFromThisCourse?.toFixed(2) || 0}</span>
          <span className="text-slate-500 dark:text-slate-500">earned</span>
        </div>
      </div>
    </div>
    <div className="flex flex-shrink-0 gap-2">
      <Button variant="secondary" onClick={onView} icon={Eye}>
        Details
      </Button>
      <Button onClick={onManage} icon={Settings}>
        Manage
      </Button>
    </div>
  </div>
)

export default InstructorCourseCard

