'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import Image from 'next/image'

import Button from '@/components/ui/Button'
import { useCart } from '@/contexts/CartProvider'
import { cartPayment } from '@/lib/api/cart'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, increment, decrement, remove, setTable, clear, itemCount, subtotal } = useCart()
  const [table, setTableInput] = useState(state.table || '')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setTableInput(state.table || '')
  }, [state.table])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const handleTableChange = (value: string) => {
    setTableInput(value)
    setTable(value || null)
  }

  const handlePayment = async () => {
    if (state.lines.length === 0) return

    setIsProcessing(true)
    setError('')

    try {
      const cart = state.lines.map(({ id, qty }) => ({ id, qty }))
      const result = await cartPayment(cart)

      if (result.init_point) {
        window.location.href = result.init_point
      } else {
        setError('No se pudo generar el link de pago')
      }
    } catch (err: any) {
      setError(err.message || 'Error procesando el pago')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-black/90 backdrop-blur-md border-l border-white/20 z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Tu pedido</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.lines.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.lines.map((line) => (
                    <motion.div
                      key={line.id}
                      className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex gap-3">
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                          {line.img ? (
                            <Image
                              src={line.img}
                              alt={line.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <span className="text-2xl">🍽️</span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">{line.name}</h3>
                          <p className="text-sm text-gray-300">{formatPrice(line.price)}</p>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => decrement(line.id)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                              >
                                <Minus size={16} className="text-white" />
                              </button>
                              <span className="text-white font-medium w-8 text-center">
                                {line.qty}
                              </span>
                              <button
                                onClick={() => increment(line.id)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                              >
                                <Plus size={16} className="text-white" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-cyan-300 font-medium">
                                {formatPrice(line.price * line.qty)}
                              </span>
                              <button
                                onClick={() => remove(line.id)}
                                className="p-1 hover:bg-red-500/20 rounded transition-colors"
                              >
                                <Trash2 size={16} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.lines.length > 0 && (
              <div className="border-t border-white/20 p-6 space-y-4">
                {/* Table input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mesa (opcional)
                  </label>
                  <input
                    type="text"
                    value={table}
                    onChange={(e) => handleTableChange(e.target.value)}
                    placeholder="Ej: Mesa 7"
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600/50 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                  />
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="text-cyan-300">{formatPrice(subtotal)}</span>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-600/20 border border-red-600/40 rounded-lg p-3">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handlePayment}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isProcessing}
                    disabled={state.lines.length === 0}
                  >
                    Pagar con Mercado Pago
                  </Button>

                  <Button onClick={clear} variant="ghost" size="md" className="w-full">
                    Vaciar carrito
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
