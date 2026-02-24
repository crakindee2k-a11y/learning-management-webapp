import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'
import { GraduationCap, LogOut, LogIn, UserPlus, User } from 'lucide-react'
import { Badge } from '../../ui/Badge'
import ThemeToggle from '../common/ThemeToggle'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Smooth entrance on mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    logout().then(() => {
      navigate('/login')
    }).catch(() => {
      navigate('/login')
    })
  }

  return (
    <header 
      className={`sticky top-0 z-40 relative overflow-hidden bg-white/92 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] transition-all duration-500 before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[radial-gradient(900px_circle_at_0%_0%,rgba(15,23,42,0.04),transparent_60%)] after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:bg-[radial-gradient(900px_circle_at_100%_0%,rgba(0,0,0,0.03),transparent_65%)] dark:bg-zinc-900/85 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.60)] dark:before:bg-[radial-gradient(900px_circle_at_0%_0%,rgba(245,158,11,0.06),transparent_60%)] dark:after:bg-[radial-gradient(900px_circle_at_100%_0%,rgba(0,0,0,0.20),transparent_70%)] ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="container relative z-10 flex items-center justify-between py-3">
        <Link to="/" className="group flex items-center gap-2.5 text-xl font-bold text-slate-900 transition-all hover:opacity-95 dark:text-slate-100">
          <div className="rounded-lg bg-zinc-900 p-2 shadow-sm shadow-black/10 transition-all duration-300 motion-safe:group-hover:scale-105 motion-safe:group-hover:-rotate-6 dark:bg-amber-500/20 dark:shadow-black/40">
            <GraduationCap className="h-6 w-6 text-white transition-transform duration-300 motion-safe:group-hover:scale-110" />
          </div>
          <span className="tracking-tight transition-transform duration-300 motion-safe:group-hover:translate-x-1">LearnHub</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <ThemeToggle />
          {user ? (
            <>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 motion-safe:animate-fade-in">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 transition-transform duration-200 hover:scale-110">
                  <User className="h-4 w-4" />
                </div>
                <span className="font-medium">{user.fullName || user.userName}</span>
                <Badge variant="primary" className="motion-safe:animate-scale-in">{user.role}</Badge>
              </div>
              <Button variant="secondary" onClick={handleLogout} icon={LogOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1.5 font-medium text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link to="/signup">
                <Button icon={UserPlus}>Signup</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar

