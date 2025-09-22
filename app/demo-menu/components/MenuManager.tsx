'use client'

import { memo, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContextProvider'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { useMenuContext } from '@/contexts/MenuContextProvider'

interface MenuManagerProps {
  children: React.ReactNode
}

function MenuManagerComponent({ children }: MenuManagerProps) {
  const { isAdmin } = useAuth()
  const { refreshItems } = useMenuData()
  const { isEditMode, setIsEditMode } = useMenuContext()

  // Refresh items when admin status changes (to show/hide hidden items)
  useEffect(() => {
    refreshItems(isAdmin)
  }, [isAdmin, refreshItems])

  // Exit edit mode if user is not admin
  useEffect(() => {
    isEditMode && !isAdmin && setIsEditMode(false)
  }, [isAdmin, isEditMode, setIsEditMode])

  return <>{children}</>
}

export const MenuManager = memo(MenuManagerComponent)
