'use client'

import { useCallback, useEffect, useState } from 'react'

import { UserPlus, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button, Input } from '@/components/ui'
import { AppProvider } from '@/contexts/AppProvider'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { acceptInvitation,validateInvitation } from '@/lib/api/invitations'

interface InvitationPageProps {
  params: Promise<{
    token: string
  }>
}

function InvitationPageContent({ params }: InvitationPageProps) {
  const [token, setToken] = useState<string>('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [invitationValid, setInvitationValid] = useState<boolean | null>(null)
  const [invitationEmail, setInvitationEmail] = useState('')
  const { restaurant } = useMenuData()

  const router = useRouter()
  const { handleError, showToast } = useErrorHandler()

  useEffect(() => {
    // Get token from params
    params.then(({ token: tokenParam }) => {
      setToken(tokenParam)
    })
  }, [params])

  const validateToken = useCallback(async () => {
    try {
      const data = await validateInvitation(token)
      setInvitationValid(true)
      setInvitationEmail(data.email)
    } catch (error) {
      setInvitationValid(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      // Validate token when we have it
      validateToken()
    }
  }, [token, validateToken])

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error')
      return
    }

    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error')
      return
    }

    setLoading(true)
    try {
      const data = await acceptInvitation(token, password)

      // Sign in with custom token
      const { signInWithCustomToken } = await import('firebase/auth')
      const { auth } = await import('@/lib/firebase')

      await signInWithCustomToken(auth, data.customToken)

      showToast('¡Cuenta creada exitosamente!', 'info')
      router.push('/admin')
    } catch (error) {
      handleError(error, 'Failed to accept invitation')
    } finally {
      setLoading(false)
    }
  }

  if (invitationValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando invitación...</p>
        </div>
      </div>
    )
  }

  if (invitationValid === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitación Inválida</h1>
          <p className="text-gray-600 mb-6">
            Esta invitación no es válida o ha expirado. Contacta al administrador para obtener una
            nueva invitación.
          </p>
          <Button onClick={() => router.push('/auth')} variant="primary">
            Ir al Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <UserPlus className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta de Administrador</h2>
          <p className="mt-2 text-sm text-gray-600">Has sido invitado a administrar {restaurant?.name || 'QR Menu'} </p>
          <p className="text-sm font-medium text-gray-900">{invitationEmail}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAcceptInvitation}>
          <div className="space-y-4">
            <div>
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div>
              <Input
                label="Confirmar Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí tu contraseña"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="show-password"
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="show-password" className="ml-2 block text-sm text-gray-900">
                Mostrar contraseña
              </label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !password || !confirmPassword}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Crear Cuenta de Administrador
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Al crear tu cuenta, aceptas los términos de uso y la política de privacidad.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function InvitationPage({ params }: InvitationPageProps) {
  return (
    <AppProvider>
      <InvitationPageContent params={params} />
    </AppProvider>
  )
}
