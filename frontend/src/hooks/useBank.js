import { useCallback, useState } from 'react'
import * as bankApi from '../api/bank.api'

export const useBank = () => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const createAccount = useCallback(async () => {
    setStatus('loading')
    setError(null)
    setMessage(null)
    try {
      const res = await bankApi.createBankAccount()
      // ApiResponse shape: { statusCode, data, message, success }
      setAccount(res?.data || null)
      setMessage(res?.message || null)
      setStatus('succeeded')
      // After create, also reflect balance (same data contains current_balance)
      if (res?.data?.bank_account_number) {
        setBalance({
          account_number: res.data.bank_account_number,
          current_balance: res.data.current_balance,
          bank_secret: res.data.bank_secret,
        })
      }
      return { ok: true, data: res }
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  const loadBalance = useCallback(async () => {
    setStatus('loading')
    setError(null)
    setMessage(null)
    try {
      const res = await bankApi.getBalance()
      // ApiResponse shape: { statusCode, data, message, success }
      setBalance(res?.data || null)
      setStatus('succeeded')
      return { ok: true, data: res }
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      setError(msg)
      setStatus('failed')
      return { ok: false, error: msg }
    }
  }, [])

  return {
    account,
    balance,
    status,
    error,
    message,
    createAccount,
    loadBalance,
  }
}
