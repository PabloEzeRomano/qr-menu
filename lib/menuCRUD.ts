import { apiGet, apiJson } from './apiClient'
import type { DailyMenu, MenuItem, Category, Restaurant, Filter, Order, Tag } from '@/types'

export const listItems = (showAll = false) =>
  apiGet<MenuItem[]>(`/api/items${showAll ? '?showAll=true' : ''}`)
export const getItem = (id: string) => apiGet<MenuItem>(`/api/items/${id}`)
export const createItem = (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) =>
  apiJson<MenuItem>('/api/items', 'POST', data)
export const updateItem = (id: string, patch: Partial<Omit<MenuItem, 'id'>>) =>
  apiJson<MenuItem>(`/api/items/${id}`, 'PATCH', patch)
export const deleteItem = (id: string) => apiJson<{ ok: true }>(`/api/items/${id}`, 'DELETE')

export const listCategories = () => apiGet<Category[]>('/api/categories')
export const createCategory = (data: Category) => apiJson<Category>('/api/categories', 'POST', data)
export const updateCategory = (key: string, patch: Partial<Omit<Category, 'key'>>) => {
  return apiJson<Category>(`/api/categories/${key}`, 'PATCH', patch)
}
export const deleteCategory = (key: string, forceDelete: boolean) =>
  apiJson<{ ok: true }>(`/api/categories/${key}?forceDelete=${forceDelete}`, 'DELETE')

export const listFilters = () => apiGet<Filter[]>('/api/filters')
export const patchFilters = (patch: Partial<Filter>) =>
  apiJson<Filter>('/api/filters', 'PATCH', patch)

export const getDailyMenu = () => apiGet<DailyMenu | null>('/api/daily-menu')
export const patchDailyMenu = (patch: Partial<DailyMenu>) =>
  apiJson<DailyMenu>('/api/daily-menu', 'PATCH', patch)

export const getRestaurant = () => apiGet<Restaurant | null>('/api/restaurant')
export const patchRestaurant = (patch: Partial<Restaurant>) =>
  apiJson<Restaurant>('/api/restaurant', 'PATCH', patch)

export const listOrders = () => apiGet<Order[]>('/api/orders')
export const createOrder = (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
  apiJson<Order>('/api/orders', 'POST', data)
export const patchOrder = (id: string, patch: Partial<Order>) =>
  apiJson<Order>(`/api/orders/${id}`, 'PATCH', patch)
export const deleteOrder = (id: string) => apiJson<{ ok: true }>(`/api/orders/${id}`, 'DELETE')
export const getOrder = (id: string) => apiGet<Order>(`/api/orders/${id}`)

// Tags CRUD
export const listTags = () => apiGet<Tag[]>('/api/tags')
export const createTags = (data: { tags: Tag[] }) =>
  apiJson<{ ok: true }>('/api/tags', 'POST', data)
export const updateTags = (data: { tags: Tag[] }) =>
  apiJson<{ ok: true }>('/api/tags', 'PATCH', data)

// Additional Filters CRUD
export const createFilters = (data: { filters: Filter[] }) =>
  apiJson<{ ok: true }>('/api/filters', 'POST', data)
export const updateFilters = (data: { filters: Filter[] }) =>
  apiJson<{ ok: true }>('/api/filters', 'PATCH', data)
