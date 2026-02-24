import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import VideoPlayer from '../../components/video/VideoPlayer'
import VideoProgressBar from '../../components/video/VideoProgressBar'
import { useEnroll } from '../../hooks/useEnroll'
import { PageHeader } from '../../ui/PageHeader'
import { Card, CardBody } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { useToast } from '../../ui/Toast'
import { Award, FileText } from 'lucide-react'

const WatchCoursePage = () => {
  const { courseId } = useParams()
  const { currentCourse, loadCourseContent, updateProgress, status, progressUpdate } = useEnroll()
  const toast = useToast()

  useEffect(() => {
    loadCourseContent(courseId)
  }, [courseId, loadCourseContent])

  useEffect(() => {
    const message = progressUpdate?.data?.message
    if (!message) return
    if (message.toLowerCase().includes('certificate')) {
      toast.success(message)
    }
  }, [progressUpdate, toast])

  if (status === 'loading' || !currentCourse) return <Loader />

  const course = currentCourse.course

  const handleComplete = async (video) => {
    if (currentCourse.status === 'Completed' || video.completed) return
    const result = await updateProgress({
      courseId,
      videoId: video._id || video.videoId,
      currentTime: video.duration_seconds,
      completed: true,
    })
    if (result?.ok && result?.data?.data?.status === 'Completed') {
      loadCourseContent(courseId)
    }
  }

  const certificate = currentCourse.certificate
  const issuedAt = certificate?.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : null

  return (
    <div className="space-y-6">
      <PageHeader
        title={course.title}
        description={course.description}
        actions={
          <Badge variant={currentCourse.status === 'Completed' ? 'success' : 'info'}>
            {currentCourse.status || 'InProgress'} • {currentCourse.yourProgress}%
          </Badge>
        }
      />

      {certificate && (
        <Card>
          <CardBody className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-zinc-100 p-3 shadow-sm shadow-black/5 dark:bg-zinc-900/70 dark:shadow-black/40">
                <Award className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Certificate Awarded</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Issued {issuedAt || 'just now'} • ID {certificate.certificateId}
                </p>
              </div>
            </div>
            <Badge variant="success">Completed</Badge>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Video Lessons</h3>
          <div className="mt-4 space-y-4">
            {course.videos?.map((video) => (
              <div key={video._id || video.videoId} className="rounded-xl bg-white/90 p-4 shadow-[0_12px_35px_-22px_rgba(15,23,42,0.25)] dark:bg-zinc-900/70 dark:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.75)]">
                <VideoPlayer courseId={courseId} video={video} onComplete={handleComplete} />
                <VideoProgressBar
                  progress={video.lastWatchedSeconds || 0}
                  duration={video.duration_seconds}
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Course Resources</h3>
          </div>
          {course.resources?.length ? (
            <ul className="mt-4 space-y-3">
              {course.resources.map((resource, index) => (
                <li key={resource._id || resource.resourceId || index} className="rounded-xl bg-white/90 p-4 shadow-[0_12px_35px_-22px_rgba(15,23,42,0.25)] dark:bg-zinc-900/70 dark:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.75)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{resource.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{resource.mediaType}</p>
                    </div>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-zinc-700 hover:underline dark:text-zinc-200"
                      >
                        Open
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No resources uploaded yet.</p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default WatchCoursePage

