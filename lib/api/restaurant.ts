import type { Restaurant } from '@/types'

import { apiFormData,apiGet, apiGetAuth, apiJson } from '../apiClient'

// Restaurant CRUD
export const getRestaurant = () => apiGet<Restaurant | null>('/api/restaurant')
export const patchRestaurant = (patch: Partial<Restaurant>) =>
  apiJson<Restaurant>('/api/restaurant', 'PATCH', patch)
export const patchRestaurantBackground = (background: FormData) =>
  apiFormData<{ url: string }>('/api/upload/blob', 'POST', background)

// Onboarding CRUD
export const getOnboardingStatus = () =>
  apiGetAuth<{ completed: boolean }>('/api/onboarding/status')
export const onboardingComplete = () =>
  apiJson<{ ok: true }>('/api/onboarding/complete', 'POST', { completed: true })
