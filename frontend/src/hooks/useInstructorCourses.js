import { useCallback, useState } from 'react'
import * as instructorApi from '../api/instructor.api'
import { handleApiError } from '../utils/helpers'

export const useInstructorCourses = () => {
  const [myCourses, setMyCourses] = useState([])
  const [courseDetails, setCourseDetails] = useState(null)
  const [earnings, setEarnings] = useState([])
  const [approvedStudents, setApprovedStudents] = useState({})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const loadMine = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const res = await instructorApi.getMyCourses()
      setMyCourses(res?.data?.courses || [])
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const loadDetails = useCallback(async (courseId) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await instructorApi.getCourseDetails(courseId)
      setCourseDetails(res?.data || null)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const createCourse = useCallback(async (formData) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await instructorApi.createCourse(formData)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const addResources = useCallback(async ({ courseId, resources, files }) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await instructorApi.addResources(courseId, resources, files)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const addVideos = useCallback(async ({ courseId, files }) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await instructorApi.addVideos(courseId, files)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const deleteItem = useCallback(async ({ courseId, itemId }) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await instructorApi.deleteResourceOrVideo(courseId, itemId)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const loadEarnings = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const res = await instructorApi.getEarningsChart()
      setEarnings(res?.data || [])
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const loadApprovedStudents = useCallback(async (courseId) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await instructorApi.getApprovedStudents(courseId)
      setApprovedStudents((prev) => ({ ...prev, [courseId]: res?.data || [] }))
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
    myCourses,
    courseDetails,
    earnings,
    approvedStudents,
    status,
    error,
    loadMine,
    loadDetails,
    createCourse,
    addResources,
    addVideos,
    deleteItem,
    loadEarnings,
    loadApprovedStudents,
  }
}

