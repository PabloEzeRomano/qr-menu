'use client'

import { memo, useEffect } from 'react'

import { useAuth } from '@/contexts/AuthContextProvider'
import { useMenuContext } from '@/contexts/MenuContextProvider'

interface MenuManagerProps {
  children: React.ReactNode
}

function MenuManagerComponent({ children }: MenuManagerProps) {
  const { isAdmin } = useAuth()
  const { isEditMode, setIsEditMode } = useMenuContext()

  // Exit edit mode if user is not admin
  useEffect(() => {
    isEditMode && !isAdmin && setIsEditMode(false)
  }, [isAdmin, isEditMode, setIsEditMode])

  return <>{children}</>
}

export const MenuManager = memo(MenuManagerComponent)
