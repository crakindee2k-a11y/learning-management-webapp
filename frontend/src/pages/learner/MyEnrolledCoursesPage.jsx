import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EnrolledCourseCard from '../../components/cards/EnrolledCourseCard'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { useEnroll } from '../../hooks/useEnroll'
import { PageHeader } from '../../ui/PageHeader'

const MyEnrolledCoursesPage = () => {
  const { enrolled, loadMyCourses, status } = useEnroll()
  const navigate = useNavigate()

  useEffect(() => {
    loadMyCourses()
  }, [loadMyCourses])

  if (status === 'loading') return <Loader />

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_10px_40px_-16px_rgba(15,23,42,0.12)] dark:bg-zinc-900 dark:shadow-[0_16px_52px_-18px_rgba(0,0,0,0.65)]">
        <div className="relative space-y-6">
          <PageHeader 
            title="My Enrolled Courses" 
            description="Continue your learning journey"
          />
          {enrolled?.length ? (
            <div className="space-y-4">
              {enrolled.map((course) => (
                <EnrolledCourseCard
                  key={course.courseId}
                  course={course}
                  onOpen={() => navigate(`/learner/watch/${course.courseId}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No enrollments" description="Enroll to start learning" />
          )}
        </div>
      </div>
    </div>
  )
}

export default MyEnrolledCoursesPage

