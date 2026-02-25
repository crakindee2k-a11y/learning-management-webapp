const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
const trimmedApiBaseUrl = rawApiBaseUrl.trim().replace(/\/+$/, '')

export const API_BASE_URL = trimmedApiBaseUrl === ''
  ? '/api'
  : trimmedApiBaseUrl.endsWith('/api')
    ? trimmedApiBaseUrl
    : `${trimmedApiBaseUrl}/api`
export const TOKEN_STORAGE_KEY = 'lms_access_token'
export const REFRESH_STORAGE_KEY = 'lms_refresh_token'
export const USER_STORAGE_KEY = 'lms_user'

export const ROLES = {
  ADMIN: 'Admin',
  INSTRUCTOR: 'Instructor',
  LEARNER: 'Learner',
}
