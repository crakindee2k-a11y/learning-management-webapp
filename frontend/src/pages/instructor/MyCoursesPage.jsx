import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InstructorCourseCard from '../../components/cards/InstructorCourseCard'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { useInstructorCourses } from '../../hooks/useInstructorCourses'

const MyCoursesPage = () => {
  const { myCourses, loadMine, status } = useInstructorCourses()
  const navigate = useNavigate()

  useEffect(() => {
    loadMine()
  }, [loadMine])

  if (status === 'loading') return <Loader />

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Courses</h2>
      {myCourses?.length ? (
        <div className="space-y-3">
          {myCourses.map((c) => (
            <InstructorCourseCard
              key={c.courseId}
              course={c}
              onView={() => navigate(`/instructor/course/${c.courseId}`)}
              onManage={() => navigate(`/instructor/course/${c.courseId}/resources`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="You have no courses"
          description="Please create quality courses to start earning."
        />
      )}
    </div>
  )
}

export default MyCoursesPage

