import { useCallback, useRef } from 'react'
import { useVideoProgress } from '../../hooks/useVideoProgress'

const VideoPlayer = ({ courseId, video, onComplete }) => {
  const videoRef = useRef(null)
  const restoredRef = useRef(false)
  const { progress, updateProgress } = useVideoProgress()

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current || restoredRef.current) return

    const fromContext = Number(progress?.[courseId]?.[video._id] || 0)
    const fromServer = Number(video?.lastWatchedSeconds || 0)
    const resumeAt = Math.max(fromContext, fromServer)

    if (resumeAt > 0) {
      const duration = Number(videoRef.current.duration || 0)
      const safeResumeAt = duration > 0 ? Math.min(resumeAt, duration - 0.5) : resumeAt
      videoRef.current.currentTime = safeResumeAt
    }

    restoredRef.current = true
  }, [courseId, progress, video?._id, video?.lastWatchedSeconds])

  const handleTimeUpdate = () => {
    const current = videoRef.current?.currentTime || 0
    updateProgress(courseId, video._id, current)
  }

  const handlePlay = () => {
    if (!restoredRef.current) {
      handleLoadedMetadata()
    }
  }

  const handleEnded = () => {
    onComplete?.(video)
  }

  return (
    <div className="space-y-2">
      <video
        ref={videoRef}
        src={video.url}
        controls
        preload="metadata"
        playsInline
        className="w-full rounded-xl bg-black/5 shadow-[0_12px_35px_-22px_rgba(15,23,42,0.25)] dark:bg-black/20 dark:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.75)]"
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      <p className="text-sm text-slate-600 dark:text-slate-400">{video.title}</p>
    </div>
  )
}

export default VideoPlayer
