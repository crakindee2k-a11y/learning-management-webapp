import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useInstructorCourses } from '../../hooks/useInstructorCourses'

const EditCoursePage = () => {
  const { courseId } = useParams()
  const { courseDetails, loadDetails, status } = useInstructorCourses()

  useEffect(() => {
    loadDetails(courseId)
  }, [courseId, loadDetails])

  if (status === 'loading') return <Loader />
  if (!courseDetails) return <EmptyState title="Course not found" />

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{courseDetails.title}</h2>
        <div className="flex gap-2 text-sm">
          <Link className="font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white" to={`/instructor/course/${courseId}/resources`}>
            Manage resources
          </Link>
          <Link className="font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white" to={`/instructor/course/${courseId}/approve`}>
            Approved students
          </Link>
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-400">{courseDetails.description}</p>
      <div className="rounded-xl bg-white/95 p-4 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.22)] dark:bg-zinc-900/70 dark:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.75)]">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">Videos</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
          {courseDetails.videos?.map((v) => (
            <li key={v.videoId}>{v.title}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl bg-white/95 p-4 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.22)] dark:bg-zinc-900/70 dark:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.75)]">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">Resources</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
          {courseDetails.resources?.map((r) => (
            <li key={r.resourceId}>
              {r.title} - <a href={r.url}>{r.url}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default EditCoursePage

