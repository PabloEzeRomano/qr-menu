'use client'

import { useState } from 'react'
import CartButton from './CartButton'
import CartDrawer from './CartDrawer'
import StickyCartBar from './StickyCartBar'
import { useAuth } from '@/contexts/AuthContextProvider'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { useCartEnabled } from '@/hooks/useCartEnabled'

export default function CartWrapper() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { isAdmin } = useAuth()
  const { loading } = useMenuData()
  const isCartEnabled = useCartEnabled()

  // Don't render anything while loading restaurant data
  if (loading) {
    return null
  }

  if (isAdmin || !isCartEnabled) {
    return null
  }

  return (
    <>
      <CartButton onClick={() => setIsDrawerOpen(true)} />
      <StickyCartBar onClick={() => setIsDrawerOpen(true)} />
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}
