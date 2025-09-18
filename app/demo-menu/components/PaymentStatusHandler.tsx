'use client'

import { useCart } from '@/contexts/CartProvider'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentStatusHandler() {
  const searchParams = useSearchParams()
  const { clear } = useCart()
  const [mpStatus, setMpStatus] = useState<string | null>(null)

  useEffect(() => {
    const status = searchParams.get('mp_status')
    const order = searchParams.get('order')

    if (status) {
      setMpStatus(status)

      // Clear cart on successful payment
      if (status === 'success') {
        clear()
      }

      // Hide status after 5 seconds
      setTimeout(() => setMpStatus(null), 5000)

      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete('mp_status')
      url.searchParams.delete('order')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams, clear])

  if (!mpStatus) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm ${
        mpStatus === 'success'
          ? 'bg-green-600/90 text-white'
          : mpStatus === 'pending'
          ? 'bg-yellow-600/90 text-white'
          : 'bg-red-600/90 text-white'
      }`}
    >
      {mpStatus === 'success' && '🎉 ¡Pago exitoso! Tu pedido está confirmado'}
      {mpStatus === 'pending' && '⏳ Pago pendiente. Te notificaremos cuando se confirme'}
      {mpStatus === 'failure' && '❌ Error en el pago. Intenta nuevamente'}
    </motion.div>
  )
}
