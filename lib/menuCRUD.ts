import { apiGet, apiJson } from './apiClient'
import type { DailyMenu, MenuItem, Category } from '@/types'

export const listItems = () => apiGet<MenuItem[]>('/api/items')
export const getItem = (id: string) => apiGet<MenuItem>(`/api/items/${id}`)
export const createItem = (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) =>
  apiJson<MenuItem>('/api/items', 'POST', data)
export const updateItem = (id: string, patch: Partial<Omit<MenuItem, 'id'>>) =>
  apiJson<MenuItem>(`/api/items/${id}`, 'PATCH', patch)
export const deleteItem = (id: string) => apiJson<{ ok: true }>(`/api/items/${id}`, 'DELETE')

export const listCategories = () => apiGet<Category[]>('/api/categories')
export const createCategory = (data: Category) => apiJson<Category>('/api/categories', 'POST', data)
export const updateCategory = (key: string, patch: Partial<Omit<Category, 'key'>>) =>
  apiJson<Category>(`/api/categories/${key}`, 'PATCH', patch)
export const deleteCategory = (key: string, forceDelete: boolean) =>
  apiJson<{ ok: true }>(`/api/categories/${key}?forceDelete=${forceDelete}`, 'DELETE')

export const getDailyMenu = () => apiGet<DailyMenu | null>('/api/daily-menu')
export const patchDailyMenu = (patch: Partial<DailyMenu>) =>
  apiJson<DailyMenu>('/api/daily-menu', 'PATCH', patch)
