import { useContext } from 'react'
import { VideoContext } from '../context/VideoContext'

export const useVideoProgress = () => useContext(VideoContext)

