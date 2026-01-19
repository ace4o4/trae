import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ title, description, variant = 'default', duration = 3000 }) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, title, description, variant, duration }])

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

function Toast({ toast, onDismiss }) {
  const icons = {
    default: <Info className="h-5 w-5 text-cyan-400" />,
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    destructive: <AlertCircle className="h-5 w-5 text-red-400" />,
  }

  const borders = {
    default: 'border-cyan-500/30 bg-slate-900/90 shadow-[0_0_20px_rgba(34,211,238,0.1)]',
    success: 'border-emerald-500/30 bg-slate-900/90 shadow-[0_0_20px_rgba(52,211,153,0.1)]',
    destructive: 'border-red-500/30 bg-slate-900/90 shadow-[0_0_20px_rgba(248,113,113,0.1)]',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      layout
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 backdrop-blur-md ${borders[toast.variant] || borders.default}`}
    >
      <div className="mt-0.5">{icons[toast.variant] || icons.default}</div>
      <div className="flex-1">
        {toast.title && (
          <h4 className="mb-1 text-sm font-semibold text-slate-100">{toast.title}</h4>
        )}
        {toast.description && (
          <p className="text-xs text-slate-400">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-500 hover:text-slate-300 transition"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
