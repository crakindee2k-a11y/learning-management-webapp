import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/helpers'
import { TrendingUp } from 'lucide-react'

const EarningsChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <TrendingUp className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No earnings data yet</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Complete enrollments will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Bar dataKey="totalEarning" fill="#2563eb" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EarningsChart

