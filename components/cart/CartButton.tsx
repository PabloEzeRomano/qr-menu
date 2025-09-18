'use client'

import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartProvider'

interface CartButtonProps {
  onClick: () => void
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { itemCount } = useCart()

  if (itemCount === 0) return null

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 md:top-24 md:bottom-auto z-40 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full p-4 shadow-lg backdrop-blur-sm transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <ShoppingCart size={24} className="-translate-x-0.5" />
        {itemCount > 0 && (
          <motion.div
            className="absolute -top-1.5 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.div>
        )}
      </div>
    </motion.button>
  )
}
