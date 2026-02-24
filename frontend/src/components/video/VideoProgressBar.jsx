import { formatSeconds } from '../../utils/formatTime'

const VideoProgressBar = ({ progress = 0, duration = 0 }) => {
  const percentage = Math.min(Math.round((progress / duration) * 100), 100)
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{formatSeconds(progress)}</span>
        <span>{formatSeconds(duration)}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
          aria-label="progress"
        />
      </div>
    </div>
  )
}

export default VideoProgressBar

