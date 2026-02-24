import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMyCourses } from '../../hooks/useMyCourses'
import { useAuth } from '../../hooks/useAuth'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import CertificateTemplate from '../../components/certificate/CertificateTemplate'
import { PageHeader } from '../../ui/PageHeader'
import { Download, Share2, ArrowLeft, Award } from 'lucide-react'
import { useToast } from '../../ui/Toast'

const CertificateViewPage = () => {
  const { courseId } = useParams()
  const { enrolled, loadMyCourses, status } = useMyCourses()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const certificateRef = useRef(null)
  const [course, setCourse] = useState(null)
  const [certificate, setCertificate] = useState(null)

  useEffect(() => {
    loadMyCourses()
  }, [loadMyCourses])

  useEffect(() => {
    if (enrolled?.length && courseId) {
      const foundCourse = enrolled.find(c => c.courseId === courseId)
      if (foundCourse && foundCourse.status === 'Completed') {
        setCourse(foundCourse)
        setCertificate({
          certificateId: `${user?._id || 'user'}-${courseId}`,
          issuedAt: foundCourse.enrolledAt || new Date().toISOString(),
          course: foundCourse
        })
      }
    }
  }, [enrolled, courseId, user])

  const handleDownload = () => {
    toast.info('PDF download feature coming soon! Use browser print (Ctrl+P) for now.')
    setTimeout(() => {
      window.print()
    }, 500)
  }

  const handleShare = () => {
    const shareData = {
      title: `Certificate - ${course?.title}`,
      text: `I completed ${course?.title} on LearnHub!`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        toast.info('Share cancelled')
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Certificate link copied to clipboard!')
    }
  }

  if (status === 'loading') return <Loader />

  if (!course || course.status !== 'Completed') {
    return (
      <div className="space-y-6">
        <PageHeader title="Certificate Not Found" />
        <EmptyState
          icon={Award}
          title="Certificate not available"
          description="This course is not completed or doesn't exist in your enrollments."
        />
        <div className="flex justify-center">
          <Button onClick={() => navigate('/learner/certificates')} icon={ArrowLeft}>
            Back to Certificates
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <PageHeader
          title="Your Certificate"
          description="Congratulations on completing this course!"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/learner/certificates')}
                icon={ArrowLeft}
              >
                Back
              </Button>
              <Button
                variant="secondary"
                onClick={handleShare}
                icon={Share2}
              >
                Share
              </Button>
              <Button
                onClick={handleDownload}
                icon={Download}
              >
                Download
              </Button>
            </div>
          }
        />
      </div>

      <div ref={certificateRef} className="mx-auto max-w-5xl">
        <CertificateTemplate
          certificate={certificate}
          course={course}
          learner={user}
        />
      </div>

      <div className="print:hidden flex justify-center gap-4 pb-8">
        <Button
          variant="secondary"
          onClick={() => navigate(`/learner/watch/${courseId}`)}
        >
          View Course
        </Button>
        <Button onClick={handleDownload} icon={Download}>
          Download Certificate
        </Button>
      </div>
    </div>
  )
}

export default CertificateViewPage
