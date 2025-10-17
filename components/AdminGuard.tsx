'use client'

import { useAuth } from '@/contexts/AuthContextProvider'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isRoot } = useAuth()
  if (!isAdmin && !isRoot) return null
  return <>{children}</>
}
