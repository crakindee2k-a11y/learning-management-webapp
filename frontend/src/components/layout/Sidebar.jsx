import { Link, useLocation } from 'react-router-dom'
import { useRole } from '../../hooks/UseRole'
import { useAuth } from '../../hooks/useAuth'
import { useState, useEffect } from 'react'
import { 
  Compass, 
  CreditCard, 
  LayoutDashboard, 
  PlusCircle, 
  BookOpen, 
  DollarSign,
  Shield,
  Award,
  Library
} from 'lucide-react'

const LinkItem = ({ to, label, icon: Icon, index = 0 }) => {
  const { pathname } = useLocation()
  const active = pathname === to
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150 + index * 50)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 after:pointer-events-none after:absolute after:left-2 after:top-1/2 after:h-5 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-transparent after:transition-all after:duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      } ${
        active
          ? 'bg-zinc-100/80 text-zinc-900 shadow-sm after:bg-amber-500/60 motion-safe:hover:-translate-x-0.5 dark:bg-white/20 dark:text-white dark:after:bg-amber-400/70'
          : 'text-zinc-700 hover:bg-zinc-100/60 motion-safe:hover:translate-x-1 group-hover:after:bg-zinc-900/10 dark:text-zinc-300 dark:hover:bg-white/10 dark:group-hover:after:bg-white/20'
      }`}
    >
      {Icon && (
        <Icon
          className={`h-4 w-4 transition-transform duration-200 ${
            active
              ? 'text-zinc-900 motion-safe:group-hover:scale-110 dark:text-amber-200'
              : 'text-zinc-500 motion-safe:group-hover:scale-110 dark:text-zinc-500'
          }`}
        />
      )}
      {label}
    </Link>
  )
}

const Sidebar = () => {
  const role = useRole()
  const { user } = useAuth()
  
  let linkIndex = 0
  const getNextIndex = () => linkIndex++
  
  return (
    <aside className="w-64 rounded-xl relative overflow-hidden bg-white/92 p-4 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[radial-gradient(900px_circle_at_0%_0%,rgba(15,23,42,0.04),transparent_60%)] after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:bg-[radial-gradient(900px_circle_at_100%_100%,rgba(0,0,0,0.03),transparent_65%)] dark:bg-zinc-900/85 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.60)] dark:before:bg-[radial-gradient(900px_circle_at_0%_0%,rgba(245,158,11,0.06),transparent_60%)] dark:after:bg-[radial-gradient(900px_circle_at_100%_100%,rgba(0,0,0,0.20),transparent_70%)]">
      <div className="relative z-10 space-y-1.5">
        <LinkItem to="/explore" label="Explore Courses" icon={Compass} index={getNextIndex()} />
        {user && <LinkItem to="/bank" label="Bank Account" icon={CreditCard} index={getNextIndex()} />}
        {role === 'Learner' && (
          <>
            <LinkItem to="/learner/dashboard" label="Dashboard" icon={LayoutDashboard} index={getNextIndex()} />
            <LinkItem to="/learner/my-courses" label="My Courses" icon={Library} index={getNextIndex()} />
            <LinkItem to="/learner/certificates" label="Certificates" icon={Award} index={getNextIndex()} />
          </>
        )}
        {role === 'Instructor' && (
          <>
            <LinkItem to="/instructor/dashboard" label="Dashboard" icon={LayoutDashboard} index={getNextIndex()} />
            <LinkItem to="/instructor/create" label="Create Course" icon={PlusCircle} index={getNextIndex()} />
          </>
        )}
        {role === 'Admin' && (
          <>
            <LinkItem to="/admin/dashboard" label="Dashboard" icon={Shield} index={getNextIndex()} />
            <LinkItem to="/admin/courses" label="Manage Courses" icon={BookOpen} index={getNextIndex()} />
            <LinkItem to="/admin/transactions" label="Transactions" icon={DollarSign} index={getNextIndex()} />
          </>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

