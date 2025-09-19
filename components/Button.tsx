'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onAnimationEnd' | 'onDragStart' | 'onDrag' | 'onDragEnd'
  > {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'ghost' | 'nav' | 'nav-active'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className = '',
      children,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'font-semibold rounded-lg transition-all duration-200 shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none flex items-center justify-center'

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white',
      secondary:
        'bg-black/30 border border-gray-600/50 text-white hover:bg-black/50 hover:border-gray-500/70',
      tertiary:
        'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white border-cyan-400 shadow-cyan-500/25',
      danger:
        'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
      success:
        'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white',
      ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/10',
      nav: 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm',
      'nav-active': 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg',
    }

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    }

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: loading || disabled ? 1 : 1.02 }}
        whileTap={{ scale: loading || disabled ? 1 : 0.98 }}
        className={classes}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {typeof children === 'string' ? 'Cargando...' : children}
          </div>
        ) : (
          children
        )}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'

export default Button
