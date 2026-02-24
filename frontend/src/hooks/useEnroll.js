import { useCallback, useState } from 'react'
import * as learnerApi from '../api/learner.api'
import { handleApiError } from '../utils/helpers'

export const useEnroll = () => {
  const [enrolled, setEnrolled] = useState([])
  const [buyable, setBuyable] = useState([])
  const [currentCourse, setCurrentCourse] = useState(null)
  const [progressUpdate, setProgressUpdate] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const enroll = useCallback(async (payload) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await learnerApi.enrollCourse(payload)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const loadMyCourses = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const res = await learnerApi.getMyCourses()
      setEnrolled(res?.data || [])
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const loadCourseContent = useCallback(async (courseId) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await learnerApi.getCourseContent(courseId)
      setCurrentCourse(res?.data || null)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const updateProgress = useCallback(async (payload) => {
    setError(null)
    try {
      const res = await learnerApi.updateProgress(payload)
      setProgressUpdate(res?.data || null)
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      return { ok: false, error: msg }
    }
  }, [])

  const loadBuyable = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const res = await learnerApi.getBuyableCourses()
      setBuyable(res?.data || [])
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  return {
    enrolled,
    buyable,
    currentCourse,
    progressUpdate,
    status,
    error,
    enroll,
    loadMyCourses,
    loadCourseContent,
    updateProgress,
    loadBuyable,
  }
}

