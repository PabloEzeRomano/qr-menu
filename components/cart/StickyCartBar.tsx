'use client'

import { AnimatePresence,motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

import { useCart } from '@/contexts/CartProvider'

interface StickyCartBarProps {
  onClick: () => void
}

export default function StickyCartBar({ onClick }: StickyCartBarProps) {
  const { itemCount, subtotal } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
        >
          <div className="bg-gradient-to-r from-cyan-600 to-blue-700 backdrop-blur-sm border-t border-white/20 px-4 py-3 shadow-lg">
            <button
              onClick={onClick}
              className="w-full flex items-center justify-between text-white"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={20} />
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </div>
                </div>
                <span className="font-medium">Ver carrito</span>
              </div>

              <div className="font-bold">{formatPrice(subtotal)}</div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
