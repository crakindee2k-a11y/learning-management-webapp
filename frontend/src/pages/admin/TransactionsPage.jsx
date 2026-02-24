import { useEffect } from 'react'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useAdminStats } from '../../hooks/useAdminStats'
import { formatCurrency } from '../../utils/helpers'
import { Card, CardBody } from '../../ui/Card'
import { Badge } from '../../ui/Badge'

const TransactionsPage = () => {
  const { transactions, loadTransactions, status, error } = useAdminStats()

  useEffect(() => {
    loadTransactions(1)
  }, [loadTransactions])

  if (status === 'loading') return <Loader />

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Transactions</h2>
      {error && (
        <div className="rounded-xl bg-red-50/80 p-3 text-sm text-red-700 shadow-sm shadow-black/5 dark:bg-red-500/10 dark:text-red-200 dark:shadow-black/40">
          {error}
        </div>
      )}
      {transactions && transactions.length > 0 ? (
        <div className="space-y-2 text-sm">
          {transactions.map((tx) => (
            <Card key={tx.transaction_id}>
              <CardBody className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{tx.type}</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(tx.amount)}</p>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {tx.from_user?.name || 'N/A'} → {tx.to_user?.name || 'N/A'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Course: {tx.course?.title || 'N/A'}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Status:</span>
                  <Badge variant={tx.status === 'COMPLETED' ? 'success' : 'warning'}>{tx.status}</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(tx.timestamp).toLocaleString()}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        status !== 'loading' && (
          <EmptyState title="No transactions found" description="There are no transactions to display" />
        )
      )}
    </div>
  )
}

export default TransactionsPage

