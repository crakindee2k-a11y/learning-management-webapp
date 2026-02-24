import { useCallback, useState } from 'react'
import * as adminApi from '../api/admin.api'
import { handleApiError } from '../utils/helpers'

export const useAdminStats = () => {
  const [stats, setStats] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const loadStats = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const res = await adminApi.getAdminStats()
      setStats(res || null)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const loadTransactions = useCallback(async (page = 1) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await adminApi.getTransactions(page)
      setTransactions(res || [])
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = handleApiError(err)
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  return { stats, transactions, status, error, loadStats, loadTransactions }
}
