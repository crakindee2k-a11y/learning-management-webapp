import { useEffect } from 'react'
import CategoryCard from '../../components/cards/categoryCard'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useCourses } from '../../hooks/useCourses'

const CoursesByCategoryPage = () => {
  const { categories, status, loadByCategory } = useCourses()

  useEffect(() => {
    loadByCategory()
  }, [loadByCategory])

  if (status === 'loading') return <Loader />
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Courses by Category</h2>
      {categories?.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      ) : (
        <EmptyState title="No categories found" />
      )}
    </div>
  )
}

export default CoursesByCategoryPage

