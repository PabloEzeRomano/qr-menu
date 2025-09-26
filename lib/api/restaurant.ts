import { apiGet, apiJson } from '../apiClient'
import type { Restaurant } from '@/types'

// Restaurant CRUD
export const getRestaurant = () => apiGet<Restaurant | null>('/api/restaurant')
export const patchRestaurant = (patch: Partial<Restaurant>) =>
  apiJson<Restaurant>('/api/restaurant', 'PATCH', patch)

// Onboarding CRUD
export const getOnboardingStatus = () => apiGet<{ completed: boolean }>('/api/onboarding/status')
export const onboardingComplete = () =>
  apiJson<{ ok: true }>('/api/onboarding/complete', 'POST', { completed: true })
