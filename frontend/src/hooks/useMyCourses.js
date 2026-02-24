import { useCallback, useEffect, useState } from 'react'
import * as learnerApi from '../api/learner.api'
import { handleApiError } from '../utils/helpers'

export const useMyCourses = () => {
  const [enrolled, setEnrolled] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

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

  useEffect(() => {
    if (status === 'idle') loadMyCourses()
  }, [loadMyCourses, status])

  return { enrolled, status, error, loadMyCourses }
}
