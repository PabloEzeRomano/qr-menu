import {
  AcceptInviteResponse,
  AdminInvitation,
  InvitationResponse,
  ValidateInviteResponse,
} from '@/types'

import { apiGet, apiGetAuth,apiJson } from '../apiClient'

// Send invitation to new admin
export const sendInvitation = (email: string, restaurantName: string) =>
  apiJson<InvitationResponse>('/api/admin/invite', 'POST', { email, restaurantName })

// Get list of sent invitations
export const getInvitations = () =>
  apiGetAuth<{ invitations: AdminInvitation[] }>('/api/admin/invitations')

// Validate invitation token
export const validateInvitation = (token: string) =>
  apiGet<ValidateInviteResponse>(`/api/admin/validate-invite?token=${token}`)

// Accept invitation and create account
export const acceptInvitation = (token: string, password: string) =>
  apiJson<AcceptInviteResponse>('/api/admin/accept-invite', 'POST', { token, password })

// Get user role (for checking if user is root/admin)
export const getUserRole = () =>
  apiGetAuth<{ role: string; canBypass: boolean }>('/api/onboarding/bypass')
