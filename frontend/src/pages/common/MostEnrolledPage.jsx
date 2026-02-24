import { useEffect } from 'react'
import CourseCard from '../../components/cards/CourseCard'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useCourses } from '../../hooks/useCourses'

const MostEnrolledPage = () => {
  const { topViewed, status, loadTop } = useCourses()

  useEffect(() => {
    loadTop()
  }, [loadTop])

  if (status === 'loading') return <Loader />

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Top Viewed Courses</h2>
      {topViewed?.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {topViewed.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState title="No data" />
      )}
    </div>
  )
}

export default MostEnrolledPage

