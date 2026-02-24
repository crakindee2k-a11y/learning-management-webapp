import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import AddResourceForm from '../../components/forms/addResourceForm'
import AddVideoForm from '../../components/forms/addVideoForm'
import Loader from '../../components/common/Loader'
import { useInstructorCourses } from '../../hooks/useInstructorCourses'
import { Card, CardBody } from '../../ui/Card'

const ManageResourcesPage = () => {
  const { courseId } = useParams()
  const {
    loadDetails,
    courseDetails,
    addResources,
    addVideos,
    deleteItem,
    status,
    error,
  } = useInstructorCourses()

  useEffect(() => {
    loadDetails(courseId)
  }, [courseId, loadDetails])

  const handleResource = ({ resources, files }) => {
    addResources({ courseId, resources, files }).then((res) => {
      if (res?.ok) loadDetails(courseId)
    })
  }

  const handleVideos = (files) => {
    addVideos({ courseId, files }).then((res) => {
      if (res?.ok) loadDetails(courseId)
    })
  }

  const handleDelete = (itemId) => {
    deleteItem({ courseId, itemId }).then(() => loadDetails(courseId))
  }

  if (status === 'loading') return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage course</h2>
          <p className="text-sm text-slate-600">
            {courseDetails?.title || 'Course details'}
          </p>
        </div>
        <Link
          className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
          to={`/instructor/course/${courseId}`}
        >
          Back to course details
        </Link>
      </div>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Course summary</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{courseDetails?.description}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Videos: {courseDetails?.videos?.length || 0}</span>
            <span>Resources: {courseDetails?.resources?.length || 0}</span>
            <span>Price: ${courseDetails?.price ?? 0}</span>
          </div>
        </CardBody>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resources</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {courseDetails?.resources?.length || 0} items
              </span>
            </div>
            <div className="mt-3">
              <AddResourceForm onSubmit={handleResource} loading={status === 'loading'} />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {courseDetails?.resources?.map((r, index) => {
                const resourceId = r._id || r.resourceId
                return (
                  <li
                    key={resourceId}
                    className="flex flex-col gap-1 rounded-lg bg-white/90 p-3 shadow-[0_12px_35px_-22px_rgba(15,23,42,0.22)] dark:bg-zinc-900/70 dark:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.75)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-900 dark:text-slate-100">
                        {index + 1}. {r.title}{' '}
                        <span className="text-xs text-slate-500 dark:text-slate-400">({r.mediaType})</span>
                      </span>
                      <button
                        className="text-xs font-semibold text-red-500"
                        onClick={() => handleDelete(resourceId)}
                      >
                        Delete
                      </button>
                    </div>
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-zinc-700 hover:underline dark:text-zinc-200"
                      >
                        View resource
                      </a>
                    )}
                  </li>
                )
              })}
              {!courseDetails?.resources?.length && (
                <li className="text-sm text-slate-500 dark:text-slate-400">No resources yet.</li>
              )}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Videos</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {courseDetails?.videos?.length || 0} videos
              </span>
            </div>
            <div className="mt-3">
              <AddVideoForm onSubmit={handleVideos} loading={status === 'loading'} />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {courseDetails?.videos?.map((v, index) => {
                const videoId = v._id || v.videoId
                return (
                  <li
                    key={videoId}
                    className="flex items-center justify-between gap-3 rounded-lg bg-white/90 p-3 shadow-[0_12px_35px_-22px_rgba(15,23,42,0.22)] dark:bg-zinc-900/70 dark:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.75)]"
                  >
                    <span className="text-slate-900 dark:text-slate-100">{index + 1}. {v.title}</span>
                    <button
                      className="text-xs font-semibold text-red-500"
                      onClick={() => handleDelete(videoId)}
                    >
                      Delete
                    </button>
                  </li>
                )
              })}
              {!courseDetails?.videos?.length && (
                <li className="text-sm text-slate-500 dark:text-slate-400">No videos uploaded yet.</li>
              )}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ManageResourcesPage

