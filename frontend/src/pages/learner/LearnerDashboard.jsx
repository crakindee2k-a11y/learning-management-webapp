import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import EnrolledCourseCard from '../../components/cards/EnrolledCourseCard'
import { useBank } from '../../hooks/useBank'
import { useMyCourses } from '../../hooks/useMyCourses'
import { PageHeader } from '../../ui/PageHeader'
import { StatCard } from '../../ui/StatCard'
import { Wallet, BookOpen, TrendingUp, Compass, Library, Award, GraduationCap, Play, Clock, Target, Trophy } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { Badge } from '../../ui/Badge'

const LearnerDashboard = () => {
  const bank = useBank()
  const courses = useMyCourses()
  const navigate = useNavigate()

  useEffect(() => {
    bank.loadBalance()
  }, [bank.loadBalance])

  if (courses.status === 'loading') return <Loader />

  const enrolledCourses = courses.enrolled || []
  const inProgress = enrolledCourses.filter((course) => course.progress_percentage < 100).length
  const completedCourses = enrolledCourses.filter((course) => course.progress_percentage >= 100)
  const completed = completedCourses.length
  const balanceAvailable = bank.balance?.current_balance
  const totalProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress_percentage || 0), 0) / enrolledCourses.length)
    : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome to Your Learning Journey"
        description="Track your progress, manage courses, and celebrate your achievements."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate('/explore')} icon={Compass}>
              Explore Courses
            </Button>
            <Button onClick={() => navigate('/learner/certificates')} icon={Award}>
              My Certificates
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total Enrolled"
          value={enrolledCourses.length}
          description="Courses in your library"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Play}
          label="In Progress"
          value={inProgress}
          description="Courses you're working on"
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Trophy}
          label="Completed"
          value={completed}
          description="Courses you've finished"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Target}
          label="Overall Progress"
          value={`${totalProgress}%`}
          description="Average completion rate"
          gradient="from-amber-500 to-orange-500"
        />
      </div>

      {completed > 0 && (
        <Card className="overflow-hidden">
          <CardBody>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                  <GraduationCap className="h-8 w-8 text-zinc-900 dark:text-zinc-100" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🎉 {completed} Certificate{completed !== 1 ? 's' : ''} Earned!</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Congratulations on completing your courses</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/learner/certificates')}
                icon={Award}
              >
                View Certificates
              </Button>
            </div>
            {completedCourses.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {completedCourses.slice(0, 5).map((course) => (
                  <Badge
                    key={course.courseId}
                    variant="success"
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => navigate(`/learner/watch/${course.courseId}`)}
                  >
                    {course.title}
                  </Badge>
                ))}
                {completedCourses.length > 5 && (
                  <Badge variant="default">+{completedCourses.length - 5} more</Badge>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Continue Learning</h3>
                </div>
                <Button variant="secondary" onClick={() => navigate('/learner/my-courses')}>
                  View all
                </Button>
              </div>
              <div className="mt-4">
                {enrolledCourses.length ? (
                  <div className="space-y-3">
                    {enrolledCourses.filter(c => c.progress_percentage < 100).slice(0, 3).map((course) => (
                      <EnrolledCourseCard
                        key={course.courseId}
                        course={course}
                        onOpen={() => navigate(`/learner/watch/${course.courseId}`)}
                      />
                    ))}
                    {inProgress === 0 && completed > 0 && (
                      <EmptyState
                        icon={Trophy}
                        title="All caught up!"
                        description="You've completed all your enrolled courses. Explore new ones!"
                      />
                    )}
                  </div>
                ) : (
                  <EmptyState
                    icon={BookOpen}
                    title="No courses yet"
                    description="Explore courses and enroll to start learning."
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                  <Wallet className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Wallet Balance</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {balanceAvailable ? `$${balanceAvailable}` : 'Not linked'}
                  </p>
                </div>
              </div>
              {!balanceAvailable && (
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate('/bank')}
                  >
                    Link Bank Account
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                  <Compass className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Discover More</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">New Courses</p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/explore')}
                >
                  Explore Courses
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LearnerDashboard

