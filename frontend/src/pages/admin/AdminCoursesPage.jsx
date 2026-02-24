import { useEffect, useState } from 'react'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import CourseCard from '../../components/cards/CourseCard'
import Button from '../../components/common/Button'
import { useCourses } from '../../hooks/useCourses'
import * as adminApi from '../../api/admin.api'
import { handleApiError } from '../../utils/helpers'

const AdminCoursesPage = () => {
  const { items, status, error, loadAll } = useCourses()
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const handleDelete = async (courseId, title) => {
    setActionError(null)

    const ok = window.confirm(`Delete course "${title}"? This cannot be undone.`)
    if (!ok) return

    try {
      setDeletingId(courseId)
      await adminApi.deleteCourse(courseId)
      loadAll()
    } catch (e) {
      setActionError(handleApiError(e))
    } finally {
      setDeletingId(null)
    }
  }

  if (status === 'loading') return <Loader />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Courses</h2>
        <Button variant="secondary" onClick={loadAll}>
          Refresh
        </Button>
      </div>

      {(error || actionError) && (
        <div className="rounded-xl bg-red-50/80 p-3 text-sm text-red-700 shadow-sm shadow-black/5 dark:bg-red-500/10 dark:text-red-200 dark:shadow-black/40">
          {error || actionError}
        </div>
      )}

      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((course) => (
            <div key={course._id} className="space-y-3">
              <CourseCard course={course} />
              <Button
                variant="danger"
                className="w-full"
                disabled={deletingId === course._id}
                onClick={() => handleDelete(course._id, course.title)}
              >
                {deletingId === course._id ? 'Deleting...' : 'Delete course'}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No courses found" description="There are no courses to manage." />
      )}
    </div>
  )
}

export default AdminCoursesPage
