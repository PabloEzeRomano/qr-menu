'use client'

import { listOrders } from '@/lib/menuCRUD'
import { Order } from '@/types'
import { useCallback, useEffect, useState } from 'react'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const ordersData = await listOrders()
      setOrders(ordersData)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Error fetching orders')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const getOrdersByStatus = useCallback(
    (status: Order['status']) => {
      return orders.filter((order) => order.status === status)
    },
    [orders],
  )

  const getTotalRevenue = useCallback(() => {
    return orders
      .filter((order) => order.status === 'approved')
      .reduce((total, order) => total + order.total, 0)
  }, [orders])

  const getOrdersCount = useCallback(() => {
    return {
      total: orders.length,
      pending: getOrdersByStatus('pending').length,
      approved: getOrdersByStatus('approved').length,
      rejected: getOrdersByStatus('rejected').length,
      cancelled: getOrdersByStatus('cancelled').length,
    }
  }, [orders, getOrdersByStatus])

  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
    )
  }, [])

  const removeOrder = useCallback((orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))
  }, [])

  return {
    orders,
    loading,
    error,
    getOrdersByStatus,
    getTotalRevenue,
    getOrdersCount,
    refetch: fetchOrders,
    updateOrder,
    removeOrder,
  }
}
