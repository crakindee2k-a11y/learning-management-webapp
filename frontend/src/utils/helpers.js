export const persistAuth = ({ user, accessToken, refreshToken }) => {
  if (user) localStorage.setItem('lms_user', JSON.stringify(user))
  if (accessToken) localStorage.setItem('lms_access_token', accessToken)
  if (refreshToken) localStorage.setItem('lms_refresh_token', refreshToken)
}

export const clearAuth = () => {
  localStorage.removeItem('lms_user')
  localStorage.removeItem('lms_access_token')
  localStorage.removeItem('lms_refresh_token')
}

export const loadAuthFromStorage = () => {
  const userRaw = localStorage.getItem('lms_user')
  const accessToken = localStorage.getItem('lms_access_token')
  const refreshToken = localStorage.getItem('lms_refresh_token')
  return {
    user: userRaw ? JSON.parse(userRaw) : null,
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
  }
}

export const formatCurrency = (amount) =>
  typeof amount === 'number'
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(amount)
    : '$0.00'

export const handleApiError = (error) => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return 'Something went wrong'
}

