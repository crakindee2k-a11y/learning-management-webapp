import { useEffect } from 'react'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useAdminStats } from '../../hooks/useAdminStats'
import { formatCurrency } from '../../utils/helpers'
import { PageHeader } from '../../ui/PageHeader'
import { StatCard } from '../../ui/StatCard'
import { BookOpen, Users, GraduationCap, TrendingUp, DollarSign, Wallet, Award, Target, Activity, BarChart3 } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'

const AdminDashboard = () => {
  const { stats, loadStats, status, error } = useAdminStats()
  const navigate = useNavigate()

  useEffect(() => {
    loadStats()
  }, [loadStats])

  if (status === 'loading') return <Loader />
  
  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader title="Admin Dashboard" />
        <div className="rounded-xl bg-red-50/92 p-4 text-sm text-red-700 shadow-[0_8px_32px_-12px_rgba(239,68,68,0.18)] dark:bg-red-500/20 dark:text-red-200 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.70)]">
          Error loading statistics: {error}
        </div>
      </div>
    )
  }

  if (!stats || !stats.overview) {
    return (
      <div className="space-y-4">
        <PageHeader title="Admin Dashboard" />
        <EmptyState title="No statistics available" description="Platform statistics could not be loaded" />
      </div>
    )
  }

  const overview = stats.overview

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Platform Overview" 
        description="Monitor performance, track revenue, and manage the learning ecosystem"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate('/admin/courses')} icon={BookOpen}>
              Manage Courses
            </Button>
            <Button onClick={() => navigate('/admin/transactions')} icon={DollarSign}>
              View Transactions
            </Button>
          </div>
        }
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          icon={BookOpen} 
          label="Total Courses" 
          value={overview.totalCourses || 0}
          description="Active courses on platform"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard 
          icon={Users} 
          label="Total Learners" 
          value={overview.totalLearners || 0}
          description="Registered students"
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard 
          icon={GraduationCap} 
          label="Instructors" 
          value={overview.totalInstructors || 0}
          description="Active educators"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Enrollments" 
          value={overview.totalEnrollments || 0}
          description="Total course enrollments"
          gradient="from-orange-500 to-red-500"
        />
        <StatCard 
          icon={DollarSign} 
          label="Total Revenue" 
          value={formatCurrency(overview.totalRevenue || 0)}
          description="Platform lifetime earnings"
          gradient="from-amber-500 to-yellow-500"
        />
        <StatCard 
          icon={Wallet} 
          label="Admin Income" 
          value={formatCurrency(overview.adminIncome || 0)}
          description="20% commission earned"
          gradient="from-indigo-500 to-blue-500"
        />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {stats.monthlyRevenueChart && stats.monthlyRevenueChart.length > 0 && (
            <Card>
              <CardBody>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Monthly Revenue Breakdown</h3>
                  </div>
                  <Badge variant="info">{stats.monthlyRevenueChart.length} Months</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {stats.monthlyRevenueChart.map((item) => (
                    <div key={item.month} className="group transform-gpu rounded-lg bg-white/90 p-4 text-sm shadow-[0_6px_24px_-10px_rgba(15,23,42,0.14)] transition-all motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.995] motion-safe:hover:shadow-[0_10px_32px_-12px_rgba(15,23,42,0.20)] dark:bg-zinc-900/80 dark:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.65)] dark:motion-safe:hover:shadow-[0_14px_38px_-14px_rgba(0,0,0,0.75)]">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{item.month}</p>
                        <Badge variant="success">{item.enrollments || 0}</Badge>
                      </div>
                      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(item.revenue || 0)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Revenue generated</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                  <Activity className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Platform Health</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">Active</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Users</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{(overview.totalLearners || 0) + (overview.totalInstructors || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Avg. Enrollments</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {overview.totalCourses ? Math.round((overview.totalEnrollments || 0) / overview.totalCourses) : 0}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                  <DollarSign className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Commission</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(overview.adminIncome || 0)}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Rate</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Revenue</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(overview.totalRevenue || 0)}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                  <Target className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Quick Actions</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">Manage</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/admin/courses')}
                  icon={BookOpen}
                >
                  View Courses
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/admin/transactions')}
                  icon={DollarSign}
                >
                  Transactions
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

