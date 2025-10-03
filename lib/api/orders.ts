import type { Order } from '@/types'

import { apiGet, apiJson } from '../apiClient'

// Orders CRUD
export const listOrders = () => apiGet<Order[]>('/api/orders')
export const createOrder = (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
  apiJson<Order>('/api/orders', 'POST', data)
export const patchOrder = (id: string, patch: Partial<Order>) =>
  apiJson<Order>(`/api/orders/${id}`, 'PATCH', patch)
export const deleteOrder = (id: string) => apiJson<{ ok: true }>(`/api/orders/${id}`, 'DELETE')
export const getOrder = (id: string) => apiGet<Order>(`/api/orders/${id}`)
