import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import EarningsChart from '../../components/charts/EarningsChart'
import InstructorCourseCard from '../../components/cards/InstructorCourseCard'
import Loader from '../../components/common/Loader'
import { useInstructorCourses } from '../../hooks/useInstructorCourses'
import { PageHeader } from '../../ui/PageHeader'
import { StatCard } from '../../ui/StatCard'
import { DollarSign, BookOpen, Users, PlusCircle, Library, TrendingUp, Star, Video, FileText } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { Badge } from '../../ui/Badge'

const InstructorDashboard = () => {
  const { earnings, myCourses, loadEarnings, loadMine, status } = useInstructorCourses()
  const navigate = useNavigate()

  useEffect(() => {
    loadEarnings()
    loadMine()
  }, [loadEarnings, loadMine])

  if (status === 'loading') return <Loader />

  const totalEarnings = (earnings || []).reduce(
    (sum, entry) => sum + (entry.totalEarning || 0),
    0,
  )
  const totalStudents = (myCourses || []).reduce(
    (sum, course) => sum + (course.studentsEnrolled || 0),
    0,
  )
  const totalVideos = (myCourses || []).reduce(
    (sum, course) => sum + (course.totalVideos || 0),
    0,
  )
  const totalResources = (myCourses || []).reduce(
    (sum, course) => sum + (course.totalResources || 0),
    0,
  )
  const avgStudentsPerCourse = myCourses?.length ? Math.round(totalStudents / myCourses.length) : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Instructor Dashboard"
        description="Monitor your teaching impact, track earnings, and grow your student base."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate('/instructor/my-courses')} icon={Library}>
              My Courses
            </Button>
            <Button onClick={() => navigate('/instructor/create')} icon={PlusCircle}>
              Create Course
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Total Earnings"
          value={`$${totalEarnings.toFixed(2)}`}
          description="From completed enrollments"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={BookOpen}
          label="Active Courses"
          value={myCourses?.length || 0}
          description="Published courses"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={totalStudents}
          description={`${avgStudentsPerCourse} avg per course`}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Video}
          label="Course Content"
          value={totalVideos}
          description={`${totalResources} resources added`}
          gradient="from-orange-500 to-red-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Earnings Overview</h3>
                </div>
                <Badge variant="success">${totalEarnings.toFixed(2)} Total</Badge>
              </div>
              <EarningsChart data={earnings || []} />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                  <DollarSign className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Earnings</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${totalEarnings.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Active Courses</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{myCourses?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Avg. per Course</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    ${myCourses?.length ? (totalEarnings / myCourses.length).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                  <Users className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Students</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalStudents}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Avg. per Course</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{avgStudentsPerCourse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Videos</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{totalVideos}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                  <Star className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Quick Action</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">Create Course</p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/instructor/create')}
                  icon={PlusCircle}
                >
                  New Course
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Library className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">My Courses</h3>
            </div>
            <Button variant="secondary" onClick={() => navigate('/instructor/my-courses')}>
              View all
            </Button>
          </div>
          <div className="mt-4">
            {myCourses?.length ? (
              <div className="space-y-3">
                {myCourses.slice(0, 3).map((course) => (
                  <InstructorCourseCard
                    key={course.courseId}
                    course={course}
                    onView={() => navigate(`/instructor/course/${course.courseId}`)}
                    onManage={() => navigate(`/instructor/course/${course.courseId}/resources`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No courses yet"
                description="Create your first course to start earning and teaching students."
              />
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default InstructorDashboard

