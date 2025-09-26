'use client'

import { useCallback } from 'react'
import { useErrorHandler } from './useErrorHandler'
import { Order } from '@/types'
import {
  deleteOrder as deleteOrderAPI,
  getOrder as getOrderAPI,
  patchOrder,
  createOrder as createOrderAPI,
} from '@/lib/api/orders'

interface UseOrderOperationsProps {
  updateOrder?: (order: Order) => void
  removeOrder?: (orderId: string) => void
}

export function useOrderOperations({ updateOrder, removeOrder }: UseOrderOperationsProps = {}) {
  const { handleError } = useErrorHandler()

  const updateOrderStatus = useCallback(
    async (orderId: string, status: Order['status']) => {
      try {
        const result = await patchOrder(orderId, { status })
        // Update local state if updateOrder function is provided
        if (updateOrder) {
          updateOrder(result)
        }
        return result
      } catch (error) {
        handleError(error, 'Error al actualizar el estado de la orden')
        throw error
      }
    },
    [handleError, updateOrder],
  )

  const deleteOrder = useCallback(
    async (orderId: string) => {
      try {
        const result = await deleteOrderAPI(orderId)
        // Remove from local state if removeOrder function is provided
        if (removeOrder) {
          removeOrder(orderId)
        }
        return result
      } catch (error) {
        handleError(error, 'Error al eliminar la orden')
        throw error
      }
    },
    [handleError, removeOrder],
  )

  const getOrder = useCallback(
    async (orderId: string) => {
      try {
        const result = await getOrderAPI(orderId)
        return result
      } catch (error) {
        handleError(error, 'Error al obtener la orden')
        throw error
      }
    },
    [handleError],
  )

  const createOrder = useCallback(
    async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const result = await createOrderAPI(orderData)
        return result
      } catch (error) {
        handleError(error, 'Error al crear la orden')
        throw error
      }
    },
    [handleError],
  )

  return {
    updateOrderStatus,
    deleteOrder,
    getOrder,
    createOrder,
  }
}
