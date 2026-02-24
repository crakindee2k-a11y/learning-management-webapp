import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseCard from '../../components/cards/CourseCard'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useCourses } from '../../hooks/useCourses'
import { Search, Sparkles, TrendingUp, Award, BookOpen, ChevronRight } from 'lucide-react'
import { Badge } from '../../ui/Badge'

const AllCoursesPage = () => {
  const { items, status, loadAll } = useCourses()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadAll()
  }, [loadAll])

  if (status === 'loading') return <Loader />

  const categories = ['all', 'development', 'design', 'business', 'data science']
  const filteredCourses = items?.filter(course => {
    const matchesSearch = !searchQuery || 
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
      course.category?.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff5349]/12 via-[#ff8a7f]/8 to-transparent p-12 border border-[#ff5349]/12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ff5349]/12 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[#ff5349]/12 border border-[#ff5349]/25">
            <Sparkles className="h-4 w-4 text-[#ff5349] dark:text-[#ff9a90]" />
            <span className="text-sm font-semibold text-[#8a2e29] dark:text-[#ffd8d3]">{items?.length || 0} Courses Available</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-zinc-800 to-slate-900 dark:from-slate-100 dark:via-zinc-100 dark:to-slate-100 bg-clip-text text-transparent">
            Discover Your Next
            <br />
            <span className="bg-gradient-to-r from-[#ff5349] to-[#ff7a6d] bg-clip-text text-transparent">Learning Adventure</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Explore curated courses designed by industry experts to accelerate your career growth
          </p>
          
          {/* Premium Search Bar */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff5349] to-[#ff7a6d] rounded-xl opacity-20 group-hover:opacity-30 transition duration-300 blur" />
            <div className="relative flex items-center gap-3 bg-white/95 dark:bg-zinc-900/90 rounded-xl p-2 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)]">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600">
                <Search className="h-5 w-5 text-white" />
              </div>
              <input
                type="text"
                placeholder="Search courses, topics, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-base font-medium"
              />
              <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#ff5349] to-[#ff7a6d] text-white font-semibold shadow-[0_4px_12px_rgba(255,83,73,0.22)] hover:shadow-[0_6px_16px_rgba(255,83,73,0.32)] transition-all motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
          <BookOpen className="h-4 w-4" />
          Categories:
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#ff5349] to-[#ff7a6d] text-white shadow-[0_4px_12px_rgba(255,83,73,0.22)]'
                : 'bg-white/90 dark:bg-zinc-900/80 text-slate-700 dark:text-slate-300 hover:bg-[#ffedea] dark:hover:bg-[#3b2523] shadow-[0_2px_8px_rgba(15,23,42,0.08)]'
            } motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group relative overflow-hidden rounded-xl bg-white/92 dark:bg-zinc-900/82 p-5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] hover:shadow-[0_8px_28px_-10px_rgba(15,23,42,0.18)] transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{items?.length || 0}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Courses</p>
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-xl bg-white/92 dark:bg-zinc-900/82 p-5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] hover:shadow-[0_8px_28px_-10px_rgba(15,23,42,0.18)] transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-[0_4px_12px_rgba(245,158,11,0.25)]">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">Top Rated</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Expert Instructors</p>
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-xl bg-white/92 dark:bg-zinc-900/82 p-5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] hover:shadow-[0_8px_28px_-10px_rgba(15,23,42,0.18)] transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-[0_4px_12px_rgba(16,185,129,0.25)]">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">Certified</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Get Recognized</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {selectedCategory === 'all' ? 'All Courses' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Courses`}
          </h2>
          <Badge variant="info">{filteredCourses?.length || 0} courses</Badge>
        </div>
        {filteredCourses?.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <div
                key={course._id}
                className="motion-safe:animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No courses found" description="Try adjusting your search or filters" />
        )}
      </div>
    </div>
  )
}

export default AllCoursesPage

