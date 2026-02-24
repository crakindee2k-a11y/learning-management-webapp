import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../../components/forms/LoginForm'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardBody } from '../../ui/Card'

const LoginPage = () => {
  const { login, user, status, error } = useAuth()
  const navigate = useNavigate()

  // AUTO-REDIRECT: After successful login, redirect based on role
  // Each role has a different dashboard with role-specific features
  useEffect(() => {
    if (user) {
      if (user.role === 'Instructor') navigate('/instructor/dashboard')
      else if (user.role === 'Admin') navigate('/admin/dashboard')
      else navigate('/learner/dashboard')  // Learner is default
    }
  }, [user, navigate])

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Sign in to your account to continue</p>
          </div>
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}
          <LoginForm onSubmit={login} loading={status === 'loading'} />
        </CardBody>
      </Card>
    </div>
  )
}

export default LoginPage
