// ═══════════════════════════════════════════════════════════
// EXPLORE COURSES PAGE - Unified course browsing & enrollment
// ═══════════════════════════════════════════════════════════
// PURPOSE: Single page for browsing and enrolling in courses
// 
// FEATURES:
// - Search by title or instructor name
// - View all available courses (or buyable courses for learners)
// - Enroll instantly with "Enroll Now" button
// - Real-time balance check before enrollment
// 
// DEMONSTRATION FLOW:
// 1. Page loads → fetch courses based on user role
// 2. User types in search bar → filter courses client-side
// 3. User clicks "Enroll Now" → validate bank account
// 4. Call enrollment API → payment executed → course access granted
// ═══════════════════════════════════════════════════════════
import { useEffect, useState } from 'react'
import CourseCard from '../../components/cards/CourseCard'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { useCourses } from '../../hooks/useCourses'
import { useEnroll } from '../../hooks/useEnroll'
import { useBank } from '../../hooks/useBank'
import { useRole } from '../../hooks/UseRole'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../ui/Toast'
import { PageHeader } from '../../ui/PageHeader'
import { SearchInput } from '../../ui/SearchInput'
import { Card, CardBody } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { BookOpen, Search, Filter } from 'lucide-react'
import Button from '../../components/common/Button'

const ExploreCoursesPage = () => {
  const { items, loading, status: coursesStatus, loadAll } = useCourses()
  const { buyable, loadBuyable, enroll, status: enrollStatus } = useEnroll()
  const bank = useBank()
  const role = useRole()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [query, setQuery] = useState('')  // Search query for filtering

  // INITIAL LOAD: Fetch courses based on user role
  useEffect(() => {
    if (role === 'Learner') {
      // Learners: show only courses they haven't enrolled in yet
      if (!buyable.length) loadBuyable()  // API: GET /api/learner/buyable-courses
      bank.loadBalance()  // Load bank balance for enrollment validation
      return
    }
    // Non-learners (or guests): show all courses
    if (!items.length) loadAll()  // API: GET /api/course/get-courses
  }, [role, buyable.length, items.length, loadBuyable, loadAll, bank.loadBalance])

  // ═════════════════════════════════════════════════════════
  // ENROLLMENT HANDLER - Core business logic
  // ═════════════════════════════════════════════════════════
  const handleEnroll = async (course) => {
    // VALIDATION 1: Check user is logged in
    if (!user) {
      toast.warning('Please login as a learner to enroll')
      navigate('/login')
      return
    }
    // VALIDATION 2: Check user is a learner (only learners can enroll)
    if (role !== 'Learner') {
      toast.error('Only learners can enroll in courses')
      return
    }
    // VALIDATION 3: Check learner has bank account (required for payment)
    if (!bank.balance) {
      toast.warning('Please create a bank account first')
      return
    }
    
    try {
      // ENROLL: Call API with course ID and bank credentials
      // This triggers payment (80% instructor, 20% admin) and grants access
      const res = await enroll({
        courseId: course._id,
        bankAccountNumber: bank.balance.account_number,
        secretKey: bank.account?.bank_secret || bank.balance?.bank_secret,  // For payment auth
      })
      if (!res?.ok) throw new Error(res?.error)
      toast.success('Enrollment successful!')
      loadBuyable()  // Refresh list (remove enrolled course)
    } catch (err) {
      toast.error(err?.message || err || 'Enrollment failed')
    }
  }

  // LOADING STATES
  const isCourseLoading = loading || coursesStatus === 'loading'
  const isBuyLoading = enrollStatus === 'loading'
  
  // COURSE LIST: Show buyable courses for learners, all courses for others
  const showBuyable = role === 'Learner' ? buyable : items
  
  // CLIENT-SIDE FILTERING: Filter by search query (title or instructor)
  const filteredCourses = showBuyable.filter((course) => {
    if (!query.trim()) return true  // Show all if no search query
    const needle = query.trim().toLowerCase()
    const titleMatch = course.title?.toLowerCase().includes(needle)
    const instructorName = course.instructor?.name || course.instructor?.fullName || ''
    const instructorMatch = instructorName.toLowerCase().includes(needle)
    return titleMatch || instructorMatch  // Match either title or instructor
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Your Next Course"
        description="Explore our curated collection of courses and start learning today."
        actions={
          <Badge variant="info" className="text-base">
            {showBuyable.length} {showBuyable.length === 1 ? 'Course' : 'Courses'} Available
          </Badge>
        }
      />
      
      <Card>
        <CardBody className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by course title or instructor name..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {query && (
            <Button
              variant="secondary"
              onClick={() => setQuery('')}
            >
              Clear
            </Button>
          )}
        </CardBody>
      </Card>

      {query && (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Search className="h-4 w-4" />
          <span>
            {filteredCourses.length} result{filteredCourses.length !== 1 ? 's' : ''} for "{query}"
          </span>
        </div>
      )}

      {(isCourseLoading || isBuyLoading) && <Loader />}

      {!isCourseLoading && !isBuyLoading && filteredCourses.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              actionLabel={role === 'Learner' ? 'Enroll Now' : 'View Details'}
              onAction={() => handleEnroll(course)}
            />
          ))}
        </div>
      ) : (
        !isCourseLoading && !isBuyLoading && (
          <Card>
            <CardBody>
              <EmptyState 
                icon={BookOpen}
                title={query ? 'No courses match your search' : 'No courses available'}
                description={query ? 'Try adjusting your search terms' : 'Check back later for new courses'}
              />
            </CardBody>
          </Card>
        )
      )}
    </div>
  )
}

export default ExploreCoursesPage
