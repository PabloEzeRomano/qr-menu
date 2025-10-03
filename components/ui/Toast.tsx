'use client'

import { AnimatePresence,motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, Info,X } from 'lucide-react'

import { ErrorState } from '@/hooks/useErrorHandler'

interface ToastProps {
  error: ErrorState
  onClose: () => void
}

export default function Toast({ error, onClose }: ToastProps) {
  const { message, type, isVisible } = error

  if (!isVisible || !message) return null

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-red-50 border-red-200'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div
          className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 flex items-start gap-3`}
        >
          {getIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
