import type { Filter, Tag } from '@/types'

import { apiGet, apiJson } from '../apiClient'

// Tags CRUD
export const listTags = () => apiGet<Tag[]>('/api/tags')
export const createTags = (data: { tags: Tag[] }) =>
  apiJson<{ ok: true }>('/api/tags', 'POST', data)
export const updateTags = (data: { tags: Tag[] }) =>
  apiJson<{ ok: true }>('/api/tags', 'PATCH', data)

// Additional Filters CRUD
export const listFilters = () => apiGet<Filter[]>('/api/filters')
export const createFilters = (data: { filters: Filter[] }) =>
  apiJson<{ ok: true }>('/api/filters', 'POST', data)
export const updateFilters = (data: { filters: Filter[] }) =>
  apiJson<{ ok: true }>('/api/filters', 'PATCH', data)
