import { createContext, useState } from 'react'

export const VideoContext = createContext({
  progress: {},
  updateProgress: () => {},
})

export const VideoProvider = ({ children }) => {
  const [progress, setProgress] = useState({})

  const updateProgress = (courseId, videoId, seconds) => {
    setProgress((prev) => ({
      ...prev,
      [courseId]: { ...(prev[courseId] || {}), [videoId]: seconds },
    }))
  }

  return (
    <VideoContext.Provider value={{ progress, updateProgress }}>
      {children}
    </VideoContext.Provider>
  )
}

