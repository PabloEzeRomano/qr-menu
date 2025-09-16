'use client'

import { useAuth } from '@/contexts/AuthContextProvider'

export default function LoginButton() {
  const { user, isAdmin, signIn, logout } = useAuth()

  if (!user) {
    return (
      <button
        onClick={() => signIn('', '')}
        className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
      >
        Iniciar sesión
      </button>
    )
  }
  return (
    <div className="flex items-center gap-3">
      {isAdmin ? (
        <span className="text-emerald-700 text-sm font-semibold">Admin</span>
      ) : (
        <span className="text-zinc-500 text-sm">Invitado</span>
      )}
      <button onClick={logout} className="px-3 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300">
        Salir
      </button>
    </div>
  )
}
