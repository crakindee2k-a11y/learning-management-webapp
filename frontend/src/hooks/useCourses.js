import { useCallback, useState } from 'react'
import {
  getAllCourses,
  getCoursesByCategory,
  getMostEnrolledCourses,
  searchByInstructor,
  searchCourses,
} from '../api/course.api'

export const useCourses = () => {
  // ⬇️ GET THESE FROM LOCAL STATE
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('idle')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [topViewed, setTopViewed] = useState([])
  const [error, setError] = useState(null)

  // ⬇️ ADD THIS FUNCTION
  const loadAll = useCallback(async () => {
    setLoading(true)
    setStatus('loading')
    setError(null)
    try {
      const res = await getAllCourses()
      setItems(res?.data || [])
      setStatus('succeeded')
      return res?.data || []
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      setStatus('failed')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const loadByCategory = useCallback(async () => {
    setLoading(true)
    setStatus('loading')
    setError(null)
    try {
      const res = await getCoursesByCategory()
      setCategories(res?.data || [])
      setStatus('succeeded')
      return res?.data || []
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      setStatus('failed')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTop = useCallback(async () => {
    setLoading(true)
    setStatus('loading')
    setError(null)
    try {
      const res = await getMostEnrolledCourses()
      setTopViewed(res?.data || [])
      setStatus('succeeded')
      return res?.data || []
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      setStatus('failed')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const searchTitle = useCallback(async (q) => {
    setLoading(true)
    setStatus('loading')
    setError(null)
    try {
      const res = await searchCourses(q)
      setSearchResults(res?.results || [])
      setStatus('succeeded')
      return res?.results || []
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      setStatus('failed')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const searchInstructor = useCallback(async (q) => {
    setLoading(true)
    setStatus('loading')
    setError(null)
    try {
      const res = await searchByInstructor(q)
      setSearchResults(res?.results || [])
      setStatus('succeeded')
      return res?.results || []
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      setStatus('failed')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // ⬇️ RETURN THESE
  return {
    items,
    status,
    categories,
    topViewed,
    error,
    loadAll,
    loadByCategory,
    loadTop,
    searchResults,
    loading,
    searchTitle,
    searchInstructor,
  }
};
