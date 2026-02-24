import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useMyCourses } from '../../hooks/useMyCourses'
import { PageHeader } from '../../ui/PageHeader'
import { Card, CardBody } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { Award, Calendar, Download, ExternalLink, GraduationCap, Eye } from 'lucide-react'
import Button from '../../components/common/Button'

const MyCertificatesPage = () => {
  const { enrolled, status, loadMyCourses } = useMyCourses()
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    loadMyCourses()
  }, [loadMyCourses])

  useEffect(() => {
    if (enrolled?.length) {
      const completed = enrolled.filter(
        (course) => course.status === 'Completed' && course.progress_percentage >= 100
      )
      setCertificates(completed)
    }
  }, [enrolled])

  if (status === 'loading') return <Loader />

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Certificates"
        description="View and download your earned certificates"
        actions={
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{certificates.length}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Earned</span>
          </div>
        }
      />

      {certificates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((course) => {
            const enrolledDate = course.enrolledAt
              ? new Date(course.enrolledAt).toLocaleDateString()
              : 'N/A'
            
            return (
              <Card 
                key={course.courseId} 
                hover
                className="group overflow-hidden"
              >
                <CardBody className="relative space-y-4">
                  <div className="relative flex items-start justify-between">
                    <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                      <GraduationCap className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />
                    </div>
                    <Badge variant="success" className="shadow-sm">
                      Completed
                    </Badge>
                  </div>

                  <div className="relative space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 dark:text-slate-100">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-400">
                      {course.description || 'Course completed successfully'}
                    </p>
                  </div>

                  <div className="relative flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Enrolled {enrolledDate}</span>
                  </div>

                  <div className="relative space-y-2 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Instructor</span>
                      <span className="text-slate-600 dark:text-slate-400">{course.instructorName || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Progress</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">{course.progress_percentage}%</span>
                    </div>
                  </div>

                  <div className="relative flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => navigate(`/learner/certificate/${course.courseId}`)}
                      icon={Eye}
                    >
                      View
                    </Button>
                    <Button
                      className="flex-1"
                      icon={Download}
                      onClick={() => navigate(`/learner/certificate/${course.courseId}`)}
                    >
                      Download
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardBody>
            <EmptyState
              icon={Award}
              title="No certificates yet"
              description="Complete courses to earn certificates and showcase your achievements."
            />
            <div className="mt-6 text-center">
              <Button onClick={() => navigate('/explore')}>
                Explore Courses
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

export default MyCertificatesPage
