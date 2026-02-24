import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { getCoursePublicDetails } from '../../api/course.api'

const CourseDetailsPublic = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadCourse = async () => {
      setStatus('loading')
      setError(null)
      try {
        const res = await getCoursePublicDetails(courseId)
        const payload = res?.data ?? res
        if (isMounted) {
          setCourse(payload)
          setStatus('succeeded')
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message)
          setStatus('failed')
        }
      }
    }

    if (courseId) {
      loadCourse()
    }

    return () => {
      isMounted = false
    }
  }, [courseId])

  if (status === 'loading') return <Loader />
  if (status === 'failed') {
    return <EmptyState title="Failed to load course" description={error} />
  }
  if (!course) return <EmptyState title="Course not found" />

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <p className="text-sm text-slate-600">{course.description}</p>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
        <span>Price: ${course.price}</span>
        {course.lumpSumPayment !== undefined && (
          <span>Lump sum: ${course.lumpSumPayment}</span>
        )}
        {course.enrolledStudents !== undefined && (
          <span>Enrolled: {course.enrolledStudents}</span>
        )}
        {course.videoCount !== undefined && <span>Videos: {course.videoCount}</span>}
        {course.resourceCount !== undefined && <span>Resources: {course.resourceCount}</span>}
      </div>
      {course.instructor && (
        <p className="text-sm text-slate-600">
          Instructor: {course.instructor.name || course.instructor.fullName}{' '}
          {course.instructor.email ? `(${course.instructor.email})` : ''}
        </p>
      )}
      <p className="text-sm text-slate-500">
        Login and enroll to unlock full videos and resources.
      </p>
    </div>
  )
}

export default CourseDetailsPublic
