'use client'

import { useEffect, useState } from 'react'

import { CheckCircle, Clock, Crown, Mail, UserPlus, XCircle } from 'lucide-react'

import { Button, Input } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContextProvider'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { getInvitations, getUserRole, sendInvitation } from '@/lib/api/invitations'
import { AdminInvitation } from '@/types'

export default function AdminInvitations() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [invitations, setInvitations] = useState<AdminInvitation[]>([])
  const { handleError, showToast } = useErrorHandler()
  const { restaurant } = useMenuData()
  const { isRoot } = useAuth()

  const handleSendInvitation = async () => {
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    setSending(true)
    try {
      await sendInvitation(email, restaurant?.name || '')

      showToast('Invitation sent successfully!', 'info')
      setEmail('')
      // Refresh invitations list
      loadInvitations()
    } catch (error) {
      handleError(error, 'Failed to send invitation')
    } finally {
      setSending(false)
    }
  }

  const loadInvitations = async () => {
    try {
      const data = await getInvitations()
      setInvitations(data.invitations || [])
    } catch (error) {
      console.error('Failed to load invitations:', error)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const getStatusBadge = (invitation: AdminInvitation) => {
    if (invitation.used) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Accepted
        </span>
      )
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Expired
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Invitar Administradores</h2>
          {isRoot && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              <Crown className="w-3 h-3" />
              ROOT
            </div>
          )}
        </div>
        <p className="text-gray-600">Invita a otros usuarios para que administren el panel</p>
      </div>

      {/* Send Invitation Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Enviar Nueva Invitación</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Email del administrador"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleSendInvitation}
              variant="primary"
              size="sm"
              disabled={sending || !email}
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              {sending ? 'Enviando...' : 'Enviar Invitación'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          La invitación expirará en 24 horas. El usuario recibirá un email con un enlace para crear
          su cuenta.
        </p>
      </div>

      {/* Invitations List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Invitaciones Enviadas ({invitations.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay invitaciones enviadas</p>
            </div>
          ) : (
            invitations.map((invitation) => (
              <div key={invitation.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{invitation.email}</span>
                        {getStatusBadge(invitation)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Enviado por {invitation.createdByName} • {formatDate(invitation.createdAt)}
                      </div>
                      {!invitation.used && new Date() <= new Date(invitation.expiresAt) && (
                        <div className="text-sm text-gray-500">
                          Expira: {formatDate(invitation.expiresAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
