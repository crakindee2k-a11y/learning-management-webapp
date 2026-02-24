import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duration }])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast])
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast])
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast])
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-50 flex flex-col gap-3 p-6">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

const Toast = ({ toast, onClose }) => {
  const { message, type } = toast

  const styles = {
    success: 'bg-emerald-50/95 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
    error: 'bg-red-50/95 text-red-800 dark:bg-red-500/20 dark:text-red-200',
    warning: 'bg-amber-50/95 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
    info: 'bg-zinc-100/90 text-zinc-800 dark:bg-zinc-800/85 dark:text-zinc-200',
  }

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />,
    error: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-300" />,
    info: <Info className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />,
  }

  return (
    <div
      className={`pointer-events-auto flex transform-gpu items-start gap-3 rounded-lg px-4 py-3 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.18)] dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.70)] ${styles[type]} animate-slide-in-right`}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded p-0.5 opacity-70 transition hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
