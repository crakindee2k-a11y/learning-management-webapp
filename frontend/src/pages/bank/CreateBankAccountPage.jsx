// ═══════════════════════════════════════════════════════════
// BANK ACCOUNT PAGE - Create/view user's bank account
// ═══════════════════════════════════════════════════════════
// PURPOSE: Users need bank accounts to:
// - Learners: Purchase courses (payment source)
// - Instructors: Receive course earnings (payment destination)
// - Admin: Receive platform commission (set via env var)
//
// FLOW:
// 1. Page loads → check if user already has account
// 2. If no account → show "Create" button
// 3. On create → backend generates account number + secret key
// 4. Account created with $5000 initial balance (demo)
// 5. Account details displayed (number + balance)
// ═══════════════════════════════════════════════════════════
import { useEffect } from 'react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import { useBank } from '../../hooks/useBank'
import { Card, CardBody } from '../../ui/Card'

const CreateBankAccountPage = () => {
  const { account, balance, status, createAccount, loadBalance, error, message } = useBank()

  // On page load: fetch user's bank account (if exists)
  useEffect(() => {
    loadBalance()  // API call: GET /api/bank/balance
  }, [loadBalance])

  const hasAccount = balance && balance.account_number

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bank Account</h2>

      {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}
      {message && !error && <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}

      {/* ══════════════════════════════════════════════════
          CASE 1: User already has a bank account
          Display account number and current balance
      ═══════════════════════════════════════════════════ */}
      {hasAccount ? (
        <>
          <Card className="max-w-xl">
            <CardBody className="space-y-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Account: {balance.account_number}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Balance: {balance.current_balance}</p>
            </CardBody>
          </Card>

          {/* ❌ No button when account exists */}
        </>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════
              CASE 2: User has no bank account
              Show create button (one account per user)
          ═══════════════════════════════════════════════════ */}
          <EmptyState
            title="No bank account found"
            description="Please create a bank account to continue"
          />

          {/* Create button calls API: POST /api/bank/create-account
              Backend generates unique account number + secret key */}
          <Button
            onClick={() => createAccount()}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Creating...' : 'Create bank account'}
          </Button>
        </>
      )}

      {/* IMPORTANT: Display secret key ONCE after creation
          User needs secret key to authorize payments (keep it safe!) */}
      {account && (
        <Card className="max-w-xl bg-emerald-500/10 shadow-[0_8px_32px_-12px_rgba(16,185,129,0.20)] dark:bg-emerald-500/10 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.70)]">
          <CardBody className="p-3 text-sm text-emerald-800 dark:text-emerald-200">
            Account created: {account.bank_account_number} | Secret: {account.bank_secret}
          </CardBody>
        </Card>
      )}
    </div>
  )
}

export default CreateBankAccountPage
