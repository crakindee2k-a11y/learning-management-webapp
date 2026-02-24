import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth.api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [initialized, setInitialized] = useState(false)

  const loadCurrentUser = useCallback(async () => {
    try {
      setError(null)
      const res = await authApi.me()
      setUser(res?.data?.user || null)
    } catch (err) {
      setUser(null)
    } finally {
      setInitialized(true)
    }
  }, [])

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  const login = useCallback(async (payload) => {
    setStatus('loading')
    setError(null)

    try {
      const res = await authApi.login(payload)
      setUser(res?.data?.user || null)
      setInitialized(true)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      setStatus('failed')
      return { ok: false, error: message }
    }
  }, [])

  const signup = useCallback(async (payload) => {
    setStatus('loading')
    setError(null)

    try {
      const res = await authApi.signup(payload)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      setStatus('failed')
      return { ok: false, error: message }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      setStatus('idle')
      setInitialized(true)
    }
    return { ok: true }
  }, [])

  const value = useMemo(
    () => ({ user, status, error, initialized, login, signup, logout, loadCurrentUser }),
    [user, status, error, initialized, login, signup, logout, loadCurrentUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider')
  return ctx
}
