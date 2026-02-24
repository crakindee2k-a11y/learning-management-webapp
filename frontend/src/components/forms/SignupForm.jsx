import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

const SignupForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    role: 'Learner',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full name" name="fullName" value={form.fullName} onChange={handleChange} />
      <Input label="Username" name="userName" value={form.userName} onChange={handleChange} />
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
        Role
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full transform-gpu rounded-md bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.10)] transition-[box-shadow,background-color] duration-300 focus:outline-none focus:shadow-[0_6px_20px_-10px_rgba(15,23,42,0.14)] dark:bg-zinc-900/80 dark:text-zinc-100 dark:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.50)] dark:focus:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.60)]"
        >
          <option value="Learner">Learner</option>
          <option value="Instructor">Instructor</option>
        </select>
      </label>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating...' : 'Create account'}
      </Button>
    </form>
  )
}

export default SignupForm

