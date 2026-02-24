import { useNavigate } from 'react-router-dom'
import SignupForm from '../../components/forms/SignupForm'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../ui/Toast'
import { Card, CardBody } from '../../ui/Card'
import { Badge } from '../../ui/Badge'

const SignupPage = () => {
  const { signup, status, error } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (payload) => {
    const res = await signup(payload)
    if (res?.ok) {
      toast.success('Account created successfully! Please login.')
      navigate('/login')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create Account</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Join our learning platform today</p>
          </div>
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}
          <SignupForm onSubmit={handleSubmit} loading={status === 'loading'} />
          <div className="mt-4 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
            <p className="text-xs text-zinc-700 dark:text-zinc-200">
              <Badge variant="info" className="mr-2">Note</Badge>
              Admin role cannot signup directly. Please login with existing admin credentials.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default SignupPage

