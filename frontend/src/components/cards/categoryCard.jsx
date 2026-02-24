const CategoryCard = ({ category }) => {
  return (
    <div className="rounded-lg bg-white/92 p-4 shadow-[0_6px_24px_-10px_rgba(15,23,42,0.12)] dark:bg-zinc-900/82 dark:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.60)]">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{category._id}</h4>
        <span className="text-sm text-slate-500 dark:text-slate-400">{category.totalCourses} courses</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Enrollments: <strong>{category.totalEnrollments}</strong>
      </p>
      <div className="mt-3 space-y-2">
        {category.courses?.map((course) => (
          <div key={course._id} className="rounded-md bg-zinc-50 p-2 dark:bg-zinc-800">
            <p className="font-medium text-slate-800 dark:text-slate-100">{course.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryCard

